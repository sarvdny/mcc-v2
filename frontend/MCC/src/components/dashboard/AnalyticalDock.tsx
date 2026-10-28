'use client';

import React, { useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { InfoTooltip } from '@/components/shared/InfoTooltip';

export const AnalyticalDock: React.FC = () => {
  const { language, districts } = useDashboardStore();
  const t = useTranslation(language);

  // Top 5 Districts by CPI
  const topDistricts = useMemo(() => {
    return [...districts]
      .sort((a, b) => (b.cpi || 0) - (a.cpi || 0))
      .slice(0, 5);
  }, [districts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
      {/* 1. District Ranking Bars */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h4 className="font-bold text-xs text-slate-900">
              {language === 'mr' ? 'अव्वल ५ जिल्हे (CPI)' : 'District Rankings (CPI)'}
            </h4>
            <InfoTooltip metricKey="cpi" />
          </div>
          <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
            Top 5
          </span>
        </div>

        <div className="space-y-2 flex-1">
          {topDistricts.map((d, idx) => (
            <div key={d.id} className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-800">
                  <span className="font-mono text-slate-400 mr-1.5">#{idx + 1}</span>
                  {language === 'mr' ? d.nameMr || d.name : d.name}
                </span>
                <span className="font-bold font-mono text-slate-900">{d.cpi.toFixed(1)}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${d.cpi}%`,
                    backgroundColor: idx === 0 ? '#22C55E' : idx === 1 ? '#84CC16' : '#3B82F6',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>State Avg: 78.4</span>
          <span>Benchmark: 36 Dists</span>
        </div>
      </div>

      {/* 2. Sentiment Diverging Chart */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h4 className="font-bold text-xs text-slate-900">
              {language === 'mr' ? 'लोकभावना विभागणी' : 'Sentiment Divergence'}
            </h4>
            <InfoTooltip metricKey="sentimentIndex" />
          </div>
          <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            +74.2% Net
          </span>
        </div>

        <div className="space-y-2.5 flex-1 flex flex-col justify-center">
          {/* Print Media */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-600 font-medium">
              <span>Print OCR (18 Dailies)</span>
              <span className="font-mono text-emerald-600 font-bold">78% Pos • 12% Neg</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
              <div style={{ width: '78%' }} className="bg-emerald-500 h-full" />
              <div style={{ width: '10%' }} className="bg-slate-300 h-full" />
              <div style={{ width: '12%' }} className="bg-rose-500 h-full" />
            </div>
          </div>

          {/* TV Broadcast */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-600 font-medium">
              <span>TV News (6 Channels)</span>
              <span className="font-mono text-emerald-600 font-bold">71% Pos • 15% Neg</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
              <div style={{ width: '71%' }} className="bg-emerald-500 h-full" />
              <div style={{ width: '14%' }} className="bg-slate-300 h-full" />
              <div style={{ width: '15%' }} className="bg-rose-500 h-full" />
            </div>
          </div>

          {/* Social Platforms */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-600 font-medium">
              <span>Social Media (X, Meta, YT)</span>
              <span className="font-mono text-emerald-600 font-bold">73% Pos • 18% Neg</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
              <div style={{ width: '73%' }} className="bg-emerald-500 h-full" />
              <div style={{ width: '9%' }} className="bg-slate-300 h-full" />
              <div style={{ width: '18%' }} className="bg-rose-500 h-full" />
            </div>
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Pos
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Neu
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Neg
          </span>
        </div>
      </div>

      {/* 3. Crisis Donut & SLA Compliance */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h4 className="font-bold text-xs text-slate-900">
              {language === 'mr' ? 'आपत्ती निवारण SLA (९० मि)' : 'Crisis SLA Compliance'}
            </h4>
            <InfoTooltip metricKey="crisisResolution" />
          </div>
          <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            94.2% SLA
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 flex-1">
          {/* Custom SVG Donut */}
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
              {/* Background circle */}
              <path
                className="text-slate-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* 94.2% resolved stroke */}
              <path
                className="text-emerald-500 transition-all duration-500"
                strokeDasharray="94.2, 100"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-bold text-slate-900 font-mono text-sm leading-none">94%</span>
              <span className="text-[9px] text-slate-400 font-medium">On-Time</span>
            </div>
          </div>

          {/* SLA Legend */}
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-600 font-medium">Within 90m: <b className="text-slate-900 font-mono">112</b></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-600 font-medium">In Triage: <b className="text-slate-900 font-mono">3</b></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span className="text-slate-600 font-medium">Breached: <b className="text-slate-900 font-mono">2</b></span>
            </div>
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Target: &lt;45m</span>
          <span>Today: 28.4m TAT</span>
        </div>
      </div>

      {/* 4. Social Engagement Velocity */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <h4 className="font-bold text-xs text-slate-900">
              {language === 'mr' ? 'नागरिक सहभाग वेग' : 'Social Engagement'}
            </h4>
            <InfoTooltip metricKey="volumeScore" />
          </div>
          <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
            3.3M Reach
          </span>
        </div>

        {/* Velocity Curve Representation */}
        <div className="space-y-2 flex-1 flex flex-col justify-center">
          <div className="flex items-end justify-between gap-1.5 h-16 pt-2 px-1">
            {[42, 65, 58, 84, 96, 78, 92, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-100 hover:bg-blue-600 rounded-t transition-all cursor-pointer"
                  style={{ height: `${h * 0.45}px` }}
                  title={`Hour ${i * 3}:00 — Reach index ${h}%`}
                />
                <span className="text-[8px] font-mono text-slate-400">
                  {i * 3}h
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600">
            <span>X (Twitter): <b className="font-mono text-slate-900">1.4M</b></span>
            <span>Meta: <b className="font-mono text-slate-900">1.2M</b></span>
            <span>YT: <b className="font-mono text-slate-900">700K</b></span>
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Peak: 14:00 IST</span>
          <span>Interactions: +18.4%</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticalDock;
