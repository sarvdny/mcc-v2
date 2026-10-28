/**
 * Statewide Aggregates & Ranking Sorting Engine
 * Directorate General of Information & Public Relations (DGIPR), Maharashtra
 */

import type { DistrictData, IncidentData } from '@/types/dashboard';
import { calculateCPI, calculateSpeedScore, calculateVolumeScore, PERIOD_MULTIPLIERS } from './metricsEngine';

export interface DistrictRankingItem {
  id: string;
  name: string;
  cpi: number;
  rank: number;
  division: string;
  grade: 'A+' | 'A' | 'B' | 'C';
}

/**
 * Calculates district rankings from highest to lowest CPI.
 */
export function calculateDistrictRankings(districts: DistrictData[]): DistrictRankingItem[] {
  const sorted = [...districts].sort((a, b) => (b.cpi || 0) - (a.cpi || 0));

  return sorted.map((d, idx) => {
    const cpi = d.cpi || 0;
    const grade: 'A+' | 'A' | 'B' | 'C' =
      cpi >= 85 ? 'A+' : cpi >= 70 ? 'A' : cpi >= 55 ? 'B' : 'C';

    return {
      id: d.id,
      name: d.name,
      cpi: Number(cpi.toFixed(2)),
      rank: idx + 1,
      division: d.division || 'General',
      grade,
    };
  });
}

/**
 * Calculates statewide average CPI, total volume, and top/lowest extremes.
 */
export function calculateStatewideAggregates(districts: DistrictData[]) {
  if (!districts || districts.length === 0) {
    return {
      totalDistricts: 0,
      averageCPI: 0,
      totalVolume: 0,
      averageTAT: 0,
      averageSentiment: 0,
      topDistrict: null,
      lowestDistrict: null,
    };
  }

  const totalDistricts = districts.length;
  const sumCPI = districts.reduce((acc, d) => acc + (d.cpi || 0), 0);
  const sumVolume = districts.reduce((acc, d) => acc + (d.volumeScore || 0), 0);
  const sumTAT = districts.reduce((acc, d) => acc + (d.avgTAT ?? d.tatScore ?? 20), 0);
  const sumSentiment = districts.reduce((acc, d) => acc + (d.sentimentScore || 75), 0);

  const rankings = calculateDistrictRankings(districts);

  return {
    totalDistricts,
    averageCPI: Number((sumCPI / totalDistricts).toFixed(2)),
    totalVolume: sumVolume,
    averageTAT: Number((sumTAT / totalDistricts).toFixed(1)),
    averageSentiment: Number((sumSentiment / totalDistricts).toFixed(1)),
    topDistrict: rankings[0] || null,
    lowestDistrict: rankings[rankings.length - 1] || null,
  };
}

/**
 * Extracts Top 5 and Lower 5 districts matrix.
 */
export function calculateTopLowerMatrix(districts: DistrictData[]) {
  const rankings = calculateDistrictRankings(districts);
  return {
    topFive: rankings.slice(0, 5),
    lowerFive: rankings.slice(-5).reverse(),
  };
}
