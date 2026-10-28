'use client';

/**
 * React Hooks for Telemetry Calculations
 * Directorate General of Information & Public Relations (DGIPR), Maharashtra
 */

import { useMemo } from 'react';
import type { DistrictData, IncidentData } from '@/types/dashboard';
import {
  calculateReactiveKPIs,
  calculateDistrictRankings,
  calculateStatewideAggregates,
  calculateTopLowerMatrix,
  calculatePillarBreakdown,
  getTATStatus,
  BENCHMARKS,
} from '../metricCalculations';

export interface UseDashboardCalculationsParams {
  districts: DistrictData[];
  incidents: IncidentData[];
  selectedPeriod: string;
  selectedDistrictId?: string;
  selectedDivision?: string;
  language?: 'en' | 'mr';
}

/**
 * Reactive hook computing all dashboard figures in a single sub-16ms pass.
 */
export function useDashboardCalculations({
  districts,
  incidents,
  selectedPeriod,
  selectedDistrictId,
  selectedDivision,
  language = 'en',
}: UseDashboardCalculationsParams) {
  const reactiveKPIs = useMemo(() => {
    return calculateReactiveKPIs({
      districts,
      incidents,
      selectedPeriod,
      selectedDistrictId,
      language,
    });
  }, [districts, incidents, selectedPeriod, selectedDistrictId, language]);

  const rankings = useMemo(() => {
    return calculateDistrictRankings(districts);
  }, [districts]);

  const statewideAggregates = useMemo(() => {
    return calculateStatewideAggregates(districts);
  }, [districts]);

  const topLowerMatrix = useMemo(() => {
    return calculateTopLowerMatrix(districts, selectedDivision);
  }, [districts, selectedDivision]);

  return {
    reactiveKPIs,
    rankings,
    statewideAggregates,
    topLowerMatrix,
  };
}

/**
 * Dedicated hook computing a single district's full 4-pillar scorecard and TAT status.
 */
export function useDistrictScorecard(district: DistrictData | null | undefined) {
  return useMemo(() => {
    if (!district) return null;

    const pillarBreakdown = calculatePillarBreakdown({
      releases: district.releases,
      avgTatMinutes: district.avgTAT ?? 38,
      sentimentPercent: district.sentiment,
      crisisSlaPercent: district.crisisSLA,
      targetReleases: BENCHMARKS.targetReleasesWeeklyTier1,
    });

    const tatStatus = getTATStatus(district.avgTAT ?? 38);

    return {
      pillarBreakdown,
      tatStatus,
      cpiScore: district.cpi,
    };
  }, [district]);
}
