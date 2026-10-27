import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

describe('Minimalist Full-Screen Auth Loading Screen & Zero-Flash Auth Gating Suite', () => {
  it('1. FullScreenAuthLoader.tsx should exist and conform to minimalist accessibility and branding specs', () => {
    const loaderPath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'auth',
      'FullScreenAuthLoader.tsx'
    );
    assert.ok(fs.existsSync(loaderPath), 'FullScreenAuthLoader.tsx must exist');

    const content = fs.readFileSync(loaderPath, 'utf8');
    assert.ok(content.includes('role="status"'), 'Must have role="status"');
    assert.ok(content.includes('aria-live="polite"'), 'Must have aria-live="polite"');
    assert.ok(content.includes('aria-busy="true"'), 'Must have aria-busy="true"');
    assert.ok(content.includes('bg-white'), 'Must have pure white background (bg-white)');
    assert.ok(content.includes('GovEmblem'), 'Must render official GovEmblem');
    assert.ok(content.includes('animate-spin'), 'Must include rotating loader with animate-spin');
    assert.ok(content.includes('Maha-Command Center'), 'Must include English title');
    assert.ok(content.includes('महा-कमांड सेंटर'), 'Must include Marathi Devanagari title');
    assert.ok(
      content.includes('Directorate General of Information & Public Relations (DGIPR)'),
      'Must include DGIPR subtitle'
    );
    assert.ok(
      content.includes('महाराष्ट्र शासन • Government of Maharashtra'),
      'Must include Government of Maharashtra attribution'
    );
    assert.ok(
      content.includes('NIC • DGIPR Secure Gateway'),
      'Must include NIC • DGIPR Secure Gateway attribution'
    );
  });

  it('2. AuthGate.tsx should implement client-side route boundary with zero-flash gating', () => {
    const gatePath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'auth',
      'AuthGate.tsx'
    );
    assert.ok(fs.existsSync(gatePath), 'AuthGate.tsx must exist');

    const content = fs.readFileSync(gatePath, 'utf8');
    assert.ok(
      content.includes('isAuthenticated') &&
        content.includes('authInitialized') &&
        content.includes('isAuthLoading') &&
        content.includes('checkAuth'),
      'AuthGate must consume isAuthenticated, authInitialized, isAuthLoading, and checkAuth'
    );
    assert.ok(
      content.includes('FullScreenAuthLoader'),
      'AuthGate must render FullScreenAuthLoader'
    );
    assert.ok(
      content.includes("router.replace('/login')"),
      'AuthGate must redirect unauthenticated users to /login'
    );
    assert.ok(
      content.includes("router.replace('/')"),
      'AuthGate must redirect authenticated users away from /login to /'
    );
    assert.ok(
      content.includes('{children}'),
      'AuthGate must render children when authentication is resolved and allowed'
    );
  });

  it('3. RootLayout (src/app/layout.tsx) should wrap children in AuthGate', () => {
    const layoutPath = path.join(ROOT_DIR, 'src', 'app', 'layout.tsx');
    assert.ok(fs.existsSync(layoutPath), 'src/app/layout.tsx must exist');

    const content = fs.readFileSync(layoutPath, 'utf8');
    assert.ok(
      content.includes("import { AuthGate } from '@/components/auth/AuthGate'"),
      'RootLayout must import AuthGate'
    );
    assert.ok(
      content.includes('<AuthGate>{children}</AuthGate>') ||
        content.includes('<AuthGate>\n          {children}\n        </AuthGate>'),
      'RootLayout must wrap {children} inside AuthGate'
    );
  });

  it('4. DashboardLayout (src/components/layout/DashboardLayout.tsx) should implement top fail-safe guard', () => {
    const dashboardLayoutPath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'layout',
      'DashboardLayout.tsx'
    );
    assert.ok(fs.existsSync(dashboardLayoutPath), 'DashboardLayout.tsx must exist');

    const content = fs.readFileSync(dashboardLayoutPath, 'utf8');
    assert.ok(
      content.includes('FullScreenAuthLoader'),
      'DashboardLayout must import FullScreenAuthLoader'
    );
    assert.ok(
      content.includes('!authInitialized || !isAuthenticated'),
      'DashboardLayout must guard against rendering until authenticated'
    );
  });

  it('5. LoginScreen (src/components/portal/LoginScreen.tsx) should reverse-gate and display FullScreenAuthLoader', () => {
    const loginPath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'portal',
      'LoginScreen.tsx'
    );
    assert.ok(fs.existsSync(loginPath), 'LoginScreen.tsx must exist');

    const content = fs.readFileSync(loginPath, 'utf8');
    assert.ok(
      content.includes('FullScreenAuthLoader'),
      'LoginScreen must render FullScreenAuthLoader'
    );
    assert.ok(
      content.includes('!authInitialized || isAuthenticated'),
      'LoginScreen must prevent showing form if uninitialized or authenticated'
    );
    assert.ok(
      content.includes('Active Government Officer Session Detected'),
      'LoginScreen must include session detected message'
    );
  });

  it('6. dashboardStore.ts should declare isAuthLoading and implement deduplicated checkAuth', () => {
    const storePath = path.join(ROOT_DIR, 'src', 'stores', 'dashboardStore.ts');
    assert.ok(fs.existsSync(storePath), 'dashboardStore.ts must exist');

    const content = fs.readFileSync(storePath, 'utf8');
    assert.ok(
      content.includes('isAuthLoading: boolean'),
      'DashboardStore interface must declare isAuthLoading: boolean'
    );
    assert.ok(
      content.includes('isAuthLoading: true'),
      'useDashboardStore initial state must set isAuthLoading: true'
    );
    assert.ok(
      content.includes('checkAuthPromise'),
      'dashboardStore must define module-level checkAuthPromise for deduplication'
    );
    assert.ok(
      content.includes('verifyAuthToken'),
      'checkAuth must use verifyAuthToken as network fallback'
    );
  });
});
