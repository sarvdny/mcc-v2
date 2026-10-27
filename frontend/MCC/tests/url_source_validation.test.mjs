import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractDomain,
  isDomainAllowlisted,
  validateOutboundUrl,
  ALLOWLISTED_DOMAINS,
} from '../src/lib/domainAllowlist.ts';
import { isSafeUrl, sanitizeUrl } from '../src/lib/urlSecurity.ts';

describe('Outbound URL Security & Source Allowlist Suite', () => {
  test('should extract clean domain hostname from various URL structures', () => {
    assert.strictEqual(extractDomain('https://www.maharashtra.gov.in/portal'), 'maharashtra.gov.in');
    assert.strictEqual(extractDomain('https://pib.gov.in/PressReleasePage.aspx?PRID=1829'), 'pib.gov.in');
    assert.strictEqual(extractDomain('http://lokmat.com/maharashtra/mumbai'), 'lokmat.com');
    assert.strictEqual(extractDomain('https://x.com/MahaDGIPR'), 'x.com');
    assert.strictEqual(extractDomain('/districts/thane'), null);
    assert.strictEqual(extractDomain(''), null);
    assert.strictEqual(extractDomain(null), null);
  });

  test('should accurately identify allowlisted government and media domains', () => {
    assert.strictEqual(isDomainAllowlisted('maharashtra.gov.in'), true);
    assert.strictEqual(isDomainAllowlisted('https://dgipr.maharashtra.gov.in'), true);
    assert.strictEqual(isDomainAllowlisted('https://pib.gov.in'), true);
    assert.strictEqual(isDomainAllowlisted('https://esakal.com/pune-news'), true);
    assert.strictEqual(isDomainAllowlisted('https://loksatta.com'), true);
    assert.strictEqual(isDomainAllowlisted('https://youtube.com/c/MahaGov'), true);
  });

  test('should reject or flag unknown external domains as unverified', () => {
    assert.strictEqual(isDomainAllowlisted('https://unverified-gossip-blog.xyz'), false);
    assert.strictEqual(isDomainAllowlisted('https://phishing-site.ru'), false);
    assert.strictEqual(isDomainAllowlisted('https://fake-maha-scheme.top'), false);
  });

  test('should validate outbound URLs returning full structured metadata', () => {
    // Internal link
    const internal = validateOutboundUrl('/crisis');
    assert.strictEqual(internal.isSafe, true);
    assert.strictEqual(internal.isInternal, true);
    assert.strictEqual(internal.isAllowlisted, true);

    // Verified external link
    const verified = validateOutboundUrl('https://pib.gov.in/release/1234');
    assert.strictEqual(verified.isSafe, true);
    assert.strictEqual(verified.isInternal, false);
    assert.strictEqual(verified.isAllowlisted, true);
    assert.strictEqual(verified.domain, 'pib.gov.in');

    // Unknown external link (needs confirmation modal)
    const unknown = validateOutboundUrl('https://random-forum.net/post/42');
    assert.strictEqual(unknown.isSafe, true);
    assert.strictEqual(unknown.isInternal, false);
    assert.strictEqual(unknown.isAllowlisted, false);
    assert.strictEqual(unknown.domain, 'random-forum.net');

    // Malicious link
    const malicious = validateOutboundUrl('javascript:alert(1)');
    assert.strictEqual(malicious.isSafe, false);
    assert.strictEqual(malicious.sanitizedUrl, null);
  });

  test('should preserve existing malicious URL sanitation', () => {
    assert.strictEqual(isSafeUrl('javascript:void(0)'), false);
    assert.strictEqual(isSafeUrl('data:text/html;base64,PHNjcmlwdD4='), false);
    assert.strictEqual(isSafeUrl('//evilsite.com'), false);
    assert.strictEqual(sanitizeUrl('https://valid.gov.in'), 'https://valid.gov.in');
    assert.strictEqual(sanitizeUrl('javascript:bad()'), null);
  });
});
