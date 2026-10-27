/**
 * Official Allowlist of Verified Government & Authorized Media Domains
 * 
 * Outbound links from the Maha-Command Center are checked against this registry.
 * Allowlisted domains open safely in a new tab with rel="noopener noreferrer".
 * Unknown domains require an explicit "Leaving Portal" user confirmation modal.
 */

export const ALLOWLISTED_DOMAINS: string[] = [
  // Maharashtra Government Official Portals
  'maharashtra.gov.in',
  'dgipr.maharashtra.gov.in',
  'lokrajya.maharashtra.gov.in',
  'aaplesarkar.mahaonline.gov.in',
  'cmrf.maharashtra.gov.in',
  'mahaonline.gov.in',
  'rts.maharashtra.gov.in',
  'cidco.maharashtra.gov.in',
  'mmrda.maharashtra.gov.in',

  // Government of India Official Portals
  'india.gov.in',
  'pib.gov.in',
  'ddnews.gov.in',
  'mygov.in',
  'nic.in',
  'uidai.gov.in',

  // Official Institutional Social Media Channels
  'x.com',
  'twitter.com',
  'youtube.com',
  'facebook.com',
  'instagram.com',
  't.me',
  'telegram.org',

  // Accredited News Agencies & Regional Print/TV Publications
  'lokmat.com',
  'esakal.com',
  'loksatta.com',
  'maharashtratimes.com',
  'pudhari.news',
  'saamana.com',
  'tarunbharat.net',
  'divyamarathi.bhaskar.com',
  'abpmajha.com',
  'tv9marathi.com',
  'zeenews.india.com',
  'ndtv.com',
  'thehindu.com',
  'indianexpress.com',
  'timesofindia.indiatimes.com',
  'hindustantimes.com',
  'ani.in',
  'pti.in',
];

/**
 * Extracts normalized hostname from URL
 */
export function extractDomain(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.startsWith('/') || trimmed.startsWith('#')) return null;

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    return parsed.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Checks if a domain is on the verified allowlist (including subdomains)
 */
export function isDomainAllowlisted(urlOrDomain: string | null | undefined): boolean {
  if (!urlOrDomain) return false;
  const domain = extractDomain(urlOrDomain) || urlOrDomain.toLowerCase().replace(/^www\./, '');

  return ALLOWLISTED_DOMAINS.some((allowed) => {
    return domain === allowed || domain.endsWith(`.${allowed}`);
  });
}

/**
 * Full outbound link validation record
 */
export interface OutboundValidationResult {
  isSafe: boolean;
  isAllowlisted: boolean;
  domain: string | null;
  sanitizedUrl: string | null;
  isInternal: boolean;
}

export function validateOutboundUrl(rawUrl: string | null | undefined): OutboundValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      isSafe: false,
      isAllowlisted: false,
      domain: null,
      sanitizedUrl: null,
      isInternal: false,
    };
  }

  const trimmed = rawUrl.trim();

  // Internal relative links
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return {
      isSafe: true,
      isAllowlisted: true,
      domain: 'maha-command.gov.in',
      sanitizedUrl: trimmed,
      isInternal: true,
    };
  }

  const domain = extractDomain(trimmed);
  if (!domain) {
    return {
      isSafe: false,
      isAllowlisted: false,
      domain: null,
      sanitizedUrl: null,
      isInternal: false,
    };
  }

  const allowlisted = isDomainAllowlisted(domain);

  return {
    isSafe: true,
    isAllowlisted: allowlisted,
    domain,
    sanitizedUrl: trimmed,
    isInternal: false,
  };
}
