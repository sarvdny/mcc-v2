import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCPI,
  calculateCrisisResolutionRate,
  calculateSentimentIndex,
  calculateAttendancePercent,
  calculatePunctualityScore,
  calculateSpeedScore,
  calculateVolumeScore,
  calculateHoardingsIlluminationRate,
  OFFICIAL_SENTIMENT_WEIGHTS,
} from '../src/lib/metricCalculations.ts';

describe('Deterministic Mathematical Calculation Engine Suite', () => {
  describe('1. Communication Performance Index (CPI) Formula', () => {
    it('should compute exact 100 max points when all 4 pillars are at maximum', () => {
      const cpi = calculateCPI({
        volumeScore: 35,
        speedScore: 25,
        sentimentIndex: 25,
        crisisResolutionRate: 15,
      });
      assert.strictEqual(cpi, 100.0, 'CPI must equal exactly 100.00 for max inputs');
    });

    it('should correctly sum Thane district baseline scores (35 + 24.5 + 22.25 + 15 = 96.75)', () => {
      const cpi = calculateCPI({
        volumeScore: 35.0,
        speedScore: 24.5,
        sentimentIndex: 22.25,
        crisisResolutionRate: 15.0,
      });
      assert.strictEqual(cpi, 96.75);
    });

    it('should cap negative or out-of-bound inputs gracefully', () => {
      const cpiOverflow = calculateCPI({
        volumeScore: 50, // Max 35
        speedScore: 40, // Max 25
        sentimentIndex: 30, // Max 25
        crisisResolutionRate: 20, // Max 15
      });
      assert.strictEqual(cpiOverflow, 100.0, 'Overflow inputs must be capped to 100');

      const cpiNegative = calculateCPI({
        volumeScore: -10,
        speedScore: -5,
        sentimentIndex: -2,
        crisisResolutionRate: -1,
      });
      assert.strictEqual(cpiNegative, 0.0, 'Negative inputs must be clamped to 0');
    });
  });

  describe('2. Crisis SLA Resolution Rate Formula', () => {
    it('should calculate percentage and 15-point CPI conversion correctly', () => {
      // 18 resolved within 90 mins out of 20 total incidents = 90.0%
      const res = calculateCrisisResolutionRate(18, 20);
      assert.strictEqual(res.ratePercent, 90.0);
      assert.strictEqual(res.cpiPoints, 13.5); // (90 / 100) * 15 = 13.5
    });

    it('should return 100% and 15.0 points when total incidents is 0 (clean baseline)', () => {
      const res = calculateCrisisResolutionRate(0, 0);
      assert.strictEqual(res.ratePercent, 100.0);
      assert.strictEqual(res.cpiPoints, 15.0);
    });

    it('should handle partial resolution accurately with 1 decimal place', () => {
      // 1 out of 3 = 33.3%
      const res = calculateCrisisResolutionRate(1, 3);
      assert.strictEqual(res.ratePercent, 33.3);
      assert.strictEqual(res.cpiPoints, 5.0); // (33.33 / 100) * 15 = 5.0
    });
  });

  describe('3. Sentiment Index Formula & Weights', () => {
    it('should verify official channel weights total 1.0 (100%)', () => {
      const totalWeight =
        OFFICIAL_SENTIMENT_WEIGHTS.printOcr +
        OFFICIAL_SENTIMENT_WEIGHTS.broadcastTv +
        OFFICIAL_SENTIMENT_WEIGHTS.socialListening +
        OFFICIAL_SENTIMENT_WEIGHTS.userComments;
      assert.strictEqual(
        Number(totalWeight.toFixed(2)),
        1.0,
        'Sum of sentiment weights must equal 1.0 (35% + 25% + 25% + 15%)'
      );
    });

    it('should compute weighted Sentiment Index and 25-point CPI component', () => {
      const res = calculateSentimentIndex({
        printOcr: 80, // 80 * 0.35 = 28
        broadcastTv: 70, // 70 * 0.25 = 17.5
        socialListening: 60, // 60 * 0.25 = 15
        userComments: 50, // 50 * 0.15 = 7.5
      });
      // Composite = 28 + 17.5 + 15 + 7.5 = 68.0%
      assert.strictEqual(res.indexPercent, 68.0);
      assert.strictEqual(res.cpiPoints, 17.0); // (68 / 100) * 25 = 17.0
    });
  });

  describe('4. Biometric Attendance & Punctuality Formulas', () => {
    it('should compute exact attendance percentage', () => {
      // 28 present out of 30 sanctioned = 93.3%
      const pct = calculateAttendancePercent(28, 30);
      assert.strictEqual(pct, 93.3);
    });

    it('should compute exact punctuality compliance score', () => {
      // 25 logged in on time out of 28 present = 89.3%
      const punctuality = calculatePunctualityScore(25, 28);
      assert.strictEqual(punctuality, 89.3);
    });

    it('should return 0% for empty sanctioned staff count safely', () => {
      assert.strictEqual(calculateAttendancePercent(5, 0), 0);
    });
  });

  describe('5. Turnaround Time (TAT) & Volume Formulas', () => {
    it('should award full 25 points for TAT <= 30 minutes', () => {
      assert.strictEqual(calculateSpeedScore(22), 25.0);
      assert.strictEqual(calculateSpeedScore(30), 25.0);
    });

    it('should deduct 0.5 points per minute above 30 minutes', () => {
      // 40 mins -> 10 mins over -> 10 * 0.5 = 5 pts deducted -> 20.0
      assert.strictEqual(calculateSpeedScore(40), 20.0);
    });

    it('should calculate volume score capped at 35 points', () => {
      assert.strictEqual(calculateVolumeScore(300, 300), 35.0);
      assert.strictEqual(calculateVolumeScore(450, 300), 35.0); // capped at 35
      // 150 releases out of 300 target = 50% * 35 = 17.5
      assert.strictEqual(calculateVolumeScore(150, 300), 17.5);
    });

    it('should calculate hoardings illumination rate accurately', () => {
      // 85 illuminated out of 100 = 85.0%
      assert.strictEqual(calculateHoardingsIlluminationRate(85, 100), 85.0);
    });
  });
});
