'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';

export type LeaderboardTab = 'cpi' | 'event' | 'specific';

interface LeaderboardTabsProps {
  activeTab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
}

export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <div
      role="tablist"
      aria-label="Leaderboard category tabs"
      className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/80 shadow-xs overflow-x-auto text-xs w-fit"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'cpi'}
        onClick={() => onTabChange('cpi')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
          activeTab === 'cpi'
            ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        {t.zone2.cpiTab}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'event'}
        onClick={() => onTabChange('event')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
          activeTab === 'event'
            ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        {t.zone2.eventTab}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'specific'}
        onClick={() => onTabChange('specific')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
          activeTab === 'specific'
            ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        {t.zone2.newsTab}
      </button>
    </div>
  );
};
