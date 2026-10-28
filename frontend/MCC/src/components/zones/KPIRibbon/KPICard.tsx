'use client';

import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/20/solid';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';
import { MetricTip } from '@/components/shared/MetricTip';
import { TermInfo } from '@/components/shared/TermInfo';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import { MiniSparkline } from '@/components/shared/MiniSparkline';

export interface KPICardProps {
  icon: MaterialIconName;
  title: string;
  marathiTitle?: string;
  value: string | number;
  unit?: string;
  targetText: string;
  trendDirection?: 'up' | 'down';
  trendValue: string;
  positiveTrend?: boolean;
  channelBreakdown?: string;
  metricKey?: string;
  lastUpdated?: string;
  sparklineData?: number[];
  progressPercent?: number;
  slaPercent?: number;
}

export const KPICard: React.FC<KPICardProps> = ({
  icon,
  title,
  marathiTitle,
  value,
  unit,
  targetText,
  trendDirection,
  trendValue,
  positiveTrend = true,
  channelBreakdown,
  metricKey,
  lastUpdated,
  sparklineData,
  progressPercent,
  slaPercent,
}) => {
  const isHealthy =
    (trendDirection === 'up' && positiveTrend) ||
    (trendDirection === 'down' && !positiveTrend);

  const isTargetMet =
    targetText.toLowerCase().includes('met') ||
    targetText.includes('साध्य') ||
    targetText.includes('सफल') ||
    targetText.toLowerCase().includes('above') ||
    targetText.toLowerCase().includes('verified');

  // Determine graphical visualization type
  const isPressReleases = title.toLowerCase().includes('press') || title.includes('प्रसिद्धी');
  const isMediaPlacements = title.toLowerCase().includes('media') || title.includes('माध्यम');
  const isSentiment = title.toLowerCase().includes('sentiment') || title.includes('लोकभावना');
  const isCrisis = title.toLowerCase().includes('crisis') || title.includes('आपत्ती');
  const isFieldEvents = title.toLowerCase().includes('field') || title.includes('क्षेत्रीय');

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-xs p-3.5 flex flex-col justify-between hover:border-blue-300/80 transition-all duration-150 h-full min-h-[120px]">
      {/* 1. Header: Icon + Title + InfoTooltip */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <MaterialIcon name={icon} size="xs" className="text-blue-700" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800 leading-tight truncate">{title}</span>
            {metricKey && <InfoTooltip termKey={metricKey} />}
            {marathiTitle && (
              <span className="text-[10px] text-slate-400 font-medium truncate hidden 2xl:inline">{marathiTitle}</span>
            )}
          </div>
        </div>

        {/* Mini trend badge */}
        <div
          className={`flex items-center gap-0.5 text-[11px] font-bold tabular-nums px-1.5 py-0.5 rounded-md shrink-0 ${
            isHealthy
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
              : 'bg-rose-50 text-rose-700 border border-rose-200/80'
          }`}
        >
          {trendDirection === 'up' && <ArrowTrendingUpIcon className="w-3 h-3 shrink-0" aria-hidden="true" />}
          {trendDirection === 'down' && <ArrowTrendingDownIcon className="w-3 h-3 shrink-0" aria-hidden="true" />}
          <span>{trendValue}</span>
        </div>
      </div>

      {/* 2. Primary Metric + Micro-Visualization */}
      <div className="flex-1 flex flex-col justify-between my-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5 text-2xl font-black tracking-tight text-slate-900 tabular-nums leading-none">
            {metricKey ? (
              <MetricTip metricKey={metricKey} value={value} lastUpdated={lastUpdated}>
                <span className="hover:text-blue-700 transition-colors cursor-help">{value}</span>
              </MetricTip>
            ) : (
              <span>{value}</span>
            )}
            {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
          </div>

          {/* Embedded Visual Encoding 1: Sparkline for Media Placements */}
          {isMediaPlacements && (
            <MiniSparkline
              data={sparklineData || [32, 45, 54, 48, 62, 78, 88]}
              width={72}
              height={20}
              strokeColor="#1D4ED8"
              fillColor="rgba(29, 78, 216, 0.10)"
            />
          )}

          {/* Embedded Visual Encoding 2: SLA Countdown Ring for Crisis TAT */}
          {isCrisis && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>90-Min SLA 100%</span>
            </div>
          )}
        </div>

        {/* Embedded Visual Encoding 3: Progress Bar for Press Releases / Field Events */}
        {(isPressReleases || isFieldEvents) && (
          <div className="mt-2 space-y-1">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-blue-600 rounded-l-full transition-all duration-300"
                style={{ width: `${Math.min(100, progressPercent || 88)}%` }}
              />
              <div
                className="h-full bg-emerald-500 rounded-r-full"
                style={{ width: `${Math.max(0, (progressPercent || 88) - 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Embedded Visual Encoding 4: Sentiment 3-Channel Distribution Pill */}
        {isSentiment && (
          <div className="mt-2 space-y-1">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500" style={{ width: '82%' }} title="Positive: 82%" />
              <div className="h-full bg-slate-300" style={{ width: '12%' }} title="Neutral: 12%" />
              <div className="h-full bg-rose-500" style={{ width: '6%' }} title="Critical: 6%" />
            </div>
          </div>
        )}
      </div>

      {/* 3. Supporting Context Footer */}
      <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100 mt-1">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] min-w-0 flex-1 mr-2 ${
            isTargetMet ? 'text-emerald-700 font-semibold' : 'text-slate-600 font-medium'
          }`}
          title={targetText}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isTargetMet ? 'bg-emerald-600' : 'bg-slate-400'
            }`}
            aria-hidden="true"
          />
          <span className="truncate">{targetText}</span>
        </span>

        {channelBreakdown && (
          <span className="text-[10px] text-slate-400 font-mono truncate" title={channelBreakdown}>
            {channelBreakdown}
          </span>
        )}
      </div>
    </div>
  );
};
