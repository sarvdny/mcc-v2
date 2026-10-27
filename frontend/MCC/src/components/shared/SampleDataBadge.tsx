'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';

interface SampleDataBadgeProps {
  className?: string;
  size?: 'xs' | 'sm';
}

export const SampleDataBadge: React.FC<SampleDataBadgeProps> = ({ className = '', size = 'xs' }) => {
  const { language } = useDashboardStore();
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-medium bg-amber-100/90 text-amber-950 border border-amber-300/80 select-none ${
        isSm ? 'text-xs' : 'text-[11px]'
      } ${className}`}
      title={
        language === 'mr'
          ? 'अधिकृत प्रात्यक्षिक / नमुना माहिती (काल्पनिक)'
          : 'Synthetic Demonstration Data (Fictional)'
      }
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0" aria-hidden="true" />
      <span>{language === 'mr' ? 'नमुना माहिती' : 'Sample data'}</span>
    </span>
  );
};
