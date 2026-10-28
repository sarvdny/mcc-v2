'use client';

import React, { useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  DISTRICT_DETAILS_BY_ID,
  ALL_36_DISTRICTS,
  type DistrictInfoDetails,
} from '@/data/maharashtraDistrictsData';
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  CheckBadgeIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';
import { InfoTooltip } from '@/components/shared/InfoTooltip';

export const DistrictScorecardBento: React.FC = () => {
  const { language, selectedDistrictId, setSelectedDistrictId, districts } = useDashboardStore();
  const t = useTranslation(language);

  const selectedDistrictData = useMemo(() => {
    if (!selectedDistrictId || selectedDistrictId === 'all') return null;
    return DISTRICT_DETAILS_BY_ID[selectedDistrictId as keyof typeof DISTRICT_DETAILS_BY_ID] || null;
  }, [selectedDistrictId]);

  // Statewide aggregates
  const statewideStats = useMemo(() => {
    const totalDistricts = districts.length || 36;
    const avgCpi = districts.reduce((acc, d) => acc + (d.cpi || 0), 0) / (districts.length || 1);
    const sorted = [...districts].sort((a, b) => (b.cpi || 0) - (a.cpi || 0));
    const top = sorted[0];
    const lowest = sorted[sorted.length - 1];

    return {
      totalDistricts,
      avgCpi: avgCpi || 78.4,
      topDistrict: top ? { name: top.name, cpi: top.cpi } : { name: 'Thane', cpi: 96.8 },
      lowestDistrict: lowest ? { name: lowest.name, cpi: lowest.cpi } : { name: 'Nandurbar', cpi: 58.2 },
    };
  }, [districts]);

  if (!selectedDistrictData) {
    // Default Statewide Aggregated View
    return (
      <div className="flex flex-col gap-4 w-full">
        {/* Statewide Aggregated CPI Averages Banner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'mr'
                    ? 'महाराष्ट्र राज्य सर्वसमावेशक कामगिरी निर्देशांक (CPI)'
                    : 'Statewide Aggregated CPI Benchmark & Division Scorecard'}
                </h3>
                <InfoTooltip metricKey="cpi" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'mr'
                  ? '३६ जिल्ह्यांमधील थेट दूरमिती व ४ स्तंभांवर आधारित सरासरी कामगिरी'
                  : 'Aggregated 36-District Operational Telemetry across 4 Quality Pillars'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">State Average CPI</span>
                <span className="text-2xl font-black font-mono text-blue-600">
                  {statewideStats.avgCpi.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-mono"> / 100</span>
              </div>
            </div>
          </div>

          {/* Quick Pillars Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
              <span className="text-[11px] text-slate-500 font-medium block">Pillar 1: Media Placement</span>
              <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">84.2%</span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">+2.4% vs last week</span>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
              <span className="text-[11px] text-slate-500 font-medium block">Pillar 2: Public Sentiment</span>
              <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">72.6% Positive</span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">+4.1% net positivity</span>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
              <span className="text-[11px] text-slate-500 font-medium block">Pillar 3: Crisis SLA TAT</span>
              <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">94.8% &lt; 90m</span>
              <span className="text-[10px] text-blue-600 font-semibold mt-1 inline-block">18m Avg Response</span>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
              <span className="text-[11px] text-slate-500 font-medium block">Pillar 4: Digital Outreach</span>
              <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">3.4M Reach</span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">+18% engagement</span>
            </div>
          </div>
        </div>

        {/* Division Breakdown Bars */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            {language === 'mr' ? 'प्रशासकीय विभागवार सरासरी कामगिरी' : 'Administrative Division CPI Averages'}
          </h4>
          <div className="space-y-3">
            {[
              { name: 'Konkan Division (कोकण)', score: 92.4, color: '#22C55E' },
              { name: 'Pune Division (पुणे)', score: 88.6, color: '#22C55E' },
              { name: 'Nashik Division (नाशिक)', score: 81.2, color: '#84CC16' },
              { name: 'Nagpur Division (नागपूर)', score: 79.5, color: '#84CC16' },
              { name: 'Chhatrapati Sambhajinagar (छत्रपती संभाजीनगर)', score: 74.8, color: '#FACC15' },
              { name: 'Amravati Division (अमरावती)', score: 72.1, color: '#FACC15' },
            ].map((div) => (
              <div key={div.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{div.name}</span>
                  <span className="font-mono font-bold text-slate-900">{div.score.toFixed(1)}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${div.score}%`, backgroundColor: div.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Select any district from the left leaderboard to inspect its Collector Bento & Taluka hierarchy.</span>
            <span className="font-semibold text-blue-600">36 Districts Ingested</span>
          </div>
        </div>
      </div>
    );
  }

  // Selected District Bento Card
  const d = selectedDistrictData;
  const cpiScore = d.cpi;
  const rank = d.rank;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Bento Header Strip */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-mono text-xs font-bold">
              Rank #{rank}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {d.divisionName} Division
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600">Live Active Reporting</span>
            <InfoTooltip metricKey="cpi" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {language === 'mr' ? d.nameMr : d.name} District
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            HQ: {language === 'mr' ? d.quickStats.headquartersMr : d.quickStats.headquarters} • Literacy: {d.quickStats.literacyRate} • Area: {d.quickStats.areaKm2}
          </p>
        </div>

        {/* CPI Score Radial Gauge */}
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200/80">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="20" stroke="#E2E8F0" strokeWidth="4" fill="transparent" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke={cpiScore >= 80 ? '#10B981' : cpiScore >= 60 ? '#1D4ED8' : '#F59E0B'}
                strokeWidth="4"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * cpiScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute font-black text-xs text-slate-800">
              {cpiScore >= 80 ? 'A+' : cpiScore >= 60 ? 'B+' : 'C'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Composite CPI
            </span>
            <span className="text-2xl font-black font-mono text-blue-600 leading-none">
              {cpiScore.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono"> / 100</span>
          </div>
        </div>
      </div>

      {/* 2-Column Bento: Collector Administration & 4 Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (5 cols): Collector & DIO Office */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <BuildingOffice2Icon className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {language === 'mr' ? 'जिल्हा प्रशासन व संपर्क' : 'District Administration'}
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
              <UserCircleIcon className="w-6 h-6 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">District Collector & DM</span>
                <span className="font-bold text-slate-800 text-xs">
                  {language === 'mr' ? d.dioOffice.collectorNameMr : d.dioOffice.collectorName}
                </span>
                <span className="text-[11px] text-slate-500 block">IAS • Collectorate, {d.name}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
              <CheckBadgeIcon className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">District Information Officer (DIO)</span>
                <span className="font-bold text-slate-800 text-xs">
                  {language === 'mr' ? d.dioOffice.officerMr : d.dioOffice.officer}
                </span>
                <span className="text-[11px] text-slate-500 block">{d.dioOffice.designation}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-slate-600">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-[11px]">{d.dioOffice.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-[11px] truncate">{d.dioOffice.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight text-slate-600">{d.dioOffice.address}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Staff Duty Present Today:</span>
              <span className="font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {d.dioOffice.staffPresentToday} / {d.dioOffice.staffSanctioned} (
                {Math.round((d.dioOffice.staffPresentToday / d.dioOffice.staffSanctioned) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): 4-Pillar Quality Scorecard */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {language === 'mr' ? '४-स्तंभ गुणवत्ता गुणपत्रिका' : '4-Pillar Quality Scorecard'}
              </h4>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Target Benchmark: 80.0</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Pillar 1 */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">1. Media Placements</span>
                <span className="font-mono font-bold text-blue-600">{d.releases} Rel</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (d.releases / 50) * 100)}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 block">Print, TV, and Web releases published</span>
            </div>

            {/* Pillar 2 */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">2. Net Sentiment</span>
                <span className="font-mono font-bold text-emerald-600">{d.sentiment}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${d.sentiment}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 block">Favorable citizen perception</span>
            </div>

            {/* Pillar 3 */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">3. Crisis Response TAT</span>
                <span className="font-mono font-bold text-emerald-600">14 min</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
              </div>
              <span className="text-[10px] text-slate-500 block">90-minute SLA standard compliance</span>
            </div>

            {/* Pillar 4 */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">4. Field IEC Outreach</span>
                <span className="font-mono font-bold text-blue-600">96.4%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '96.4%' }} />
              </div>
              <span className="text-[10px] text-slate-500 block">Verified outdoor schemes & hoardings</span>
            </div>
          </div>

          {/* Sub-District Talukas Hierarchy */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800">
                Sub-District Talukas ({d.quickStats.talukasCount} Reporting Units)
              </span>
              <span className="text-[11px] font-mono text-emerald-600 font-semibold">100% Online</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Taluka Central', 'Haveli / Rural', 'North Sub-Division', 'Industrial Belt', 'Coastal Sector', 'Agri Tehsil'].map((tal, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 rounded-md text-[11px] font-medium transition-colors"
                >
                  {tal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
