# DGIPR Maha-Command Center: Engineering Implementation Tasks

This document translates the audit findings from [audit.md](file:///d:/proj-eureks-re/frontend/MCC/docs/audit.md) into phased, actionable engineering tasks with sub-task checkboxes, implementation details, targeted files, and acceptance criteria.

---

## Phase 1: Zero-Emoji Enforcement & Solid SVG Migration
**Objective:** Eliminate 100% of Unicode emojis across all portal screens and replace them with accessible, production-grade solid SVGs from Heroicons / Lucide.

- [x] **Task 1.1: Replace Emojis in AI Copilot Drawer**
  - Target: `src/components/copilot/CopilotDrawer.tsx` (lines 736–748)
  - Subtasks:
    - [x] Replace `📊` with `<ChartBarIcon className="w-3.5 h-3.5 text-blue-600" />`.
    - [x] Replace `📍` with `<MapPinIcon className="w-3.5 h-3.5 text-rose-600" />`.
    - [x] Replace `⚠️` with `<ExclamationTriangleIcon className="w-3.5 h-3.5 text-amber-600" />`.
    - [x] Verify keyboard tab focus and screen reader announcements.

- [x] **Task 1.2: Replace Emojis in Social Media Analysis Telemetry**
  - Target: `src/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis.tsx` (lines 264–317)
  - Subtasks:
    - [x] Replace `↻` with `<ArrowPathRoundedSquareIcon className="w-3.5 h-3.5 inline mr-1 text-slate-500" />`.
    - [x] Replace `♥` with `<HeartIcon className="w-3.5 h-3.5 inline mr-1 text-rose-500" />`.
    - [x] Replace `👁` with `<EyeIcon className="w-3.5 h-3.5 inline mr-1 text-blue-500" />`.
    - [x] Replace `💬` with `<ChatBubbleLeftIcon className="w-3.5 h-3.5 inline mr-1 text-indigo-500" />`.
    - [x] Replace `▶` with `<PlayIcon className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />`.
    - [x] Replace `👍` with `<HandThumbUpIcon className="w-3.5 h-3.5 inline mr-1 text-amber-500" />`.

- [x] **Task 1.3: Replace Emojis in Portal Screens (Ads, Fact-Check, News, Newspaper)**
  - Targets:
    - `src/components/portal/AdvertisementsScreen.tsx` (lines 657, 667)
    - `src/components/portal/FactCheckScreen.tsx` (lines 217, 334)
    - `src/components/portal/LiveNewsScreen.tsx` (lines 644, 668)
    - `src/components/portal/NewspaperScreen.tsx` (line 1181)
  - Subtasks:
    - [x] Replace `🖼️` and `📋` in Advertisements with `Squares2X2Icon` and `TableCellsIcon`.
    - [x] Replace `📌` and `❌` in FactCheck with `BookmarkIcon` and `XCircleIcon`.
    - [x] Replace `⚠️` in FactCheck forged alert banner with `ShieldExclamationIcon`.
    - [x] Replace `🎥` and `📺` in LiveNews with `VideoCameraIcon` and `TvIcon`.
    - [x] Replace `✂` in Newspaper with SVG scissors icon.

- [x] **Task 1.4: Replace Emojis in PDF Export Engine**
  - Target: `src/lib/exportTelemetryPdf.ts` (lines 219, 242)
  - Subtasks:
    - [x] Replace `🏛️` with inline vectorized Maharashtra State Emblem SVG.
    - [x] Replace raw text checkmarks `✓` with clean SVG check indicators.

---

## Phase 2: Color Palette Harmonization & Disruption Removal
**Objective:** Eliminate the pitch-black header and sidebar disruptions; unify the interface into the Daylight Government Command Palette.

- [x] **Task 2.1: Refactor Top Header Framing**
  - Target: `src/components/layout/Header.tsx` (line 160)
  - Subtasks:
    - [x] Replace `bg-[#070B14]` with `bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900`.
    - [x] Update breadcrumb text from `text-slate-400` to `text-slate-600 font-semibold`.
    - [x] Update search bar input styling to `bg-slate-100/80 border border-slate-200 text-slate-800 placeholder-slate-400`.
    - [x] Re-theme officer profile pill and role badges to daylight slate with crisp borders.

- [x] **Task 2.2: Refactor Navigation Rail Sidebar**
  - Target: `src/components/layout/Sidebar.tsx` (lines 115–220)
  - Subtasks:
    - [x] Replace dark container classes `bg-slate-950` / `bg-[#0A0F1D]` with `bg-[#F8FAFC] border-r border-slate-200/90`.
    - [x] Update active nav link pills from `bg-amber-500/10 text-amber-400` to Apple executive blue `bg-[#EBF3FF] text-[#1D4ED8] font-bold shadow-xs border border-blue-200/80`.
    - [x] Update inactive nav link text from `text-slate-300` to `text-slate-600 hover:text-slate-900 hover:bg-slate-100/80`.
    - [x] Modernize group section headers with uppercase slate-400 typography.

- [x] **Task 2.3: Establish Universal Semantic Design Tokens in Tailwind**
  - Target: `src/app/globals.css` or Tailwind theme definitions
  - Subtasks:
    - [x] Verify `--color-gov-canvas: #F8FAFC`, `--color-gov-card: #FFFFFF`.
    - [x] Verify `--color-gov-accent: #1D4ED8`, `--color-gov-accent-soft: #EBF3FF`.
    - [x] Define signal tokens for alert (`#EF4444`), warning (`#F59E0B`), success (`#10B981`), info (`#3B82F6`).

---

## Phase 3: Subheading Trimming & Viewport-Locked Decongestion
**Objective:** Strip redundant subheadings, placeholder taglines, and marketing fillers to reclaim 80px–120px of vertical height.

- [x] **Task 3.1: Trim Redundant Subheadings in Card Headers**
  - Targets:
    - `src/components/shared/MinimalCardHeader.tsx`
    - `src/components/leadership/GISMap/GISMap.tsx`
    - `src/components/dashboard/GovernmentSchemeHoardingsPanel.tsx`
    - `src/components/dashboard/CitizenServicesCard.tsx`
  - Subtasks:
    - [x] Converted card subtitles to hover/focus tooltip popovers via `MinimalCardHeader`, saving 40-80px vertical height.
    - [x] Retained clean semantic card titles and status indicator badges exclusively on screen.
    - [x] Preserved required test assertion title strings (`isMr ? 'तक्रारी व हमी कायदा (SLA)' : 'Grievances & SLA'`).

- [x] **Task 3.2: Decongest KPI Ribbon Metrics**
  - Target: `src/components/zones/KPIRibbon/KPICard.tsx`
  - Subtasks:
    - [x] Converted raw text filler beneath numbers into clean micro-visualizations.
    - [x] Reallocated vertical space for embedded graphical sparklines and target progress bars.

---

## Phase 4: Button Ergonomics, Sizing & Tactile Press Feedback
**Objective:** Standardize button touch targets to minimum 36px (desktop) / 44px (touch) and eliminate wire-thin text outlines.

- [x] **Task 4.1: Standardize Portal Action Buttons**
  - Target: `src/components/portal/AdvertisementsScreen.tsx`
  - Subtasks:
    - [x] Updated table view action buttons to `px-3.5 py-1.5 min-h-[36px] text-xs font-semibold rounded-xl`.
    - [x] Enclosed bare text triggers in rounded button containers.
    - [x] Added `active:scale-95 transition-all cursor-pointer` to all interactive controls.

- [x] **Task 4.2: Replace Wire-Thin Action Links in Dashboard Cards**
  - Target: `src/components/dashboard/CitizenServicesCard.tsx`
  - Subtasks:
    - [x] Standardized interaction styling while strictly maintaining test assertions (`ml-auto font-medium hover:underline`).

- [x] **Task 4.3: Add Smooth Sliding LayoutId Indicator for Module Tabs**
  - Target: `src/components/dashboard/ThreeColumnDashboard.tsx`
  - Subtasks:
    - [x] Wrapped view tab buttons in Framer Motion `layoutId="activeModuleTab"` pill to provide smooth sliding feedback when switching between views.

---

## Phase 5: Numerical Data Graphic Overhaul (Charts, Sparklines, Gauges)
**Objective:** Convert raw numerical metrics into rich graphical representations across the dashboard.

- [x] **Task 5.1: Enhance KPI Cards with Visual Graphs**
  - Target: `src/components/zones/KPIRibbon/KPICard.tsx`
  - Subtasks:
    - [x] **Press Releases**: Embedded mini horizontal target completion progress bar (actual vs. target).
    - [x] **Media Placements**: Embedded 7-day micro SVG trend sparkline (`MiniSparkline.tsx`).
    - [x] **Net Sentiment**: Embedded 3-channel sentiment distribution bar (Print, TV, Social).
    - [x] **Crisis SLA**: Embedded circular 90-minute SLA countdown badge with compliance status.
    - [x] **Field Events**: Embedded execution progress bar.

- [x] **Task 5.2: Enhance District Scorecard Bento**
  - Target: `src/components/dashboard/DistrictScorecardBento.tsx`
  - Subtasks:
    - [x] Converted 4-pillar numerical breakdown (Speed, Volume, Sentiment, Crisis SLA) into horizontal stacked progress bars.
    - [x] Added circular radial score gauge for composite CPI.

- [x] **Task 5.3: Enhance Citizen Services Card**
  - Target: `src/components/dashboard/CitizenServicesCard.tsx`
  - Subtasks:
    - [x] Replaced plain text summary with a 4-segment colored proportional indicator bar.

---

## Phase 6: Universal "i" Info Tooltip Popovers & Formula Documentation
**Objective:** Equip every executive metric and term with an interactive "i" icon button providing definition, formula, and source details.

- [x] **Task 6.1: Build Universal `<InfoTooltip>` Component**
  - Target: `src/components/shared/InfoTooltip.tsx`
  - Subtasks:
    - [x] Implemented 16x16px circular button trigger (`w-4 h-4 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-400 hover:text-blue-600 flex items-center justify-center text-[10px] font-bold`).
    - [x] Connected to `src/data/metricDefinitions.ts` for bilingual name, definition, formula, source, and update interval. Supports aliases (`cpi`, `volumeScore`, `speedScore`, `sentimentIndex`, `crisisResolution`).
    - [x] Styled Radix Popover with Apple glass styling (`bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-2xl p-3 max-w-xs`).

- [x] **Task 6.2: Integrate `<InfoTooltip>` Across Key Cards**
  - Subtasks:
    - [x] Mounted on KPI Cards (CPI, TAT, Net Sentiment, Crisis SLA, Releases).
    - [x] Mounted on District Scorecard Bento headers and District leaderboards.
    - [x] Mounted on Analytical Dock cards (Rankings, Sentiment, Crisis SLA, Social Engagement).

---

## Phase 7: Backend API Routes & Ingestion Pipeline (SKIPPED PER USER EXPLICIT INSTRUCTION)
*Note: Explicitly excluded from execution per user prompt: "do all the phases, except the pshase7 and phase11, complete others."*

- [ ] **Task 7.1: Implement Missing Next.js API Route Handlers** (Skipped)
- [ ] **Task 7.2: Refactor Components to Fetch Data via Store/API** (Skipped)

---

## Phase 8: Modular Calculations Architecture
**Objective:** Decouple `calculations.tsx` into single-responsibility, pure-math calculation modules.

- [x] **Task 8.1: Create Dedicated Math & Processing Modules**
  - Target directory: `src/lib/calculations/`
  - Subtasks:
    - [x] `src/lib/calculations/metricsEngine.ts`: Pure mathematical formulas (CPI, Speed Score, Volume Score, Sentiment Index, Crisis Resolution Rate). Zero JSX dependencies.
    - [x] `src/lib/calculations/statewideAggregates.ts`: Aggregation across 36 districts, regional rollups, ranking algorithms, Top/Lower matrix.
    - [x] `src/lib/calculations/crisisProcessing.ts`: Incident SLA compliance, triage escalation, 90-minute window analytics.
    - [x] `src/lib/calculations/mediaProcessing.ts`: Ingestion stream normalization, OCR parsing, broadcast speed ratings.
    - [x] `src/lib/calculations/attendanceProcessing.ts`: Biometric attendance percentage, punctuality score, shift adherence.
    - [x] `src/lib/calculations/hooks.ts`: React hooks (`useDashboardCalculations`, `useDistrictScorecard`).
    - [x] `src/lib/calculations/index.ts`: Barrel export.

- [x] **Task 8.2: Refactor `calculations.tsx` as Unified Facade**
  - Target: `src/lib/calculations.tsx`
  - Subtasks:
    - [x] Preserved backward compatibility with all existing unit tests and component imports while exposing modular calculations.

---

## Phase 9: Multi-Scale Responsiveness & Zoom Optimization
**Objective:** Ensure flawless layout integrity and zero unconstrained scroll across 100%, 125%, 150%, and 175% display zoom levels.

- [x] **Task 9.1: Replace Rigid Pixel Heights with Fluid Container Budgeting**
  - Target: `src/components/dashboard/ThreeColumnDashboard.tsx`
  - Subtasks:
    - [x] Retained required test grid classes while ensuring fluid height budgeting and overflow containment.
    - [x] Optimized Analytical Dock and 3D maps for high zoom levels.

- [x] **Task 9.2: Implement Auto-Collapsing Sidebar for Narrow Desktop Viewports**
  - Target: `src/components/layout/DashboardLayout.tsx`
  - Subtasks:
    - [x] Added viewport width breakpoint listener: automatically collapses sidebar to 64px icon-only rail when screen width is `< 1440px` (or at 150%/175% zoom).
    - [x] Ensured zero horizontal overflow on Header and Global Context Bar.

---

## Phase 10: Complete Loader Architecture
**Objective:** Provide instant, feedback-rich loading states across all routes, cards, and asynchronous filter transitions.

- [x] **Task 10.1: Add Missing Route Boundary Loaders**
  - Targets:
    - [x] `src/app/attendance/loading.tsx`
    - [x] `src/app/advertisements/loading.tsx`
    - [x] `src/app/publications/loading.tsx`
    - [x] `src/app/live-events/loading.tsx`
  - Subtasks:
    - [x] Created skeleton components matching each respective screen layout to eliminate layout shift during route transitions.

- [x] **Task 10.2: Implement Card-Level Micro-Shimmers on Filter Changes**
  - Target: `src/components/zones/KPIRibbon/KPIRibbon.tsx`
  - Subtasks:
    - [x] Synchronized with `isLoadingData` and subtle 2px saffron shimmer progress bar across the layout.

---

## Phase 11: Extra / Orphaned Component Decommissioning (SKIPPED PER USER EXPLICIT INSTRUCTION)
*Note: Explicitly excluded from execution per user prompt: "do all the phases, except the pshase7 and phase11, complete others." Preserves `src/components/dashboard/MainDashboard.tsx` permanently as the historical backup layout.*

- [ ] **Task 11.1: Decommission Dead Dashboard Components** (Skipped)

---

## Phase 12: Comprehensive Verification, Testing & QA Gate
**Objective:** Validate all 186 unit/integration tests, confirm clean TypeScript compilation, and verify production build.

- [x] **Task 12.1: TypeScript Validation**
  - [x] Run `npx tsc --noEmit` and confirm 0 errors.

- [x] **Task 12.2: Test Suite Verification**
  - [x] Run `npm test` and confirm all 186 tests in 58 suites pass cleanly.

- [x] **Task 12.3: Production Build Gate**
  - [x] Run `npm run build` and verify clean compilation.

- [ ] **Task 12.4: Multi-Scale Visual Inspection**
  - [ ] Capture Edge headless screenshots at 100%, 125%, 150%, and 175% to confirm zero overflow and pristine visual aesthetics.
