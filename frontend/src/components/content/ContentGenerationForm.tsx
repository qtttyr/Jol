import { useState } from 'react';
import { Button } from '../ui/button';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Platform, PostType, ContentLanguage, ContentStyle } from '../../types/post';

interface ContentGenerationFormProps {
  onGenerate: (params: {
    post_type: PostType;
    platform: Platform;
    language: ContentLanguage;
    style: ContentStyle;
  }) => Promise<void>;
  loading: boolean;
}

const POST_TYPES: { value: PostType; label: string; description: string }[] = [
  { value: 'data_driven', label: 'Data-Driven', description: 'Fact-based insight with data' },
  { value: 'storytelling', label: 'Storytelling', description: 'Personal narrative & lessons' },
  { value: 'hot_take', label: 'Hot Take', description: 'Contrarian opinion' },
];

const PLATFORMS: { value: Platform; label: string; maxChars: number }[] = [
  { value: 'linkedin', label: 'LinkedIn', maxChars: 3000 },
  { value: 'threads', label: 'Threads', maxChars: 500 },
  { value: 'instagram', label: 'Instagram', maxChars: 2000 },
  { value: 'telegram', label: 'Telegram', maxChars: 4000 },
  { value: 'medium', label: 'Medium', maxChars: 5000 },
  { value: 'reddit', label: 'Reddit', maxChars: 40000 },
];

const LANGUAGES: { value: ContentLanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ru', label: 'Russian' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
];

const STYLES: { value: ContentStyle; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and authoritative' },
  { value: 'casual', label: 'Casual', description: 'Friendly and approachable' },
  { value: 'humorous', label: 'Humorous', description: 'Witty and entertaining' },
  { value: 'academic', label: 'Academic', description: 'In-depth and analytical' },
];

function Sparkle({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
      animate={{ 
        scale: [0, 1, 0], 
        opacity: [0, 1, 0],
        x: [0, (Math.random() - 0.5) * 60],
        y: [0, (Math.random() - 0.5) * 60]
      }}
      transition={{ 
        duration: 0.8, 
        delay, 
        repeat: Infinity,
        repeatDelay: 2 + Math.random() * 2
      }}
      className="absolute w-1.5 h-1.5 rounded-full bg-white"
      style={{
        boxShadow: '0 0 6px 2px rgba(255,255,255,0.6)',
      }}
    />
  );
}

export function ContentGenerationForm({ onGenerate, loading }: ContentGenerationFormProps) {
  const [selectedPostType, setSelectedPostType] = useState<PostType>('data_driven');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('linkedin');
  const [selectedLanguage, setSelectedLanguage] = useState<ContentLanguage>('en');
  const [selectedStyle, setSelectedStyle] = useState<ContentStyle>('professional');
  const [isHovered, setIsHovered] = useState(false);

  const handleGenerate = async () => {
    await onGenerate({
      post_type: selectedPostType,
      platform: selectedPlatform,
      language: selectedLanguage,
      style: selectedStyle,
    });
  };

  const selectedPlatformData = PLATFORMS.find(p => p.value === selectedPlatform);
  const platformMaxChars = selectedPlatformData?.maxChars || 3000;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-purple-400" />
        Content Generator
      </h2>

      <div className="space-y-6">
        {/* Post Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Post Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {POST_TYPES.map((type) => (
              <motion.button
                key={type.value}
                onClick={() => setSelectedPostType(type.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedPostType === type.value
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-purple-400'
                }`}
              >
                <div className="font-semibold text-sm">{type.label}</div>
                <div className="text-xs mt-1 opacity-75">{type.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Target Platform ({platformMaxChars} char limit)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PLATFORMS.map((platform) => (
              <motion.button
                key={platform.value}
                onClick={() => setSelectedPlatform(platform.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                  selectedPlatform === platform.value
                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-indigo-400'
                }`}
              >
                {platform.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as ContentLanguage)}
            className="w-full px-4 py-2 rounded-lg bg-slate-700 border-2 border-slate-600 text-white focus:border-indigo-500 focus:outline-none transition-colors"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Writing Style
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STYLES.map((style) => (
              <motion.button
                key={style.value}
                onClick={() => setSelectedStyle(style.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedStyle === style.value
                    ? 'border-pink-500 bg-pink-500/20 text-white'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-pink-400'
                }`}
              >
                <div className="font-semibold text-sm">{style.label}</div>
                <div className="text-xs mt-1 opacity-75">{style.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="relative group pt-2">
          <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full h-12 overflow-hidden rounded-xl border-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] transition-all duration-500 hover:bg-[100%_0] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25"
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 skew-x-12 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            {/* Sparkles effect on hover */}
            <AnimatePresence>
              {isHovered && !loading && (
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  {[...Array(8)].map((_, i) => (
                    <Sparkle key={i} delay={i * 0.1} />
                  ))}
                </div>
              )}
            </AnimatePresence>
            
            <div className="relative flex items-center justify-center gap-2.5 z-10">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span className="font-semibold text-white tracking-wide">Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="font-semibold text-white tracking-wide">Generate Post</span>
                  <motion.div
                    animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.7 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </motion.div>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
