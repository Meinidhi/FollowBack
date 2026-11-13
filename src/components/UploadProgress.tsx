import React from 'react';
import { Loader2 } from 'lucide-react';

interface UploadProgressProps {
  step: string;
  percent: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ step, percent }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-5">
          <Loader2 className="w-8 h-8 animate-spin stroke-[2.5]" />
        </div>
        
        <h3 className="text-xl font-extrabold text-main mb-2">
          Analyzing Your Instagram Data
        </h3>
        <p className="text-sm text-secondary mb-6">
          {step || 'Processing files locally in your browser...'}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 mb-3">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, Math.min(100, percent))}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs font-semibold text-secondary">
          <span>Client-Side Processing</span>
          <span>{percent}%</span>
        </div>
      </div>
    </div>
  );
};
