'use client';

import React from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';

interface DistrictSearchBarProps {
  searchDistrict: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const DistrictSearchBar: React.FC<DistrictSearchBarProps> = ({
  searchDistrict,
  onSearchChange,
  filteredCount,
  totalCount,
}) => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
      <div className="relative flex-1 max-w-sm">
        <MaterialIcon name="search" size="sm" className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={t.zone2.searchPlaceholder}
          value={searchDistrict}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200/90 text-xs bg-slate-50/70 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-accent/60 focus:border-slate-300 shadow-xs transition-all duration-150"
        />
      </div>
      <div className="text-slate-500 font-medium text-[11px] font-mono">
        {t.zone2.showingPrefix} <strong className="text-gov-primary font-bold">{filteredCount}</strong> / {totalCount} {t.zone2.districtsSuffix}
      </div>
    </div>
  );
};
