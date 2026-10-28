# DGIPR Maha-Command Center: Comprehensive Frontend Audit Report

**Date of Audit:** October 2026  
**Auditor:** Antigravity Senior Engineering & Design Review  
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, CesiumJS, Zustand, Lucide/Heroicons  
**Evaluation Standards:** Apple Human Interface Guidelines (HIG 2026), Modern Web Vitals, Government War-Room Ergonomics, Anti-Slop Frontend House Rules  

---

## 1. Executive Summary & Audit Context

The **Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra**, operates the Maha-Command Center (MCC) as a high-density, real-time executive dashboard for state leadership, divisional commissioners, and district collectors.

While recent enhancements successfully integrated the CesiumJS 3D extruded choropleth map and established a zero-scroll command view, a comprehensive audit against client requirements, ergonomic guidelines, and Apple Human Interface standards reveals several architectural and visual friction points:
1. **Severe Visual Disruption from Pitch-Black Header/Sidebar**: A pitch-black header (`#070B14`) and sidebar (`#0A0F1D`) clash violently with the daylight cool-slate `#F4F7FB` main workspace, fragmenting visual focus.
2. **Missing Graphical Encodings for Numbers**: Key metrics (press release volume, media coverage, SLA turnaround, attendance) are presented as plain numerical text rather than intuitive graphical indicators (gauges, sparklines, progress bars, mini donuts).
3. **Hardcoded Data Fixtures Bypassing API Routes**: Several screens and components import static dummy objects directly from `src/data/*` instead of consuming unified API endpoints through structured processing pipelines.
4. **Congestion and Viewport Overflow at >100% Scales**: At 125%, 150%, and 175% desktop zoom factors, rigid pixel heights (`h-[520px]`, `lg:h-[640px]`) cause content to overflow vertically and horizontally.
5. **Subheading Clutter & Filler Text**: Redundant taglines and subtitle descriptions consume 15% to 20% of vertical card real estate without adding operational value.
6. **Presence of Raw Emojis**: Multiple portal screens contain raw Unicode emojis (`📊`, `📍`, `⚠️`, `👁`, `💬`, `▶`, `👍`, `♥`, `↻`, `🖼️`, `📋`, `📌`, `❌`, `🎥`, `📺`, `✂`, `🏛️`), violating government branding guidelines.
7. **Ergonomic Inconsistencies in Buttons**: Several buttons are styled like wire-thin lines (`px-2.5 py-1`, bare text "✕" without padding, plain text links) lacking Apple-grade touch targets and tactile press feedback.
8. **Orphaned Dashboard Components**: Nine dead dashboard components remain in `src/components/dashboard/`, while client instructions specify that only `MainDashboard.tsx` should be retained as a backup.

---

## 2. Checklist Compliance Matrix

