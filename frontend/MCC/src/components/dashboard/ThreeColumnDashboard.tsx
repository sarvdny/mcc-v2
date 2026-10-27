'use client';

import React, { useState, useMemo } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { KPIRibbon } from '@/components/zones/KPIRibbon/KPIRibbon';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import { GISMap, DISTRICT_NUMBERS } from '@/components/leadership/GISMap/GISMap';
import { BreakingNewsTicker } from '@/components/dashboard/BreakingNewsTicker';
import { KeyMetricsTrends } from '@/components/dashboard/KeyMetricsTrends';
import { TopLowerMatrix } from '@/components/leadership/TopLowerMatrix/TopLowerMatrix';
import { SocialMediaAnalysis } from '@/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { LiveNewsQueue } from '@/components/dashboard/LiveNewsQueue';
import { LiveStreaming } from '@/components/leadership/LiveStreaming/LiveStreaming';
import { DIPRDivisionsPanel } from '@/components/dashboard/DIPRDivisionsPanel';
import { GovernmentSchemeHoardingsPanel } from '@/components/dashboard/GovernmentSchemeHoardingsPanel';
import { CitizenServicesCard } from '@/components/dashboard/CitizenServicesCard';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getDistrictName } from '@/lib/dataLocalization';

type DashboardWorkspaceView = 'overview' | 'performance' | 'media' | 'crisis' | 'all';

