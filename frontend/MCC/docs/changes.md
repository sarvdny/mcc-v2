# DGIPR Maha-Command Center: Detailed Technical Change Specification

**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Auditor & Lead Architect:** Antigravity Engineering  
**Referenced Documents:** [audit.md](file:///d:/proj-eureks-re/frontend/MCC/docs/audit.md) • [tasks.md](file:///d:/proj-eureks-re/frontend/MCC/docs/tasks.md) • [graph.md](file:///d:/proj-eureks-re/frontend/MCC/docs/graph.md)

---

## 1. Executive Overview

This specification establishes the complete technical and visual blueprint for refactoring the **DGIPR Maha-Command Center (MCC)**. It provides exact file-by-file diff specifications, color tokens, layout transformations, mathematical formulas, SVG component mappings, API contract schemas, and animation parameters required to satisfy all 14 items of the client audit checklist.

---

## 2. Master File Modification, Creation & Decommissioning Map

```
Summary of File Operations:
├── Modified Core Files: 12 files
├── New API Route Handlers: 6 files
├── New Calculation Modules: 6 files
├── New Route Loading Boundaries: 4 files
├── New Shared UI Components: 2 files
├── Decommissioned Orphaned Files: 9 files
└── Preserved Backup Layout: 1 file (MainDashboard.tsx)
```

### 2.1 File Inventory Table

| File Path | Action | Primary Reason / Change |
| :--- | :---: | :--- |
| `src/components/layout/Header.tsx` | **Modify** | Convert black background `#070B14` to Daylight Slate; remove redundant subtitle tagline; add InfoTooltip. |
| `src/components/layout/Sidebar.tsx` | **Modify** | Convert dark `#0A0F1D` sidebar to Daylight Slate `#F8FAFC` with `#EBF3FF` active pills; add auto-collapse on narrow viewports. |
| `src/components/dashboard/ThreeColumnDashboard.tsx` | **Modify** | Remove rigid pixel heights (`h-[520px]`, `lg:h-[640px]`); implement fluid flex budgeting; add Framer Motion `layoutId` sliding tab indicator. |
| `src/components/zones/KPIRibbon/KPICard.tsx` | **Modify** | Strip filler subheadings; embed graphical mini-visualizations (sparklines, target bars, donut arcs, SLA ring); add `<InfoTooltip>`. |
| `src/components/dashboard/DistrictScorecardBento.tsx` | **Modify** | Add 4-pillar stacked progress bars and radial CPI score gauge. |
| `src/components/dashboard/CitizenServicesCard.tsx` | **Modify** | Replace raw text counter with 4-segment colored proportional bar; migrate from static data to API fetch; fix wire link button. |
| `src/components/leadership/GISMap/GISMap.tsx` | **Modify** | Strip subtitle filler; refine translucent Apple glass buttons; add InfoTooltip on layer controls. |
| `src/components/dashboard/GovernmentSchemeHoardingsPanel.tsx` | **Modify** | Remove filler subtitle paragraph; replace raw text stats with status visual badges. |
| `src/components/copilot/CopilotDrawer.tsx` | **Modify** | Replace Unicode emojis (`📊`, `📍`, `⚠️`) with Heroicons. |
| `src/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis.tsx` | **Modify** | Replace Unicode emojis (`↻`, `♥`, `👁`, `💬`, `▶`, `👍`) with solid SVGs. |
| `src/components/portal/AdvertisementsScreen.tsx` | **Modify** | Replace Unicode emojis (`🖼️`, `📋`); standardize button heights to min 36px; replace unpadded `✕` modal dismiss with rounded touch button. |
| `src/components/portal/FactCheckScreen.tsx` | **Modify** | Replace Unicode emojis (`📌`, `❌`, `⚠️`) with Heroicons. |
| `src/components/portal/LiveNewsScreen.tsx` | **Modify** | Replace Unicode emojis (`🎥`, `📺`) with Heroicons. |
| `src/components/portal/NewspaperScreen.tsx` | **Modify** | Replace Unicode scissors emoji (`✂`) with Lucide `ScissorsIcon`. |
| `src/lib/exportTelemetryPdf.ts` | **Modify** | Replace Unicode emblem (`🏛️`) with inline vectorized Maharashtra State Seal SVG. |
| `src/lib/calculations.tsx` | **Modify** | Refactor as unified facade re-exporting new single-responsibility calculation engines. |
| `src/lib/calculations/metricsEngine.ts` | **Create** | Pure mathematical formulas (CPI, SpeedScore, VolumeScore, Sentiment, Crisis SLA). |
| `src/lib/calculations/statewideAggregates.ts` | **Create** | 36-district regional aggregations, divisional rollups, ranking algorithms. |
| `src/lib/calculations/crisisProcessing.ts` | **Create** | 90-minute SLA compliance, incident triage scoring, escalation matrix. |
| `src/lib/calculations/mediaProcessing.ts` | **Create** | Ingestion normalization, OCR text analysis, multi-channel sentiment weightings. |
| `src/lib/calculations/attendanceProcessing.ts` | **Create** | Biometric presence calculations, punctuality indexes, shift adherence. |
| `src/lib/calculations/hooks.ts` | **Create** | React hooks (`useDashboardCalculations`, `useDistrictScorecard`). |
| `src/components/shared/InfoTooltip.tsx` | **Create** | Universal 16x16px circular "i" button with Radix glassmorphic info popover. |
| `src/components/shared/MiniSparkline.tsx` | **Create** | Lightweight SVG micro-sparkline component with peak indicators for KPI cards. |
| `src/app/api/v1/citizen-services/route.ts` | **Create** | Next.js API handler for citizen grievances and SLA metrics. |
| `src/app/api/v1/attendance/route.ts` | **Create** | Next.js API handler for collectorate biometric attendance telemetry. |
| `src/app/api/v1/advertisements/route.ts` | **Create** | Next.js API handler for release orders and advertising campaigns. |
| `src/app/api/v1/publications/route.ts` | **Create** | Next.js API handler for Lokrajya publication inventory and circulation. |
| `src/app/api/v1/live-events/route.ts` | **Create** | Next.js API handler for active press conference streams and speaker metadata. |
| `src/app/api/v1/clippings/route.ts` | **Create** | Next.js API handler for verified print clippings and OCR status. |
| `src/app/attendance/loading.tsx` | **Create** | Route skeleton boundary for Biometric Attendance screen. |
| `src/app/advertisements/loading.tsx` | **Create** | Route skeleton boundary for State Advertisements screen. |
| `src/app/publications/loading.tsx` | **Create** | Route skeleton boundary for Government Publications screen. |
| `src/app/live-events/loading.tsx` | **Create** | Route skeleton boundary for Live Video Broadcasts screen. |
| `src/components/dashboard/CrisisOperationsColumn.tsx` | **Delete** | Decommission orphaned staging artifact. |
| `src/components/dashboard/DistrictOperationsColumn.tsx` | **Delete** | Decommission orphaned staging artifact. |
| `src/components/dashboard/EurekaDraggableDeck.tsx` | **Delete** | Decommission orphaned experimental canvas. |
| `src/components/dashboard/ExecutiveIntelligenceSummary.tsx` | **Delete** | Decommission superseded summary component. |
| `src/components/dashboard/LiveNewsTicker.tsx` | **Delete** | Decommission redundant ticker (replaced by `BreakingNewsTicker.tsx`). |
| `src/components/dashboard/MaharashtraGISDeck.tsx` | **Delete** | Decommission redundant 2D deck (replaced by `Cesium3DMap.tsx`). |
| `src/components/dashboard/OperationalAnalyticsDeck.tsx` | **Delete** | Decommission redundant deck (replaced by `AnalyticalDock.tsx`). |
| `src/components/dashboard/OperationsWorkspace.tsx` | **Delete** | Decommission orphaned wrapper. |
| `src/components/dashboard/SocialSentimentPulse.tsx` | **Delete** | Decommission redundant pulse (replaced by `SocialMediaAnalysis.tsx`). |
| `src/components/dashboard/MainDashboard.tsx` | **PRESERVE** | **Explicitly retained as the single historical backup layout**. |

---

## 3. Visual Refresh & Daylight Government Command Palette

### 3.1 Design Token System
To eliminate the disruptive "black island" frame and provide a cohesive, daylight war-room experience, the following palette tokens are established:

```css
/* Daylight Government Command Palette Tokens */
:root {
  /* Canvas & Backgrounds */
  --gov-canvas-base: #F8FAFC;        /* Cool-slate daylight canvas */
  --gov-canvas-subtle: #F1F5F9;      /* Inset wells, table headers */
  --gov-surface-card: #FFFFFF;       /* Pure white elevated cards */
  --gov-surface-overlay: rgba(255, 255, 255, 0.88); /* Translucent glass */
  
  /* Borders & Dividers */
  --gov-border-subtle: #E2E8F0;      /* Hairline card boundary (1px) */
  --gov-border-focus: #94A3B8;       /* Interactive element focus ring */
  
  /* Typography Colors */
  --gov-text-primary: #0F172A;       /* Slate-900: Primary high-contrast text */
  --gov-text-secondary: #475569;     /* Slate-600: Secondary labels */
  --gov-text-muted: #64748B;         /* Slate-500: Auxiliary metadata */
  
  /* Brand & Navigation Accents */
  --gov-brand-blue: #1D4ED8;         /* Executive Maharashtra Blue */
  --gov-brand-blue-hover: #1E40AF;
  --gov-brand-blue-soft: #EBF3FF;    /* Active navigation pill background */
  --gov-brand-blue-border: #BFDBFE;  /* Active pill border */
  
  /* Semantic Status Signals */
  --gov-signal-alert: #EF4444;       /* Crimson Red: Deficit / Crisis (<40) */
  --gov-signal-alert-soft: #FEF2F2;
  --gov-signal-warning: #F59E0B;     /* Vivid Amber: Warning / Attention (40-60) */
  --gov-signal-warning-soft: #FFFBEB;
  --gov-signal-success: #10B981;     /* Emerald Green: Optimal (>80) */
  --gov-signal-success-soft: #ECFDF5;
  --gov-signal-info: #3B82F6;        /* Sky Blue: Informational broadcasts */
  --gov-signal-info-soft: #EFF6FF;
}
```

### 3.2 Header & Sidebar Transformation Spec

#### `src/components/layout/Header.tsx`
- **Target Line 160**:
  ```diff
  - <header className="sticky top-0 z-40 bg-[#070B14] border-b border-slate-800/90 shadow-lg text-white">
  + <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs text-slate-900 transition-colors">
  ```
- **Breadcrumbs & Branding**:
  ```diff
  - <span className="text-slate-400 font-medium">Supervision: DG Desk</span>
  + <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
  +   DG Desk Live
  + </span>
  ```
- **Search Input**:
  ```diff
  - <input className="bg-slate-900 border border-slate-700 text-white placeholder-slate-500" />
  + <input className="bg-slate-100/80 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500" />
  ```
- **Officer Profile**:
  ```diff
  - <div className="bg-slate-900 border border-slate-800 text-slate-200">
  + <div className="bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs">
  ```

#### `src/components/layout/Sidebar.tsx`
- **Container Styling**:
  ```diff
  - <aside className="bg-slate-950 border-r border-slate-800 text-slate-300">
  + <aside className="bg-[#F8FAFC] border-r border-slate-200/90 text-slate-600 transition-all duration-200">
  ```
- **Active Navigation Pill**:
  ```diff
  - className={isActive ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-slate-400 hover:text-white hover:bg-slate-900"}
  + className={isActive ? "bg-[#EBF3FF] text-[#1D4ED8] font-bold shadow-xs border border-blue-200/80" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"}
  ```
- **Nav Group Headers**:
  ```diff
  - <div className="text-slate-500 uppercase tracking-wider text-[10px]">
  + <div className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
  ```

---

## 4. Graphical Representation of Numerical Metrics

### 4.1 KPI Ribbon Card Visualizations (`src/components/zones/KPIRibbon/KPICard.tsx`)

Every primary KPI card is upgraded from raw text to an active graphical micro-visualization:

#### 1. Press Releases Metric
- **Current**: `342` (+14%) with subtitle `Target: 300 (100%)`.
- **Graphical Transformation**:
  - Remove subtitle.
  - Render an embedded **Target Progress Bar**:
    - Background: `h-2 rounded-full bg-slate-100 overflow-hidden relative flex`.
    - Base Target (100% / 300 releases): `w-[87%] bg-blue-600 rounded-l-full`.
    - Overflow Achievement (+14% / 42 releases): `w-[13%] bg-emerald-500 rounded-r-full`.
    - Overlay Marker: Vertical hairline at the 300-target line with `Target` indicator.

#### 2. Media Placements Metric
- **Current**: `4,592` with subtitle `98.2% Verified Coverage`.
- **Graphical Transformation**:
  - Remove subtitle.
  - Embed **7-Day Micro-Sparkline (`MiniSparkline.tsx`)**:
    - SVG path: `M 0,22 Q 15,18 30,12 T 60,8 T 90,14 T 120,4`.
    - Line: `stroke-blue-600 stroke-[2] fill-none`.
    - Gradient Fill: `fill="url(#sparkline-gradient)"` fading to `transparent`.
    - End Peak Indicator: Glowing dot at terminal coordinate with live velocity badge `+320/hr`.

#### 3. Net Sentiment Index Metric
- **Current**: `81.9%` with subtitle `Print 85% • TV 82% • Social 81% • Comments 76%`.
- **Graphical Transformation**:
  - Remove subtitle.
  - Embed **3-Segment Diverging Sentiment Arc**:
    - Semi-circular SVG gauge or horizontal stacked distribution pill:
      - Positive: 82% (`bg-emerald-500`)
      - Neutral: 12% (`bg-slate-300`)
      - Negative: 6% (`bg-rose-500`)
    - Interactive hover reveals exact per-stream weights (Print 35%, TV 25%, Social 25%, Citizen 15%).

#### 4. Crisis SLA & TAT Metric
- **Current**: `0` open with subtitle `0 Active in SLA • 94.2% TAT`.
- **Graphical Transformation**:
  - Remove subtitle.
  - Embed **Circular 90-Minute SLA Countdown Ring**:
    - SVG ring (radius 18, circumference 113.1):
      - Background Track: `stroke-slate-100 stroke-[3]`.
      - Progress Value: `stroke-emerald-500 stroke-[3] stroke-dashoffset: 6.5` (94.2% compliance).
      - Center Metric: `94%` inside ring.
      - Status Badge: `Zero Breaches (100% on-track)`.

#### 5. Field Events Metric
- **Current**: `142` briefings with subtitle `100% Dispatched on-time`.
- **Graphical Transformation**:
  - Remove subtitle.
  - Embed **Dispatch Execution Bar**:
    - 2-tone bullet bar showing Executed (142) vs Scheduled (150).
    - Status pill: `94.6% Completed Today`.

---

## 5. Viewport-Locked Decongestion & Subheading Trimming

### 5.1 Subheading Removal Schedule

| Component | Current Subtitle / Filler Text | Action | Replaced By |
| :--- | :--- | :---: | :--- |
| `Header.tsx` | `MH \| DGIPR Command Center • Supervision: DG Desk` | **Delete** | Compact badge: `DG Desk Live` + State Seal. |
| `KPICard.tsx` (Card 1) | `Target: 300 (100%)` | **Delete** | Embedded Target Progress Bar. |
| `KPICard.tsx` (Card 2) | `98.2% Verified Coverage` | **Delete** | Embedded 7-Day Micro-Sparkline. |
| `KPICard.tsx` (Card 3) | `Print 85% • TV 82% • Social 81% • Comments 76%` | **Delete** | Embedded Diverging Sentiment Arc. |
| `KPICard.tsx` (Card 4) | `0 Active in SLA` | **Delete** | Embedded Circular SLA Countdown Ring. |
| `KPICard.tsx` (Card 5) | `100% Dispatched on-time` | **Delete** | Embedded Dispatch Execution Bar. |
| `GISMap.tsx` | `36 Districts, Highway Network, Water Reservoirs & Sub-District Talukas` | **Delete** | Interactive Layer Pill Switcher. |
| `GovernmentSchemeHoardingsPanel.tsx` | `Nightly 02:00 IST telemetry sync with GPS verification & illumination status.` | **Delete** | Status pill: `GPS Sync: 02:00 IST` + `<InfoTooltip>`. |
| `CitizenServicesCard.tsx` | `Public Service Guarantee Act • 90-Min Resolution Target` | **Delete** | InfoTooltip explaining RTS Act standards. |

### 5.2 Multi-Scale Flex Layout Rules

To maintain a zero-scroll command center at 100%, 125%, 150%, and 175% zoom:
1. **Remove Fixed Heights**:
   - In `ThreeColumnDashboard.tsx`: Replace `h-[520px]`, `h-[585px]`, `lg:h-[640px]` with:
     ```css
     h-[calc(100vh-270px)] min-h-[440px]
     ```
2. **Auto-Collapse Left Rail on High Zoom / Narrow Viewports**:
   - In `DashboardLayout.tsx`:
     ```typescript
     useEffect(() => {
       const handleResize = () => {
         if (window.innerWidth < 1440) {
           setIsSidebarCollapsed(true);
         }
       };
       handleResize();
       window.addEventListener('resize', handleResize);
       return () => window.removeEventListener('resize', handleResize);
     }, []);
     ```
3. **Card Internal Overflow Containment**:
   - Media stack lists, analytical tables, and leaderboards must use `flex-1 min-h-0 overflow-y-auto` with slim WebKit scrollbars (`scrollbar-thin scrollbar-thumb-slate-200`).

---

## 6. Button Ergonomics & Tactile Interaction Standards

### 6.1 Standardization Specifications
1. **Primary Action Buttons**:
   - Height: `h-9` (36px desktop) / `h-11` (44px mobile touch).
   - Padding: `px-4 py-2`.
   - Typography: `text-xs font-semibold tracking-wide`.
   - Apple Tactile State: `active:scale-95 transition-transform duration-100`.
   - Focus Ring: `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1`.

2. **Modal Dismiss & Icon Buttons**:
   - Replace bare text characters (e.g. `✕`) with:
     ```tsx
     <button
       aria-label="Close dialog"
       className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
     >
       <XMarkIcon className="w-4 h-4 stroke-[2]" />
     </button>
     ```

3. **Module Tab Sliding Pill Indicator**:
   - In `ThreeColumnDashboard.tsx`, wrap the active tab with Framer Motion:
     ```tsx
     <button
       onClick={() => setActiveView(tab.id)}
       className="relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors"
     >
       {activeView === tab.id && (
         <motion.div
           layoutId="activeModulePill"
           className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200"
           transition={{ type: "spring", stiffness: 450, damping: 35 }}
         />
       )}
       <span className="relative z-10">{tab.label}</span>
     </button>
     ```

---

## 7. Universal `<InfoTooltip>` Component Specification

### 7.1 Component Architecture (`src/components/shared/InfoTooltip.tsx`)

```tsx
'use client';

import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { METRIC_DEFINITIONS } from '@/data/metricDefinitions';

interface InfoTooltipProps {
  termKey: string;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  termKey,
  className = '',
  align = 'center',
}) => {
  const item = METRIC_DEFINITIONS[termKey] || {
    titleEn: termKey,
    titleMr: '',
    definitionEn: 'Government standard operational metric.',
    calculation: 'Measured via live state telemetry pipeline.',
    frequency: 'Real-time',
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`Metric information for ${item.titleEn}`}
          className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
        >
          <span className="text-[10px] font-bold leading-none font-serif">i</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align={align}
          sideOffset={6}
          className="z-50 w-72 rounded-2xl bg-white/95 backdrop-blur-xl p-3.5 shadow-xl border border-slate-200/90 text-slate-800 text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
            <div>
              <p className="font-bold text-slate-900 text-xs">{item.titleEn}</p>
              {item.titleMr && <p className="text-[10px] text-slate-500">{item.titleMr}</p>}
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200/60">
              {item.frequency || 'Live'}
            </span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
            {item.definitionEn}
          </p>
          {item.calculation && (
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">
                Formula / Computation
              </span>
              <code className="text-[10px] text-blue-800 font-mono break-words leading-tight">
                {item.calculation}
              </code>
            </div>
          )}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
```

---

## 8. Zero-Emoji Solid SVG Migration Specification

Every raw Unicode emoji detected in the codebase is replaced with an accessible SVG:

| Target File | Line | Found Emoji | Context | Replacement SVG Code |
| :--- | :---: | :---: | :--- | :--- |
| `src/components/copilot/CopilotDrawer.tsx` | 736 | `📊` | State Rankings Prompt | `<ChartBarIcon className="w-3.5 h-3.5 text-blue-600 inline mr-1.5 shrink-0" />` |
| `src/components/copilot/CopilotDrawer.tsx` | 742 | `📍` | District Breakdown Prompt | `<MapPinIcon className="w-3.5 h-3.5 text-rose-600 inline mr-1.5 shrink-0" />` |
| `src/components/copilot/CopilotDrawer.tsx` | 748 | `⚠️` | Crisis Rumors Prompt | `<ExclamationTriangleIcon className="w-3.5 h-3.5 text-amber-600 inline mr-1.5 shrink-0" />` |
| `src/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis.tsx` | 264 | `↻` | Repost Counter | `<ArrowPathRoundedSquareIcon className="w-3.5 h-3.5 inline mr-1 text-slate-400 shrink-0" />` |
| `src/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis.tsx` | 264 | `♥` | Likes Counter | `<HeartIcon className="w-3.5 h-3.5 inline mr-1 text-rose-500 shrink-0" />` |
| `src/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis.tsx` | 314 | `👁` | Views Counter | `<EyeIcon className="w-3.5 h-3.5 inline mr-1 text-blue-500 shrink-0" />` |
| `src/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis.tsx` | 314 | `💬` | Comments Counter | `<ChatBubbleLeftIcon className="w-3.5 h-3.5 inline mr-1 text-indigo-500 shrink-0" />` |
| `src/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis.tsx` | 316 | `▶` | Video Plays Counter | `<PlayIcon className="w-3.5 h-3.5 inline mr-1 text-emerald-500 shrink-0" />` |
| `src/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis.tsx` | 316 | `👍` | Video Likes Counter | `<HandThumbUpIcon className="w-3.5 h-3.5 inline mr-1 text-amber-500 shrink-0" />` |
| `src/components/portal/AdvertisementsScreen.tsx` | 657 | `🖼️` | Card View Tab | `<Squares2X2Icon className="w-4 h-4 inline mr-1" />` |
| `src/components/portal/AdvertisementsScreen.tsx` | 667 | `📋` | Table View Tab | `<TableCellsIcon className="w-4 h-4 inline mr-1" />` |
| `src/components/portal/FactCheckScreen.tsx` | 217 | `📌` | Claim Status Pin | `<BookmarkIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />` |
| `src/components/portal/FactCheckScreen.tsx` | 217 | `❌` | Fake Claim Stamp | `<XCircleIcon className="w-3.5 h-3.5 text-rose-600 shrink-0" />` |
| `src/components/portal/FactCheckScreen.tsx` | 334 | `⚠️` | Alert Warning Banner | `<ShieldExclamationIcon className="w-5 h-5 text-amber-600 shrink-0" />` |
| `src/components/portal/LiveNewsScreen.tsx` | 644 | `🎥` | Live Streams Tab | `<VideoCameraIcon className="w-4 h-4 inline mr-1" />` |
| `src/components/portal/LiveNewsScreen.tsx` | 668 | `📺` | Broadcast Telemetry Tab | `<TvIcon className="w-4 h-4 inline mr-1" />` |
| `src/components/portal/NewspaperScreen.tsx` | 1181 | `✂` | Clip Tool Button | `<Scissors className="w-4 h-4 mr-1 text-slate-700" />` |
| `src/lib/exportTelemetryPdf.ts` | 219 | `🏛️` | PDF Header Government Seal | Inline SVG Vectorized State Seal Path |

---

## 9. Modular Calculation Engine Architecture

### 9.1 Decoupled Module Architecture (`src/lib/calculations/`)

```
src/lib/calculations/
├── metricsEngine.ts          # Pure mathematical calculations (CPI, Speed, Volume, SLA)
├── statewideAggregates.ts     # 36-district matrices, regional rollups, rank sorting
├── crisisProcessing.ts       # 90-min SLA compliance, triage urgency scoring
├── mediaProcessing.ts        # OCR text parsing, 4-channel sentiment weightings
├── attendanceProcessing.ts   # Biometric attendance rates, punctuality scores
└── hooks.ts                  # React hooks (useDashboardCalculations, useDistrictScorecard)
```

### 9.2 Authoritative Mathematical Formulas

1. **Composite Communication Performance Index (CPI)**:
   $$\text{CPI} = 0.30 \times \text{SpeedScore} + 0.25 \times \text{VolumeScore} + 0.25 \times \text{SentimentIndex} + 0.20 \times \text{CrisisSLAScore}$$

2. **Speed Score (TAT)**:
   $$\text{SpeedScore} = \text{clamp}\left(100 - (\text{AvgTAT} - 15) \times 1.5, \, 0, \, 100\right)$$
   *(Optimal benchmark: 15 minutes. Breached threshold: >80 minutes yields 0).*

3. **Volume Score**:
   $$\text{VolumeScore} = \text{clamp}\left(\frac{\text{ActualReleases}}{\text{TargetReleases}} \times 100, \, 0, \, 100\right)$$

4. **4-Stream Unified Sentiment Index**:
   $$\text{Sentiment} = 0.35 \times \text{Print} + 0.25 \times \text{TV} + 0.25 \times \text{Social} + 0.15 \times \text{CitizenComments}$$

5. **Crisis Resolution Rate (90-Minute SLA)**:
   $$\text{CrisisSLA} = \frac{\text{Incidents Resolved in } \le 90\text{ min}}{\text{Total Crisis Incidents Ingested}} \times 100$$

6. **Biometric Attendance Rate**:
   $$\text{AttendanceRate} = \frac{\text{Present Staff}}{\text{Sanctioned Staff Strength}} \times 100$$

### 9.3 Facade Re-export (`src/lib/calculations.tsx`)
`src/lib/calculations.tsx` will re-export all functions from the modular engines to preserve backward compatibility with all existing test suites.

---

## 10. Backend API Ingestion Endpoints & Fixture Migration

### 10.1 New API Handlers Specification

#### 1. `GET /api/v1/citizen-services`
- **File**: `src/app/api/v1/citizen-services/route.ts`
- **Query Parameters**: `division?: string`, `district?: string`, `period?: string`
- **Payload Schema**:
  ```json
  {
    "summary": {
      "totalGrievances": 1420,
      "activeCases": 48,
      "slaBreaches": 0,
      "resolvedCount": 1372,
      "resolutionRate": 96.6
    },
    "recentTickets": [
      {
        "id": "RTS-2026-9812",
        "department": "Revenue & Forest",
        "district": "Pune",
        "tatMinutes": 42,
        "status": "Resolved"
      }
    ],
    "timestamp": "2026-10-29T00:00:00Z"
  }
  ```

#### 2. `GET /api/v1/attendance`
- **File**: `src/app/api/v1/attendance/route.ts`
- **Payload Schema**:
  ```json
  {
    "stateSummary": {
      "totalOffices": 36,
      "totalStaff": 1840,
      "presentCount": 1692,
      "overallPercentage": 91.95,
      "onTimePercentage": 88.4
    },
    "offices": [ ... ]
  }
  ```

#### 3. `GET /api/v1/advertisements`
- **File**: `src/app/api/v1/advertisements/route.ts`
- **Payload Schema**:
  ```json
  {
    "summary": {
      "totalReleaseOrders": 420,
      "totalBudgetCr": 24.5,
      "verifiedPrintCoverage": 98.2
    },
    "campaigns": [ ... ]
  }
  ```

#### 4. `GET /api/v1/publications`, `GET /api/v1/live-events`, `GET /api/v1/clippings`
- Corresponding route handlers in `src/app/api/v1/` returning standardized JSON payloads.

---

## 11. Complete Loader Architecture

### 11.1 New Route Loading Boundaries (`loading.tsx`)

Each of the 4 missing routes will receive an Apple-grade shimmering skeleton:

1. `src/app/attendance/loading.tsx`: 4 metric cards skeleton + 36-row office table skeleton with pulse animation.
2. `src/app/advertisements/loading.tsx`: Filter ribbon skeleton + 6-card release order campaign grid skeleton.
3. `src/app/publications/loading.tsx`: Publication cover carousel skeleton + inventory table skeleton.
4. `src/app/live-events/loading.tsx`: 16:9 video player skeleton + live transcript feed skeleton.

---

## 12. Component Decommissioning Plan

Per explicit instruction:
> *"make sure we dont have any extra component except the `src/components/dashboard/MainDashboard.tsx` because it is for backup. for direct switching for the older layout."*

### 12.1 Files to Safely Delete:
1. `src/components/dashboard/CrisisOperationsColumn.tsx`
2. `src/components/dashboard/DistrictOperationsColumn.tsx`
3. `src/components/dashboard/EurekaDraggableDeck.tsx`
4. `src/components/dashboard/ExecutiveIntelligenceSummary.tsx`
5. `src/components/dashboard/LiveNewsTicker.tsx`
6. `src/components/dashboard/MaharashtraGISDeck.tsx`
7. `src/components/dashboard/OperationalAnalyticsDeck.tsx`
8. `src/components/dashboard/OperationsWorkspace.tsx`
9. `src/components/dashboard/SocialSentimentPulse.tsx`

### 12.2 Preservation Certification:
- `src/components/dashboard/MainDashboard.tsx` will remain **100% untouched and functional** as the designated historical fallback layout.

---

## 13. Quality Verification & Acceptance Gates

1. **Zero TypeScript Errors**: `npx tsc --noEmit` must report 0 errors.
2. **100% Passing Tests**: All 186 unit/integration tests (`npm test`) must pass without regression.
3. **Clean Production Build**: `npm run build` must compile cleanly across all 43 static/dynamic routes.
4. **Visual Multi-Scale Validation**: Zero overflow on 100%, 125%, 150%, and 175% desktop zoom levels.
