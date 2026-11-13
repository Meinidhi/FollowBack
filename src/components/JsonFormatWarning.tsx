import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Sliders, Calendar, FileCode2, ImageOff } from 'lucide-react';

export const JsonFormatWarning: React.FC = () => {
  return (
    <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-6 sm:p-8 my-8 shadow-sm">
      {/* Warning Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/20">
          <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <span className="inline-block text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded mb-1">
            Critical Step
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight">
            IMPORTANT: SELECT JSON FORMAT
          </h3>
          <p className="text-sm sm:text-base text-amber-900/90 font-medium mt-1 leading-relaxed">
            Your Instagram download <strong className="underline decoration-amber-600 decoration-2">MUST be in JSON format</strong>. If you select HTML, the application will not be able to process your data. Please double-check the format before creating your download.
          </p>
        </div>
      </div>

      {/* Comparison Cards: JSON vs HTML */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* JSON Card */}
        <div className="bg-white border-2 border-emerald-500 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SUPPORTED</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-main text-lg">JSON Format</h4>
              <p className="text-xs text-emerald-700 font-semibold">Recommended & Required</p>
            </div>
          </div>
          <p className="text-sm text-secondary leading-snug mt-3">
            Choose this format to use FollowBack. Allows automatic extraction and comparison of followers and following lists.
          </p>
        </div>

        {/* HTML Card */}
        <div className="bg-white border-2 border-red-300 rounded-xl p-5 shadow-sm relative overflow-hidden opacity-90">
          <div className="absolute top-0 right-0 bg-danger text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>NOT SUPPORTED</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-red-100 text-danger flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-main text-lg line-through text-slate-400">HTML Format</h4>
              <p className="text-xs text-danger font-semibold">Will Cause Error</p>
            </div>
          </div>
          <p className="text-sm text-secondary leading-snug mt-3">
            Do not select this format. FollowBack cannot process HTML exports.
          </p>
        </div>
      </div>

      {/* Exact Configuration Settings Table */}
      <div className="bg-white/90 border border-amber-200 rounded-xl p-4 sm:p-5">
        <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-amber-700" />
          Required Download Configuration Settings
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
            <div className="text-xs text-secondary font-medium mb-1 flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-primary" /> Format
            </div>
            <div className="text-base font-extrabold text-main text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> JSON
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
            <div className="text-xs text-secondary font-medium mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Date Range
            </div>
            <div className="text-base font-extrabold text-main flex items-center gap-1.5">
              <span>All Time</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
            <div className="text-xs text-secondary font-medium mb-1 flex items-center gap-1.5">
              <ImageOff className="w-3.5 h-3.5 text-secondary" /> Media Quality
            </div>
            <div className="text-base font-extrabold text-secondary flex items-center gap-1.5">
              <span>Not relevant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