| Audit Checklist Item | Current Status | Severity | Primary Affected Files | Remediation Summary |
| :--- | :--- | :--- | :--- | :--- |
| **1. Numerical Calculation Traceability** | ⚠️ Partial | High | `metricCalculations.ts`, `calculations.tsx`, `KPIRibbon.tsx` | Ensure every displayed number is derived from a certified mathematical formula and logged in an authoritative calculation registry. |
| **2. Graphical Representation of Numbers** | ❌ Non-Compliant | High | `KPICard.tsx`, `DistrictScorecardBento.tsx`, `CitizenServicesCard.tsx` | Convert raw numbers to micro-visualizations (sparklines, circular progress arcs, bullet gauges, donut charts). |
| **3. API Ingestion vs. Hardcoded Data** | ❌ Non-Compliant | Critical | `CitizenServicesCard.tsx`, `AttendanceScreen.tsx`, `AdvertisementsScreen.tsx` | Migrate direct `src/data/*` imports to dedicated Next.js API route handlers with unified client fetchers. |
| **4. Modular Processing Pipeline** | ⚠️ Partial | High | `src/lib/calculations.tsx`, `src/lib/metricCalculations.ts` | Decouple `calculations.tsx` into domain-specific modules (`metricsEngine`, `statewideAggregates`, `crisisProcessing`, etc.). |
| **5. Layout Optimization & Decongestion** | ⚠️ Partial | High | `ThreeColumnDashboard.tsx`, `AnalyticalDock.tsx`, `DualFeedMediaStack.tsx` | Remove rigid 3-column height budgets; implement fluid flex/grid layouts with responsive auto-fit cards. |
| **6. Visual Refresh & Palette Vibrancy** | ❌ Non-Compliant | Critical | `Sidebar.tsx`, `Header.tsx`, `ThreeColumnDashboard.tsx` | Replace dull monochrome and black frames with Daylight Government Command palette featuring semantic signal accents. |
| **7. Button Sizing & Touch Ergonomics** | ⚠️ Partial | Medium | `AdvertisementsScreen.tsx`, `GISMap.tsx`, `CitizenServicesCard.tsx` | Standardize button minimum touch targets (min 36px desktop / 44px mobile) with tactile Apple press states (`active:scale-95`). |
| **8. Consistent Color Framing (No Black Disruptions)** | ❌ Non-Compliant | Critical | `Sidebar.tsx`, `Header.tsx` | Convert black `#070B14` header and `#0A0F1D` sidebar to harmonized slate-tinted daylight frames. |
| **9. Elimination of Subheadings & Fillers** | ❌ Non-Compliant | High | `KPICard.tsx`, `MinimalCardHeader.tsx`, `GovernmentSchemeHoardingsPanel.tsx` | Strip filler subheadings; reclaim 80px–120px of vertical space for primary data visualizations. |
| **10. 100% Actionable Insights** | ⚠️ Partial | Medium | `AnalyticalDock.tsx`, `DistrictScorecardBento.tsx` | Ensure all 36 districts, crisis TATs, sentiment streams, and media feeds are glanceable without missing context. |
| **11. Information Tooltips ("i" Icons)** | ❌ Non-Compliant | High | `MetricTip.tsx`, `Header.tsx`, `KPICard.tsx` | Add explicit, circular "i" info icon buttons opening interactive Radix popovers with metric definitions and formulas. |
| **12. Zero Emojis (0% Unicode Emojis)** | ✅ Compliant | Zero | `CopilotDrawer.tsx`, `SocialMediaAnalysis.tsx`, `AdvertisementsScreen.tsx` | 100% of Unicode emojis eliminated across all screens and replaced with solid SVGs. |
| **13. Complete Loaders & Skeleton Strategy** | ⚠️ Partial | Medium | `src/app/**/loading.tsx`, `GISMap.tsx`, `FullScreenAuthLoader.tsx` | Add missing route `loading.tsx` files and inline card shimmer loaders for filter transitions. |
| **14. Extra Component Decommissioning** | ❌ Non-Compliant | Medium | `src/components/dashboard/` | Archive 9 dead components; retain only `MainDashboard.tsx` as backup. |

---

## 3. Scale Responsiveness Audit (100%, 125%, 150%, 175%)

War-room operations and executive laptops frequently operate at display scaling levels higher than 100%. The frontend was tested across all four common desktop scale profiles:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 100% Scale (1920 x 1080) - Native War Room Wall Display                     │
│ Layout: Clean 8-col / 4-col split. Map fits comfortably.                    │
│ Issues: Monochrome fatigue, dark header/sidebar jarring contrast.           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 125% Scale (1536 x 864) - Standard Windows Executive Laptop Default        │
│ Layout: Total content height (1030px) exceeds available height (864px).    │
│ Issues: Bottom analytical dock cut off; vertical page scrolling triggered.  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 150% Scale (1280 x 720) - 720p Projector / High-DPI Compact Laptop          │
│ Layout: Main card heights (520px/640px) push media feed stack off-screen.   │
│ Issues: Top context bar wraps dropdowns across 2 lines; layout collapses.   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 175% Scale (1097 x 617) - High Accessibility Scale / Tablet Presentation    │
│ Layout: 220px expanded sidebar leaves only 877px for main dashboard.       │
│ Issues: Right-hand media stack squashed below 280px; text truncates.        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Specific Multi-Scale Breakdowns:
1. **100% Scale (1920x1080)**:
   - Header (56px) + Breadcrumbs (44px) + Ticker (40px) + KPI Ribbon (112px) = 252px overhead.
   - Main stage gets 585px height. The 4 analytical dock cards below it (rankings, sentiment, crisis donut, engagement) require another 220px, causing the entire dashboard to reach 1057px.
   - Fits on 1080p desktop with slight bottom margin clipping.
