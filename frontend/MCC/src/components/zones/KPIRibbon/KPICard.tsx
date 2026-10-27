'use client';

import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/20/solid';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';
import { MetricTip } from '@/components/shared/MetricTip';
import { TermInfo } from '@/components/shared/TermInfo';

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
}) => {
  const isHealthy =
    (trendDirection === 'up' && positiveTrend) ||
    (trendDirection === 'down' && !positiveTrend);

  const isTargetMet =
    targetText.toLowerCase().includes('met') ||
    targetText.includes('साध्य') ||
    targetText.includes('सफल') ||
    targetText.toLowerCase().includes('above');

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-sm p-3.5 flex flex-col justify-between hover:border-slate-300 transition-all duration-150 h-full min-h-[114px]">
      {/* 1. Header: Icon + Title */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <MaterialIcon name={icon} size="sm" className="text-slate-500 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex items-center gap-1">
            <span className="text-xs font-semibold text-slate-700 leading-tight truncate">{title}</span>
            {metricKey && <TermInfo termKey={metricKey} size="xs" />}
            {marathiTitle && (
              <span className="text-xs text-slate-500 font-normal truncate ml-0.5">{marathiTitle}</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Primary Metric */}
      <div className="flex-1 flex flex-col justify-between my-0.5">
        <div>
          <div className="flex items-baseline gap-1.5 text-2xl font-bold tracking-tight text-slate-900 tabular-nums leading-none">
            {metricKey ? (
              <MetricTip metricKey={metricKey} value={value} lastUpdated={lastUpdated}>
                <span className="hover:text-gov-primary transition-colors cursor-help">{value}</span>
              </MetricTip>
            ) : (
              <span>{value}</span>
            )}
            {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
          </div>

          {channelBreakdown && (
            <div className="text-[11px] text-slate-500 mt-1 truncate" title={channelBreakdown}>
              {channelBreakdown}
            </div>
          )}
        </div>

        {/* 3. Supporting Context Footer */}
        <div className="flex items-center justify-between text-xs mt-2 pt-1.5 border-t border-slate-100">
          <span
            className={`inline-flex items-center gap-1.5 text-xs truncate max-w-[180px] ${
              isTargetMet ? 'text-emerald-700 font-medium' : 'text-slate-600'
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
          <div
            className={`flex items-center gap-0.5 text-xs font-semibold tabular-nums shrink-0 ${
              isHealthy ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {trendDirection === 'up' && <ArrowTrendingUpIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
            {trendDirection === 'down' && <ArrowTrendingDownIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
            <span>{trendValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
