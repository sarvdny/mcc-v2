'use client';

import React, { useMemo, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/20/solid';
import {
  getDistrictName,
  getDivisionName,
  getLocalizedCategory,
  getLocalizedStatus,
} from '@/lib/dataLocalization';
import { TopLowerMatrixSkeleton } from '@/components/skeletons/TopLowerMatrixSkeleton';
import { MetricTip } from '@/components/shared/MetricTip';
import { TermInfo } from '@/components/shared/TermInfo';
import { calculateTopLowerMatrix } from '@/calculations';
import { MinimalCardHeader } from '@/components/shared/MinimalCardHeader';

interface MatrixRow {
  id: string;
  rank: number;
  name: string;
  nameMr?: string;
  division: string;
  event: number;
  category: string;
  extreme: 'Top High' | 'Lower Band';
  metricPercent: number;
  cpi: number;
}

const DISTRICT_CATEGORIES: Record<string, string> = {
  pune: 'Agrarian Relief',
  nagpur: 'Metro Phase II',
  thane: 'Coastal Security',
  nashik: 'Kumbh Prep',
  'chhatrapati-sambhajinagar': 'Water Grid',
  mumbai: 'Urban Transit',
  kolhapur: 'Sugar MSP',
  amravati: 'Cotton Textile',
  gadchiroli: 'Tribal Outreach',
  nandurbar: 'Health Camp',
  sindhudurg: 'Tourism Alert',
  bhandara: 'Paddy MSP',
  washim: 'Road Works',
};

export const TopLowerMatrix: React.FC = () => {
  const { districts, selectedDivision, selectedDistrictId, setSelectedDistrictId, language, isLoadingData } =
    useDashboardStore();
  const t = useTranslation(language);
  const [filterMode, setFilterMode] = useState<'all' | 'top' | 'lower'>('all');

  // Compute dynamic top 5 and bottom 5 from live store using centralized calculation engine
  const matrixData: MatrixRow[] = useMemo(() => {
    const res = calculateTopLowerMatrix(districts, selectedDivision);
    return res.all.map((item) => ({
      ...item,
      category: DISTRICT_CATEGORIES[item.id] || (item.extreme === 'Top High' ? 'District Dev' : 'Field Welfare'),
    }));
  }, [districts, selectedDivision]);

  const displayedRows = matrixData.filter((r) => {
    if (filterMode === 'top') return r.extreme === 'Top High';
    if (filterMode === 'lower') return r.extreme === 'Lower Band';
    return true;
  });

  const minEvent = Math.min(...matrixData.map((r) => r.event));
  const maxEvent = Math.max(...matrixData.map((r) => r.event));

  if (isLoadingData) {
    return <TopLowerMatrixSkeleton />;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col overflow-hidden">
      {/* Header matching Wireframe 2 */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
        <MinimalCardHeader
          title={t.leadership.matrixTitle}
          subtitle={t.leadership.matrixSub}
          badge={
            selectedDivision !== 'All Maharashtra' ? (
              <span className="text-xs font-mono border-l-2 border-gov-blue pl-2 text-gov-blue font-semibold whitespace-nowrap">
                {language === 'mr' ? getDivisionName(selectedDivision, 'mr') : selectedDivision}
              </span>
            ) : undefined
          }
          action={
            <div
              role="tablist"
              aria-label="Filter matrix by performance"
              className="flex items-center gap-0.5 bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/80 shadow-xs text-xs"
            >
              <button
                type="button"
                role="tab"
                aria-selected={filterMode === 'all'}
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {t.leadership.matrixAllBtn}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filterMode === 'top'}
                onClick={() => setFilterMode('top')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                  filterMode === 'top'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {t.leadership.matrixTopBtn}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filterMode === 'lower'}
                onClick={() => setFilterMode('lower')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                  filterMode === 'lower'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {t.leadership.matrixLowerBtn}
              </button>
            </div>
          }
          className="w-full"
        />
      </div>

      {/* Wireframe Diagram Table Representation */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="overflow-x-auto -mx-1 px-1 border border-slate-200/90 rounded-lg shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gov-primary font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-3">{language === 'mr' ? 'जिल्ह्याचे नाव' : 'District Name'}</th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <span>{language === 'mr' ? 'सक्रियता व सीपीआय' : 'Activity & CPI'}</span>
                    <TermInfo termKey="cpi" size="xs" />
                  </div>
                </th>
                <th className="py-3 px-3">{language === 'mr' ? 'प्रमुख क्षेत्र' : 'Focus Category'}</th>
                <th className="py-3 px-3 text-right">{language === 'mr' ? 'कामगिरी गट' : 'Coverage Extreme'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-800">
              {displayedRows.map((row) => {
                const isTop = row.extreme === 'Top High';
                const isSelected = row.id === selectedDistrictId;

                return (
                  <tr
                    key={row.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedDistrictId(row.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedDistrictId(row.id);
                      }
                    }}
                    className={`cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-2 border-l-gov-blue font-medium'
                        : 'hover:bg-slate-50/90 active:bg-amber-500/20 active:brightness-95 transition-colors duration-100'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-mono text-slate-600 font-semibold w-5">
                          #{row.rank}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {row.name} {row.nameMr || getDistrictName(row.name, 'mr') ? `• ${row.nameMr || getDistrictName(row.name, 'mr')}` : ''}
                          </span>
                          <span className="text-xs text-slate-600 font-medium">
                            {row.division} {language === 'mr' ? `(${getDivisionName(row.division, 'mr')})` : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="hidden 2xl:inline-block w-14 bg-slate-200 h-2 rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full rounded-full ${
                              isTop ? 'bg-gov-blue' : 'bg-slate-400'
                            }`}
                            style={{ width: `${row.metricPercent}%` }}
                          ></div>
                        </div>
                        <MetricTip metricKey="cpi" value={row.cpi}>
                          <span className="font-mono font-bold text-slate-800 text-[11px] cursor-help hover:text-gov-primary hover:underline">
                            {row.cpi}
                          </span>
                        </MetricTip>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                        {getLocalizedCategory(row.category, language)}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-flex items-center justify-end gap-1.5 text-xs font-semibold whitespace-nowrap ${
                          isTop ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isTop ? (
                          <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{getLocalizedStatus(row.extreme, language)}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-2.5 px-2 text-xs text-slate-600 flex justify-between items-center">
          <span>
            {language === 'mr'
              ? '३६ जिल्ह्यांचे सांख्यिकी संकलन — संमिश्र तफावत विश्लेषण'
              : 'Real-Time Extreme Variance Analysis Across 36 Districts'}
          </span>
          <span className="font-mono text-gov-primary font-semibold">
            {language === 'mr'
              ? `कक्षा: ${minEvent} - ${maxEvent} सक्रियता गुण`
              : `Range: ${minEvent} - ${maxEvent} Activity Score`}
          </span>
        </div>
      </div>
    </div>
  );
};
