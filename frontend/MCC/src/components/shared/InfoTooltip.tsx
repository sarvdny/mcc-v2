'use client';

import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { useDashboardStore } from '@/stores/dashboardStore';
import { METRIC_DEFINITIONS } from '@/data/metricDefinitions';

export interface InfoTooltipProps {
  termKey?: string;
  metricKey?: string;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const KEY_ALIASES: Record<string, string> = {
  cpi: 'cpi',
  volumeScore: 'volume_score',
  speedScore: 'tat_speed_score',
  sentimentIndex: 'sentiment_index',
  crisisResolution: 'crisis_sla_resolution_rate',
  attendancePercent: 'attendance_rate',
  punctualityScore: 'punctuality_rate',
  hoardings: 'hoardings_count',
};

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  termKey,
  metricKey,
  className = '',
  align = 'center',
  side = 'top',
}) => {
  const { language } = useDashboardStore();
  const rawKey = termKey || metricKey || '';
  const resolvedKey = KEY_ALIASES[rawKey] || rawKey;
  const def = METRIC_DEFINITIONS[resolvedKey];

  if (!def) {
    return null;
  }

  const name = language === 'mr' ? def.name.mr : def.name.en;
  const description = language === 'mr' ? def.shortDescription.mr : def.shortDescription.en;
  const formula = language === 'mr' ? def.formula.mr : def.formula.en;
  const source = language === 'mr' ? def.source.mr : def.source.en;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`Information for ${def.name.en}`}
          className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer select-none shrink-0 ${className}`}
        >
          <span className="text-[10px] font-bold font-serif leading-none italic">i</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align={align}
          side={side}
          sideOffset={6}
          className="z-50 w-72 max-w-[92vw] rounded-2xl bg-white/95 backdrop-blur-xl p-3.5 shadow-xl border border-slate-200 text-slate-800 text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-xs leading-tight truncate">{name}</p>
              {language === 'mr' && (
                <p className="text-[10px] text-slate-500 font-medium truncate">{def.name.en}</p>
              )}
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200/60 shrink-0">
              {def.timeWindow?.[language] || 'Live'}
            </span>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed mb-2.5">
            {description}
          </p>

          {formula && (
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100 mb-2">
              <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">
                {language === 'mr' ? 'गणितीय सूत्र / नियम' : 'Computation Formula'}
              </span>
              <code className="text-[10px] text-blue-800 font-mono break-words leading-tight block">
                {formula}
              </code>
            </div>
          )}

          {source && (
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
              <span className="truncate">Source: {source}</span>
              {def.isSampleData && (
                <span className="px-1 py-0.2 rounded bg-amber-50 text-amber-700 font-medium text-[9px] border border-amber-200 shrink-0">
                  Mock/Simulation
                </span>
              )}
            </div>
          )}

          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
