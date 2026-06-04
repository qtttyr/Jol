import { Input } from '../ui/input';
import { Textarea } from '../ui/Textarea';
import { motion } from 'framer-motion';

interface ProjectFormProps {
  formData: {
    name: string;
    niche: string;
    stage: string;
    description: string;
    target_audience: string;
    brand_voice_examples: string[];
  };
  setFormData: (data: {
    name: string;
    niche: string;
    stage: string;
    description: string;
    target_audience: string;
    brand_voice_examples: string[];
  }) => void;
}

export default function ProjectForm({ formData, setFormData }: ProjectFormProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Startup Name</label>
        <Input 
          placeholder="e.g. Jol AI"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-muted/50 border-border rounded-2xl h-12 focus:bg-muted transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Niche</label>
          <Input 
            placeholder="e.g. B2B SaaS"
            value={formData.niche}
            onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
            className="bg-muted/50 border-border rounded-2xl h-12 focus:bg-muted transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Stage</label>
          <select 
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-2xl h-12 px-4 text-sm focus:bg-muted outline-none transition-all appearance-none"
          >
            <option value="idea">Idea</option>
            <option value="mvp">MVP</option>
            <option value="growth">Growth</option>
            <option value="scale">Scale</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">What are you building?</label>
        <Textarea 
          placeholder="Describe your product in one sentence..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-muted/50 border-border rounded-2xl min-h-[100px] focus:bg-muted transition-all resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Who is your audience?</label>
        <Input 
          placeholder="e.g. CTOs at Series A startups"
          value={formData.target_audience}
          onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
          className="bg-muted/50 border-border rounded-2xl h-12 focus:bg-muted transition-all"
        />
      </div>
    </motion.div>
  );
}
