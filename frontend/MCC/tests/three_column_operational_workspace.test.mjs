import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

describe('3-Column Operational Workspace Refactoring & Decongestion Suite', () => {
  describe('1. Responsive Grid Architecture (ThreeColumnDashboard.tsx)', () => {
    const dashboardPath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'dashboard',
      'ThreeColumnDashboard.tsx'
    );

    it('ThreeColumnDashboard.tsx should exist', () => {
      assert.ok(fs.existsSync(dashboardPath), 'ThreeColumnDashboard.tsx must exist');
    });

    it('should implement responsive CSS grid container with gap-4 and items-start', () => {
      const content = fs.readFileSync(dashboardPath, 'utf8');
      assert.ok(
        content.includes('grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full'),
        'Must use responsive CSS grid container grid-cols-1 lg:grid-cols-12 gap-4 items-start'
      );
    });

    it('should implement mobile-first stacking with CSS grid visual ordering', () => {
      const content = fs.readFileSync(dashboardPath, 'utf8');
      // Col 1: Grievances (order-2 on mobile, order-1 on desktop)
      assert.ok(
        content.includes('order-2 lg:order-1'),
        'Grievances column must be order-2 on mobile and order-1 on desktop'
      );
      // Col 2: GIS Map (order-1 on mobile, order-2 on desktop)
      assert.ok(
        content.includes('order-1 lg:order-2'),
        'GIS Map column must be order-1 on mobile and order-2 on desktop'
      );
      // Col 3: Crisis + Social (order-3 on mobile, order-3 on desktop)
      assert.ok(
        content.includes('order-3 lg:order-3'),
        'Crisis + Social column must be order-3 across all breakpoints'
      );
    });

    it('should implement desktop breakpoint allocation and 640px height budget', () => {
      const content = fs.readFileSync(dashboardPath, 'utf8');
      assert.ok(
        content.includes('lg:col-span-4 xl:col-span-3 xl:min-w-[310px] lg:h-[640px]'),
        'Col 1 must allocate lg:col-span-4, xl:col-span-3, and lg:h-[640px]'
      );
      assert.ok(
        content.includes('lg:col-span-5 xl:col-span-6 lg:h-[640px]'),
        'Col 2 must allocate lg:col-span-5, xl:col-span-6, and lg:h-[640px]'
      );
      assert.ok(
        content.includes('lg:col-span-3 xl:col-span-3 xl:min-w-[310px] lg:h-[640px]'),
        'Col 3 must allocate lg:col-span-3, xl:col-span-3, and lg:h-[640px]'
      );
    });
  });

  describe('2. Above-Grid KPI Empty State Alert Bar (KPIRibbon.tsx)', () => {
    const kpiPath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'zones',
      'KPIRibbon',
      'KPIRibbon.tsx'
    );

    it('should collapse empty district state into slim h-11 single-line alert bar', () => {
      const content = fs.readFileSync(kpiPath, 'utf8');
      assert.ok(
        content.includes('h-11 px-4 py-2 flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 w-full'),
        'Empty state must use compact h-11 alert bar'
      );
      assert.ok(
        content.includes('No telemetry ingested for this district yet.'),
        'Empty state must inform user cleanly without 160px placeholder'
      );
      assert.ok(
        content.includes('Select an active reporting district above to inspect KPIs.'),
        'Empty state must provide guidance to select an active reporting district'
      );
    });
  });

  describe('3. Column 1: Grievances & SLA (CitizenServicesCard.tsx)', () => {
    const cardPath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'dashboard',
      'CitizenServicesCard.tsx'
    );

    it('should display "Grievances & SLA" title with 94.2% SLA pill', () => {
      const content = fs.readFileSync(cardPath, 'utf8');
      assert.ok(
        content.includes("isMr ? 'तक्रारी व हमी कायदा (SLA)' : 'Grievances & SLA'"),
        'Header title must be Grievances & SLA'
      );
      assert.ok(
        content.includes('94.2%'),
        'SLA emerald pill must be present'
      );
    });

    it('should render compact 4-cell metric summary bar without wrapping sub-words', () => {
      const content = fs.readFileSync(cardPath, 'utf8');
      assert.ok(
        content.includes('grid grid-cols-4 gap-1.5 p-2 bg-slate-50 rounded-lg border-b border-slate-100 text-center'),
        'Summary strip must use compact 4-cell metric grid'
      );
      assert.ok(content.includes("'TOTAL'"), 'Must contain TOTAL label');
      assert.ok(content.includes("'ACTIVE'"), 'Must contain ACTIVE label');
      assert.ok(content.includes("'AFFECTED'"), 'Must contain AFFECTED label');
      assert.ok(content.includes("'RESOLVED'"), 'Must contain RESOLVED label');
      assert.ok(
        content.includes("totalAffected >= 1000 ? `${(totalAffected / 1000).toFixed(1)}K`"),
        'Must format thousands with K (13.4K) to prevent wrapping'
      );
    });

    it('should fix card collision bug with shortened ticket ID and ml-auto action link', () => {
      const content = fs.readFileSync(cardPath, 'utf8');
      assert.ok(
        content.includes("shortTicketNumber = item.ticketNumber.replace"),
        'Ticket number must be shortened to prevent overflow'
      );
      assert.ok(
        content.includes('ml-auto font-medium hover:underline'),
        'Right action link must be ml-auto and clean to prevent overlap with affected count'
      );
    });
  });

  describe('4. Column 2: Maharashtra GIS Optimization (GISMap.tsx)', () => {
    const gisPath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'leadership',
      'GISMap',
      'GISMap.tsx'
    );

    it('should display "Maharashtra GIS" title and debloated header', () => {
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(
        content.includes("language === 'mr'\n              ? 'महाराष्ट्र जीआयएस (GIS)'\n              : 'Maharashtra GIS'"),
        'Header title must be Maharashtra GIS'
      );
      assert.ok(
        !content.includes('36 Districts (#1 to #36)'),
        'Redundant 36 districts pill must be removed from header toolbar'
      );
    });

    it('should replace stacked pill ribbons with compact 2-select filter bar', () => {
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(
        content.includes('grid grid-cols-12 gap-2 items-center') ||
        content.includes('flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs'),
        'Must use compact 2-select filter bar'
      );
      assert.ok(content.includes('selectedDivisionFilter'), 'Must include division dropdown');
      assert.ok(content.includes('selectedId || \'\''), 'Must include district select');
    });

    it('should replace floating layer buttons with top-right [ Layers (n) ▾ ] popover', () => {
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(
        content.includes('absolute top-3 right-3 z-20'),
        'Layers popover must be positioned in top-right corner'
      );
      assert.ok(
        content.includes("({activeLayersCount})"),
        'Layers button must display active layers count'
      );
      assert.ok(
        content.includes('isLayersOpen && ('),
        'Layers dropdown menu must toggle cleanly via isLayersOpen'
      );
    });

    it('should include SVG paintOrder stroke fill or aria-hidden on SVG halo text', () => {
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(
        content.includes("style={{ paintOrder: 'stroke fill' }}") ||
        content.includes('aria-hidden="true"\n                    pointerEvents="none"'),
        'SVG halo outline text must have paintOrder or aria-hidden'
      );
    });
  });

  describe('5. Column 3: Crisis Monitor & Social Pulse', () => {
    const emergencyPath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'zones',
      'EmergencyAlert',
      'EmergencyAlert.tsx'
    );
    const socialPath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'leadership',
      'SocialMediaAnalysis',
      'SocialMediaAnalysis.tsx'
    );

    it('EmergencyAlert should display "Crisis Monitor" and compact 44px bar when 0 active', () => {
      const content = fs.readFileSync(emergencyPath, 'utf8');
      assert.ok(
        content.includes("language === 'mr' ? 'संकट संनियंत्रण कक्ष' : 'Crisis Monitor'"),
        'Must display Crisis Monitor title'
      );
      assert.ok(
        content.includes("scopeIncidents.length === 0 && !isCrisisRoute"),
        'Must detect 0 active incidents'
      );
      assert.ok(
        content.includes("0 Active (Konkan)"),
        'Must render 0 Active status indicator'
      );
    });

    it('SocialMediaAnalysis should display "Social Pulse", compact tabs and clean metric stats', () => {
      const content = fs.readFileSync(socialPath, 'utf8');
      assert.ok(
        content.includes("language === \"mr\" ? \"समाज माध्यम नाडी (Social Pulse)\" : \"Social Pulse\""),
        'Must display Social Pulse title'
      );
      assert.ok(
        content.includes("<span>Live</span>"),
        'Must display compact Live status indicator'
      );
      assert.ok(
        content.includes("<span>API Active</span>"),
        'Must display minimalist sticky API Active divider'
      );
      assert.ok(
        content.includes("↻ 1.4K • ♥ 6.2K"),
        'Must format metrics cleanly with symbols'
      );
    });
  });
});
