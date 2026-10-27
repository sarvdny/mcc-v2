import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSentimentFromNewsQueue,
  SENTIMENT_WEIGHTS,
} from '../src/lib/sentimentEngine.ts';
import {
  detectMisinformationFromNews,
  defaultRuleBasedClassifier,
} from '../src/lib/misinformationDetector.ts';

describe('Live Sentiment Index & Misinformation Ticket Binding Suite', () => {
  const mockNewsQueue = [
    {
      id: 'NQ-TEST-01',
      source: 'Lokmat',
      sourceShort: 'Lokmat',
      url: 'https://lokmat.com/test-1',
      channelType: 'Print',
      newsEn: 'Chief Minister inaugurates new solar feeder project in Solapur',
      newsMr: 'मुख्यमंत्र्यांच्या हस्ते सोलापूर सौर वाहिनी प्रकल्पाचे उद्घाटन',
      district: 'Solapur',
      scoring: 90,
      scoreLevel: 'High',
      sentiment: 'Positive',
      verification: 'Verified',
      credibilityScore: 95,
      credibilityTier: 'Tier-1 Accredited',
      volumes: '120K Reach',
      impressions: '300K views',
      timestamp: '11:20:00',
    },
    {
      id: 'NQ-TEST-02',
      source: 'TV9 Marathi',
      sourceShort: 'TV9',
      url: 'https://tv9marathi.com/test-2',
      channelType: 'TV',
      newsEn: 'Pune ring road land acquisition reaches 85% completion',
      newsMr: 'पुणे रिंग रोड भूसंपादन ८५% पूर्ण',
      district: 'Pune',
      scoring: 88,
      scoreLevel: 'High',
      sentiment: 'Positive',
      verification: 'Verified',
      credibilityScore: 94,
      credibilityTier: 'Tier-1 Accredited',
      volumes: '250K Reach',
      impressions: '600K views',
      timestamp: '11:25:00',
    },
    {
      id: 'NQ-TEST-03',
      source: 'X / Twitter',
      sourceShort: 'X',
      url: 'https://twitter.com/fake_account/status/9999',
      channelType: 'Digital',
      newsEn: 'False rumor of bridge collapse on Ghodbunder road circulating online',
      newsMr: 'घोडबंदर रोडवरील पूल खचल्याची खोटी अफवा समाजमाध्यमांवर',
      district: 'Thane',
      scoring: 92,
      scoreLevel: 'Critical',
      sentiment: 'Critical',
      verification: 'Flagged Misinfo',
      credibilityScore: 60,
      credibilityTier: 'Digital Wire',
      volumes: '180K Reach',
      impressions: '400K views',
      timestamp: '11:30:00',
    },
  ];

  it('should compute live Sentiment Index from news items with exact channel weights', () => {
    const result = computeSentimentFromNewsQueue(mockNewsQueue, 'Last 7 days');

    assert.ok(result.composite > 0, 'Composite sentiment must be positive number');
    assert.ok(typeof result.lastComputedAt === 'string', 'lastComputedAt must be timestamp string');
    assert.strictEqual(result.itemCount, 3);
    assert.strictEqual(result.positiveCount, 2);
    assert.strictEqual(result.negativeCount, 1);

    // Verify channel weights
    assert.strictEqual(SENTIMENT_WEIGHTS.printOcr, 0.35);
    assert.strictEqual(SENTIMENT_WEIGHTS.broadcastTv, 0.25);
    assert.strictEqual(SENTIMENT_WEIGHTS.socialListening, 0.25);
    assert.strictEqual(SENTIMENT_WEIGHTS.userComments, 0.15);
  });

  it('should recompute sentiment when a new negative news item arrives', () => {
    const baseline = computeSentimentFromNewsQueue(mockNewsQueue, 'Last 7 days');

    const negativeItem = {
      id: 'NQ-TEST-04',
      source: 'Regional Paper',
      sourceShort: 'Regional',
      url: 'https://regional.com/pothole',
      channelType: 'Print',
      newsEn: 'Monsoon potholes cause severe highway delays in Mangaon',
      newsMr: 'माणगाव महामार्गावर खड्ड्यांमुळे वाहतूक कोंडी',
      district: 'Raigad',
      scoring: 35,
      scoreLevel: 'Moderate',
      sentiment: 'Negative',
      verification: 'Under Review',
      credibilityScore: 85,
      credibilityTier: 'Verified Regional',
      volumes: '40K Reach',
      impressions: '90K views',
      timestamp: '11:45:00',
    };

    const updated = computeSentimentFromNewsQueue([...mockNewsQueue, negativeItem], 'Last 7 days');

    assert.ok(
      updated.composite < baseline.composite,
      `Sentiment must decrease after negative item arrival: baseline ${baseline.composite} -> updated ${updated.composite}`
    );
    assert.strictEqual(updated.negativeCount, 2);
  });

  it('should flag misinformation items and generate linked incident tickets', () => {
    const { newTickets, lastComputedAt } = detectMisinformationFromNews(mockNewsQueue, []);

    assert.strictEqual(newTickets.length, 1, 'Should generate 1 ticket from Flagged Misinfo item');
    const ticket = newTickets[0];

    assert.strictEqual(ticket.originatingItemId, 'NQ-TEST-03');
    assert.strictEqual(ticket.district, 'Thane');
    assert.strictEqual(ticket.severity, 'High');
    assert.strictEqual(ticket.slaMinutes, 90);
    assert.strictEqual(ticket.slaRemaining, '01:30:00');
    assert.ok(ticket.summary.includes('rumor') || ticket.summary.includes('Ghodbunder'));
    assert.ok(ticket.detectedDate, 'Ticket must contain detectedDate');
    assert.ok(ticket.officialEvidence, 'Ticket must state officialEvidence');
    assert.ok(typeof lastComputedAt === 'string', 'Must provide lastComputedAt timestamp');
  });

  it('should match Marathi rumor keyword "अफवा" through defaultRuleBasedClassifier', () => {
    const item = {
      id: 'NQ-TEST-05',
      source: 'Social Wire',
      sourceShort: 'Wire',
      url: 'https://social.com',
      channelType: 'Digital',
      newsEn: 'Unverified claim regarding water cut',
      newsMr: 'शहरात पाणीपुरवठा बंद असल्याची खोटी अफवा',
      district: 'Nashik',
      scoring: 70,
      scoreLevel: 'Moderate',
      sentiment: 'Neutral',
      verification: 'Under Review',
      credibilityScore: 70,
      credibilityTier: 'Digital Wire',
      volumes: '20K',
      impressions: '50K',
      timestamp: '12:00:00',
    };

    const result = defaultRuleBasedClassifier(item);
    assert.strictEqual(result.isMisinformation, true, 'Keyword "अफवा" must be caught by detector');
    assert.strictEqual(result.verdict, 'Disputed Narrative');
  });
});
