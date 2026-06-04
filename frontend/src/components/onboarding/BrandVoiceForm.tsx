import { Textarea } from '../ui/Textarea';
import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';

interface BrandVoiceFormProps {
  formData: { 
    brand_voice_examples: string[];
    [key: string]: unknown;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    niche: string;
    stage: string;
    description: string;
    target_audience: string;
    brand_voice_examples: string[];
  }>>;
}

export default function BrandVoiceForm({ formData, setFormData }: BrandVoiceFormProps) {
  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...formData.brand_voice_examples];
    newExamples[index] = value;
    setFormData(prev => ({ ...prev, brand_voice_examples: newExamples }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <PenLine className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Teach Jol your style</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Paste 2-3 of your best posts or articles. Jol will analyze your sentence structure, tone, and vocabulary to write exactly like you.
        </p>
      </div>

      <div className="space-y-4">
        {formData.brand_voice_examples.map((example: string, i: number) => (
          <div key={i} className="space-y-2 relative group">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                Example #{i + 1}
              </label>
            </div>
            <Textarea 
              placeholder="Paste your text here..."
              value={example}
              onChange={(e) => handleExampleChange(i, e.target.value)}
              className="bg-muted/50 border-border rounded-2xl min-h-[120px] focus:bg-muted transition-all resize-none text-xs leading-relaxed"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
