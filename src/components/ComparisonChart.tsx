import React from 'react';
import { PieChart, Clock, FileArchive } from 'lucide-react';
import { AnalysisResult } from '../types/instagram';
import { formatFileSize } from '../utils/validation';

interface ComparisonChartProps {
  result: AnalysisResult;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ result }) => {
  const totalFollowing = result.totalFollowing || 1;

  // Proportions for visual bar breakdown
  const nonFollowersPercent = Math.min(100, Math.max(0, result.nonFollowersPercentage));
  const mutualsPercent = totalFollowing > 0
    ? Math.round((result.mutualFollowersCount / totalFollowing) * 1000) / 10
    : 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card mb-8">
      {/* Top Meta Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-main flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            <span>Audience Relationship Overview</span>
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Mathematical breakdown of your Instagram audience network
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-secondary">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Analyzed: {result.analysisTimestamp}</span>
          </div>
          {result.fileName && (
            <div className="flex items-center gap-1.5">
              <FileArchive className="w-3.5 h-3.5 text-slate-400" />
              <span>{result.fileName} ({formatFileSize(result.fileSize)})</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Sentence Box */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 mb-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-base sm:text-lg font-bold text-main">
            Out of <span className="text-primary font-extrabold">{result.totalFollowing.toLocaleString()}</span> accounts you follow,{' '}
            <span className="text-danger font-extrabold">{result.nonFollowersCount.toLocaleString()}</span> don’t follow you back.
          </p>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            That represents <strong className="text-danger font-bold">{result.nonFollowersPercentage}%</strong> of your entire following list.
          </p>
        </div>

        <div className="px-4 py-2 rounded-lg bg-danger/10 border border-danger/20 text-danger text-center flex-shrink-0">
          <div className="text-2xl font-black">{result.nonFollowersPercentage}%</div>
          <div className="text-[10px] uppercase font-bold tracking-wider">Non-Follow Rate</div>
        </div>
      </div>

      {/* Visual Proportional Distribution Bar */}
      <div>
        <div className="flex justify-between items-center text-xs font-bold text-secondary mb-2">
          <span>Following List Breakdown</span>
          <span>{result.totalFollowing.toLocaleString()} Total Accounts Followed</span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
          <div
            className="bg-danger hover:opacity-95 transition-all duration-300"
            style={{ width: `${nonFollowersPercent}%` }}
            title={`Don't Follow Back: ${result.nonFollowersCount} (${nonFollowersPercent}%)`}
          />
          <div
            className="bg-emerald-500 hover:opacity-95 transition-all duration-300"
            style={{ width: `${mutualsPercent}%` }}
            title={`Mutual Friends: ${result.mutualFollowersCount} (${mutualsPercent}%)`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 text-xs font-semibold text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-danger" />
            <span>Don't Follow You Back: <strong className="text-main">{result.nonFollowersCount.toLocaleString()}</strong> ({nonFollowersPercent}%)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Mutual Followers: <strong className="text-main">{result.mutualFollowersCount.toLocaleString()}</strong> ({mutualsPercent}%)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Fans (You don't follow back): <strong className="text-main">{result.youDontFollowBackCount.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
