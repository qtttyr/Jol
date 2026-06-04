import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ChevronRight, ChevronLeft, Rocket, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import StepIndicator from '../components/onboarding/StepIndicator';
import ProjectForm from '../components/onboarding/ProjectForm';
import BrandVoiceForm from '../components/onboarding/BrandVoiceForm';
import { useProjects } from '../hooks/useProjects';

import heroGif from '../assets/hero.gif';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    stage: 'idea',
    description: '',
    target_audience: '',
    brand_voice_examples: ['', '', ''],
  });
  
  const { createProject, loading } = useProjects();
  const navigate = useNavigate();

  const handleNext = async () => {
    if (currentStep < 3) {
      if (currentStep === 1) {
        if (!formData.name) {
          toast.error("Please enter your startup name");
          return;
        }
        if (!formData.niche) {
          toast.error("Please enter your niche");
          return;
        }
        if (!formData.stage) {
          toast.error("Please select a stage for your startup");
          return;
        }
        if (!formData.description) {
          toast.error("Please describe what you are building");
          return;
        }
        if (!formData.target_audience) {
          toast.error("Please specify your target audience");
          return;
        }
      }
      setCurrentStep(currentStep + 1);
      return;
    }

    try {
      const filteredExamples = formData.brand_voice_examples.filter(ex => ex.trim() !== '');
      
      await createProject({
        name: formData.name,
        niche: formData.niche,
        stage: formData.stage,
        description: formData.description,
        target_audience: formData.target_audience,
        brand_voice_examples: filteredExamples,
      });

      toast.success("Welcome to JOL!");
      navigate('/dashboard');
    } catch (error: unknown) {
      // Error is already toasted in useProjects
      console.error("Onboarding failed", error);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-dvh bg-[#0a0a0c] text-foreground flex items-center justify-center p-6 selection:bg-primary selection:text-white">
      {/* Background with GIF and overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src={heroGif} 
          alt="" 
          className="w-full h-full object-cover opacity-40 contrast-125 saturate-0 brightness-100"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0c]/80 via-[#0a0a0c]/40 to-[#0a0a0c]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="p-1 rounded-[48px] bg-linear-to-b from-white/10 to-transparent shadow-2xl">
          <div className="bg-[#111114]/90 backdrop-blur-3xl rounded-[44px] p-8 md:p-12 border border-white/5">
            
            <StepIndicator currentStep={currentStep} totalSteps={3} />

            <div className="mb-12">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {currentStep === 1 && "Start your journey"}
                    {currentStep === 2 && "Personalize your AI"}
                    {currentStep === 3 && "Ready for Liftoff"}
                  </h2>
               </div>
               <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                 {currentStep === 1 && "Let's start with the basics. Tell us about your startup and what you're building."}
                 {currentStep === 2 && "The secret sauce. Add examples of your writing so Jol can replicate your brand voice."}
                 {currentStep === 3 && "You're all set. We'll generate your first marketing strategy and social posts in seconds."}
               </p>
            </div>

            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <ProjectForm key="step1" formData={formData} setFormData={setFormData} />
                )}
                {currentStep === 2 && (
                  <BrandVoiceForm key="step2" formData={formData} setFormData={setFormData} />
                )}
                {currentStep === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 relative">
                       <Rocket className="w-8 h-8 text-primary animate-bounce" />
                       <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Everything looks perfect</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Jol is ready to analyze your niche and start building your marketing autopilot.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  disabled={currentStep === 1 || loading}
                  className="rounded-2xl h-12 px-6 hover:bg-white/5 transition-all text-muted-foreground hove:text-foreground"
                >
                  <ChevronLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
                
                <Button 
                  onClick={handleNext}
                  disabled={loading}
                  className="rounded-2xl h-12 px-8 min-w-[160px] bg-white text-black hover:bg-neutral-200 font-bold transition-all shadow-xl shadow-white/5 group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {currentStep === 3 ? 'Launching...' : 'Continuing...'}
                    </>
                  ) : (
                    <>
                      {currentStep === 3 ? 'Launch Rocket' : 'Continue'} 
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
