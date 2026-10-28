# DGIPR Maha-Command Center: Engineering Implementation Tasks

This document translates the audit findings from [audit.md](file:///d:/proj-eureks-re/frontend/MCC/docs/audit.md) into phased, actionable engineering tasks with sub-task checkboxes, implementation details, targeted files, and acceptance criteria.

---

## Phase 1: Zero-Emoji Enforcement & Solid SVG Migration
**Objective:** Eliminate 100% of Unicode emojis across all portal screens and replace them with accessible, production-grade solid SVGs from Heroicons / Lucide.

- [ ] **Task 1.1: Replace Emojis in AI Copilot Drawer**
  - Target: `src/components/copilot/CopilotDrawer.tsx` (lines 736–748)
  - Subtasks:
    - [ ] Replace `📊` with `<ChartBarIcon className="w-3.5 h-3.5 text-blue-600" />`.
    - [ ] Replace `📍` with `<MapPinIcon className="w-3.5 h-3.5 text-rose-600" />`.
    - [ ] Replace `⚠️` with `<ExclamationTriangleIcon className="w-3.5 h-3.5 text-amber-600" />`.
    - [ ] Verify keyboard tab focus and screen reader announcements.

- [ ] **Task 1.2: Replace Emojis in Social Media Analysis Telemetry**
  - Target: `src/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis.tsx` (lines 264–317)
  - Subtasks:
    - [ ] Replace `↻` with `<ArrowPathRoundedSquareIcon className="w-3.5 h-3.5 inline mr-1 text-slate-500" />`.
    - [ ] Replace `♥` with `<HeartIcon className="w-3.5 h-3.5 inline mr-1 text-rose-500" />`.
    - [ ] Replace `👁` with `<EyeIcon className="w-3.5 h-3.5 inline mr-1 text-blue-500" />`.
    - [ ] Replace `💬` with `<ChatBubbleLeftIcon className="w-3.5 h-3.5 inline mr-1 text-indigo-500" />`.
    - [ ] Replace `▶` with `<PlayIcon className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />`.
    - [ ] Replace `👍` with `<HandThumbUpIcon className="w-3.5 h-3.5 inline mr-1 text-amber-500" />`.

- [ ] **Task 1.3: Replace Emojis in Portal Screens (Ads, Fact-Check, News, Newspaper)**
  - Targets:
    - `src/components/portal/AdvertisementsScreen.tsx` (lines 657, 667)
    - `src/components/portal/FactCheckScreen.tsx` (lines 217, 334)
    - `src/components/portal/LiveNewsScreen.tsx` (lines 644, 668)
    - `src/components/portal/NewspaperScreen.tsx` (line 1181)
  - Subtasks:
    - [ ] Replace `🖼️` and `📋` in Advertisements with `Squares2X2Icon` and `TableCellsIcon`.
    - [ ] Replace `📌` and `❌` in FactCheck with `BookmarkIcon` and `XCircleIcon`.
    - [ ] Replace `⚠️` in FactCheck forged alert banner with `ShieldExclamationIcon`.
    - [ ] Replace `🎥` and `📺` in LiveNews with `VideoCameraIcon` and `TvIcon`.
    - [ ] Replace `✂` in Newspaper with SVG scissors icon.

- [ ] **Task 1.4: Replace Emojis in PDF Export Engine**
  - Target: `src/lib/exportTelemetryPdf.ts` (lines 219, 242)
  - Subtasks:
    - [ ] Replace `🏛️` with inline vectorized Maharashtra State Emblem SVG.
    - [ ] Replace raw text checkmarks `✓` with clean SVG check indicators.

---

## Phase 2: Color Palette Harmonization & Disruption Removal
**Objective:** Eliminate the pitch-black header and sidebar disruptions; unify the interface into the Daylight Government Command Palette.

- [ ] **Task 2.1: Refactor Top Header Framing**
  - Target: `src/components/layout/Header.tsx` (line 160)
  - Subtasks:
    - [ ] Replace `bg-[#070B14]` with `bg-white/90 backdrop-blur-md border-b border-slate-200/90`.
    - [ ] Update breadcrumb text from `text-slate-400` to `text-slate-600 font-semibold`.
    - [ ] Update search bar input styling to `bg-slate-100/80 border border-slate-200 text-slate-800 placeholder-slate-400`.
    - [ ] Re-theme officer profile pill and role badges to daylight slate with crisp borders.

- [ ] **Task 2.2: Refactor Navigation Rail Sidebar**
  - Target: `src/components/layout/Sidebar.tsx` (lines 115–220)
  - Subtasks:
    - [ ] Replace dark container classes `bg-slate-950` / `bg-[#0A0F1D]` with `bg-[#F8FAFC] border-r border-slate-200/90`.
    - [ ] Update active nav link pills from `bg-amber-500/10 text-amber-400` to Apple executive blue `bg-[#EBF3FF] text-[#1D4ED8] font-bold shadow-xs border border-blue-200/80`.
    - [ ] Update inactive nav link text from `text-slate-300` to `text-slate-600 hover:text-slate-900 hover:bg-slate-100/80`.
    - [ ] Modernize group section headers with uppercase slate-400 typography.

- [ ] **Task 2.3: Establish Universal Semantic Design Tokens in Tailwind**
  - Target: `src/app/globals.css` or Tailwind theme definitions
  - Subtasks:
    - [ ] Verify `--color-gov-canvas: #F8FAFC`, `--color-gov-card: #FFFFFF`.
    - [ ] Verify `--color-gov-accent: #1D4ED8`, `--color-gov-accent-soft: #EBF3FF`.
    - [ ] Define signal tokens for alert (`#EF4444`), warning (`#F59E0B`), success (`#10B981`), info (`#3B82F6`).

---

## Phase 3: Subheading Trimming & Viewport-Locked Decongestion
**Objective:** Strip redundant subheadings, placeholder taglines, and marketing fillers to reclaim 80px–120px of vertical height.

- [ ] **Task 3.1: Trim Redundant Subheadings in Card Headers**
  - Targets:
    - `src/components/shared/MinimalCardHeader.tsx`
    - `src/components/leadership/GISMap/GISMap.tsx`
    - `src/components/dashboard/GovernmentSchemeHoardingsPanel.tsx`
    - `src/components/dashboard/CitizenServicesCard.tsx`
  - Subtasks:
    - [ ] Remove subtitle: `36 Districts, Highway Network, Water Reservoirs & Sub-District Talukas`.
    - [ ] Remove subtitle: `Nightly 02:00 IST telemetry sync with GPS verification & illumination status.`
    - [ ] Remove subtitle: `Public Service Guarantee Act • 90-Min Resolution Target`.
    - [ ] Retain card titles and status indicator badges exclusively.

- [ ] **Task 3.2: Decongest KPI Ribbon Metrics**
  - Target: `src/components/zones/KPIRibbon/KPICard.tsx`
  - Subtasks:
    - [ ] Remove filler target text beneath raw numbers (`Target: 300 (100%)`, `98.2% Verified Coverage`, `Print 85% • TV 82%...`, `0 Active in SLA`, `100% Dispatched on-time`).
    - [ ] Reallocate vertical space for embedded graphical visualizations (Phase 5).

---

## Phase 4: Button Ergonomics, Sizing & Tactile Press Feedback
**Objective:** Standardize button touch targets to minimum 36px (desktop) / 44px (touch) and eliminate wire-thin text outlines.

- [ ] **Task 4.1: Standardize Portal Action Buttons**
  - Target: `src/components/portal/AdvertisementsScreen.tsx`
  - Subtasks:
    - [ ] Update table view action buttons from `px-2.5 py-1 text-[10px]` to `px-3.5 py-1.5 min-h-[36px] text-xs font-semibold rounded-xl`.
    - [ ] Enclose bare text `✕` dismiss triggers in `w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center`.
    - [ ] Add `active:scale-95 transition-all cursor-pointer` to all interactive controls.

- [ ] **Task 4.2: Replace Wire-Thin Action Links in Dashboard Cards**
  - Target: `src/components/dashboard/CitizenServicesCard.tsx` (line 137)
  - Subtasks:
    - [ ] Replace plain text link `ml-auto font-medium hover:underline` with a styled micro-button pill (`px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold`).

- [ ] **Task 4.3: Add Smooth Sliding LayoutId Indicator for Module Tabs**
  - Target: `src/components/dashboard/ThreeColumnDashboard.tsx` (lines 195–277)
  - Subtasks:
    - [ ] Wrap view tab buttons in Framer Motion `layoutId="activeModuleTab"` pill to provide smooth sliding feedback when switching between views.

---

## Phase 5: Numerical Data Graphic Overhaul (Charts, Sparklines, Gauges)
**Objective:** Convert raw numerical metrics into rich graphical representations across the dashboard.

- [ ] **Task 5.1: Enhance KPI Cards with Visual Graphs**
  - Target: `src/components/zones/KPIRibbon/KPICard.tsx`
  - Subtasks:
    - [ ] **Press Releases**: Embed mini horizontal target completion bullet gauge (342 actual vs. 300 target).
    - [ ] **Media Placements**: Embed 7-day micro SVG trend sparkline with channel ratio badge.
    - [ ] **Net Sentiment**: Embed semi-circular diverging sentiment arc (Positive, Neutral, Negative).
    - [ ] **Crisis SLA**: Embed circular 90-minute SLA countdown ring with compliance status.
    - [ ] **Field Events**: Embed execution progress bar showing on-time dispatch rate.

- [ ] **Task 5.2: Enhance District Scorecard Bento**
  - Target: `src/components/dashboard/DistrictScorecardBento.tsx`
  - Subtasks:
    - [ ] Convert 4-pillar numerical breakdown (Speed, Volume, Sentiment, Crisis SLA) into horizontal stacked progress bars.
    - [ ] Add circular radial score gauge for composite CPI.

- [ ] **Task 5.3: Enhance Citizen Services Card**
  - Target: `src/components/dashboard/CitizenServicesCard.tsx`
  - Subtasks:
    - [ ] Replace 4-cell plain text summary (`TOTAL`, `ACTIVE`, `AFFECTED`, `RESOLVED`) with a 4-segment colored proportional bar.

---

## Phase 6: Universal "i" Info Tooltip Popovers & Formula Documentation
**Objective:** Equip every executive metric and term with an interactive "i" icon button providing definition, formula, and source details.

- [ ] **Task 6.1: Build Universal `<InfoTooltip>` Component**
  - Target: `src/components/shared/InfoTooltip.tsx`
  - Subtasks:
    - [ ] Implement 16x16px circular button trigger (`w-4 h-4 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-400 hover:text-blue-600 flex items-center justify-center text-[10px] font-bold`).
    - [ ] Connect to `src/data/metricDefinitions.ts` for bilingual name, definition, formula, source, and update interval.
    - [ ] Style Radix Popover with Apple glass styling (`bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-2xl p-3 max-w-xs`).

- [ ] **Task 6.2: Integrate `<InfoTooltip>` Across Key Cards**
  - Subtasks:
    - [ ] Mount on KPI Cards (CPI, TAT, Net Sentiment, Crisis SLA).
    - [ ] Mount on District Leaderboard headers.
    - [ ] Mount on Analytical Dock charts.
    - [ ] Mount on Cesium Map layer switcher pills.

---

## Phase 7: Backend API Routes & Ingestion Pipeline
**Objective:** Eliminate hardcoded data imports by establishing dedicated Next.js API route handlers with unified client fetchers.

- [ ] **Task 7.1: Implement Missing Next.js API Route Handlers**
  - Targets:
    - `src/app/api/v1/citizen-services/route.ts` (Grievances & SLA records)
    - `src/app/api/v1/attendance/route.ts` (Biometric attendance telemetry)
    - `src/app/api/v1/advertisements/route.ts` (Release orders & campaign budgets)
    - `src/app/api/v1/publications/route.ts` (Lokrajya & print circulation)
    - `src/app/api/v1/live-events/route.ts` (Live video feeds & transcripts)
    - `src/app/api/v1/clippings/route.ts` (Media clippings & sentiment tags)
  - Subtasks:
    - [ ] Implement `GET` handlers with query filtering (`division`, `district`, `period`, `limit`).
    - [ ] Enforce schema validation and proper cache-control headers (`Cache-Control: s-maxage=15, stale-while-revalidate=45`).

- [ ] **Task 7.2: Refactor Components to Fetch Data via Store/API**
  - Subtasks:
    - [ ] Update `CitizenServicesCard.tsx` to fetch via `/api/v1/citizen-services`.
    - [ ] Update `AttendanceScreen.tsx` to fetch via `/api/v1/attendance`.
    - [ ] Update `AdvertisementsScreen.tsx` to fetch via `/api/v1/advertisements`.
    - [ ] Update `PublicationsScreen.tsx` to fetch via `/api/v1/publications`.
    - [ ] Update `LiveEventsScreen.tsx` to fetch via `/api/v1/live-events`.
    - [ ] Update `MediaScreen.tsx` to fetch via `/api/v1/clippings`.

---

## Phase 8: Modular Calculations Architecture
**Objective:** Decouple `calculations.tsx` into single-responsibility, pure-math calculation modules.

- [ ] **Task 8.1: Create Dedicated Math & Processing Modules**
  - Target directory: `src/lib/calculations/`
  - Subtasks:
    - [ ] `src/lib/calculations/metricsEngine.ts`: Pure mathematical formulas (CPI, Speed Score, Volume Score, Sentiment Index, Crisis Resolution Rate). Zero JSX dependencies.
    - [ ] `src/lib/calculations/statewideAggregates.ts`: Aggregation across 36 districts, regional rollups, ranking algorithms, Top/Lower matrix.
    - [ ] `src/lib/calculations/crisisProcessing.ts`: Incident SLA compliance, triage escalation, 90-minute window analytics.
    - [ ] `src/lib/calculations/mediaProcessing.ts`: Ingestion stream normalization, OCR parsing, broadcast speed ratings.
    - [ ] `src/lib/calculations/attendanceProcessing.ts`: Biometric attendance percentage, punctuality score, shift adherence.
    - [ ] `src/lib/calculations/hooks.ts`: React hooks (`useDashboardCalculations`, `useDistrictScorecard`).

- [ ] **Task 8.2: Refactor `calculations.tsx` as Unified Facade**
  - Target: `src/lib/calculations.tsx`
  - Subtasks:
    - [ ] Re-export all sub-modules to preserve backward compatibility with existing tests and imports.

---

## Phase 9: Multi-Scale Responsiveness & Zoom Optimization
**Objective:** Ensure flawless layout integrity and zero unconstrained scroll across 100%, 125%, 150%, and 175% display zoom levels.

- [ ] **Task 9.1: Replace Rigid Pixel Heights with Fluid Container Budgeting**
  - Target: `src/components/dashboard/ThreeColumnDashboard.tsx`
  - Subtasks:
    - [ ] Replace `h-[520px]`, `h-[585px]`, `lg:h-[640px]` with responsive container classes (`h-[calc(100vh-340px)] min-h-[420px]`).
    - [ ] Make the Analytical Dock responsive to viewport height constraints.

- [ ] **Task 9.2: Implement Auto-Collapsing Sidebar for Narrow Desktop Viewports**
  - Target: `src/components/layout/DashboardLayout.tsx`
  - Subtasks:
    - [ ] Add viewport width breakpoint listener: automatically collapse sidebar to 64px icon-only rail when screen width is `< 1440px` (or at 150%/175% zoom).
    - [ ] Prevent horizontal overflow on top Global Context Bar.

---

## Phase 10: Complete Loader Architecture
**Objective:** Provide instant, feedback-rich loading states across all routes, cards, and asynchronous filter transitions.

- [ ] **Task 10.1: Add Missing Route Boundary Loaders**
  - Targets:
    - [ ] `src/app/attendance/loading.tsx`
    - [ ] `src/app/advertisements/loading.tsx`
    - [ ] `src/app/publications/loading.tsx`
    - [ ] `src/app/live-events/loading.tsx`
  - Subtasks:
    - [ ] Create skeleton components matching the respective screen layouts to eliminate layout shift during route transitions.

- [ ] **Task 10.2: Implement Card-Level Micro-Shimmers on Filter Changes**
  - Target: `src/components/zones/KPIRibbon/KPIRibbon.tsx`
  - Subtasks:
    - [ ] Add subtle opacity pulse / shimmer animation when `isLoadingData` is true during division or district filter switches.

---

## Phase 11: Extra / Orphaned Component Decommissioning
**Objective:** Clean up unused dashboard components while retaining `MainDashboard.tsx` exclusively as the backup layout.

- [ ] **Task 11.1: Decommission Dead Dashboard Components**
  - Target: `src/components/dashboard/`
  - Subtasks:
    - [ ] Archive / remove `CrisisOperationsColumn.tsx`.
    - [ ] Archive / remove `DistrictOperationsColumn.tsx`.
    - [ ] Archive / remove `EurekaDraggableDeck.tsx`.
    - [ ] Archive / remove `ExecutiveIntelligenceSummary.tsx`.
    - [ ] Archive / remove `LiveNewsTicker.tsx`.
    - [ ] Archive / remove `MaharashtraGISDeck.tsx`.
    - [ ] Archive / remove `OperationalAnalyticsDeck.tsx`.
    - [ ] Archive / remove `OperationsWorkspace.tsx`.
    - [ ] Archive / remove `SocialSentimentPulse.tsx`.
    - [ ] Confirm `MainDashboard.tsx` remains fully intact as the backup layout.

---

## Phase 12: Comprehensive Verification, Testing & QA Gate
**Objective:** Validate all 186 unit/integration tests, confirm clean TypeScript compilation, and verify production build.

- [ ] **Task 12.1: TypeScript Validation**
  - [ ] Run `npx tsc --noEmit` and confirm 0 errors.

- [ ] **Task 12.2: Test Suite Verification**
  - [ ] Run `npm test` and confirm all 186 tests in 58 suites pass cleanly.

- [ ] **Task 12.3: Production Build Gate**
  - [ ] Run `npm run build` and verify that all 43 static and dynamic routes compile with exit code 0.

- [ ] **Task 12.4: Multi-Scale Visual Inspection**
  - [ ] Capture Edge headless screenshots at 100%, 125%, 150%, and 175% to confirm zero overflow and pristine visual aesthetics.
