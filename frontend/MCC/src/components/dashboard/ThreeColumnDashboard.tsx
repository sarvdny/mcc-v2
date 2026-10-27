'use client';

import React, { useState } from 'react';
import { KPIRibbon } from '@/components/zones/KPIRibbon/KPIRibbon';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import { GISMap } from '@/components/leadership/GISMap/GISMap';
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

type DashboardWorkspaceView = 'overview' | 'performance' | 'media' | 'crisis' | 'all';

export const ThreeColumnDashboard: React.FC = () => {
  const { language, selectedDistrictId } = useDashboardStore();
  const [activeView, setActiveView] = useState<DashboardWorkspaceView>('all');

  return (
    <div className="p-3 sm:p-4 xl:p-4.5 2xl:p-6 max-w-[1860px] w-full mx-auto flex flex-col gap-3.5 sm:gap-4 xl:gap-5 bg-[#f4f6fa]">
      {/* 0. PROMINENT TOP-OF-DASHBOARD REAL-TIME HEADLINE SCROLL TICKER */}
      <div className="w-full">
        <BreakingNewsTicker />
      </div>

      {/* 1. EXECUTIVE COMMAND BRIEFING HEADER (Minimalist & Dignified) */}
      <div className="bg-white rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gov-primary text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700/60 shadow-xs" aria-label="Maharashtra State Emblem">
            MH
          </div>
          <div className="min-w-0 flex items-center flex-wrap gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none truncate">
              {language === 'mr'
                ? 'महाराष्ट्र शासन — माहिती व जनसंपर्क महासंचालनालय (DGIPR) आदेश कक्ष'
                : 'Government of Maharashtra — Central Directorate of Information & Public Relations (DGIPR)'}
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 shrink-0" aria-hidden="true" />
              {language === 'mr' ? 'थेट संनियंत्रण: महासंचालक कक्ष' : 'Supervision: Director General Desk'}
            </span>
          </div>
        </div>

        {/* WORKSPACE PERSPECTIVE SWITCHER (Apple-style Segmented Control) */}
        <div
          role="tablist"
          aria-label={language === 'mr' ? 'डॅशबोर्ड विभाग निवडा' : 'Select dashboard view'}
          className="flex items-center gap-0.5 bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/80 shadow-xs overflow-x-auto scrollbar-none text-xs self-start lg:self-auto shrink-0 max-w-full"
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

      {/* 2. FULL-WIDTH CORE KPI RIBBON (5 On-Point Metrics) */}
      <section className="w-full">
        <KPIRibbon layout="ribbon" />
      </section>

      {/* 3. DYNAMIC FOCUSED WORKSPACE (Tailored & Decluttered) */}

      {/* VIEW A: PRIMARY EXECUTIVE OVERVIEW (Hero Map + Clean 2-Column Split) */}
      {activeView === 'overview' && (
        <div className="flex flex-col gap-5 w-full">
          {/* Hero GIS Map */}
          <div className="w-full">
            <GISMap />
            <GovernmentSchemeHoardingsPanel />
            <DIPRDivisionsPanel />
          </div>

          {/* Clean 2-Column Executive Operations Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">
            {/* Left Deck (7/12): District Leaderboard & Citizen Services */}
            <div className="lg:col-span-7 flex flex-col gap-5 min-w-0">
              <DistrictLeaderboard showChart={true} />
              <CitizenServicesCard />
            </div>

            {/* Right Deck (5/12): Operational Priority Brief & Live News */}
            <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
              <EmergencyAlert />
              <LiveNewsQueue />
            </div>
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
            <BreakingNewsTicker />
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
