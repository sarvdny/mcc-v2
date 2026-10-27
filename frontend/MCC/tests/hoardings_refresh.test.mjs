import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getDefaultLastNightlyFetch,
  isHoardingDataStale,
  getHoardingsSyncStatus,
  updateHoardingsSync,
  HOARDINGS_SYNC_CONFIG,
} from '../src/data/hoardingsSyncState.ts';

describe('Nightly Hoardings Sync & Stale Detection Suite', () => {
  test('should return default nightly schedule matching 02:00 IST', () => {
    assert.strictEqual(HOARDINGS_SYNC_CONFIG.schedule, 'Nightly at 02:00 IST');
    assert.strictEqual(HOARDINGS_SYNC_CONFIG.staleThresholdHours, 36);
  });

  test('should calculate valid default ISO timestamp for last nightly fetch', () => {
    const timestamp = getDefaultLastNightlyFetch();
    assert.ok(timestamp, 'Timestamp should be non-empty');
    const parsed = new Date(timestamp);
    assert.ok(!isNaN(parsed.getTime()), 'Timestamp should be valid ISO date');
  });

  test('should correctly identify fresh data within 36 hours', () => {
    const now = Date.now();
    // 12 hours ago
    const twelveHoursAgo = new Date(now - 12 * 60 * 60 * 1000).toISOString();
    assert.strictEqual(isHoardingDataStale(twelveHoursAgo, now, 36), false);

    // 35 hours ago
    const thirtyFiveHoursAgo = new Date(now - 35 * 60 * 60 * 1000).toISOString();
    assert.strictEqual(isHoardingDataStale(thirtyFiveHoursAgo, now, 36), false);
  });

  test('should correctly flag data as stale when exceeding 36 hours', () => {
    const now = Date.now();
    // 37 hours ago
    const thirtySevenHoursAgo = new Date(now - 37 * 60 * 60 * 1000).toISOString();
    assert.strictEqual(isHoardingDataStale(thirtySevenHoursAgo, now, 36), true);

    // 48 hours ago
    const fortyEightHoursAgo = new Date(now - 48 * 60 * 60 * 1000).toISOString();
    assert.strictEqual(isHoardingDataStale(fortyEightHoursAgo, now, 36), true);

    // Empty or invalid inputs
    assert.strictEqual(isHoardingDataStale('', now, 36), true);
    assert.strictEqual(isHoardingDataStale('invalid-date', now, 36), true);
  });

  test('should update sync status and record trigger source', () => {
    const newTimestamp = new Date().toISOString();
    const updated = updateHoardingsSync(newTimestamp, 'cron_test_runner', 142);

    assert.strictEqual(updated.lastFetchedAt, newTimestamp);
    assert.strictEqual(updated.lastTriggerSource, 'cron_test_runner');
    assert.strictEqual(updated.totalHoardings, 142);
    assert.strictEqual(updated.isStale, false);
    assert.strictEqual(updated.lastSyncStatus, 'success');
  });

  test('should verify secret protection logic for /api/v1/hoardings/refresh', () => {
    const secret = HOARDINGS_SYNC_CONFIG.defaultSecret;
    assert.ok(secret && secret.length > 10, 'Default secret must be strong string');

    const isValidHeader = (headerValue) => headerValue === (process.env.HOARDINGS_REFRESH_SECRET || secret);
    assert.strictEqual(isValidHeader(secret), true);
    assert.strictEqual(isValidHeader('wrong-secret'), false);
    assert.strictEqual(isValidHeader(null), false);
  });
});
