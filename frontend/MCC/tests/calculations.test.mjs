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
  calculateHoardingsVerificationRate,
  calculatePillarBreakdown,
  calculateDistrictRankings,
  calculateStatewideAggregates,
  calculateTopLowerMatrix,
  calculateAttendanceSummary,
  calculateReactiveKPIs,
  formatTAT,
  getTATStatus,
  CPI_MAX_POINTS,
  OFFICIAL_SENTIMENT_WEIGHTS,
  BENCHMARKS,
  PERIOD_MULTIPLIERS,
} from '../src/lib/metricCalculations.ts';

describe('Authoritative Unified Calculations Suite (calculations.tsx / metricCalculations.ts)', () => {
  describe('1. Apex CPI Composite Score & Boundaries', () => {
    it('should calculate 100.00 for maximum possible pillar values', () => {
      const cpi = calculateCPI({
        volumeScore: 35,
        speedScore: 25,
        sentimentIndex: 25,
        crisisResolutionRate: 15,
      });
      assert.strictEqual(cpi, 100.0);
    });

    it('should clamp scores to their designated maximums', () => {
      const cpi = calculateCPI({
        volumeScore: 50, // Max 35
        speedScore: 30, // Max 25
        sentimentIndex: 40, // Max 25
        crisisResolutionRate: 20, // Max 15
      });
      assert.strictEqual(cpi, 100.0);
    });

    it('should clamp negative scores to 0.00 gracefully', () => {
      const cpi = calculateCPI({
        volumeScore: -10,
        speedScore: -5,
        sentimentIndex: -20,
        crisisResolutionRate: -15,
      });
      assert.strictEqual(cpi, 0.0);
    });

    it('should compute partial scores with exact 2-decimal precision', () => {
      const cpi = calculateCPI({
        volumeScore: 24.35,
        speedScore: 21.5,
        sentimentIndex: 18.25,
        crisisResolutionRate: 12.0,
      });
      assert.strictEqual(cpi, 76.1);
    });
  });

  describe('2. Speed / Turnaround Time (TAT) Formulas', () => {
    it('should award full 25 points when TAT is under or equal to 30 minutes', () => {
      assert.strictEqual(calculateSpeedScore(15), 25.0);
      assert.strictEqual(calculateSpeedScore(30), 25.0);
    });

    it('should deduct 0.5 points per minute for TAT beyond 30 minutes', () => {
      // 36 mins -> 6 mins over -> 6 * 0.5 = 3 pts deducted -> 22.0
      assert.strictEqual(calculateSpeedScore(36), 22.0);
      // 40 mins -> 10 mins over -> 10 * 0.5 = 5 pts deducted -> 20.0
      assert.strictEqual(calculateSpeedScore(40), 20.0);
      // 50 mins -> 20 mins over -> 20 * 0.5 = 10 pts deducted -> 15.0
      assert.strictEqual(calculateSpeedScore(50), 15.0);
    });

    it('should clamp speed score to 0 when TAT is severely delayed (> 80 mins)', () => {
      // 80 mins -> 50 over -> 50 * 0.5 = 25 deducted -> 0
      assert.strictEqual(calculateSpeedScore(80), 0.0);
      assert.strictEqual(calculateSpeedScore(120), 0.0);
    });

    it('should format TAT in English and Marathi accurately', () => {
      assert.strictEqual(formatTAT(25, 'en'), '25 mins');
      assert.strictEqual(formatTAT(25, 'mr'), '25 मिनिटे');
      assert.strictEqual(formatTAT(90, 'en'), '1h 30m');
      assert.strictEqual(formatTAT(90, 'mr'), '1 तास 30 मि.');
      assert.strictEqual(formatTAT(120, 'en'), '2 hrs');
      assert.strictEqual(formatTAT(120, 'mr'), '2 तास');
    });

    it('should return correct TAT status labels and CSS badge tokens', () => {
      const optimal = getTATStatus(25);
      assert.strictEqual(optimal.status, 'optimal');
      assert.ok(optimal.badgeClass.includes('emerald'));

      const acceptable = getTATStatus(45);
      assert.strictEqual(acceptable.status, 'acceptable');
      assert.ok(acceptable.badgeClass.includes('amber'));

      const delayed = getTATStatus(75);
      assert.strictEqual(delayed.status, 'delayed');
      assert.ok(delayed.badgeClass.includes('rose'));
    });
  });

  describe('3. Volume Score & Period Multipliers', () => {
    it('should scale volume score proportionally to target', () => {
      // 150 releases out of 300 target = 50% of 35 = 17.5
      assert.strictEqual(calculateVolumeScore(150, 300), 17.5);
      // 300 releases out of 300 = 100% of 35 = 35.0
      assert.strictEqual(calculateVolumeScore(300, 300), 35.0);
    });

    it('should cap volume score at 35 points even with surplus output', () => {
      assert.strictEqual(calculateVolumeScore(500, 300), 35.0);
    });

    it('should provide calibrated period multipliers for rolling windows', () => {
      assert.strictEqual(PERIOD_MULTIPLIERS['Last 7 days'], 1.0);
      assert.strictEqual(PERIOD_MULTIPLIERS['Last 30 days'], 3.8);
      assert.strictEqual(PERIOD_MULTIPLIERS['Last 90 days'], 11.2);
    });
  });

  describe('4. Multi-Stream Sentiment Index', () => {
    it('should correctly apply 35/25/25/15 weights across channels', () => {
      const res = calculateSentimentIndex({
        printOcr: 80, // 80 * 0.35 = 28.0
        broadcastTv: 75, // 75 * 0.25 = 18.75
        socialListening: 70, // 70 * 0.25 = 17.5
        userComments: 60, // 60 * 0.15 = 9.0
      });
      // Composite = 28.0 + 18.75 + 17.5 + 9.0 = 73.25 -> 73.3%
      assert.strictEqual(res.indexPercent, 73.3);
      // 25-point conversion: (73.3 / 100) * 25 = 18.325 -> 18.32
      assert.strictEqual(res.cpiPoints, 18.32);
    });
  });

  describe('5. Crisis SLA Resolution Rate (90-Minute Window)', () => {
    it('should compute exact resolution percentage and 15-point conversion', () => {
      // 9 resolved out of 10 = 90.0% -> 90% of 15 = 13.5 pts
      const res = calculateCrisisResolutionRate(9, 10);
      assert.strictEqual(res.ratePercent, 90.0);
      assert.strictEqual(res.cpiPoints, 13.5);
    });

    it('should handle zero incidents as 100% clean baseline', () => {
      const res = calculateCrisisResolutionRate(0, 0);
      assert.strictEqual(res.ratePercent, 100.0);
      assert.strictEqual(res.cpiPoints, 15.0);
    });
  });

  describe('6. Full 4-Pillar Breakdown & Gap Analysis', () => {
    it('should compute all 4 pillars and gap analysis from raw operational telemetry', () => {
      const breakdown = calculatePillarBreakdown({
        releases: 240, // 240 / 300 * 35 = 28.0 pts (gap: 7.0)
        avgTatMinutes: 38, // 38m -> 8m over -> 8 * 0.5 = 4 pts deducted -> 21.0 pts (gap: 4.0)
        sentimentPercent: 80, // 80% of 25 = 20.0 pts (gap: 5.0)
        crisisSlaPercent: 90, // 90% of 15 = 13.5 pts (gap: 1.5)
        targetReleases: 300,
      });

      assert.strictEqual(breakdown.volumeScore, 28.0);
      assert.strictEqual(breakdown.speedScore, 21.0);
      assert.strictEqual(breakdown.sentimentScore, 20.0);
      assert.strictEqual(breakdown.crisisScore, 13.5);
      assert.strictEqual(breakdown.totalCPI, 82.5);

      assert.strictEqual(breakdown.gaps.volumeGap, 7.0);
      assert.strictEqual(breakdown.gaps.speedGap, 4.0);
      assert.strictEqual(breakdown.gaps.sentimentGap, 5.0);
      assert.strictEqual(breakdown.gaps.crisisGap, 1.5);
      assert.strictEqual(breakdown.gaps.totalGap, 17.5);
    });
  });

  describe('7. District Rankings & Aggregations', () => {
    const mockDistricts = [
      {
        id: 'thane',
        name: 'Thane',
        division: 'Konkan',
        releases: 400,
        sentiment: 85,
        crisisSLA: 100,
        cpi: 95.5,
        volumeScore: 35,
        sentimentScore: 21,
        crisisScore: 15,
        rank: 1,
        dioActive: true,
      },
      {
        id: 'pune',
        name: 'Pune',
        division: 'Pune',
        releases: 380,
        sentiment: 80,
        crisisSLA: 95,
        cpi: 93.0,
        volumeScore: 33,
        sentimentScore: 20,
        crisisScore: 14,
        rank: 2,
        dioActive: true,
      },
      {
        id: 'nagpur',
        name: 'Nagpur',
        division: 'Nagpur',
        releases: 350,
        sentiment: 78,
        crisisSLA: 90,
        cpi: 90.0,
        volumeScore: 30,
        sentimentScore: 19.5,
        crisisScore: 13.5,
        rank: 3,
        dioActive: true,
      },
    ];

    it('should assign deterministic 1-based ranks ordered by CPI desc', () => {
      const ranked = calculateDistrictRankings(mockDistricts);
      assert.strictEqual(ranked[0].id, 'thane');
      assert.strictEqual(ranked[0].calculatedRank, 1);
      assert.strictEqual(ranked[1].id, 'pune');
      assert.strictEqual(ranked[1].calculatedRank, 2);
      assert.strictEqual(ranked[2].id, 'nagpur');
      assert.strictEqual(ranked[2].calculatedRank, 3);
    });

    it('should accurately compute statewide averages', () => {
      const aggregates = calculateStatewideAggregates(mockDistricts);
      assert.strictEqual(aggregates.totalReleases, 1130);
      assert.strictEqual(aggregates.avgReleases, 377);
      assert.strictEqual(aggregates.avgSentiment, 81.0);
      assert.strictEqual(aggregates.avgCrisisSLA, 95.0);
      assert.strictEqual(aggregates.avgCPI, 92.83);
    });

    it('should generate Top 5 and Lower 5 matrix correctly', () => {
      const matrix = calculateTopLowerMatrix(mockDistricts, 'All Maharashtra');
      assert.ok(Array.isArray(matrix.all));
      assert.strictEqual(matrix.all.length, 3);
      assert.strictEqual(matrix.all[0].extreme, 'Top High');
    });
  });

  describe('8. Biometric Attendance Aggregation', () => {
    it('should compute overall attendance and punctuality across multiple administrative offices', () => {
      const offices = [
        { sanctionedStrength: 30, presentToday: 28, onTimeArrivals: 26, onFieldDuty: 1, onLeave: 1 },
        { sanctionedStrength: 20, presentToday: 18, onTimeArrivals: 16, onFieldDuty: 1, onLeave: 1 },
      ];
      const summary = calculateAttendanceSummary(offices);
      assert.strictEqual(summary.totalSanctioned, 50);
      assert.strictEqual(summary.totalPresent, 46);
      assert.strictEqual(summary.overallAttendancePercent, 92.0); // 46 / 50 = 92%
      assert.strictEqual(summary.overallPunctualityScore, 91.3); // 42 / 46 = 91.3%
      assert.strictEqual(summary.officesMeetingTarget, 2);
    });
  });
});
