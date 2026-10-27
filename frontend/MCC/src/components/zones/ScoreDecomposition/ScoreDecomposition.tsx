'use client';

import React, { useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { ScoreMetricBar } from './ScoreMetricBar';
import { ScoreDecompositionSkeleton } from '@/components/skeletons/ScoreDecompositionSkeleton';
import { getDistrictName } from '@/lib/dataLocalization';
import { getDistrictSentiment } from '@/lib/sentimentEngine';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { MetricTip } from '@/components/shared/MetricTip';
import { TermInfo } from '@/components/shared/TermInfo';
import { calculateStatewideAggregates } from '@/calculations';
import { MinimalCardHeader } from '@/components/shared/MinimalCardHeader';

export interface ScoreDecompositionProps {
  /** Optional prop to enable cross-panel highlighting when a district is selected from toolbar */
  highlightDistrict?: (districtId: string) => void;
}

export const ScoreDecomposition: React.FC<ScoreDecompositionProps> = ({
  highlightDistrict,
}) => {
  const { districts, selectedDistrictId, selectedPeriod, language, isLoadingData } =
    useDashboardStore();
  const t = useTranslation(language);

  const isAllDistricts = !selectedDistrictId || selectedDistrictId === 'all';
  const thaneDistrict = districts.find((d) => d.id === 'thane') || districts[0];
  const matchedDistrict = districts.find((d) => d.id === selectedDistrictId?.toLowerCase());
  const selected = isAllDistricts ? thaneDistrict : (matchedDistrict || thaneDistrict);

  const sentimentBreakdown = useMemo(() => {
    return getDistrictSentiment(selected && !isAllDistricts ? selected.id : undefined, selectedPeriod);
  }, [selected, isAllDistricts, selectedPeriod]);

  // Safeguard #1: Return skeleton directly at root level to prevent double card wrappers
  if (isLoadingData) {
    return <ScoreDecompositionSkeleton />;
  }

  // Cross-panel selection can point at a district outside the ingested dataset.
  // Say so plainly instead of rendering another district's numbers.
  if (!selected) {
    const label = selectedDistrictId
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white">
          <MinimalCardHeader
            title={`${t.zone3.title} — ${label}`}
            subtitle={t.zone3.subtitle}
          />
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center gap-2">
          <MaterialIcon name="bar_chart" size="md" className="text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">
            {language === 'mr'
              ? 'या जिल्ह्याची अद्याप टेलीमेट्री उपलब्ध नाही'
              : 'No telemetry ingested for this district yet'}
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            {language === 'mr'
              ? 'सध्या सक्रिय जिल्ह्यांचा डेटा उपलब्ध आहे. कृपया दुसरा जिल्हा निवडा.'
              : 'Decomposition is computed for active reporting districts. Choose another district to inspect its score.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white">
        <MinimalCardHeader
          title={`${t.zone3.title} — ${
            language === 'mr'
              ? (selected.nameMr || getDistrictName(selected.name, 'mr'))
              : selected.name
          }`}
          subtitle={t.zone3.subtitle}
          action={
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              {selected.rank > 0 && (
                <>
                  <span className="text-gov-primary font-bold">
                    {t.zone3.rankPrefix} #{selected.rank}
                  </span>
                  <span className="text-slate-300 select-none font-mono">|</span>
                </>
              )}
              <div className="flex items-center gap-1">
                <MetricTip metricKey="cpi" value={selected.cpi}>
                  <span className="font-mono font-bold text-gov-primary hover:text-amber-600 transition-colors cursor-help">
                    {selected.cpi} <span className="font-sans font-medium text-slate-500">/ 100 {t.zone3.cpiPrefix}</span>
                  </span>
                </MetricTip>
                <TermInfo termKey="cpi" size="xs" />
              </div>
            </div>
          }
          className="w-full"
        />
      </div>

      {/* 3 Constituent Scores */}
      <div className="p-5 space-y-4 bg-white">
        {/* 1. Volume Score (35 pts) */}
        {(() => {
          const safeVolume = Math.min(35, Number(selected.volumeScore || 0));
          const volumeGap = Number((35 - safeVolume).toFixed(2));
          return (
            <ScoreMetricBar
              icon="newspaper"
              title={t.zone3.volumeTitle}
              subtitle={t.zone3.volumeSub}
              score={safeVolume}
              maxScore={35}
              valueLabel={`${selected.releases} ${language === 'mr' ? 'पत्रके' : 'releases'}`}
              gapLabel={`${volumeGap} ${t.zone3.gapSuffix}`}
              metricKey="volumeScore"
            />
          );
        })()}

        {/* 2. Media Sentiment Index (Multi-Channel 4-Stream Composite, 25 pts) */}
        <div className="space-y-1.5 p-2 rounded-md hover:bg-slate-50 transition-colors">
          {(() => {
            const safeSentiment = Math.min(25, Number(selected.sentimentScore || 0));
            const sentimentGap = Number((25 - safeSentiment).toFixed(2));
            return (
              <ScoreMetricBar
                icon="chat_bubble"
                title={t.zone3.sentimentTitle}
                subtitle={t.zone3.sentimentSub}
                score={safeSentiment}
                maxScore={25}
                valueLabel={`${selected.sentiment}%`}
                gapLabel={`${sentimentGap} ${t.zone3.gapSuffix}`}
                metricKey="sentimentIndex"
              />
            );
          })()}

          {/* 4-Channel Weighted Breakdown Badges */}
          <div className="mt-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1 mb-1.5">
              <MaterialIcon name="bar_chart" size="xs" className="text-slate-400" />
              <span>
                {language === 'mr' ? '४-प्रवाह घटक:' : '4-Channel Mix:'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/80 rounded-lg border border-slate-100">
              <div
                className="flex items-center justify-between gap-1 pl-2 border-l-2 border-blue-500 text-xs"
                title="Print Media OCR (35% weight in composite tone score)"
              >
                <span className="text-slate-700 font-medium truncate">
                  {language === 'mr' ? 'प्रिंट ओसीआर' : 'Print OCR'}
                </span>
                <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
                  <strong className="text-slate-900">{sentimentBreakdown.printOcr}%</strong>
                  <span className="text-slate-400 text-xs">(35%)</span>
                </div>
              </div>
              <div
                className="flex items-center justify-between gap-1 pl-2 border-l-2 border-purple-500 text-xs"
                title="Broadcast TV Telemetry - DD Sahyadri & Regional News (25% weight)"
              >
                <span className="text-slate-700 font-medium truncate">
                  {language === 'mr' ? 'टीव्ही प्रसारण' : 'Broadcast TV'}
                </span>
                <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
                  <strong className="text-slate-900">{sentimentBreakdown.broadcastTv}%</strong>
                  <span className="text-slate-400 text-xs">(25%)</span>
                </div>
              </div>
              <div
                className="flex items-center justify-between gap-1 pl-2 border-l-2 border-emerald-500 text-xs"
                title="Social Listening - X/Twitter, FB, Insta, YouTube (25% weight)"
              >
                <span className="text-slate-700 font-medium truncate">
                  {language === 'mr' ? 'सोशल ऐकणे' : 'Social'}
                </span>
                <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
                  <strong className="text-slate-900">{sentimentBreakdown.socialListening}%</strong>
                  <span className="text-slate-400 text-xs">(25%)</span>
                </div>
              </div>
              <div
                className="flex items-center justify-between gap-1 pl-2 border-l-2 border-amber-500 text-xs"
                title="Citizen/User Comments & Public Feedback (15% weight)"
              >
                <span className="text-slate-700 font-medium truncate">
                  {language === 'mr' ? 'नागरिक टिप्पण्या' : 'Comments'}
                </span>
                <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
                  <strong className="text-slate-900">{sentimentBreakdown.userComments}%</strong>
                  <span className="text-slate-400 text-xs">(15%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Crisis SLA Resolution Rate (15 pts) */}
        {(() => {
          const rawCrisis = Number(selected.crisisScore || 0);
          const safeCrisis = rawCrisis > 15
            ? Number(((selected.crisisSLA / 100) * 15).toFixed(2))
            : Math.min(15, rawCrisis);
          const crisisGap = Number((15 - safeCrisis).toFixed(2));
          return (
            <ScoreMetricBar
              icon="warning"
              title={t.zone3.crisisTitle}
              subtitle={t.zone3.crisisSub}
              score={safeCrisis}
              maxScore={15}
              valueLabel={`${selected.crisisSLA}%`}
              gapLabel={`${crisisGap} ${t.zone3.gapSuffix}`}
              metricKey="crisisSlaResolutionRate"
            />
          );
        })()}
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
        <span>{t.zone3.footerLeft}</span>
        <span className="font-semibold text-gov-primary">{t.zone3.footerRight}</span>
      </div>
    </div>
  );
};