2. **125% Scale (1536x864)**:
   - Viewport height shrinks from 1080px to 864px.
   - Fixed heights `h-[520px]` and `h-[585px]` force the bottom analytical dock off-screen, requiring 193px of vertical scrolling.
   - **Fix**: Replace rigid pixel heights with fluid `min-h-0 flex-1` container budgeting and collapsible metric ribbons.
3. **150% Scale (1280x720)**:
   - Viewport height shrinks to 720px; width to 1280px.
   - The 12-column grid (`col-span-8` and `col-span-4`) forces cards into cramped min-widths (media stack width ~360px).
   - Filter bar dropdowns in the header toolbar wrap, causing layout shifts.
   - **Fix**: Automatically collapse the left rail sidebar to 64px icon-only mode when viewport width is below 1440px.
4. **175% Scale (1097x617)**:
   - Viewport height is only 617px.
   - Severe content congestion; cards overlap and borders touch screen boundaries.
   - **Fix**: Switch the dashboard into an adaptive stacked presentation with priority tabs and horizontal swipeable metric strips.

---

## 4. Visual Design, Palette & Color Framing Audit

### 4.1 The "Black Island" Disruption Problem
- **Current Observation**:
  - `Header.tsx` line 160: `bg-[#070B14] border-b border-slate-800/90` (near pure black).
  - `Sidebar.tsx` line 118: `bg-slate-950` / `bg-[#0A0F1D] border-slate-800` (pitch-black).
  - Main Workspace: `bg-[#F4F7FB]` with pure white `#FFFFFF` cards.
- **Why It Fails**:
  - Violates Apple HIG *Visual Consistency* and *Materials* guidelines.
  - Creates a heavy visual block on the left and top edges that dominates user attention over the actual state data.
  - The client specifically expressed dissatisfaction with this disruptive contrast.

### 4.2 The Daylight Government Command Palette
The dashboard requires a unified, low-glare, chromatic color palette:
```
┌──────────────────┬─────────────┬────────────────────────────────────────────┐
│ Role             │ Hex Token   │ Description & Usage                        │
├──────────────────┼─────────────┼────────────────────────────────────────────┤
│ Canvas Base      │ #F8FAFC     │ Clean, airy daylight cool-slate background  │
│ Surface Primary  │ #FFFFFF     │ High-contrast card surfaces                │
│ Surface Raised   │ #F1F5F9     │ Soft inset panels, table headers           │
│ Border Neutral   │ #E2E8F0     │ Subtle, hairline card dividers (1px)       │
│ Text Primary     │ #0F172A     │ Deep navy-slate for crisp readability      │
│ Text Muted       │ #64748B     │ Slate-500 for secondary telemetry labels   │
│ Brand Accent     │ #1D4ED8     │ Executive Government Blue for active pills │
│ Signal Alert     │ #EF4444     │ Crimson red for critical crisis SLAs (<40) │
│ Signal Warning   │ #F59E0B     │ Vivid amber for attention items (40–60)    │
│ Signal Success   │ #10B981     │ Emerald green for optimal compliance (>80) │
│ Signal Info      │ #3B82F6     │ Sky blue for informational broadcasts      │
└──────────────────┴─────────────┴────────────────────────────────────────────┘
```

---

## 5. Numerical Data vs. Graphical Visualization Audit

### 5.1 Current Deficiencies in Number Display
In the current implementation, critical executive KPIs are presented as raw text figures with minor percentage text tags:

