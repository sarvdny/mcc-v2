'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { LockClosedIcon, ChevronDownIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { getDistrictName } from '@/lib/dataLocalization';
import { DISTRICT_NUMBERS } from '@/components/leadership/GISMap/GISMap';

export interface DashboardToolbarProps {
  /** Optional preset district ID to pre-select (for deep linking) */
  presetDistrictId?: string;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({ presetDistrictId }) => {
  const {
    selectedPeriod,
    setSelectedPeriod,
    selectedDivision,
    setSelectedDivision,
    userRole,
    currentUser,
    language,
    selectedDistrictId,
    districts,
    searchDistrict,
    setSearchDistrict,
    setSelectedDistrictId,
    setToast,
  } = useDashboardStore();
  const t = useTranslation(language);

  const isDistrictScoped = userRole === 'collector' || userRole === 'dio_desk';
  const isDivisionScoped = userRole === 'director_konkan';

  const localizedDistrictName = getDistrictName(currentUser?.district || 'Palghar', language);

  const scopeBadgeText = isDistrictScoped
    ? (language === 'mr' ? `${localizedDistrictName} जिल्हा मंजुरी` : `${currentUser?.district || 'Palghar'} District Clearance`)
    : isDivisionScoped
    ? (language === 'mr' ? 'विभागीय मंजुरी' : 'Divisional clearance')
    : (language === 'mr' ? 'राज्यस्तरीय मंजुरी' : 'Statewide clearance');

  const handleExport = () => {
    setToast({
      type: 'success',
      message: language === 'mr'
        ? 'माहिती अहवाल यशस्वीरित्या निर्यात केला.'
        : 'Telemetry operations report exported successfully (CSV/PDF).',
    });
  };

  // Highlight district across all dashboard panels
  const highlightDistrict = (districtId: string) => {
    setSelectedDistrictId(districtId);
  };

  // The dropdown always mirrors the store selection so cross-panel clicks stay in sync (two-way).
  const currentDistrictValue =
    selectedDistrictId && selectedDistrictId !== 'all' ? selectedDistrictId : '';

  // Options mirror the dashboard dataset, localized with district numbers.
  const districtOptions = React.useMemo(() => {
    const options = [...districts]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((d) => {
        const num = DISTRICT_NUMBERS?.[d.id];
        const numPrefix = num ? `#${num} ` : '';
        return {
          id: d.id,
          label: (language === 'mr'
            ? `${numPrefix}${d.nameMr || getDistrictName(d.name, 'mr')}`
            : `${numPrefix}${d.name}`).replace(/,\s*$/, ''),
        };
      });

    if (
      selectedDistrictId &&
      selectedDistrictId !== 'all' &&
      !options.some((o) => o.id === selectedDistrictId)
    ) {
      const num = DISTRICT_NUMBERS?.[selectedDistrictId];
      const numPrefix = num ? `#${num} ` : '';
      const fallbackLabel = selectedDistrictId
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      options.push({ id: selectedDistrictId, label: `${numPrefix}${fallbackLabel}`.replace(/,\s*$/, '') });
    }

    return options;
  }, [districts, language, selectedDistrictId]);

  return (
    <div className="shrink-0 backdrop-blur-md bg-white/90 border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none z-10 sticky top-0">
      {/* Left: Operations Title */}
      <div className="flex items-center gap-2.5">
        <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
          {language === 'mr' ? 'राज्य संनियंत्रण दृश्यावलोकन' : 'State Operations Overview'}
        </h1>
      </div>

      {/* Right: Centralized Global Scope Selection Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* 1. Division Scope Filter */}
        <div className="relative flex items-center z-20">
          <select
            value={selectedDivision || 'Konkan'}
            onChange={(e) => setSelectedDivision(e.target.value)}
            aria-label={language === 'mr' ? 'विभाग निवडा' : 'Select division'}
            className="h-9 pl-3 pr-8 rounded-xl border border-slate-200/80 bg-white/95 text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 hover:shadow-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:border-transparent cursor-pointer appearance-none transition-all duration-100 ease-out"
          >
            <option value="All Maharashtra">{language === 'mr' ? 'सर्व विभाग' : 'All Divisions'}</option>
            <option value="Konkan">{language === 'mr' ? 'विभाग: कोकण' : 'Division: Konkan'}</option>
            <option value="Pune">{language === 'mr' ? 'विभाग: पुणे' : 'Division: Pune'}</option>
            <option value="Nashik">{language === 'mr' ? 'विभाग: नाशिक' : 'Division: Nashik'}</option>
            <option value="Chhatrapati Sambhajinagar">{language === 'mr' ? 'विभाग: छ. संभाजीनगर' : 'Division: Chh. Sambhajinagar'}</option>
            <option value="Amravati">{language === 'mr' ? 'विभाग: अमरावती' : 'Division: Amravati'}</option>
            <option value="Nagpur">{language === 'mr' ? 'विभाग: नागपूर' : 'Division: Nagpur'}</option>
          </select>
          <ChevronDownIcon
            className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 shrink-0"
            aria-hidden="true"
          />
        </div>

        {/* 2. District Scope Filter with cross-panel highlighting */}
        {isDistrictScoped ? (
          <div className="h-9 px-3 rounded-xl border border-slate-200/80 bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-xs">
            <LockClosedIcon className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
            <span>{localizedDistrictName} {language === 'mr' ? '(बंदिस्त)' : '(Locked)'}</span>
          </div>
        ) : (
          <div className="relative flex items-center z-20">
            <select
              value={currentDistrictValue}
              onChange={(e) => {
                const val = e.target.value;
                setSearchDistrict('');
                highlightDistrict(val || 'all');
              }}
              aria-label={language === 'mr' ? 'जिल्हा निवडा' : 'Select district'}
              className="h-9 pl-3 pr-8 rounded-xl border border-slate-200/80 bg-white/95 text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 hover:shadow-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:border-transparent cursor-pointer appearance-none transition-all duration-100 ease-out"
            >
              <option value="">{language === 'mr' ? 'सर्व जिल्हे' : 'All Districts'}</option>
              {districtOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 shrink-0"
              aria-hidden="true"
            />
          </div>
        )}

        {/* 2. Time Range Filter with dynamic updates */}
        <div className="relative flex items-center z-20">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            aria-label={language === 'mr' ? 'कालावधी निवडा' : 'Select time range'}
            className="h-9 pl-3 pr-8 rounded-xl border border-slate-200/80 bg-white/95 text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 hover:shadow-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:border-transparent cursor-pointer appearance-none transition-all duration-100 ease-out"
          >
            <option value="Last 7 days">{language === 'mr' ? 'मागील ७ दिवस' : 'Last 7 Days'}</option>
            <option value="Last 30 days">{language === 'mr' ? 'मागील ३० दिवस' : 'Last 30 Days'}</option>
            <option value="Last 90 days">{language === 'mr' ? 'मागील ९० दिवस' : 'Last 90 Days'}</option>
          </select>
          <ChevronDownIcon
            className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 shrink-0"
            aria-hidden="true"
          />
        </div>

        {/* 3. Primary Export / Action Button */}
        <button
          type="button"
          onClick={handleExport}
          className="h-9 px-3.5 rounded-xl bg-gov-primary hover:bg-slate-800 border border-slate-800/80 shadow-xs hover:shadow-sm focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:outline-hidden text-white text-xs font-medium flex items-center gap-1.5 transition-all duration-100 ease-out cursor-pointer active:scale-[0.98]"
          title={language === 'mr' ? 'माहिती अहवाल निर्यात करा' : 'Export Telemetry Report'}
        >
          <ArrowDownTrayIcon className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
          <span>{language === 'mr' ? 'अहवाल निर्यात' : 'Export Telemetry Report'}</span>
        </button>
      </div>
    </div>
  );
};
