import React from 'react';
import { Shield, Sparkles, UserCheck, ArrowRight, Download, UploadCloud, BarChart3, HelpCircle } from 'lucide-react';

interface HeroProps {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPrimaryClick, onSecondaryClick }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-primary/10 via-purple-100/30 to-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Safe • Client-Side • No Passwords</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-main tracking-tight leading-[1.15] mb-6">
          Find out who doesn’t <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            follow you back.
          </span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-secondary leading-relaxed mb-10">
          Your Instagram following list, decoded. Upload your Instagram data export and instantly discover who follows you back and who doesn’t.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onPrimaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-base text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-200 active:scale-95 group"
          >
            <span>Analyze My Instagram</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={onSecondaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-main bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all duration-200"
          >
            <HelpCircle className="w-4 h-4 text-secondary" />
            <span>How It Works</span>
          </button>
        </div>

        {/* 3 Step Explanation Flow */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm mb-16 text-left">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-primary mb-6 text-center">
            How It Works in 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-base flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-main text-base mb-1 flex items-center gap-2">
                  <Download className="w-4 h-4 text-primary" /> Download Your Data
                </h3>
                <p className="text-sm text-secondary leading-snug">
                  Request your follower export from Instagram Account Center in JSON format.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-base flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-main text-base mb-1 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-primary" /> Upload Your ZIP
                </h3>
                <p className="text-sm text-secondary leading-snug">
                  Drag and drop the ZIP file directly into FollowBack. It never touches a remote server.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-base flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-main text-base mb-1 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Get Instant Results
                </h3>
                <p className="text-sm text-secondary leading-snug">
                  Explore non-followers, mutuals, and fans with search, sort, and CSV export.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 text-left shadow-card hover:shadow-card-hover transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-main mb-2">Privacy First</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Your Instagram data is processed directly in your browser. We never need your password.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 text-left shadow-card hover:shadow-card-hover transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-main mb-2">Accurate Comparison</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Automatically compare your followers and following lists with 100% precision.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 text-left shadow-card hover:shadow-card-hover transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-main mb-2">Instant Results</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Discover non-followers, mutual followers, and accounts you don't follow back in seconds.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