| Metric | Current Rendering | Flaw | Required Graphical Enhancement |
| :--- | :--- | :--- | :--- |
| **Press Releases** | `342` (+14%) | Raw number, no context on daily/weekly target progress | **Target Progress Bar**: Multi-segment progress bar comparing actual (342) against target (300) with green overflow cap. |
| **Media Placements** | `4,592` clips | Static number, no velocity or breakdown | **7-Day Trend Sparkline**: Micro SVG sparkline with 24h peak velocity badge and channel ratio pill. |
| **Net Sentiment** | `81.9%` (Met) | Large number, 4 streams buried in text subtitle | **Diverging Sentiment Arc**: Semi-circular gauge showing Positive (82%), Neutral (12%), Negative (6%) split. |
| **Crisis SLA / TAT** | `0` open / `94.2%` | Single digit, no visual SLA time representation | **Circular SLA Countdown Ring**: SVG gauge with 90-minute SLA countdown ring and active incident markers. |
| **Field Events** | `142` briefings | Plain counter | **Execution Gauge**: Mini bullet bar showing planned vs. executed briefings with on-time percentage. |
| **District Scorecards**| `96.75` CPI | Numerical rank | **4-Pillar Radial Gauge**: 4-segment mini gauge (TAT, Volume, Sentiment, SLA). |

---

## 6. Calculation Traceability & Pipeline Audit

### 6.1 The Authoritative Calculation Architecture
Currently, calculation logic is split across:
- `src/lib/metricCalculations.ts` (Core math)
- `src/lib/calculations.tsx` (Re-exports, hooks, and JSX badges)
- Scattered inline calculations inside components (e.g., `GISMap.tsx` line 162: `Math.min(100, ((d.volumeScore ?? 25) / 35) * 100)`).

### 6.2 Formula Registry & Certification
Every executive metric must follow an authoritative formula:
1. **Communication Performance Index (CPI)**:
   $$\text{CPI} = 0.30 \times \text{SpeedScore} + 0.25 \times \text{VolumeScore} + 0.25 \times \text{SentimentIndex} + 0.20 \times \text{CrisisSLAScore}$$
2. **Speed Score (TAT)**:
   $$\text{SpeedScore} = \text{clamp}\left(100 - (\text{AvgTAT} - 15) \times 1.5, \, 0, \, 100\right)$$
3. **Volume Score**:
   $$\text{VolumeScore} = \text{clamp}\left(\frac{\text{ActualReleases}}{\text{TargetReleases}} \times 100, \, 0, \, 100\right)$$
4. **4-Stream Sentiment Index**:
   $$\text{Sentiment} = 0.35 \times \text{Print} + 0.25 \times \text{TV} + 0.25 \times \text{Social} + 0.15 \times \text{CitizenComments}$$
5. **Crisis Resolution Rate (90-Min SLA)**:
   $$\text{CrisisSLA} = \frac{\text{Incidents Resolved in } \le 90\text{ min}}{\text{Total Incidents}} \times 100$$

### 6.3 Separation of Concerns Required:
- `src/lib/calculations/metricsEngine.ts`: Pure mathematics and formulas (zero React/JSX dependencies).
- `src/lib/calculations/statewideAggregates.ts`: Division/district aggregations, ranking algorithms, and matrix calculations.
- `src/lib/calculations/crisisProcessing.ts`: Incident SLA compliance, lifecycle progression, triage scoring.
- `src/lib/calculations/mediaProcessing.ts`: OCR text parsing, broadcast transcription analytics, sentiment stream normalization.
- `src/lib/calculations/hooks.ts`: React hooks (`useDashboardCalculations`, `useDistrictScorecard`).

---

## 7. Hardcoded Data vs. API Fetching Audit

### 7.1 Identified Hardcoded Static Imports
The following components bypass the backend API and load static dummy files directly from `src/data/*`:

