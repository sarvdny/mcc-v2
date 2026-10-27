import type { NewsQueueItem, IncidentData } from '../types/dashboard.ts';

export interface MisinformationValidationBasis {
  detectedSource: string; // e.g. "X (Twitter) @unverified_handle"
  sourceUrl: string; // verified through urlSecurity
  detectedAt: string; // ISO or formatted timestamp
  verdict: 'Confirmed Misinformation' | 'Disputed Narrative' | 'Fabricated Document';
  verdictMr: string;
  officialEvidence: string; // e.g. "Collectorate Press Note Ref #DM/2026/891"
  officialEvidenceMr: string;
}

export type MisinformationClassifierHook = (item: NewsQueueItem) => {
  isMisinformation: boolean;
  verdict?: MisinformationValidationBasis['verdict'];
  verdictMr?: string;
  confidence?: number;
};

// Pluggable classifier hooks array
const classifierHooks: MisinformationClassifierHook[] = [];

export function registerClassifierHook(hook: MisinformationClassifierHook) {
  classifierHooks.push(hook);
}

/**
 * Built-in Rule-Based Misinformation Heuristic Classifier
 */
export function defaultRuleBasedClassifier(item: NewsQueueItem): {
  isMisinformation: boolean;
  verdict: MisinformationValidationBasis['verdict'];
  verdictMr: string;
} {
  if (item.verification === 'Flagged Misinfo' || item.sentiment === 'Critical') {
    return {
      isMisinformation: true,
      verdict: 'Confirmed Misinformation',
      verdictMr: 'प्रमाणित दिशाभूल माहिती (खोटे वृत्त)',
    };
  }

  const textToScan = `${item.newsEn} ${item.newsMr} ${item.source}`.toLowerCase();
  const triggerKeywords = [
    'rumor',
    'rumour',
    'fake',
    'earthquake rumor',
    'heavy vehicle ban rumor',
    'अफवा',
    'बनावट',
    'खोटी बातमी',
    'दिशाभूल',
    'unverified claim',
  ];

  const matched = triggerKeywords.some((kw) => textToScan.includes(kw));
  if (matched) {
    return {
      isMisinformation: true,
      verdict: 'Disputed Narrative',
      verdictMr: 'अतथ्य व वादग्रस्त दावा',
    };
  }

  return {
    isMisinformation: false,
    verdict: 'Confirmed Misinformation',
    verdictMr: 'प्रमाणित दिशाभूल माहिती',
  };
}

/**
 * Creates an IncidentData ticket from a flagged news queue item
 */
export function createTicketFromNewsItem(
  item: NewsQueueItem,
  verdict: MisinformationValidationBasis['verdict'] = 'Confirmed Misinformation',
  verdictMr: string = 'प्रमाणित दिशाभूल माहिती (खोटे वृत्त)'
): IncidentData {
  const now = new Date();
  const dayStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return {
    id: `INC-AUTO-${item.id.replace('NQ-', '')}`,
    severity: item.scoring >= 90 ? 'High' : 'Medium',
    summary: item.newsEn,
    summaryMr: item.newsMr,
    source: item.source,
    url: item.url,
    sources: item.sources || [{ name: item.source, url: item.url || '', type: 'Digital' }],
    verificationStatus: 'System Monitoring · Flagged from Live Ingestion',
    slaRemaining: '01:30:00',
    slaMinutes: 90,
    district: item.district,
    authorized: false,
    originatingItemId: item.id,
    detectedDate: dayStr,
    detectedTime: item.timestamp || 'Just now',
    verdict,
    verdictMr,
    officialEvidence: `DGIPR Fact-Check Advisory & District Collectorate Verification (${item.district})`,
    officialEvidenceMr: `माहिती व जनसंपर्क फॅक्टचेक परिपत्रक व जिल्हाधिकारी पडताळणी (${item.district})`,
  };
}

/**
 * Scans a collection of NewsQueueItems, executes registered hooks,
 * and generates unique IncidentData tickets for any detected misinformation.
 */
export function detectMisinformationFromNews(
  items: NewsQueueItem[],
  existingIncidents: IncidentData[] = []
): {
  newTickets: IncidentData[];
  totalActiveTickets: number;
  lastComputedAt: string;
} {
  const existingIds = new Set(
    existingIncidents.map((inc) => inc.originatingItemId || inc.id)
  );

  const newTickets: IncidentData[] = [];

  items.forEach((item) => {
    // Check registered custom hooks first
    let isMisinfo = false;
    let verdict: MisinformationValidationBasis['verdict'] = 'Confirmed Misinformation';
    let verdictMr = 'प्रमाणित दिशाभूल माहिती (खोटे वृत्त)';

    for (const hook of classifierHooks) {
      const res = hook(item);
      if (res.isMisinformation) {
        isMisinfo = true;
        if (res.verdict) verdict = res.verdict;
        if (res.verdictMr) verdictMr = res.verdictMr;
        break;
      }
    }

    if (!isMisinfo) {
      const defaultRes = defaultRuleBasedClassifier(item);
      if (defaultRes.isMisinformation) {
        isMisinfo = true;
        verdict = defaultRes.verdict;
        verdictMr = defaultRes.verdictMr;
      }
    }

    if (isMisinfo && !existingIds.has(item.id)) {
      const ticket = createTicketFromNewsItem(item, verdict, verdictMr);
      newTickets.push(ticket);
      existingIds.add(item.id);
    }
  });

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const lastComputedAt = `${hours}:${minutes}:${seconds} IST`;

  const totalActiveTickets = existingIncidents.length + newTickets.length;

  return {
    newTickets,
    totalActiveTickets,
    lastComputedAt,
  };
}
