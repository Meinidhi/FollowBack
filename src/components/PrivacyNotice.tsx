import React from 'react';
import { ShieldCheck, Lock, Database, ServerOff, KeyRound, Cpu } from 'lucide-react';

export const PrivacyNotice: React.FC = () => {
  const points = [
    { icon: KeyRound, title: 'No Passwords Required', desc: 'We never ask for your Instagram password or account credentials.' },
    { icon: Lock, title: 'No Instagram Login', desc: 'No OAuth tokens, cookie scraping, or session takeovers.' },
    { icon: ServerOff, title: 'Zero External Servers', desc: 'Your ZIP file and extracted data never leave your browser.' },
    { icon: Cpu, title: '100% In-Browser Execution', desc: 'JSZip unpacks your archive entirely in your local device RAM.' },
    { icon: Database, title: 'No Database Storage', desc: 'Nothing is stored, logged, or saved to any database anywhere.' },
    { icon: ShieldCheck, title: 'Safe From Account Bans', desc: 'Using official Meta data exports keeps your account in 100% good standing.' },
  ];

  return (
    <section id="privacy" className="py-16 md:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guaranteed Security</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-main tracking-tight mb-3">
            Your data stays yours.
          </h2>
          <p className="text-base text-secondary">
            FollowBack is engineered strictly as a client-side utility. We believe privacy shouldn't be compromised to gain insights.
          </p>
        </div>

        {/* 6 Grid Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div key={i} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:bg-slate-50/80 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-primary flex items-center justify-center mb-4 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-main text-base mb-1.5">{pt.title}</h4>
                <p className="text-sm text-secondary leading-relaxed">{pt.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
