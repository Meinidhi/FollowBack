import React from 'react';
import { ArrowDownAZ, ArrowUpZA, DownloadCloud } from 'lucide-react';
import { SortOrder } from '../types/instagram';

interface FilterControlsProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  onExportCsv: () => void;
  count: number;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  sortOrder,
  onSortChange,
  onExportCsv,
  count
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Sort buttons */}
      <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => onSortChange('default')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            sortOrder === 'default'
              ? 'bg-white text-main shadow-sm font-bold'
              : 'text-secondary hover:text-main'
          }`}
        >
          Default
        </button>
        <button
          onClick={() => onSortChange('az')}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
            sortOrder === 'az'
              ? 'bg-white text-main shadow-sm font-bold'
              : 'text-secondary hover:text-main'
          }`}
          title="Sort Alphabetical A to Z"
        >
          <ArrowDownAZ className="w-3.5 h-3.5" />
          <span>A–Z</span>
        </button>
        <button
          onClick={() => onSortChange('za')}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
            sortOrder === 'za'
              ? 'bg-white text-main shadow-sm font-bold'
              : 'text-secondary hover:text-main'
          }`}
          title="Sort Alphabetical Z to A"
        >
          <ArrowUpZA className="w-3.5 h-3.5" />
          <span>Z–A</span>
        </button>
      </div>

      {/* CSV Export Button */}
      <button
        onClick={onExportCsv}
        disabled={count === 0}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
          count === 0
            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            : 'bg-white hover:bg-slate-50 text-main border-slate-200 hover:border-slate-300 shadow-sm active:scale-95'
        }`}
        title="Download CSV spreadsheet of all matching accounts"
      >
        <DownloadCloud className="w-4 h-4 text-primary" />
        <span>Export CSV</span>
      </button>
    </div>
  );
};
