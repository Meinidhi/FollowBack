import React from 'react';
import { Users, ArrowLeftRight, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/90 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
              <div className="relative">
                <Users className="w-4 h-4" />
                <ArrowLeftRight className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 text-white bg-primary rounded-full" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-main">
                Follow<span className="text-primary">Back</span>
              </span>
              <p className="text-xs text-secondary">Know who follows you back.</p>
            </div>
          </div>

          {/* Privacy statement */}
          <div className="text-xs text-secondary text-center md:text-right max-w-md flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              100% Client-Side Open Tool. FollowBack is not affiliated with, sponsored, or endorsed by Instagram or Meta.
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};
