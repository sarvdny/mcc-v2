'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getMetricDefinition } from '@/data/metricDefinitions';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export interface TermInfoProps {
  termKey: string;
  className?: string;
  size?: 'xs' | 'sm';
}

export const TermInfo: React.FC<TermInfoProps> = ({
  termKey,
  className = '',
  size = 'xs',
}) => {
  const { language } = useDashboardStore();
  const def = getMetricDefinition(termKey);

  if (!def) return null;

  const lang = language === 'mr' ? 'mr' : 'en';
  const name = def.name[lang];
  const shortDesc = def.shortDescription[lang];
  const detailed = def.detailedMeaning[lang];
  const example = def.example[lang];

  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label={`${name} - ${lang === 'mr' ? 'माहिती व व्याख्या' : 'Information & Definition'}`}
            className={`inline-flex items-center justify-center rounded-full text-slate-400 hover:text-gov-primary hover:bg-slate-200/80 transition-colors focus:outline-none focus:ring-1 focus:ring-gov-accent cursor-help p-0.5 ml-1 ${className}`}
          >
            <MaterialIcon name="help_outline" size={size} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={6}
            className="z-[9999] max-w-[320px] bg-slate-900 text-white rounded-lg p-3 text-xs shadow-xl border border-slate-700/80 animate-in fade-in-0 zoom-in-95 leading-relaxed"
          >
            <div className="font-bold text-slate-100 flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1.5 mb-1.5">
              <span>{name}</span>
              <span className="text-[10px] text-gov-accent font-semibold">{def.categoryLabel[lang]}</span>
            </div>
            <p className="text-slate-200 text-[11px] mb-2">{detailed || shortDesc}</p>
            {example && (
              <div className="text-[10px] text-slate-400 bg-slate-800/80 p-1.5 rounded border border-slate-700/50">
                <strong className="text-slate-300">{lang === 'mr' ? 'उदाहरण: ' : 'Example: '}</strong>
                <span>{example}</span>
              </div>
            )}
            <div className="mt-2 text-right">
              <a
                href="/glossary"
                className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
              >
                {lang === 'mr' ? 'शब्दकोशात सविस्तर पहा →' : 'Full Glossary Details →'}
              </a>
            </div>
            <Tooltip.Arrow className="fill-slate-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