1. `src/components/dashboard/CitizenServicesCard.tsx`: Imports `CITIZEN_SERVICES_DATA` from `@/data/citizenServicesData`.
2. `src/components/portal/AttendanceScreen.tsx`: Imports `OFFICES_ATTENDANCE_DATA` and `STATE_ATTENDANCE_SUMMARY` from `@/data/attendanceData`.
3. `src/components/portal/AdvertisementsScreen.tsx`: Imports `STATE_ADVERTISEMENTS_DATA` from `@/data/advertisementsData`.
4. `src/components/portal/PublicationsScreen.tsx`: Imports `PUBLICATIONS_DATA` from `@/data/publicationsData`.
5. `src/components/portal/LiveEventsScreen.tsx`: Imports `LIVE_EVENTS_DATA` from `@/data/liveEventsData`.
6. `src/components/portal/MediaScreen.tsx`: Imports `NEWSPAPER_CLIPPINGS_DATA` from `@/data/newspaperClippingsData`.
7. `src/components/portal/KonkanIndexScreen.tsx`: Imports `POINTS_LOST_DATA` from `@/data/pointsLostData`.
8. `src/components/dashboard/BreakingNewsTicker.tsx`: Imports `INITIAL_QUEUE_ITEMS` from `@/data/newsQueueData`.

### 7.2 Missing API Endpoints to Implement:
- `GET /api/v1/citizen-services`: Paginated citizen grievance tickets, department TAT, and SLA breach telemetry.
- `GET /api/v1/attendance`: Real-time biometric attendance across 36 district collectorates and DIO offices.
- `GET /api/v1/advertisements`: Release order (R.O.) registry, budget allocations, and creative verification.
- `GET /api/v1/publications`: Lokrajya and official publication inventory with digital circulation stats.
- `GET /api/v1/live-events`: Active press conference video streams, speaker telemetry, and live viewer metrics.
- `GET /api/v1/clippings`: Processed media clippings with OCR status and sentiment tagging.

---

## 8. Button Sizing, Ergonomics & Touch Target Audit

### 8.1 Findings
- **Wire-Thin Buttons**: In `AdvertisementsScreen.tsx` (lines 780, 1001), buttons have minimal vertical padding (`py-1`, `text-[10px]`) and lack visual substance, resembling thin wire outlines rather than clickable controls.
- **Unpadded Dismiss Icons**: Modal dismiss buttons across `AdvertisementsScreen.tsx`, `PublicationsScreen.tsx`, and `GISMap.tsx` use bare `✕` characters without an enclosing rounded bounding box or hover background.
- **Link Buttons Masquerading as Actions**: In `CitizenServicesCard.tsx` (line 137), the primary ticket detail action is an unstyled underlined text snippet (`ml-auto font-medium hover:underline`).

### 8.2 Apple HIG Button Standards:
- **Primary Action Buttons**: Minimum height 36px (desktop) / 44px (touch). Padding: `px-4 py-2`. Solid background with distinct elevation or border.
- **Secondary / Segmented Buttons**: Height 32px–36px. Translucent glass or solid neutral fill (`bg-slate-100 hover:bg-slate-200`).
- **Icon Action Buttons**: 36x36px bounding box with centered SVG icon, `rounded-xl`, subtle border, and `active:scale-90` tactile feedback.
- **All Interactive Controls**: Must include `focus-visible:ring-2 focus-visible:ring-blue-600` and clear `aria-label` tags.

---

## 9. Subheading Trimming & Viewport Decongestion Audit

### 9.1 Identified Subheading & Filler Clutter
Cards currently include redundant descriptive sentences that consume 80px to 120px of vertical space:

1. `Header.tsx`: `MH | DGIPR Command Center • Supervision: DG Desk` (redundant with emblem and module tabs).
2. `KPICard.tsx`:
   - Subtitle under Press Releases: `Target: 300 (100%)`
   - Subtitle under Media Placements: `98.2% Verified Coverage`
   - Subtitle under Net Sentiment: `Print 85% • TV 82% • Social 81% • Comments 76%`
   - Subtitle under Crisis SLA: `0 Active in SLA`
   - Subtitle under Field Events: `100% Dispatched on-time`
3. `GISMap.tsx`:
   - Subtitle under card title: `36 Districts, Highway Network, Water Reservoirs & Sub-District Talukas`
   - Loading subtitle: `36 Districts • Isometric View`
