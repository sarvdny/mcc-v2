/**
 * Media Ingestion Normalization & Sentiment Stream Engine
 * Directorate General of Information & Public Relations (DGIPR), Maharashtra
 */

import { OFFICIAL_SENTIMENT_WEIGHTS, CPI_MAX_POINTS } from './metricsEngine';

export interface SentimentStreamInputs {
  printPositivePercent: number;
  broadcastPositivePercent: number;
  socialPositivePercent: number;
  commentsPositivePercent: number;
}

/**
 * Calculates 4-Stream Unified Sentiment Index.
 * Weights: Print 35%, TV 25%, Social 25%, Comments 15%.
 * Point conversion: Scaled to 25 points maximum for CPI.
 */
export function calculateSentimentIndex(streams: SentimentStreamInputs): {
  indexPercent: number;
  cpiPoints: number;
  breakdown: {
    print: number;
    tv: number;
    social: number;
    comments: number;
  };
} {
  const printContribution = streams.printPositivePercent * OFFICIAL_SENTIMENT_WEIGHTS.printOcr;
  const tvContribution = streams.broadcastPositivePercent * OFFICIAL_SENTIMENT_WEIGHTS.broadcastTv;
  const socialContribution = streams.socialPositivePercent * OFFICIAL_SENTIMENT_WEIGHTS.socialListening;
  const commentsContribution = streams.commentsPositivePercent * OFFICIAL_SENTIMENT_WEIGHTS.userComments;

  const indexPercent = Number((printContribution + tvContribution + socialContribution + commentsContribution).toFixed(1));
  const cpiPoints = Number(((indexPercent / 100) * CPI_MAX_POINTS.sentiment).toFixed(2));

  return {
    indexPercent,
    cpiPoints,
    breakdown: {
      print: Number(printContribution.toFixed(2)),
      tv: Number(tvContribution.toFixed(2)),
      social: Number(socialContribution.toFixed(2)),
      comments: Number(commentsContribution.toFixed(2)),
    },
  };
}

/**
 * Calculates Outdoor Scheme Hoardings Illumination Rate.
 * Threshold standard: Lux >= 200 lux is illuminated.
 */
export function calculateHoardingsIlluminationRate(hoardings: Array<{ luxRating?: number; isIlluminated?: boolean }>): number {
  if (!hoardings || hoardings.length === 0) return 0;
  const illuminated = hoardings.filter((h) => (h.luxRating ?? 0) >= 200 || h.isIlluminated).length;
  return Number(((illuminated / hoardings.length) * 100).toFixed(1));
}

/**
 * Calculates Hoardings Physical/GPS Verification Rate.
 */
export function calculateHoardingsVerificationRate(hoardings: Array<{ isVerified?: boolean; geotag?: any }>): number {
  if (!hoardings || hoardings.length === 0) return 0;
  const verified = hoardings.filter((h) => h.isVerified || h.geotag).length;
  return Number(((verified / hoardings.length) * 100).toFixed(1));
}