export const ThreeColumnDashboard: React.FC = () => {
  const {
    language,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDivision,
    setSelectedDivision,
    selectedPeriod,
    setSelectedPeriod,
    districts,
    setToast,
  } = useDashboardStore();
  const [activeView, setActiveView] = useState<DashboardWorkspaceView>('overview');

  const districtOptions = useMemo(() => {
    return [...districts]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((d) => {
        const num = DISTRICT_NUMBERS[d.id];
        const numPrefix = num ? `#${num} ` : '';
        return {
          id: d.id,
          label: language === 'mr'
            ? `${numPrefix}${d.nameMr || getDistrictName(d.name, 'mr')}`
            : `${numPrefix}${d.name}`,
        };
      });
  }, [districts, language]);

  const handleExport = () => {
    setToast({
      type: 'success',
      message: language === 'mr'
        ? 'माहिती अहवाल यशस्वीरित्या निर्यात केला.'
        : 'Telemetry operations report exported successfully (CSV/PDF).',
    });
  };

  return (
    <div className="p-3 sm:p-4 xl:p-4.5 2xl:p-6 max-w-[1860px] w-full mx-auto flex flex-col gap-3.5 sm:gap-4 xl:gap-5 bg-[#f4f6fa]">
      {/* 1. TIER 1: UNIFIED CONTEXT & NAVIGATION BAR */}
      <header className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col gap-3">
        {/* Row 1: Department Identity on left; Global Scope Filters on right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Department Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg bg-gov-primary text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700/60 shadow-xs"
              aria-label="Maharashtra State Emblem"
            >
              MH
            </div>
            <div className="min-w-0 flex items-center flex-wrap gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none truncate">
                {language === 'mr'
                  ? 'महाराष्ट्र शासन — माहिती व जनसंपर्क महासंचालनालय (DGIPR) आदेश कक्ष'
                  : 'MH | DGIPR Command Center • Supervision: DG Desk'}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 shrink-0 animate-pulse" aria-hidden="true" />
                {language === 'mr' ? 'थेट संनियंत्रण: महासंचालक कक्ष' : 'Supervision: DG Desk'}
              </span>
            </div>
          </div>

          {/* Right: Global Scope Filters (Division, District, Timeframe, Export) */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Division Selector */}
            <div className="flex items-center gap-1">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 cursor-pointer"
                aria-label="Select administrative division"
              >
                <option value="All Maharashtra">
                  {language === 'mr' ? 'सर्व महाराष्ट्र' : 'Division: All'}
                </option>
                <option value="Konkan">
                  {language === 'mr' ? 'कोकण विभाग' : 'Division: Konkan'}
                </option>
                <option value="Pune">
                  {language === 'mr' ? 'पुणे विभाग' : 'Division: Pune'}
                </option>
                <option value="Nashik">
                  {language === 'mr' ? 'नाशिक विभाग' : 'Division: Nashik'}
                </option>
                <option value="Chhatrapati Sambhajinagar">
                  {language === 'mr' ? 'छत्रपती संभाजीनगर' : 'Division: C. Sambhajinagar'}
                </option>
                <option value="Amravati">
                  {language === 'mr' ? 'अमरावती विभाग' : 'Division: Amravati'}
                </option>
                <option value="Nagpur">
                  {language === 'mr' ? 'नागपूर विभाग' : 'Division: Nagpur'}
                </option>
              </select>
            </div>

            {/* District Selector */}
            <div className="flex items-center gap-1">
              <select
                value={selectedDistrictId || ''}
                onChange={(e) => setSelectedDistrictId(e.target.value || 'all')}
                className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 cursor-pointer max-w-[170px] truncate"
                aria-label="Select district scope"
              >
                <option value="all">
                  {language === 'mr' ? 'सर्व ३६ जिल्हे' : 'District: All (36)'}
                </option>
                {districtOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center gap-1">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 cursor-pointer"
                aria-label="Select timeframe"
              >
                <option value="24h">{language === 'mr' ? 'मागील २४ तास' : 'Last 24 Hours'}</option>
                <option value="7d">{language === 'mr' ? 'मागील ७ दिवस' : 'Last 7 Days'}</option>
                <option value="30d">{language === 'mr' ? 'मागील ३० दिवस' : 'Last 30 Days'}</option>
              </select>
            </div>

            {/* Export Trigger */}
            <button
              type="button"
              onClick={handleExport}
              className="h-8 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
              title={language === 'mr' ? 'अहवाल निर्यात करा' : 'Export telemetry dossier'}
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'mr' ? 'निर्यात' : 'Export'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: View Switcher Segmented Control (Apple-style pill selector) */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
          <div
            role="tablist"
            aria-label={language === 'mr' ? 'डॅशबोर्ड विभाग निवडा' : 'Select dashboard view'}
            className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs overflow-x-auto scrollbar-none text-xs w-full sm:w-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'overview'}
              onClick={() => setActiveView('overview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:outline-hidden ${
                activeView === 'overview'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {language === 'mr' ? 'नकाशा व मुख्य डॅशबोर्ड' : 'GIS Map & Command'}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'performance'}
              onClick={() => setActiveView('performance')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:outline-hidden ${
                activeView === 'performance'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {language === 'mr' ? 'जिल्हा कामगिरी (CPI)' : 'District Performance'}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'media'}
              onClick={() => setActiveView('media')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:outline-hidden ${
                activeView === 'media'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {language === 'mr' ? 'माध्यम व थेट प्रक्षेपण' : 'Media & Broadcast'}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'crisis'}
              onClick={() => setActiveView('crisis')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:outline-hidden ${
                activeView === 'crisis'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {language === 'mr' ? 'आपत्कालीन कक्ष' : 'Crisis Desk'}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'all'}
              onClick={() => setActiveView('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:outline-hidden ${
                activeView === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {language === 'mr' ? 'सर्व विभाग (कमांड वॉल)' : 'Command Wall (All)'}
            </button>
          </div>
        </div>
      </header>

      {/* 2. TIER 2: UNIFIED DUAL-MODE LIVE WIRE TICKER (40px) */}
      <div className="w-full">
        <BreakingNewsTicker />
      </div>

      {/* 3. FULL-WIDTH CORE KPI RIBBON (5 On-Point Metrics) */}
      <section className="w-full">
        <KPIRibbon layout="ribbon" />
      </section>

      {/* 4. DYNAMIC FOCUSED WORKSPACE (Tailored & Decluttered) */}

      {/* VIEW A: 3-COLUMN OPERATIONAL WORKSPACE (Responsive Decongested Workspace) */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
          {/* Column 1: Grievances & SLA + Crisis Monitor (Order 2 on mobile, Order 1 on desktop) */}
          <div className="order-2 lg:order-1 col-span-1 lg:col-span-4 xl:col-span-3 xl:min-w-[310px] lg:h-[640px] flex flex-col gap-3 min-w-0">
            <EmergencyAlert />
            <div className="flex-1 min-h-0 flex flex-col">
              <CitizenServicesCard />
            </div>
          </div>

          {/* Column 2: Maharashtra State GIS (Order 1 on mobile, Order 2 on desktop) */}
          <div className="order-1 lg:order-2 col-span-1 lg:col-span-5 xl:col-span-6 lg:h-[640px] flex flex-col min-w-0">
            <GISMap />
          </div>

          {/* Column 3: Full-height Social Pulse & Media Listening (Order 3 on mobile, Order 3 on desktop) */}
          <div className="order-3 lg:order-3 col-span-1 lg:col-span-3 xl:col-span-3 xl:min-w-[310px] lg:h-[640px] flex flex-col min-w-0">
            <SocialMediaAnalysis />
          </div>
        </div>
      )}

      {/* VIEW B: DISTRICT PERFORMANCE & CPI MATRIX */}
      {activeView === 'performance' && (
        <div className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
            <div className="lg:col-span-7 flex flex-col gap-5 min-w-0">
              <DistrictLeaderboard showChart={true} />
              <TopLowerMatrix />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
              <ScoreDecomposition />
              <KeyMetricsTrends />
            </div>
          </div>
        </div>
      )}

      {/* VIEW C: MEDIA INTELLIGENCE & BROADCAST */}
      {activeView === 'media' && (
        <div className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
            <div className="lg:col-span-6 flex flex-col gap-5 min-w-0">
              <LiveStreaming />
            </div>
            <div className="lg:col-span-6 flex flex-col gap-5 min-w-0">
              <SocialMediaAnalysis />
              <LiveNewsQueue />
            </div>
          </div>
        </div>
      )}

      {/* VIEW D: CRISIS & EMERGENCY OPERATIONS */}
      {activeView === 'crisis' && (
        <div className="flex flex-col gap-5 w-full">
          <EmergencyAlert />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
            <div className="lg:col-span-8 flex flex-col gap-5 min-w-0">
              <GISMap />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-5 min-w-0">
              <LiveNewsQueue />
            </div>
          </div>
        </div>
      )}

      {/* VIEW E: COMMAND WALL (CONSOLIDATED ALL-IN-ONE) */}
      {activeView === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-5 xl:gap-6 items-start w-full">
          {/* Column 1: Analytics & Rankings (3/12 on XL) */}
          <div className="md:col-span-12 lg:col-span-7 xl:col-span-3 flex flex-col gap-5 min-w-0">
            <CitizenServicesCard />
            <ScoreDecomposition />
            <KeyMetricsTrends />
            <TopLowerMatrix />
            <DIPRDivisionsPanel />
          </div>

          {/* Column 2: Map & Central Leadership (5/12 on XL) */}
          <div className="md:col-span-12 lg:col-span-5 xl:col-span-5 flex flex-col gap-5 min-w-0">
            <GISMap />
            <GovernmentSchemeHoardingsPanel />
            <DistrictLeaderboard showChart={false} />
          </div>

          {/* Column 3: Live Media & Emergency Action (4/12 on XL) */}
          <div className="md:col-span-12 lg:col-span-12 xl:col-span-4 flex flex-col gap-5 min-w-0 [&>*]:flex-1 [&>*]:h-full">
            <EmergencyAlert />
            <SocialMediaAnalysis />
            <LiveNewsQueue />
            <LiveStreaming />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeColumnDashboard;
