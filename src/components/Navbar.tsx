import React from 'react';
import { Users, ArrowLeftRight, ShieldCheck, Trash2 } from 'lucide-react';

interface NavbarProps {
  hasResults: boolean;
  onClearData: () => void;
  onNavigateToUpload: () => void;
  onNavigateToInstructions: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasResults,
  onClearData,
  onNavigateToUpload,
  onNavigateToInstructions
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={hasResults ? onClearData : onNavigateToUpload} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/25 group-hover:scale-105 transition-transform duration-200">
            <div className="relative">
              <Users className="w-5 h-5" />
              <ArrowLeftRight className="w-3 h-3 absolute -bottom-1 -right-1 text-white bg-primary rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-main">Follow<span className="text-primary">Back</span></span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-primary-light text-primary px-1.5 py-0.5 rounded">v1.0</span>
            </div>
            <p className="text-xs text-secondary font-medium hidden sm:block">Know who follows you back</p>
          </div>
        </div>

        {/* Center / Right Links */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={onNavigateToInstructions}
            className="text-sm font-semibold text-secondary hover:text-main transition-colors hidden md:inline-flex items-center gap-1.5"
          >
            How to Download
          </button>
          
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% In-Browser Privacy</span>
          </div>

          {hasResults ? (
            <button
              onClick={onClearData}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-danger hover:bg-danger-light/50 px-3.5 py-2 rounded-lg border border-danger/20 transition-all duration-150"
              title="Clear all analyzed data and upload a new file"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Data</span>
            </button>
          ) : (
            <button
              onClick={onNavigateToUpload}
              className="inline-flex items-center justify-center text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-lg shadow-sm shadow-primary/30 transition-all duration-150 active:scale-95"
            >
              Analyze My Instagram
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