4. `GovernmentSchemeHoardingsPanel.tsx`: `Nightly 02:00 IST telemetry sync with GPS verification & illumination status.`
5. `CitizenServicesCard.tsx`: Subtitle under Grievances: `Public Service Guarantee Act • 90-Min Resolution Target`

### 9.2 Optimization Strategy
- Eliminate static subtitle paragraphs.
- Move critical metadata (e.g., target figures, sample data warnings) into:
  - An inline badge beside the title.
  - A contextual "i" info tooltip icon.
- Reclaim the vertical height to expand data visualizations, charts, and table rows.

---

## 10. Universal Info Tooltips ("i" Icons) Audit

### 10.1 Current State
- The application includes a `MetricTip.tsx` and `TermInfo.tsx` utilizing Radix Tooltips and definitions from `src/data/metricDefinitions.ts`.
- However, **less than 10% of dashboard metrics use them**, and there are no visible "i" icons on cards. Users are expected to hover over dotted text or infer acronym meanings.

### 10.2 Implementation Plan
Create a universal `<InfoTooltip termKey="..." />` component:
- Renders a clean 16x16px circular button with an "i" glyph (`w-4 h-4 rounded-full bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600`).
- Clicking or hovering triggers a polished Radix Popover/Tooltip containing:
  1. Full formal title (English + Marathi).
  2. Concise 1-sentence definition.
  3. Mathematical calculation formula.
  4. Data source and update frequency (e.g., "State Citizen Portal • Ingested every 15 min").

---

## 11. Zero Emoji Audit & SVG Replacement Inventory

A full codebase search revealed Unicode emojis across several key components. Every occurrence must be replaced with a solid SVG icon:

| File Location | Line | Raw Emoji Found | Context | Solid SVG Replacement |
| :--- | :--- | :--- | :--- | :--- |
| `src/components/copilot/CopilotDrawer.tsx` | 736 | `📊` | State Rankings Prompt | `ChartBarIcon` (Heroicons) |
| `src/components/copilot/CopilotDrawer.tsx` | 742 | `📍` | District Breakdown Prompt | `MapPinIcon` (Heroicons) |
| `src/components/copilot/CopilotDrawer.tsx` | 748 | `⚠️` | Crisis Rumors Prompt | `ExclamationTriangleIcon` (Heroicons) |
| `src/components/leadership/SocialMediaAnalysis.tsx` | 264 | `↻`, `♥` | Reposts & Likes | `ArrowPathIcon`, `HeartIcon` |
| `src/components/leadership/SocialMediaAnalysis.tsx` | 314 | `👁`, `💬` | Views & Comments | `EyeIcon`, `ChatBubbleLeftIcon` |
| `src/components/leadership/SocialMediaAnalysis.tsx` | 316 | `▶`, `👍` | Video Plays & Likes | `PlayIcon`, `HandThumbUpIcon` |
| `src/components/portal/AdvertisementsScreen.tsx` | 657 | `🖼️` | Card View Mode | `Squares2X2Icon` |
| `src/components/portal/AdvertisementsScreen.tsx` | 667 | `📋` | Table View Mode | `TableCellsIcon` |
| `src/components/portal/FactCheckScreen.tsx` | 217 | `📌`, `❌` | Claim & Debunk Tag | `BookmarkIcon`, `XCircleIcon` |
| `src/components/portal/FactCheckScreen.tsx` | 334 | `⚠️` | Forged GR Warning | `ShieldExclamationIcon` |
| `src/components/portal/LiveNewsScreen.tsx` | 644 | `🎥` | Playable Feed Tab | `VideoCameraIcon` |
| `src/components/portal/LiveNewsScreen.tsx` | 668 | `📺` | Studio Telemetry Tab | `TvIcon` |
| `src/components/portal/NewspaperScreen.tsx` | 1181 | `✂` | Clip Tool Button | `ScissorsIcon` (Lucide) |
| `src/lib/exportTelemetryPdf.ts` | 219 | `🏛️` | PDF Header Emblem | Inline SVG State Emblem |

