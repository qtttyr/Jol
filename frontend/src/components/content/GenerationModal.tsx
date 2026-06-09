import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import type { PostType, Platform, ContentLanguage, ContentStyle } from '../../types/post';

interface GenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: {
    post_type: PostType;
    platform: Platform;
    language: ContentLanguage;
    style: ContentStyle;
  }) => Promise<void>;
  loading: boolean;
}

const POST_TYPES: { value: PostType; label: string; description: string }[] = [
  { value: 'data_driven', label: 'Data-Driven', description: 'Fact-based insight backed by data' },
  { value: 'storytelling', label: 'Storytelling', description: 'Personal narrative and lessons learned' },
  { value: 'hot_take', label: 'Hot Take', description: 'Contrarian perspective on industry trends' },
];

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'threads', label: 'Threads' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'medium', label: 'Medium' },
  { value: 'reddit', label: 'Reddit' },
];

const LANGUAGES: { value: ContentLanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ru', label: 'Русский' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
  { value: 'ko', label: '한국어' },
  { value: 'ar', label: 'العربية' },
  { value: 'hi', label: 'हिंदी' },
];

const STYLES: { value: ContentStyle; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and authoritative' },
  { value: 'casual', label: 'Casual', description: 'Friendly and approachable' },
  { value: 'humorous', label: 'Humorous', description: 'Witty and entertaining' },
  { value: 'academic', label: 'Academic', description: 'In-depth and analytical' },
];

export function GenerationModal({ isOpen, onClose, onGenerate, loading }: GenerationModalProps) {
  const [step, setStep] = useState<'type' | 'platform' | 'language' | 'style' | 'review'>(
    'type'
  );
  const [selectedType, setSelectedType] = useState<PostType>('data_driven');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('linkedin');
  const [selectedLanguage, setSelectedLanguage] = useState<ContentLanguage>('en');
  const [selectedStyle, setSelectedStyle] = useState<ContentStyle>('professional');

  const handleNext = () => {
    switch (step) {
      case 'type':
        setStep('platform');
        break;
      case 'platform':
        setStep('language');
        break;
      case 'language':
        setStep('style');
        break;
      case 'style':
        setStep('review');
        break;
    }
  };

  const handlePrev = () => {
    switch (step) {
      case 'platform':
        setStep('type');
        break;
      case 'language':
        setStep('platform');
        break;
      case 'style':
        setStep('language');
        break;
      case 'review':
        setStep('style');
        break;
    }
  };

  const handleGenerate = async () => {
    await onGenerate({
      post_type: selectedType,
      platform: selectedPlatform,
      language: selectedLanguage,
      style: selectedStyle,
    });
    onClose();
  };

  const stepNumber = ['type', 'platform', 'language', 'style', 'review'].indexOf(step) + 1;
  const totalSteps = 5;

  const stepTitles = {
    type: 'What type of content?',
    platform: 'Where will it be published?',
    language: 'What language?',
    style: 'How should it sound?',
    review: 'Review your selection',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="relative border-b border-slate-200 dark:border-slate-800 px-8 py-6">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

                <div className="pr-8">
                  <div className="text-sm font-medium text-slate-500 mb-2">
                    Step {stepNumber} of {totalSteps}
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {stepTitles[step]}
                  </h2>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mt-6">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: i < stepNumber ? 1 : 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="h-0.5 flex-1 origin-left bg-slate-900 dark:bg-white rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-8">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Step: Type */}
                  {step === 'type' && (
                    <div className="space-y-3">
                      {POST_TYPES.map((type) => (
                        <motion.button
                          key={type.value}
                          onClick={() => setSelectedType(type.value)}
                          whileHover={{ x: 4 }}
                          className={`w-full p-4 rounded-lg border transition-all text-left group ${
                            selectedType === type.value
                              ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-900/50'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {type.label}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {type.description}
                              </div>
                            </div>
                            {selectedType === type.value && (
                              <motion.div
                                layoutId="selected"
                                className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white mt-1"
                              />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Step: Platform */}
                  {step === 'platform' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {PLATFORMS.map((platform) => (
                        <motion.button
                          key={platform.value}
                          onClick={() => setSelectedPlatform(platform.value)}
                          whileHover={{ y: -2 }}
                          className={`p-4 rounded-lg border transition-all text-center font-medium ${
                            selectedPlatform === platform.value
                              ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-900/50'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="text-slate-900 dark:text-white">{platform.label}</div>
                          {selectedPlatform === platform.value && (
                            <motion.div
                              layoutId="selected"
                              className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white mx-auto mt-3"
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Step: Language */}
                  {step === 'language' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {LANGUAGES.map((lang) => (
                        <motion.button
                          key={lang.value}
                          onClick={() => setSelectedLanguage(lang.value)}
                          whileHover={{ y: -2 }}
                          className={`p-3 rounded-lg border transition-all text-center text-sm font-medium ${
                            selectedLanguage === lang.value
                              ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-900/50'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="text-slate-900 dark:text-white">{lang.label}</div>
                          {selectedLanguage === lang.value && (
                            <motion.div
                              layoutId="selected"
                              className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white mx-auto mt-2"
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Step: Style */}
                  {step === 'style' && (
                    <div className="space-y-3">
                      {STYLES.map((style) => (
                        <motion.button
                          key={style.value}
                          onClick={() => setSelectedStyle(style.value)}
                          whileHover={{ x: 4 }}
                          className={`w-full p-4 rounded-lg border transition-all text-left ${
                            selectedStyle === style.value
                              ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-900/50'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {style.label}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {style.description}
                              </div>
                            </div>
                            {selectedStyle === style.value && (
                              <motion.div
                                layoutId="selected"
                                className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white mt-1"
                              />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Step: Review */}
                  {step === 'review' && (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800">
                          <div className="text-sm text-slate-600 dark:text-slate-400">Post Type</div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {POST_TYPES.find((t) => t.value === selectedType)?.label}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800">
                          <div className="text-sm text-slate-600 dark:text-slate-400">Platform</div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {PLATFORMS.find((p) => p.value === selectedPlatform)?.label}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800">
                          <div className="text-sm text-slate-600 dark:text-slate-400">Language</div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {LANGUAGES.find((l) => l.value === selectedLanguage)?.label}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800">
                          <div className="text-sm text-slate-600 dark:text-slate-400">Style</div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {STYLES.find((s) => s.value === selectedStyle)?.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 dark:border-slate-800 px-8 py-6 flex gap-3 bg-slate-50/50 dark:bg-slate-900/30">
                {step !== 'type' && (
                  <Button
                    onClick={handlePrev}
                    variant="outline"
                    className="flex-1 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Back
                  </Button>
                )}
                {step !== 'review' && (
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {step === 'review' && (
                  <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium"
                  >
                    {loading ? 'Generating...' : 'Generate'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
