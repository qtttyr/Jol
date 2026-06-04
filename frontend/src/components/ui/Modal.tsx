import * as React from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm shadow-sm transition-all duration-100 flex items-center justify-center p-4">
      <div 
        className={cn("bg-card text-card-foreground border border-border shadow-lg rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 zoom-in-95", className)}
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
