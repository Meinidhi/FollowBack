import React from 'react';
import { Users, UserX, ArrowRightLeft } from 'lucide-react';
import { AnalysisResult, ResultTab } from '../types/instagram';

interface StatsCardsProps {
  result: AnalysisResult;
  activeTab: ResultTab;
  onTabChange: (tab: ResultTab) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  result,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      
      {/* CARD 1: Total Followers */}
      <div 
        onClick={() => onTabChange('you_dont_follow_back')}
        className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Total Followers
          </span>
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl sm:text-4xl font-black text-main tracking-tight">
          {result.totalFollowers.toLocaleString()}
        </div>
        <p className="text-xs text-secondary mt-1.5 font-medium">
          Accounts following you
        </p>
      </div>

      {/* CARD 2: Total Following */}
      <div 
        onClick={() => onTabChange('not_following_back')}
        className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Total Following
          </span>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl sm:text-4xl font-black text-main tracking-tight">
          {result.totalFollowing.toLocaleString()}
        </div>
        <p className="text-xs text-secondary mt-1.5 font-medium">
          Accounts you follow
        </p>
      </div>

      {/* CARD 3: Don't Follow You Back (Highlighted) */}
      <div 
        onClick={() => onTabChange('not_following_back')}
        className={`bg-white border-2 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer relative overflow-hidden group ${
          activeTab === 'not_following_back' ? 'border-danger ring-2 ring-danger/10' : 'border-red-200 hover:border-danger/60'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-danger flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            Don't Follow You Back
          </span>
          <div className="w-9 h-9 rounded-xl bg-red-100 text-danger flex items-center justify-center group-hover:scale-105 transition-transform">
            <UserX className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl sm:text-4xl font-black text-danger tracking-tight">
          {result.nonFollowersCount.toLocaleString()}
        </div>
        <p className="text-xs text-danger/80 mt-1.5 font-medium">
          {result.nonFollowersPercentage}% of your following list
        </p>
      </div>

      {/* CARD 4: Mutual Followers */}
      <div 
        onClick={() => onTabChange('mutual')}
        className={`bg-white border-2 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer group ${
          activeTab === 'mutual' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200/90 hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Mutual Followers
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">
          {result.mutualFollowersCount.toLocaleString()}
        </div>
        <p className="text-xs text-emerald-600 mt-1.5 font-medium">
          You follow each other
        </p>
      </div>

    </div>
  );
};
