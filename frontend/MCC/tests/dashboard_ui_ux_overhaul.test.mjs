import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

describe('Maha-Command Center: Complete Dashboard UI/UX Overhaul Test Suite', () => {
  describe('1. Top Command Header & Navigation', () => {
    const headerPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'Header.tsx');
    const searchPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'GlobalSearchBar.tsx');
    const sidebarPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'Sidebar.tsx');

    it('Global search bar must have dedicated desktop width min-w-[200px] and max-w-md', () => {
      const content = fs.readFileSync(headerPath, 'utf8');
      assert.ok(
        content.includes('min-w-[200px]') && content.includes('max-w-md'),
        'Search bar container must provide min-w-[200px] and max-w-md'
      );
    });

    it('User profile pill must remove rigid max-w-[140px] cap with shrink-0 min-w-fit pr-2', () => {
      const content = fs.readFileSync(headerPath, 'utf8');
      assert.ok(
        content.includes('shrink-0 min-w-fit pr-2'),
        'Profile pill container must use shrink-0 min-w-fit pr-2'
      );
      assert.ok(
        content.includes('tabular-nums whitespace-nowrap'),
        'Tier designation must use whitespace-nowrap and tabular-nums'
      );
    });

    it('GlobalSearchBar must display ⌘K shortcut badge on desktop', () => {
      const content = fs.readFileSync(searchPath, 'utf8');
      assert.ok(
        content.includes('⌘K'),
        'Global search input must display ⌘K badge'
      );
    });

    it('Sidebar collapse toggle must be docked in bottom rail footer', () => {
      const content = fs.readFileSync(sidebarPath, 'utf8');
      assert.ok(
        content.includes('Bottom Rail Footer: Docked Collapse Menu Toggle'),
        'Sidebar collapse button must be docked in bottom rail footer'
      );
      assert.ok(
        content.includes('border-t border-slate-800/80 shrink-0 bg-slate-900/60'),
        'Bottom rail footer must have dedicated styling docked at base'
      );
    });
  });

  describe('2. State Operations Bar & Real-time Ticker', () => {
    const toolbarPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'DashboardToolbar.tsx');
    const tickerPath = path.join(ROOT_DIR, 'src', 'components', 'dashboard', 'BreakingNewsTicker.tsx');

    it('DashboardToolbar must centralize Division, District with numbering, and Timeframe filters', () => {
      const content = fs.readFileSync(toolbarPath, 'utf8');
      assert.ok(
        content.includes('selectedDivision'),
        'Must support division scope selection'
      );
      assert.ok(
        content.includes('DISTRICT_NUMBERS'),
        'Must prefix district numbers (e.g. #4 Mumbai Suburban)'
      );
      assert.ok(
        content.includes('Division: Konkan'),
        'Must provide Konkan division option'
      );
    });

    it('BreakingNewsTicker must apply smooth CSS horizontal fade mask', () => {
      const content = fs.readFileSync(tickerPath, 'utf8');
      assert.ok(
        content.includes('[mask-image:linear-gradient(to_right,transparent_0%,black_3%,black_92%,transparent_100%)]'),
        'Ticker must apply CSS mask-image fade to edges'
      );
    });
  });

  describe('3. KPI Ribbon & Bento Card Uncluttering', () => {
    const kpiRibbonPath = path.join(ROOT_DIR, 'src', 'components', 'zones', 'KPIRibbon', 'KPIRibbon.tsx');
    const kpiCardPath = path.join(ROOT_DIR, 'src', 'components', 'zones', 'KPIRibbon', 'KPICard.tsx');

    it('KPIRibbon must host unified Last synced badge in section header', () => {
      const content = fs.readFileSync(kpiRibbonPath, 'utf8');
      assert.ok(
        content.includes('Last synced') || content.includes('शेवटचे अद्यतन'),
        'Ribbon header must display unified Last synced timestamp'
      );
    });

    it('KPIRibbon must pass clean targetText without appending Computed timestamp', () => {
      const content = fs.readFileSync(kpiRibbonPath, 'utf8');
      assert.ok(
        content.includes('targetText={reactiveMetrics.sentimentTarget}'),
        'Sentiment KPI must pass clean sentimentTarget'
      );
      assert.ok(
        content.includes('targetText={reactiveMetrics.misinfoTarget}'),
        'Misinfo KPI must pass clean misinfoTarget'
      );
    });

    it('KPICard must remove max-w-[180px] so target text displays without truncation', () => {
      const content = fs.readFileSync(kpiCardPath, 'utf8');
      assert.ok(
        !content.includes('max-w-[180px]'),
        'KPICard footer must not cap target text with max-w-[180px]'
      );
      assert.ok(
        content.includes('min-w-0 flex-1 mr-2'),
        'Target text must take full remaining space min-w-0 flex-1'
      );
    });
  });

  describe('4. Left Column: Grievances & SLA (CitizenServicesCard.tsx)', () => {
    const cardPath = path.join(ROOT_DIR, 'src', 'components', 'dashboard', 'CitizenServicesCard.tsx');

    it('Category filter pills must wrap cleanly so all 5 pills are visible', () => {
      const content = fs.readFileSync(cardPath, 'utf8');
      assert.ok(
        content.includes('flex flex-wrap items-center gap-1.5'),
        'Filter pills must use flex-wrap gap-1.5 to prevent horizontal clipping'
      );
    });

    it('Grievance list must provide padding clearance to prevent first card scroll-underlap', () => {
      const content = fs.readFileSync(cardPath, 'utf8');
      assert.ok(
        content.includes('overflow-y-auto flex-1 min-h-0 p-2.5 pt-3 space-y-2.5'),
        'List must use pt-3 space-y-2.5 to prevent slicing under filter bar'
      );
    });

    it('Card footer must enforce whitespace-nowrap shrink-0 on timeline link', () => {
      const content = fs.readFileSync(cardPath, 'utf8');
      assert.ok(
        content.includes('whitespace-nowrap shrink-0 ml-2'),
        'Footer link must not wrap arrow onto new line'
      );
    });
  });

  describe('5. Center Column: Maharashtra State GIS & Bento Scorecard (GISMap.tsx)', () => {
    const gisPath = path.join(ROOT_DIR, 'src', 'components', 'leadership', 'GISMap', 'GISMap.tsx');

    it('GIS Map SVG canvas must maintain min-h-[300px] sm:min-h-[360px] dedicated footprint', () => {
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(
        content.includes('min-h-[300px] sm:min-h-[360px]'),
        'Map canvas must have dedicated min-h-[300px] sm:min-h-[360px]'
      );
      assert.ok(
        content.includes('shrink-0'),
        'Map canvas must be shrink-0 so it is not crushed by scorecard'
      );
    });

    it('District Scorecard must implement an Apple Bento 2x2 Grid (grid-cols-1 sm:grid-cols-2 gap-3)', () => {
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(
        content.includes('grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs items-stretch'),
        'District scorecard must use 2x2 Bento Grid'
      );
    });

    it('Headquarters and Literacy must be moved up into District Header subtitle', () => {
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(
        content.includes('HQ: {inspectedDetails?.quickStats.headquarters || inspected.name} • Literacy:'),
        'HQ and Literacy must be in district header'
      );
    });

    it('Box 3 must separate Notices and Resolved into dedicated sub-columns to prevent collision', () => {
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(
        content.includes('grid grid-cols-2 gap-2 mt-1'),
        'Notices and Resolution must be rendered in dedicated sub-grid'
      );
    });

    it('Box 4 must support singular/plural grammar for Hoarding', () => {
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(
        content.includes("(inspectedDetails?.hoardings?.length || 0) === 1 ? 'Hoarding' : 'Hoardings'"),
        'Must format 1 Hoarding vs N Hoardings correctly'
      );
    });

    it('4-Pillar Quality Scorecard must stack label on top and score below with tabular-nums', () => {
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(
        content.includes('1. Volume</span>\n                <span className="font-bold font-mono text-xs text-slate-900 tabular-nums">'),
        'Pillar 1 must stack label and score with tabular-nums'
      );
      assert.ok(
        content.includes('4. Crisis SLA Resolution</span>\n                <span className="font-bold font-mono text-xs text-slate-900 tabular-nums">'),
        'Pillar 4 must stack label and score with tabular-nums'
      );
    });
  });

  describe('6. Right Column: Crisis Monitor & Social Pulse', () => {
    const socialPath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'leadership',
      'SocialMediaAnalysis',
      'SocialMediaAnalysis.tsx'
    );

    it('Stream channel headers must be shrink-0 siblings with scroll isolation', () => {
      const content = fs.readFileSync(socialPath, 'utf8');
      assert.ok(
        content.includes('border-b border-slate-100 mb-2 shrink-0'),
        'Stream headers must be shrink-0 siblings'
      );
      assert.ok(
        content.includes('space-y-2.5 overflow-y-auto max-h-[240px] pr-1 pt-1 scroll-pt-1') ||
        content.includes('space-y-2.5 overflow-y-auto max-h-[240px] pr-1 pt-0.5 scroll-pt-1'),
        'Stream feed must provide pt-1 scroll-pt-1 so first post is completely visible at scroll top 0'
      );
    });
  });

  describe('7. Part 1-3: Comprehensive Spatial Rearrangement, Bug Elimination & Visual Polish', () => {
    const layoutPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'DashboardLayout.tsx');
    const dashboardPath = path.join(ROOT_DIR, 'src', 'components', 'dashboard', 'ThreeColumnDashboard.tsx');
    const tickerPath = path.join(ROOT_DIR, 'src', 'components', 'dashboard', 'BreakingNewsTicker.tsx');
    const emergencyPath = path.join(ROOT_DIR, 'src', 'components', 'zones', 'EmergencyAlert', 'EmergencyAlert.tsx');
    const gisPath = path.join(ROOT_DIR, 'src', 'components', 'leadership', 'GISMap', 'GISMap.tsx');
    const citizenPath = path.join(ROOT_DIR, 'src', 'components', 'dashboard', 'CitizenServicesCard.tsx');
    const scorePath = path.join(ROOT_DIR, 'src', 'components', 'zones', 'ScoreDecomposition', 'ScoreDecomposition.tsx');
    const searchPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'GlobalSearchBar.tsx');

    it('DashboardLayout should eliminate Bar 1 & Bar 2 clutter on main dashboard', () => {
      const content = fs.readFileSync(layoutPath, 'utf8');
      assert.ok(!content.includes('LiveNewsTicker'), 'LiveNewsTicker marquee must be removed from DashboardLayout');
      assert.ok(
        content.includes("pathname !== '/' &&\n    pathname !== '/dashboard'"),
        'DashboardToolbar must be hidden on / and /dashboard routes'
      );
    });

    it('ThreeColumnDashboard Tier 1 must unify Department Identity, View Switcher & Global Filters', () => {
      const content = fs.readFileSync(dashboardPath, 'utf8');
      assert.ok(content.includes('TIER 1: UNIFIED CONTEXT & NAVIGATION BAR'), 'Tier 1 comment header must exist');
      assert.ok(content.includes('MH | DGIPR Command Center • Supervision: DG Desk'), 'Title must be unified');
      assert.ok(content.includes('selectedDivision'), 'Tier 1 must include division filter');
      assert.ok(content.includes('selectedDistrictId'), 'Tier 1 must include district filter');
      assert.ok(content.includes('selectedPeriod'), 'Tier 1 must include timeframe filter');
      assert.ok(content.includes('handleExport'), 'Tier 1 must include export action');
      assert.ok(content.includes('GIS Map & Command'), 'View switcher must include GIS Map & Command tab');
    });

    it('BreakingNewsTicker Tier 2 must render 40px ribbon with semantic inline pills', () => {
      const content = fs.readFileSync(tickerPath, 'utf8');
      assert.ok(content.includes('h-10'), 'Ticker must have 40px (h-10) height');
      assert.ok(content.includes('BREAKING • RED'), 'Ticker must render [BREAKING • RED] pill');
      assert.ok(content.includes('ALERT • AMBER'), 'Ticker must render [ALERT • AMBER] pill');
      assert.ok(content.includes('NOTICE • BLUE'), 'Ticker must render [NOTICE • BLUE] pill');
      assert.ok(content.includes('[animation-play-state:paused]'), 'Ticker must support pause on hover');
    });

    it('ThreeColumnDashboard View all must not render duplicate BreakingNewsTicker below GIS map', () => {
      const content = fs.readFileSync(dashboardPath, 'utf8');
      // In View all, Column 2 must contain GISMap, GovernmentSchemeHoardingsPanel, and DistrictLeaderboard without BreakingNewsTicker
      const viewAllSection = content.slice(content.indexOf("{activeView === 'all' && ("));
      assert.ok(
        !viewAllSection.includes('<BreakingNewsTicker />'),
        'View all must not have duplicate BreakingNewsTicker below GISMap'
      );
    });

    it('Bento Workspace View A must dock EmergencyAlert in Column 1 above CitizenServicesCard', () => {
      const content = fs.readFileSync(dashboardPath, 'utf8');
      const viewASection = content.slice(
        content.indexOf("{activeView === 'overview' && ("),
        content.indexOf("{activeView === 'performance' && (")
      );
      const alertIdx = viewASection.indexOf('<EmergencyAlert />');
      const citizenIdx = viewASection.indexOf('<CitizenServicesCard />');
      const gisIdx = viewASection.indexOf('<GISMap />');
      const socialIdx = viewASection.indexOf('<SocialMediaAnalysis />');

      assert.ok(alertIdx !== -1, 'EmergencyAlert must be in View A');
      assert.ok(citizenIdx !== -1, 'CitizenServicesCard must be in View A');
      assert.ok(alertIdx < citizenIdx, 'EmergencyAlert must be docked above CitizenServicesCard');
      assert.ok(citizenIdx < gisIdx, 'Column 1 must precede Column 2');
      assert.ok(gisIdx < socialIdx, 'Column 2 must precede Column 3');
    });

    it('EmergencyAlert collapsed state must use 2-row anti-collision layout', () => {
      const content = fs.readFileSync(emergencyPath, 'utf8');
      assert.ok(content.includes('flex flex-col gap-1.5'), 'Collapsed alert must use flex-col');
      assert.ok(content.includes('line-clamp-2'), 'Summary title must use line-clamp-2');
      assert.ok(content.includes('primaryIncident.id'), 'Must display incident ID');
    });

    it('GISMap must implement responsive grid-cols-12 filter bar, single SVG text, and pulsing centroid beacon', () => {
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(content.includes('grid grid-cols-12 gap-2 items-center'), 'Filter bar must use grid-cols-12');
      assert.ok(content.includes("style={{ paintOrder: 'stroke fill' }}"), 'SVG labels must use paintOrder stroke fill');
      assert.ok(content.includes('animate-ping'), 'Selected district centroid must have pulsing beacon ring');
      assert.ok(content.includes('/ 35'), 'Volume score denominator must be / 35');
      assert.ok(content.includes('/ 15'), 'Crisis score denominator must be / 15');
    });

    it('CitizenServicesCard must place Town Name on Row 1 and Ticket ID on Row 3 to prevent truncation', () => {
      const content = fs.readFileSync(citizenPath, 'utf8');
      assert.ok(
        content.includes('Item Row 1: Status Dot + Town & District Name on left; Compact Status on right'),
        'Row 1 must be dedicated to Town & District name'
      );
      assert.ok(
        content.includes('Item Row 3: Category Pill + Ticket ID + Numeric Count on left; Action Link on right'),
        'Row 3 must host Category Pill and Ticket ID'
      );
    });

    it('ScoreDecomposition must format point deltas with toFixed(2) and cap scores accurately', () => {
      const content = fs.readFileSync(scorePath, 'utf8');
      assert.ok(content.includes('Number((35 - safeVolume).toFixed(2))'), 'Volume gap must use toFixed(2)');
      assert.ok(content.includes('Number((25 - safeSentiment).toFixed(2))'), 'Sentiment gap must use toFixed(2)');
      assert.ok(content.includes('Number((15 - safeCrisis).toFixed(2))'), 'Crisis gap must use toFixed(2)');
    });

    it('GlobalSearchBar must prevent ⌘K badge collision with pr-14 truncate on input', () => {
      const content = fs.readFileSync(searchPath, 'utf8');
      assert.ok(content.includes('pr-14 truncate'), 'Input must have pr-14 truncate');
    });
  });
});
