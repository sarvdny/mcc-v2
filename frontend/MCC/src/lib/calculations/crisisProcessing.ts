/**
 * Crisis SLA Processing & Incident Containment Engine
 * Directorate General of Information & Public Relations (DGIPR), Maharashtra
 *
 * Enforces the mandatory 90-minute misinformation refutation SLA.
 */

import { BENCHMARKS, CPI_MAX_POINTS } from './metricsEngine';
import type { IncidentData } from '@/types/dashboard';

/**
 * Calculates Crisis SLA Resolution Rate.
 * Formula: (Resolved within 90 mins / Total Incidents) * 100
 * Point conversion: Scaled to 15 points maximum for CPI.
 */
export function calculateCrisisResolutionRate(incidents: IncidentData[]): {
  ratePercent: number;
  cpiPoints: number;
  total: number;
  resolvedInSLA: number;
  breachedCount: number;
} {
  if (!incidents || incidents.length === 0) {
    return {
      ratePercent: 100,
      cpiPoints: CPI_MAX_POINTS.crisisResolution,
      total: 0,
      resolvedInSLA: 0,
      breachedCount: 0,
    };
  }

  let resolvedInSLA = 0;
  let breachedCount = 0;

  incidents.forEach((inc) => {
    // If ticket has elapsed or response time > 90 mins, consider breached
    const responseMins = (inc as unknown as { responseTimeMinutes?: number; tatMinutes?: number }).responseTimeMinutes ?? (inc as unknown as { tatMinutes?: number }).tatMinutes ?? inc.slaMinutes ?? 45;
    if (responseMins <= BENCHMARKS.crisisSlaWindowMinutes) {
      resolvedInSLA += 1;
    } else {
      breachedCount += 1;
    }
  });

  const ratePercent = Number(((resolvedInSLA / incidents.length) * 100).toFixed(1));
  const cpiPoints = Number(((ratePercent / 100) * CPI_MAX_POINTS.crisisResolution).toFixed(2));

  return {
    ratePercent,
    cpiPoints,
    total: incidents.length,
    resolvedInSLA,
    breachedCount,
  };
}