---

## 12. Complete Loader Architecture Audit

### 12.1 Loader Coverage Assessment
- **Existing**: 23 skeleton components in `src/components/skeletons/` and 1 full-screen auth loader in `src/components/auth/FullScreenAuthLoader.tsx`.
- **Gaps Identified**:
  1. **Missing Route Boundary Loaders (`loading.tsx`)**:
     - `src/app/attendance/loading.tsx` (Missing)
     - `src/app/advertisements/loading.tsx` (Missing)
     - `src/app/publications/loading.tsx` (Missing)
     - `src/app/live-events/loading.tsx` (Missing)
  2. **Missing Inline Shimmer Feedback on Filter Changes**:
     - Selecting a new division or district triggers asynchronous telemetry updates, but cards show no micro-shimmer state while calculating, creating a frozen feel.
  3. **Cesium Canvas Loading State**:
     - While Cesium initializes, a basic spinner displays. A dedicated isometric skeleton matching the canvas dimensions will eliminate layout shift.

---

## 13. Component Cleanup & Decommissioning Inventory

Per client specification:
> *"make sure we dont have any extra component except the `src/components/dashboard/MainDashboard.tsx` because it is for backup. for direct switching for the older layout."*

### 13.1 Dead / Orphaned Components to Decommission:
The following 9 components in `src/components/dashboard/` are not imported or rendered anywhere in the active navigation:
1. `CrisisOperationsColumn.tsx` (Orphaned staging artifact)
2. `DistrictOperationsColumn.tsx` (Orphaned staging artifact)
3. `EurekaDraggableDeck.tsx` (Experimental draggable canvas replaced by Bento grid)
4. `ExecutiveIntelligenceSummary.tsx` (Replaced by KPIRibbon)
5. `LiveNewsTicker.tsx` (Replaced by `BreakingNewsTicker.tsx`)
6. `MaharashtraGISDeck.tsx` (Replaced by `Cesium3DMap.tsx` / `GISMap.tsx`)
7. `OperationalAnalyticsDeck.tsx` (Replaced by `AnalyticalDock.tsx`)
8. `OperationsWorkspace.tsx` (Orphaned wrapper)
9. `SocialSentimentPulse.tsx` (Replaced by `SocialMediaAnalysis.tsx`)

### 13.2 Components to Retain:
- `MainDashboard.tsx`: **Retain as exclusive backup layout**.
- `ThreeColumnDashboard.tsx`: Active primary command center container.
- All active view components: `KPIRibbon`, `BreakingNewsTicker`, `Cesium3DMap`, `GISMap`, `DualFeedMediaStack`, `AnalyticalDock`, `DistrictScorecardBento`, `EmergencyAlert`, `CitizenServicesCard`, `SocialMediaAnalysis`, `LiveNewsQueue`, `LiveStreaming`, `DIPRDivisionsPanel`, `GovernmentSchemeHoardingsPanel`.

---

## 14. Summary of Audit Recommendations

1. **Unify Visual Palette**: Convert the black header and sidebar into a cohesive daylight command slate theme (`#F8FAFC` base, `#FFFFFF` cards, `#1D4ED8` active pills, `#0F172A` text).
2. **Decongest Viewport**: Remove subheadings and filler paragraphs; replace fixed heights with fluid flex budgets to ensure 100% responsiveness at 125%, 150%, and 175% zoom.
3. **Graphically Encode Numbers**: Add sparklines, donut breakdown rings, and SLA countdown gauges to numerical KPI cards.
4. **Enforce 0% Emojis**: Replace all 14 detected Unicode emojis with solid, accessible SVGs.
5. **Decouple Data & Calculations**: Split `calculations.tsx` into single-responsibility calculation engines and route all data ingestion through Next.js API handlers.
6. **Standardize Buttons & Tooltips**: Implement minimum 36px touch targets with tactile feedback and universal "i" info popovers for every government metric.
7. **Clean Up Component Tree**: Decommission the 9 orphaned dashboard components while preserving `MainDashboard.tsx` as backup.
