'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { DistrictData } from '@/types/dashboard';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getDistrictName } from '@/lib/dataLocalization';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface DistrictPerformanceChartProps {
  districts: DistrictData[];
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
}

export const DistrictPerformanceChart: React.FC<DistrictPerformanceChartProps> = ({
  districts,
  selectedDistrictId,
  onSelectDistrict,
}) => {
  const { language } = useDashboardStore();

  const chartOption = useMemo(() => {
    const top5 = districts.slice(0, 5);
    const categories = top5.map((d) => (language === 'mr' ? (d.nameMr || getDistrictName(d.name, 'mr')) : d.name));

    return {
      grid: { top: 38, right: 15, bottom: 25, left: 35 },
      legend: {
        top: 4,
        right: 10,
        itemGap: 14,
        textStyle: { fontSize: 12, color: '#334155' },
        itemWidth: 10,
        itemHeight: 10,
        data: [
          language === 'mr' ? 'प्रसिद्धी प्रमाण (३५)' : 'Volume (35 pts)',
          language === 'mr' ? 'लोकभावना निर्देशांक (२५)' : 'Sentiment Index (25 pts)',
          language === 'mr' ? 'आपत्कालीन एसएलए निवारण दर (१५)' : 'Crisis SLA Resolution Rate (15 pts)',
        ],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: '#f8fafc', fontSize: 12 },
        extraCssText: 'backdrop-filter: blur(12px); border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.35);',
        formatter: (params: Array<{ seriesName: string; value: number; name: string; color: string }>) => {
          const districtName = params[0]?.name || '';
          const currentDistrict = top5.find((d) => (language === 'mr' ? (d.nameMr || getDistrictName(d.name, 'mr')) : d.name) === districtName);
          const totalCpi = currentDistrict ? currentDistrict.cpi : params.reduce((acc, p) => acc + (p.value || 0), 0).toFixed(1);

          let html = `<div style="font-size:12px; min-width:190px;">
            <div style="font-weight:700; color:#FFFFFF; border-bottom:1px solid rgba(255,255,255,0.12); padding-bottom:5px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
              <span>${districtName}</span>
              <span style="color:#F59E0B; font-family:monospace; font-weight:700;">${totalCpi} / 100 CPI</span>
            </div>`;
          params.forEach((p) => {
            html += `<div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-top:3px;">
              <span style="color:#94A3B8; display:flex; align-items:center; gap:6px;">
                <span style="width:7px; height:7px; border-radius:50%; background-color:${p.color}; display:inline-block;"></span>
                ${p.seriesName}
              </span>
              <strong style="font-family:monospace; color:#FFFFFF;">${p.value}</strong>
            </div>`;
          });
          html += '</div>';
          return html;
        },
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: '#E2E8F0' } },
        axisLabel: { color: '#0F172A', fontSize: 12, fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif' },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
        axisLabel: { color: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
      },
      series: [
        {
          name: language === 'mr' ? 'प्रसिद्धी प्रमाण (३५)' : 'Volume (35 pts)',
          type: 'bar',
          stack: 'cpi',
          barWidth: '36%',
          data: top5.map((d) => d.volumeScore),
          itemStyle: { color: '#1B2A4A' },
        },
        {
          name: language === 'mr' ? 'लोकभावना निर्देशांक (२५)' : 'Sentiment Index (25 pts)',
          type: 'bar',
          stack: 'cpi',
          data: top5.map((d) => d.sentimentScore),
          itemStyle: { color: '#D97706' },
        },
        {
          name: language === 'mr' ? 'आपत्कालीन एसएलए निवारण दर (१५)' : 'Crisis SLA Resolution Rate (15 pts)',
          type: 'bar',
          stack: 'cpi',
          borderRadius: [4, 4, 0, 0],
          data: top5.map((d) => d.crisisScore),
          itemStyle: { color: '#059669' },
        },
      ],
    };
  }, [districts, language]);

  return (
    <div className="w-full">
      <div className="h-52 w-full bg-slate-50/50 rounded-lg p-2 border border-slate-100">
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          onEvents={{
            click: (params: { dataIndex: number }) => {
              const clickedDistrict = districts[params.dataIndex];
              if (clickedDistrict) onSelectDistrict(clickedDistrict.id);
            },
          }}
        />
      </div>
    </div>
  );
};
