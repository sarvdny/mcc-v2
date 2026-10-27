'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getMetricDefinition } from '@/data/metricDefinitions';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export interface MetricTipProps {
  metricKey: string;
  value?: string | number;
  lastUpdated?: string;
  isSampleData?: boolean;
  children: React.ReactNode;
  className?: string;
  asInline?: boolean;
}

export const MetricTip: React.FC<MetricTipProps> = ({
  metricKey,
  value,
  lastUpdated,
  isSampleData,
  children,
  className = '',
  asInline = false,
}) => {
  const { language } = useDashboardStore();
  const def = getMetricDefinition(metricKey);

  if (!def) {
    return <span className={className}>{children}</span>;
  }

  const lang = language === 'mr' ? 'mr' : 'en';
  const name = def.name[lang];
  const shortDesc = def.shortDescription[lang];
  const detailed = def.detailedMeaning[lang];
  const formula = def.formula[lang];
  const source = def.source[lang];
  const timeWindow = def.timeWindow[lang];
  const rounding = def.rounding[lang];
  const example = def.example[lang];
  const isSample = isSampleData ?? def.isSampleData;
  const updateTime = lastUpdated || 'Updated today at 06:00 IST';

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span
            tabIndex={0}
            role="figure"
            aria-label={`${name}: ${value !== undefined ? value : ''}`}
            className={`inline-flex items-center cursor-help group transition-all rounded focus:outline-none focus:ring-2 focus:ring-gov-accent focus:ring-offset-1 ${className}`}
          >
            {children}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={8}
            className="z-[9999] max-w-[340px] sm:max-w-[380px] bg-slate-900 text-white rounded-xl p-3.5 sm:p-4 text-xs shadow-2xl border border-slate-700/80 animate-in fade-in-0 zoom-in-95 duration-150 select-text leading-relaxed"
          >
            {/* Header: Name + Badge */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-700/80 pb-2 mb-2.5">
              <div>
                <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  <MaterialIcon name="analytics" size="xs" className="text-gov-accent" />
                  <span>{name}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{def.categoryLabel[lang]}</div>
              </div>
              {isSample && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  {lang === 'mr' ? 'नमुना डेटा' : 'Sample data'}
                </span>
              )}
            </div>

            {/* Meaning */}
            <div className="mb-2.5 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {lang === 'mr' ? 'अर्थ व महत्त्व' : 'Meaning & Context'}
              </div>
              <p className="text-slate-200 text-xs leading-normal">{detailed || shortDesc}</p>
            </div>

            {/* Formula / Logic */}
            <div className="mb-2.5 bg-slate-800/90 rounded-lg p-2 border border-slate-700/60 font-mono text-[11px] text-amber-300">
              <div className="text-[10px] uppercase font-sans font-bold text-slate-400 tracking-wider mb-0.5">
                {lang === 'mr' ? 'सूत्र / कार्यप्रणाली' : 'Formula / Calculation'}
              </div>
              <div className="font-medium break-words">{formula}</div>
            </div>

            {/* Example if present */}
            {example && (
              <div className="mb-2 text-[11px] text-slate-300">
                <span className="font-semibold text-slate-400">{lang === 'mr' ? 'उदाहरण: ' : 'Example: '}</span>
                <span>{example}</span>
              </div>
            )}

            {/* Metadata Footer: Source & Timestamp */}
            <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-1 text-[10px] text-slate-400">
              <div className="flex items-center justify-between">
                <span>
                  <strong className="text-slate-300">{lang === 'mr' ? 'स्रोत: ' : 'Source: '}</strong>
                  {source}
                </span>
                <span className="text-slate-500">{rounding}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                <MaterialIcon name="schedule" size="xs" className="text-slate-500" />
                <span>
                  {lang === 'mr' ? 'अद्ययावत: ' : 'Last updated: '}
                  <span className="text-slate-200 font-medium">{updateTime}</span>
                </span>
              </div>
            </div>

            <Tooltip.Arrow className="fill-slate-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
