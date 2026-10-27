/**
 * Maha-Command Center — Nightly Hoardings Sync State & Stale Detection
 * 
 * Schedule: Nightly at 02:00 IST
 * Stale Warning Threshold: 36 Hours
 */

export interface HoardingsSyncMetadata {
  schedule: string;
  scheduleMr: string;
  lastFetchedAt: string;
  staleThresholdHours: number;
  isStale: boolean;
  totalHoardings: number;
  lastSyncStatus: 'success' | 'warning' | 'error';
  lastTriggerSource?: string;
}

export const HOARDINGS_SYNC_CONFIG = {
  schedule: 'Nightly at 02:00 IST',
  scheduleMr: 'दररोज रात्री ०२:०० वाजता (IST)',
  staleThresholdHours: 36,
  defaultSecret: 'maha-gov-cron-secret-2026',
};

/**
 * Calculates the most recent 02:00 IST timestamp
 */
export function getDefaultLastNightlyFetch(now: Date = new Date()): string {
  // IST is UTC + 5:30 (330 minutes)
  const istOffsetMinutes = 330;
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istDate = new Date(utcMs + (istOffsetMinutes * 60000));

  const istHours = istDate.getHours();
  // If IST time is before 02:00, use yesterday's 02:00 IST
  if (istHours < 2) {
    istDate.setDate(istDate.getDate() - 1);
  }
  istDate.setHours(2, 0, 0, 0);

  // Convert back to UTC ISO string
  const targetUtcMs = istDate.getTime() - (istOffsetMinutes * 60000);
  return new Date(targetUtcMs).toISOString();
}

/**
 * Checks if a lastFetchedAt timestamp is older than 36 hours
 */
export function isHoardingDataStale(
  lastFetchedAt: string,
  nowMs: number = Date.now(),
  staleThresholdHours: number = 36
): boolean {
  if (!lastFetchedAt) return true;
  const fetchedMs = new Date(lastFetchedAt).getTime();
  if (isNaN(fetchedMs)) return true;
  const ageMs = nowMs - fetchedMs;
  return ageMs > staleThresholdHours * 60 * 60 * 1000;
}

// In-memory persistent state across requests during runtime
let globalLastFetchedAt = getDefaultLastNightlyFetch();
let globalTriggerSource = 'system_startup';
let globalTotalCount = 140;

export function getHoardingsSyncStatus(nowMs: number = Date.now()): HoardingsSyncMetadata {
  const isStale = isHoardingDataStale(globalLastFetchedAt, nowMs, HOARDINGS_SYNC_CONFIG.staleThresholdHours);
  return {
    schedule: HOARDINGS_SYNC_CONFIG.schedule,
    scheduleMr: HOARDINGS_SYNC_CONFIG.scheduleMr,
    lastFetchedAt: globalLastFetchedAt,
    staleThresholdHours: HOARDINGS_SYNC_CONFIG.staleThresholdHours,
    isStale,
    totalHoardings: globalTotalCount,
    lastSyncStatus: isStale ? 'warning' : 'success',
    lastTriggerSource: globalTriggerSource,
  };
}

export function updateHoardingsSync(
  timestampIso?: string,
  triggerSource: string = 'api_cron_refresh',
  count: number = 140
): HoardingsSyncMetadata {
  globalLastFetchedAt = timestampIso || new Date().toISOString();
  globalTriggerSource = triggerSource;
  globalTotalCount = count;
  return getHoardingsSyncStatus();
}
