'use client';

import React, { useMemo, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { LeaderboardTabs, LeaderboardTab } from './LeaderboardTabs';
import { DistrictPerformanceChart } from './DistrictPerformanceChart';
import { DistrictSearchBar } from './DistrictSearchBar';
import { DistrictTable } from './DistrictTable';
import { LeaderboardSkeleton } from '@/components/skeletons/LeaderboardSkeleton';
import { MinimalCardHeader } from '@/components/shared/MinimalCardHeader';

export interface DistrictLeaderboardProps {
  showChart?: boolean;
  /** Optional prop to enable cross-panel highlighting when a district row is clicked */
  highlightDistrict?: (districtId: string) => void;
}

export const DistrictLeaderboard: React.FC<DistrictLeaderboardProps> = (
  { showChart = true, highlightDistrict }: DistrictLeaderboardProps) => {
  const {
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDivision,
    searchDistrict,
    setSearchDistrict,
    language,
    isLoadingData,
  } = useDashboardStore();
  const t = useTranslation(language);

  const [activeTab, setActiveTab] = useState<LeaderboardTab>('cpi');

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const matchesDivision =
        selectedDivision === 'All Maharashtra' || d.division === selectedDivision;
      const matchesSearch = d.name.toLowerCase().includes(searchDistrict.toLowerCase());
      return matchesDivision && matchesSearch;
    });
  }, [districts, selectedDivision, searchDistrict]);

  // Safeguard #1: Return skeleton directly at root level to prevent double card wrappers
  if (isLoadingData) {
    return <LeaderboardSkeleton />;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col overflow-hidden">
      {/* Header and Sub-tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
        <div className="mb-3">
          <MinimalCardHeader
            title={t.zone2.title}
            subtitle={t.zone2.subtitle}
            className="w-full"
          />
        </div>
        <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        {/* Top 5 Bar Chart */}
        {showChart && (
          <DistrictPerformanceChart
            districts={districts}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={setSelectedDistrictId}
          />
        )}

        {/* Controls: Search and Division Counter */}
        <DistrictSearchBar
          searchDistrict={searchDistrict}
          onSearchChange={setSearchDistrict}
          filteredCount={filteredDistricts.length}
          totalCount={districts.length}
        />

        {/* Ranked District Table - rows now support cross-panel highlighting */}
        <DistrictTable
          districts={filteredDistricts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
          highlightDistrict={highlightDistrict}
        />
      </div>
    </div>
  );
};
