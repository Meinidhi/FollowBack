import React, { useState, useMemo } from 'react';
import { UserX, UserCheck, ArrowRightLeft, Trash2 } from 'lucide-react';
import { AnalysisResult, ResultTab, SortOrder } from '../types/instagram';
import { StatsCards } from './StatsCards';
import { ComparisonChart } from './ComparisonChart';
import { SearchBar } from './SearchBar';
import { FilterControls } from './FilterControls';
import { AccountTable } from './AccountTable';
import { Pagination } from './Pagination';
import { exportUsersToCsv } from '../utils/csvExporter';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onClearData: () => void;
}

const PAGE_SIZE = 25;

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onClearData
}) => {
  const [activeTab, setActiveTab] = useState<ResultTab>('not_following_back');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [currentPage, setCurrentPage] = useState(1);

  // Switch tabs & reset page
  const handleTabChange = (tab: ResultTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Get raw list based on active tab
  const rawList = useMemo(() => {
    switch (activeTab) {
      case 'not_following_back':
        return result.notFollowingBack;
      case 'you_dont_follow_back':
        return result.youDontFollowBack;
      case 'mutual':
        return result.mutualFollowers;
      default:
        return result.notFollowingBack;
    }
  }, [activeTab, result]);

  // Filter & Sort list
  const filteredAndSorted = useMemo(() => {
    let list = [...rawList];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(u => u.normalizedUsername.includes(q));
    }

    // Sort
    if (sortOrder === 'az') {
      list.sort((a, b) => a.normalizedUsername.localeCompare(b.normalizedUsername));
    } else if (sortOrder === 'za') {
      list.sort((a, b) => b.normalizedUsername.localeCompare(a.normalizedUsername));
    }

    return list;
  }, [rawList, searchQuery, sortOrder]);

  // Pagination calculation
  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedUsers = useMemo(() => {
    return filteredAndSorted.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredAndSorted, startIndex]);

  // Reset page when search changes
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // CSV export handler
  const handleExportCsv = () => {
    exportUsersToCsv(filteredAndSorted, activeTab);
  };

  return (
    <div className="py-8 md:py-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Clear Data Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Analysis Complete</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-main tracking-tight">
              Your Instagram FollowBack Report
            </h1>
            <p className="text-sm sm:text-base text-secondary mt-1">
              Your Instagram data has been successfully analyzed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearData}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-danger bg-white hover:bg-danger-light/40 border border-danger/30 shadow-sm transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Data & Upload New</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <StatsCards
          result={result}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Visual Chart / Proportion Bar */}
        <ComparisonChart result={result} />

        {/* Comparison Tabs & Lists Section */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card">
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-5 mb-6">
            <button
              onClick={() => handleTabChange('not_following_back')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'not_following_back'
                  ? 'bg-danger text-white shadow-md shadow-danger/20'
                  : 'text-secondary hover:text-main hover:bg-slate-100'
              }`}
            >
              <UserX className="w-4 h-4" />
              <span>Don't Follow You Back</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === 'not_following_back' ? 'bg-white/20 text-white' : 'bg-slate-100 text-secondary'
              }`}>
                {result.nonFollowersCount.toLocaleString()}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('you_dont_follow_back')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'you_dont_follow_back'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-secondary hover:text-main hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>You Don't Follow Back</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === 'you_dont_follow_back' ? 'bg-white/20 text-white' : 'bg-slate-100 text-secondary'
              }`}>
                {result.youDontFollowBackCount.toLocaleString()}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('mutual')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'mutual'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-secondary hover:text-main hover:bg-slate-100'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Mutual Followers</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === 'mutual' ? 'bg-white/20 text-white' : 'bg-slate-100 text-secondary'
              }`}>
                {result.mutualFollowersCount.toLocaleString()}
              </span>
            </button>
          </div>

          {/* Search, Filter & CSV Export Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search username..."
            />

            <FilterControls
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              onExportCsv={handleExportCsv}
              count={totalItems}
            />
          </div>

          {/* Table / Cards List */}
          <AccountTable
            users={paginatedUsers}
            activeTab={activeTab}
            startIndex={startIndex}
            searchQuery={searchQuery}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />

        </div>

      </div>
    </div>
  );
};
