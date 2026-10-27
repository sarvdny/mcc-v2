import type { NewsQueueItem } from '../types/dashboard.ts';

export interface SentimentChannelBreakdown {
  printOcr: number; // 0-100%
  broadcastTv: number; // 0-100%
  socialListening: number; // 0-100%
  userComments: number; // 0-100%
  composite: number; // 0-100%
}

export interface SentimentWeights {
  printOcr: number;
  broadcastTv: number;
  socialListening: number;
  userComments: number;
}

export const SENTIMENT_WEIGHTS: SentimentWeights = {
  printOcr: 0.35, // 35% Print Media OCR
  broadcastTv: 0.25, // 25% Broadcast TV Telemetry
  socialListening: 0.25, // 25% Social Listening Data
  userComments: 0.15, // 15% Public / Citizen Comments
};

export function computeCompositeSentiment(
  channels: Omit<SentimentChannelBreakdown, 'composite'>,
  weights: SentimentWeights = SENTIMENT_WEIGHTS
): number {
  const composite =
    channels.printOcr * weights.printOcr +
    channels.broadcastTv * weights.broadcastTv +
    channels.socialListening * weights.socialListening +
    channels.userComments * weights.userComments;
  return Number(composite.toFixed(1));
}

export interface LiveSentimentResult {
  composite: number; // 0 - 100%
  channels: SentimentChannelBreakdown;
  itemCount: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  lastComputedAt: string;
  timeRange: string;
}

/**
 * Derives an individual item score (0-100) from its sentiment label and scoring metadata
 */
export function getItemSentimentScore(item: NewsQueueItem): number {
  if (item.sentiment === 'Positive') {
    return Math.max(75, Math.min(100, item.scoring || 85));
  }
  if (item.sentiment === 'Neutral') {
    return Math.max(50, Math.min(74, item.scoring ? item.scoring * 0.7 : 60));
  }
  if (item.sentiment === 'Negative') {
    return Math.max(25, Math.min(49, item.scoring ? item.scoring * 0.45 : 38));
  }
  // Critical
  return Math.max(10, Math.min(30, item.scoring ? item.scoring * 0.25 : 20));
}

/**
 * Computes Sentiment Index dynamically from live news queue items.
 * Weighted by channel (Print 35%, TV 25%, Social 25%, User 15%) across selected time window.
 */
export function computeSentimentFromNewsQueue(
  items: NewsQueueItem[],
  timeRange: string = 'Last 7 days',
  districtId?: string
): LiveSentimentResult {
  let filtered = [...items];

  // Optional district filter
  if (districtId && districtId.toLowerCase() !== 'all') {
    const normDist = districtId.toLowerCase();
    filtered = filtered.filter(
      (i) => (i.district || '').toLowerCase() === normDist
    );
  }

  // Temporal scaling / filtering simulation for 24h, 7d, 30d
  if (timeRange === '24h' || timeRange === 'Last 24 Hours') {
    // Keep most recent 35% of items
    filtered = filtered.slice(0, Math.max(5, Math.ceil(filtered.length * 0.35)));
  } else if (timeRange === '30d' || timeRange === 'Last 30 days') {
    // Full set
  }

  const printItems: number[] = [];
  const tvItems: number[] = [];
  const socialItems: number[] = [];
  const userItems: number[] = [];

  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;

  filtered.forEach((item) => {
    const score = getItemSentimentScore(item);
    if (item.sentiment === 'Positive') positiveCount++;
    else if (item.sentiment === 'Neutral') neutralCount++;
    else negativeCount++;

    const cType = (item.channelType || '').toLowerCase();
    const src = (item.source || '').toLowerCase();

    if (cType === 'print') {
      printItems.push(score);
    } else if (cType === 'tv') {
      tvItems.push(score);
    } else if (cType === 'digital' || src.includes('twitter') || src.includes('facebook') || src.includes('social')) {
      socialItems.push(score);
    } else {
      userItems.push(score);
    }
  });

  const avg = (arr: number[], fallback: number): number => {
    if (!arr.length) return fallback;
    const sum = arr.reduce((acc, v) => acc + v, 0);
    return Number((sum / arr.length).toFixed(1));
  };

  // Base fallback channels if queue is sparse
  const baseChannels = STATEWIDE_BASE_CHANNELS[timeRange] || STATEWIDE_BASE_CHANNELS['Last 7 days'];

  const printOcr = avg(printItems, baseChannels.printOcr);
  const broadcastTv = avg(tvItems, baseChannels.broadcastTv);
  const socialListening = avg(socialItems, baseChannels.socialListening);
  const userComments = avg(userItems, baseChannels.userComments);

  const composite = computeCompositeSentiment({
    printOcr,
    broadcastTv,
    socialListening,
    userComments,
  });

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const lastComputedAt = `${hours}:${minutes}:${seconds} IST`;

  return {
    composite,
    channels: {
      printOcr,
      broadcastTv,
      socialListening,
      userComments,
      composite,
    },
    itemCount: filtered.length,
    positiveCount,
    neutralCount,
    negativeCount,
    lastComputedAt,
    timeRange,
  };
}

export const DISTRICT_SENTIMENT_DATA: Record<string, Omit<SentimentChannelBreakdown, 'composite'>> = {
  thane: {
    printOcr: 85,
    broadcastTv: 82,
    socialListening: 81,
    userComments: 76,
  },
  raigad: {
    printOcr: 78,
    broadcastTv: 76,
    socialListening: 75,
    userComments: 73,
  },
  palghar: {
    printOcr: 74,
    broadcastTv: 71,
    socialListening: 70,
    userComments: 66,
  },
  ratnagiri: {
    printOcr: 70,
    broadcastTv: 69,
    socialListening: 67,
    userComments: 63,
  },
  sindhudurg: {
    printOcr: 76,
    broadcastTv: 74,
    socialListening: 74,
    userComments: 70,
  },
};

export const STATEWIDE_BASE_CHANNELS: Record<string, Omit<SentimentChannelBreakdown, 'composite'>> = {
  'Last 7 days': {
    printOcr: 71.0,
    broadcastTv: 68.5,
    socialListening: 70.2,
    userComments: 64.8,
  },
  'Last 30 days': {
    printOcr: 74.2,
    broadcastTv: 71.0,
    socialListening: 72.8,
    userComments: 67.5,
  },
  'Last 90 days': {
    printOcr: 76.5,
    broadcastTv: 74.0,
    socialListening: 75.0,
    userComments: 70.2,
  },
};

export function getDistrictSentiment(districtId?: string, timeRange: string = 'Last 7 days'): SentimentChannelBreakdown {
  const normId = (districtId || '').toLowerCase();
  const rawChannels = DISTRICT_SENTIMENT_DATA[normId] || STATEWIDE_BASE_CHANNELS[timeRange] || STATEWIDE_BASE_CHANNELS['Last 7 days'];

  let scale = 1.0;
  if (timeRange === 'Last 30 days') scale = 1.02;
  else if (timeRange === 'Last 90 days') scale = 1.04;

  const scaled = {
    printOcr: Math.min(100, Number((rawChannels.printOcr * (districtId ? scale : 1)).toFixed(1))),
    broadcastTv: Math.min(100, Number((rawChannels.broadcastTv * (districtId ? scale : 1)).toFixed(1))),
    socialListening: Math.min(100, Number((rawChannels.socialListening * (districtId ? scale : 1)).toFixed(1))),
    userComments: Math.min(100, Number((rawChannels.userComments * (districtId ? scale : 1)).toFixed(1))),
  };

  const composite = computeCompositeSentiment(scaled);
  return {
    ...scaled,
    composite,
  };
}
