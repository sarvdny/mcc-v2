'use client';

import React, { useMemo } from 'react';
import { KPICard } from './KPICard';
import { KPIRibbonSkeleton } from '@/components/skeletons/KPIRibbonSkeleton';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { getDistrictName } from '@/lib/dataLocalization';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { calculateReactiveKPIs } from '@/calculations';

export interface KPIRibbonProps {
  layout?: 'ribbon' | 'column';
}

export const KPIRibbon: React.FC<KPIRibbonProps> = ({ layout = 'ribbon' }) => {
  const {
    language,
    overviewMetrics,
    selectedDistrictId,
    selectedPeriod,
    districts,
    incidents,
    isLoadingData,
    lastSentimentComputedAt,
    lastTicketsComputedAt,
  } = useDashboardStore();

  const t = useTranslation(language);

  const isDistrictSelected = Boolean(selectedDistrictId && selectedDistrictId !== 'all');
  const prettyDistrictName = selectedDistrictId
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  // Selected district is only meaningful when it is part of the ingested dataset.
  const currentDistrict = isDistrictSelected
    ? districts.find((d) => d.id === selectedDistrictId.toLowerCase()) || null
    : null;

  // Memoized reactive metric calculation on any filter change (<16ms)
  const reactiveMetrics = useMemo(() => {
    return calculateReactiveKPIs({
      districts,
      incidents,
      selectedPeriod,
      selectedDistrictId,
      language,
    });
  }, [selectedDistrictId, selectedPeriod, districts, incidents, language]);

  if (isLoadingData) {
    return <KPIRibbonSkeleton cardsCount={3} />;
  }

  if (isDistrictSelected && !currentDistrict) {
    return (
      <section className="w-full space-y-1.5 select-none" aria-label={t.zone1.sectionTitle}>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" aria-hidden="true" />
            <h2 className="text-xs font-semibold text-slate-700">
              {t.zone1.sectionTitle}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            {prettyDistrictName} {language === 'mr' ? 'जिल्हा कार्यक्षेत्र' : 'District Operations'}
          </span>
        </div>
        <div className="h-11 px-4 py-2 flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <MaterialIcon name="bar_chart" size="xs" className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="font-medium text-slate-700 truncate">
              {language === 'mr'
                ? 'या जिल्ह्यासाठी टेलीमेट्री उपलब्ध नाही.'
                : 'No telemetry ingested for this district yet.'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 shrink-0 hidden sm:inline">
            {language === 'mr'
              ? 'केपीआय तपासण्यासाठी वरील सक्रिय जिल्हा निवडा.'
              : 'Select an active reporting district above to inspect KPIs.'}
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-2 select-none" aria-label={t.zone1.sectionTitle}>
      {/* Scope Sub-label & Unified Sync Badge */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" aria-hidden="true" />
          <h2 className="text-xs font-semibold text-slate-700">
            {t.zone1.sectionTitle}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 tabular-nums">
            {language === 'mr' ? 'शेवटचे अद्यतन' : 'Last synced'} • {lastSentimentComputedAt || '18:25 IST'}
          </span>
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            {reactiveMetrics.scopeName}
          </span>
        </div>
      </div>

      {/* KPI Cards: 3 cards matching Volume, Sentiment, and Crisis SLA */}
      <div
        className={
          layout === 'ribbon'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 xl:gap-5 w-full items-stretch'
            : 'grid grid-cols-1 gap-2.5 w-full items-stretch'
        }
      >
        {/* 1. Total Releases (Volume) */}
        <KPICard
          icon="description"
          title={t.zone1.totalReleases}
          value={reactiveMetrics.releasesVal}
          targetText={reactiveMetrics.releasesTarget}
          trendDirection="up"
          trendValue={reactiveMetrics.releasesTrend}
          positiveTrend={true}
          metricKey="volumeScore"
        />

        {/* 2. Multi-Channel Sentiment Index */}
        <KPICard
          icon="analytics"
          title={t.zone1.sentimentIndex}
          value={reactiveMetrics.sentimentVal}
          targetText={reactiveMetrics.sentimentTarget}
          trendDirection="up"
          trendValue={reactiveMetrics.sentimentTrend}
          positiveTrend={true}
          channelBreakdown={reactiveMetrics.sentimentChannelsText}
          metricKey="sentimentIndex"
          lastUpdated={lastSentimentComputedAt}
        />

        {/* 3. Crisis SLA / Misinformation Containment */}
        <KPICard
          icon="error"
          title={t.zone1.misinformation}
          value={reactiveMetrics.openTicketsCount}
          unit={language === 'mr' ? 'चालू' : 'open'}
          targetText={reactiveMetrics.misinfoTarget}
          trendDirection="down"
          trendValue={reactiveMetrics.misinfoTrend}
          positiveTrend={false}
          metricKey="misinformationTickets"
          lastUpdated={lastTicketsComputedAt}
        />
      </div>
    </section>
  );
};
