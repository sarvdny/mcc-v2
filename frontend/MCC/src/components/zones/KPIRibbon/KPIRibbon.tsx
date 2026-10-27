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
      <section className="w-full space-y-2 select-none" aria-label={t.zone1.sectionTitle}>
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
        <div className="bg-white rounded-lg border border-slate-200 px-6 py-8 flex flex-col items-center justify-center text-center gap-2">
          <MaterialIcon name="bar_chart" size="md" className="text-slate-400" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-800">
            {language === 'mr'
              ? 'या जिल्ह्याची अद्याप टेलीमेट्री उपलब्ध नाही'
              : 'No telemetry ingested for this district yet'}
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            {language === 'mr'
              ? 'सध्या केवळ कोकण विभागाच्या पाच जिल्ह्यांची माहिती उपलब्ध आहे.'
              : 'KPI aggregation covers all reporting districts. Choose another district to inspect its releases, response speed and sentiment.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-2 select-none" aria-label={t.zone1.sectionTitle}>
      {/* Scope Sub-label */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" aria-hidden="true" />
          <h2 className="text-xs font-semibold text-slate-700">
            {t.zone1.sectionTitle}
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          {reactiveMetrics.scopeName}
        </span>
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
          targetText={`${reactiveMetrics.sentimentTarget} · ${language === 'mr' ? 'शेवटची गणना' : 'Computed'}: ${lastSentimentComputedAt || '18:25 IST'}`}
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
          targetText={`${reactiveMetrics.misinfoTarget} · ${language === 'mr' ? 'शेवटची गणना' : 'Computed'}: ${lastTicketsComputedAt || '18:25 IST'}`}
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
