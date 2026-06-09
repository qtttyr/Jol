import json
import re
import time
import asyncio
import logging
from enum import Enum
from typing import Optional

from google import genai as google_genai
from groq import AsyncGroq

from core.config import settings

logger = logging.getLogger(__name__)


class ModelTier(Enum):
    GEMINI_FLASH = "gemini_flash"
    GROQ_WRITER = "groq_writer"
    GROQ_FALLBACK = "groq_fallback"


class AiClient:
    def __init__(self):
        self._gemini_client: Optional[google_genai.Client] = None
        self._groq_client: Optional[AsyncGroq] = None

        self.MODEL_MAP = {
            ModelTier.GEMINI_FLASH: settings.GEMINI_MODEL,
            ModelTier.GROQ_WRITER: settings.GROQ_WRITER_MODEL,
            ModelTier.GROQ_FALLBACK: settings.GROQ_FALLBACK_MODEL,
        }

        self._groq_tpm_reset = time.monotonic()
        self._groq_tpm_used = 0
        self._tpm_lock = asyncio.Lock()
        self.GROQ_TPM_LIMIT = 6000

    @property
    def gemini(self) -> google_genai.Client:
        if self._gemini_client is None:
            self._gemini_client = google_genai.Client(
                api_key=settings.GOOGLE_AI_STUDIO_KEY
            )
        return self._gemini_client

    @property
    def groq(self) -> AsyncGroq:
        if self._groq_client is None:
            self._groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        return self._groq_client

    async def _wait_for_groq_tpm(self, estimated_tokens: int = 500):
        async with self._tpm_lock:
            now = time.monotonic()
            if now - self._groq_tpm_reset >= 60:
                self._groq_tpm_used = 0
                self._groq_tpm_reset = now

            if self._groq_tpm_used + estimated_tokens > self.GROQ_TPM_LIMIT:
                wait = 60 - (now - self._groq_tpm_reset)
                if wait > 0:
                    logger.info(f"Groq TPM limit hit, waiting {wait:.1f}s")
                    await asyncio.sleep(wait)
                self._groq_tpm_used = 0
                self._groq_tpm_reset = time.monotonic()

            self._groq_tpm_used += estimated_tokens

    async def _call_gemini(self, prompt: str, response_type: str = "text") -> str:
        config = {"temperature": 0.7}
        if response_type == "json":
            config["response_mime_type"] = "application/json"

        last_error = None
        for attempt in range(3):
            try:
                response = await asyncio.to_thread(
                    lambda: self.gemini.models.generate_content(
                        model=self.MODEL_MAP[ModelTier.GEMINI_FLASH],
                        contents=prompt,
                        config=config,
                    )
                )
                return response.text
            except Exception as e:
                last_error = e
                err_str = str(e).lower()
                # Only retry on server errors (5xx) or rate limits
                if "503" in err_str or "500" in err_str or "429" in err_str or "unavailable" in err_str:
                    wait = 2 ** attempt
                    logger.warning(f"Gemini call attempt {attempt + 1} failed ({e}), retrying in {wait}s...")
                    await asyncio.sleep(wait)
                else:
                    break

        logger.error(f"Gemini call failed after all retries: {last_error}")
        raise last_error or RuntimeError("Gemini call failed")

    async def _call_groq(
        self,
        prompt: str,
        tier: ModelTier,
        estimated_tokens: int = 500,
    ) -> str:
        await self._wait_for_groq_tpm(estimated_tokens)

        model = self.MODEL_MAP[tier]
        try:
            response = await self.groq.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=4096,
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"Groq {model} failed: {e}")
            raise

    async def generate(
        self,
        prompt: str,
        tier: ModelTier = ModelTier.GEMINI_FLASH,
        response_type: str = "text",
        estimated_tokens: int = 500,
    ) -> str:
        if tier == ModelTier.GEMINI_FLASH:
            return await self._call_gemini(prompt, response_type)

        try:
            return await self._call_groq(prompt, tier, estimated_tokens)
        except Exception as writer_err:
            if tier == ModelTier.GROQ_WRITER:
                logger.warning("llama-3.1-8b-instant failed, falling back to qwen/qwen3-32b")
                try:
                    return await self._call_groq(
                        prompt, ModelTier.GROQ_FALLBACK, estimated_tokens
                    )
                except Exception as fallback_err:
                    raise RuntimeError(
                        f"Both Groq models failed. Writer: {writer_err}, Fallback: {fallback_err}"
                    )
            raise

    async def generate_json(
        self,
        prompt: str,
        tier: ModelTier = ModelTier.GEMINI_FLASH,
        estimated_tokens: int = 500,
    ) -> dict:
        if tier == ModelTier.GEMINI_FLASH:
            text = await self.generate(
                prompt, tier=tier, response_type="json", estimated_tokens=estimated_tokens
            )
        else:
            text = await self.generate(prompt, tier=tier, estimated_tokens=estimated_tokens)

        clean = text.replace("```json", "").replace("```", "").strip()

        def _fix_backtick(text):
            def _replace(m):
                key = m.group(1)
                val = m.group(2)
                val = val.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")
                return f'"{key}": "{val}"'
            return re.sub(r'"(\w+)":\s*`((?:[^`]|\n)*)`', _replace, text)

        # Try parsing with multiple fallbacks — validate result is a dict
        for candidate in (clean, _fix_backtick(clean)):
            try:
                parsed = json.loads(candidate, strict=False)
                if isinstance(parsed, dict):
                    return parsed
            except json.JSONDecodeError:
                pass

        # Try extracting just the JSON object
        maybe = re.search(r"\{.*\}", clean, re.DOTALL)
        if maybe:
            try:
                return json.loads(maybe.group(0), strict=False)
            except json.JSONDecodeError:
                pass

        def _unescape(s: str) -> str:
            # Order matters: escaped backslash before other escapes
            return (s.replace('\\\\', '\x00')
                     .replace('\\n', '\n')
                     .replace('\\r', '\r')
                     .replace('\\t', '\t')
                     .replace('\\"', '"')
                     .replace('\x00', '\\'))

        # Try extracting content field directly with lenient parsing
        m = re.search(r'"content":\s*"((?:\\.|[^"\\])*)"\s*}', clean, re.DOTALL)
        if m:
            return {"content": _unescape(m.group(1))}

        # Ultra-lenient: scan char by char for "content": " ... "}
        idx = clean.find('"content": "')
        if idx >= 0:
            start = idx + len('"content": "')
            remaining = clean[start:]
            i = 0
            while i < len(remaining):
                if remaining[i] == '\\':
                    i += 2
                elif remaining[i] == '"' and i + 1 < len(remaining) and remaining[i + 1] == '}':
                    return {"content": _unescape(remaining[:i])}
                else:
                    i += 1
            # No closing found — take everything
            return {"content": _unescape(remaining)}

        # Fallback for known top-level keys — use greedy match to handle nested objects
        for key in ("steps", "title", "description", "result", "data"):
            m = re.search(r'"' + key + r'":\s*(\[.*\]|\{.*\})', clean, re.DOTALL)
            if m:
                try:
                    val = json.loads(m.group(1), strict=False)
                    return {key: val}
                except (json.JSONDecodeError, ValueError):
                    pass

        # Last resort: try to find ANY valid JSON object/array in the text
        for brace in (r'\{.*\}', r'\[.*\]'):
            m = re.search(brace, clean, re.DOTALL)
            if m:
                try:
                    parsed = json.loads(m.group(0), strict=False)
                    if isinstance(parsed, dict):
                        return parsed
                    if isinstance(parsed, list) and len(parsed) > 0:
                        # Detect if this looks like a roadmap steps array
                        if isinstance(parsed[0], dict) and "title" in parsed[0]:
                            return {"steps": parsed}
                        return {"data": parsed}
                except json.JSONDecodeError:
                    pass

        logger.error(f"Failed to parse JSON from LLM response. Response: {text[:1000]}")
        raise RuntimeError("Invalid JSON from LLM")


_client: Optional[AiClient] = None


def get_ai_client() -> AiClient:
    global _client
    if _client is None:
        _client = AiClient()
    return _client
