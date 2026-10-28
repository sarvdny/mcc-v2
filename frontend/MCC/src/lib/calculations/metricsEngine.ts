/**
 * Pure Mathematical Metrics Engine for Maha-Command Center (MCC)
 * Directorate General of Information & Public Relations (DGIPR), Maharashtra
 *
 * Certified Mathematical Formulas:
 * 1. Communication Performance Index (CPI)
 * 2. Speed Score (Turnaround Time TAT)
 * 3. Volume Score (Releases vs Target)
 * 4. Composite Sentiment Index
 * 5. Crisis SLA Resolution Rate (90-Minute Window)
 */

export const CPI_MAX_POINTS = {
  volume: 35,
  speed: 25,
  sentiment: 25,
  crisisResolution: 15,
  total: 100,
} as const;

export const OFFICIAL_SENTIMENT_WEIGHTS = {
  printOcr: 0.35,        // 35% Print Media OCR
  broadcastTv: 0.25,     // 25% Broadcast TV
  socialListening: 0.25, // 25% Social Media Streams
  userComments: 0.15,    // 15% Citizen Comments
} as const;

export const BENCHMARKS = {
  tatTargetMinutes: 30,
  tatDeductionRate: 0.5,
  crisisSlaWindowMinutes: 90,
  targetReleasesWeeklyTier1: 300,
  targetReleasesWeeklyStatewide: 1500,
  attendanceSanctionedThreshold: 85,
  punctualityTargetThreshold: 90,
} as const;

export const PERIOD_MULTIPLIERS: Record<string, number> = {
  'Last 24 Hours': 0.14,
  '24h': 0.14,
  'Last 7 days': 1.0,
  '7d': 1.0,
  'Last 30 days': 3.8,
  '30d': 3.8,
  'Last 90 days': 11.2,
  '90d': 11.2,
};

export interface CPIInputs {
  speedScore: number;
  volumeScore: number;
  sentimentIndex: number;
  crisisSlaScore: number;
}

/**
 * Calculates apex Communication Performance Index (CPI).
 * Scale: 0 to 100 points.
 * CPI = Volume (35) + Speed (25) + Sentiment (25) + Crisis SLA (15)
 */
export function calculateCPI(inputs: CPIInputs): number {
  const vol = Math.min(CPI_MAX_POINTS.volume, Math.max(0, inputs.volumeScore));
  const spd = Math.min(CPI_MAX_POINTS.speed, Math.max(0, inputs.speedScore));
  const sent = Math.min(CPI_MAX_POINTS.sentiment, Math.max(0, inputs.sentimentIndex));
  const crisis = Math.min(CPI_MAX_POINTS.crisisResolution, Math.max(0, inputs.crisisSlaScore));

  const total = vol + spd + sent + crisis;
  return Number(Math.min(100, Math.max(0, total)).toFixed(2));
}

/**
 * Calculates Speed Score from Average Turnaround Time (TAT in minutes).
 * Baseline: 30 mins = 25/25 pts.
 * Formula: clamp(25 - (avgTAT - 30) * 0.5, 0, 25)
 */
export function calculateSpeedScore(avgTatMinutes: number): number {
  if (avgTatMinutes <= BENCHMARKS.tatTargetMinutes) {
    return CPI_MAX_POINTS.speed;
  }
  const deduction = (avgTatMinutes - BENCHMARKS.tatTargetMinutes) * BENCHMARKS.tatDeductionRate;
  const score = Math.max(0, CPI_MAX_POINTS.speed - deduction);
  return Number(score.toFixed(2));
}

/**
 * Calculates Volume Score based on actual releases vs target.
 * Formula: clamp((actual / target) * 35, 0, 35)
 */
export function calculateVolumeScore(actualReleases: number, targetReleases: number = BENCHMARKS.targetReleasesWeeklyTier1): number {
  if (targetReleases <= 0) return 0;
  const ratio = actualReleases / targetReleases;
  const score = Math.min(CPI_MAX_POINTS.volume, ratio * CPI_MAX_POINTS.volume);
  return Number(Math.max(0, score).toFixed(2));
}

/**
 * Formats TAT minutes into human-readable duration string.
 */
export function formatTAT(minutes: number, language: 'en' | 'mr' = 'en'): string {
  const rounded = Math.round(minutes);
  if (language === 'mr') {
    return `${rounded} मिनिटे`;
  }
  return `${rounded} min`;
}

/**
 * Returns TAT health classification.
 */
export function getTATStatus(minutes: number): 'optimal' | 'moderate' | 'breached' {
  if (minutes <= 30) return 'optimal';
  if (minutes <= 60) return 'moderate';
  return 'breached';
}
