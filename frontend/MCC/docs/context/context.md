# Maha-Command Center (MCC) — Master Context & Architectural Blueprint

> **CRITICAL REPOSITORY DIRECTIVE**:
> This document is the single authoritative architectural context for the **Maha-Command Center (MCC)** project. Whenever changes, additions, refactors, or optimizations are made anywhere in this codebase, **this file MUST be continuously updated** to reflect the exact state, file structure, component specifications, and operational workflows of the system.

---

## 1. Executive Overview & Institutional Purpose

### 1.1 Project Identity
- **Project Name:** Maha-Command Center (MCC) / DGIPR Institutional Command & Media Intelligence System
- **Owner Organization:** Directorate General of Information and Public Relations (DGIPR / माहिती व जनसंपर्क महासंचालनालय), Government of Maharashtra, Mantralaya, Mumbai.
- **Repository Location:** `d:\proj-eureks-re\frontend\MCC`
- **Application Class:** Mission-critical, 24x7 state executive situational awareness portal, real-time media telemetry dashboard, multi-channel crisis communication response desk, and public perception monitoring cockpit.

### 1.2 Core Mandates
1. **Statewide Media Surveillance:** Real-time multi-channel aggregation across 18+ daily newspapers (OCR digitisation), 6 broadcast TV news channels, digital wire services, and state social media handles (X/Twitter, Facebook, Instagram, YouTube).
2. **Communication Performance Index (CPI):** Algorithmic scoring of all 36 Maharashtra districts out of 100 points based on:
   - Volume Score (35 pts max)
   - TAT / Speed Score (25 pts max)
   - Sentiment Index (25 pts max)
   - Crisis SLA Resolution Rate (15 pts max)
3. **90-Minute Crisis SLA & Rumor Refutation:** Strict standard operating procedure for monitoring high-velocity misinformation and executing authorized rebuttals signed off by District Collectors or the Director General within 90 minutes.
4. **Bilingual Parity:** Seamless, instantaneous Marathi (मराठी) Devanagari and English language toggling across every dashboard widget, data table, chart axis, modal, and export document.
5. **GIGW 3.0 & UX4G Compliance:** Strict compliance with the Guidelines for Indian Government Websites (GIGW 3.0), WCAG 2.1 AA accessibility, accessible data tables for charts (`View as Table`), accessible tooltips on hover and keyboard focus (`<MetricTip>`), high contrast ratios, screen reader semantics (`aria-*`, `scope="col"`), and official State Government emblems/branding.
6. **Zero External Vulnerability Surface:** Strict URL sanitization against malicious protocols (`javascript:`, `data:`, `vbscript:`, `file:`, `blob:`), verified domain allowlist checking with leaving-portal confirmation modals (`src/lib/domainAllowlist.ts`, `<OutboundLink>`), 12-hour session timeout enforcement using HMAC-SHA256 JWT tokens, and WebAuthn FIDO2 hardware biometric security.

---

## 2. Technology Stack & Runtime Dependencies

The project uses **461 installed npm packages** managed via `package-lock.json`.

| Layer | Technology | Version | Purpose & Constraints |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.4.1` | Turbopack dev, experimental CPU throttling (`cpus: 1`), breaking-changes compliance (`AGENTS.md`) |
| **Runtime / Library** | React | `19.3.1` | React 19 Server Components, Client Components (`'use client'`), Concurrent transitions |
| **Styling** | Tailwind CSS | `3.4.1` | Utility-first with custom institutional design system tokens |
| **State Management**| Zustand | `5.0.15`| Lightweight global reactive store with LocalStorage persistence and selectors |
| **Accessible Tooltips**| @radix-ui/react-tooltip | `^1.1.8` | WAI-ARIA and GIGW 3.0 compliant hover and keyboard-focus tooltips for figures (`<MetricTip>`) |
| **Data Visualisation**| Apache ECharts | `6.1.0` | High-performance canvas/SVG charting, gauge meters, GIS topological layers |
| **Security / Auth** | Jose | `^6.0.8` | Cryptographic JWT signing and verification (`HS256`, 12-hour TTL enforcement) |
| **Geospatial Engine**| D3-Geo & TopoJSON | `^3.1.2` / `^3.0.2`| Precise SVG projection & polygon simplification of all 36 Maharashtra districts |
| **Icons & Symbols** | Custom Heroicons Pack | Handcrafted | Pure SVG 24x24 Solid Heroicons (`src/symbols.jsx`) and Material UI icons |
| **Testing** | Node.js Test Runner | Native (`node:test`) | Ultra-fast unit & integration testing via `--experimental-strip-types` (**137 tests passing across 43 suites**) |

---

## 3. High-Level System Architecture & Layout Flow

```
[ Incoming Telemetry & Media Feeds ]
     │ (Print OCR, TV Broadcasts, Wire Feeds, Social Scraping)
     ▼
[ Realtime Ingestion Pipeline / Hermes Backend ]
     │
     ├──► POST /api/v1/copilot/... ──► [ Open UI Copilot & AI Query Engine ]
     ├──► POST /api/ai/chat ──────────► [ Route-Aware AI Assistant Widget ]
     ├──► GET  /api/v1/ticker ────────► [ Breaking News Saffron Ticker ]
     ├──► GET  /api/v1/districts/... ─► [ 36 Districts Registry & CPI Engine ]
     ├──► GET  /api/v1/hoardings ─────► [ Scheme Hoardings & Nightly Sync ]
     │                                  └── Protected /api/v1/hoardings/refresh (02:00 IST)
     ▼
[ Next.js 16 Application Shell (DashboardLayout) ]
     │
     ├── [ Header ] (Gov Emblem, Persona Switcher, Bilingual Toggle, Biometrics, Glossary Quick Access)
     ├── [ Sidebar ] (20 Screen Links, Command Center Accordion, Incident Badges, Docked Collapse Toggle)
     ├── [ DashboardToolbar ] (Mounted on secondary routes; hidden on main dashboard to eliminate 4-bar clutter)
     │
     ├──► [ ThreeColumnDashboard (Main Dashboard View) ]
     │     ├── Tier 1: Unified Context & Navigation Bar (Identity, View Switcher Segmented Control, Scope Filters: Division, District, Timeframe, Export)
     │     ├── Tier 2: Unified Dual-Mode Live Wire Ticker (40px, pause-on-hover, semantic pills: [BREAKING], [ALERT], [NOTICE])
     │     ├── KPI Ribbon: 5 Core Metrics with unified Last Synced badge and GIGW tooltips
     │     └── 3-Column Bento Operational Workspace (640px height budget with scroll isolation):
     │           ├── Column 1 (Left 3/12): Incident Response Rail — Crisis Monitor docked above Grievances & SLA
     │           ├── Column 2 (Center 6/12): Maharashtra State GIS with grid-cols-12 filter bar, single SVG text, and 2x2 Bento Scorecard Drawer
     │           └── Column 3 (Right 3/12): Full-height Social Pulse & Multi-Platform Listening Stream (X Feed, Meta/DD News)
     │
     └──► [ Global Floating AI Assistant FAB & Copilot Drawer ]
```

---

## 4. Complete Repository File Structure

```
frontend/MCC/
├── package.json                            # Scripts, dependencies (React 19, Next 16, Zustand 5, Radix Tooltip)
├── package-lock.json                       # 461 locked packages
├── next.config.ts                          # Next.js 16 compiler options & SVG loaders
├── tailwind.config.ts                      # Extended institutional theme tokens, fonts, colors
├── task.md                                 # Task tracking checklist
├── tsconfig.json                           # TypeScript compiler settings & `@/*` path alias
│
├── .github/
│   └── workflows/
│       └── frontend-test.yml               # Automated CI test workflow running Node test suite
│
├── doc/
│   └── context.md                          # Synced root context mirror
├── docs/
│   └── context/
│       └── context.md                      # [THIS FILE] Authoritative project context & code registry
│
├── public/
│   ├── favicon.svg                         # Browser tab favicon
│   ├── icon.svg                            # Application icon
│   ├── MAHAGOV_ICON.svg                    # Public static Maharashtra emblem
│   └── videos/
│       └── sonam_wangchuk_live.mp4         # Fallback test video loop for media monitoring
│
├── scripts/
│   └── build-maharashtra-geo.mjs           # TopoJSON to SVG map generator for 36 districts
│
├── src/
│   ├── calculations.tsx                    # Root shortcut re-export for authoritative calculations engine (@/calculations)
│   ├── middleware.ts                       # Next.js route guard, JWT verification, /login redirect
│   ├── symbols.jsx                         # Central Solid Heroicons (24x24) pure SVG icon set
│   │
│   ├── app/                                # Next.js App Router root (25 route directories)
│   │   ├── favicon.ico                     # Favicon file
│   │   ├── globals.css                     # Institutional CSS tokens, animations, custom scrollbars
│   │   ├── icon.svg                        # Favicon SVG
│   │   ├── layout.tsx                      # Root HTML layout, font setup, mounts global AI FAB
│   │   ├── loading.tsx                     # Route-level suspense boundary wrapping persistent skeleton
│   │   ├── page.tsx                        # Root route redirecting to ThreeColumnDashboard
│   │   │
│   │   ├── account/
│   │   │   └── page.tsx                    # Account & security settings view
│   │   ├── activities/
│   │   │   ├── loading.tsx                 # Activities skeleton fallback
│   │   │   └── page.tsx                    # Daily ministerial activities & events
│   │   ├── advertisements/
│   │   │   └── page.tsx                    # Government campaign hoarding monitoring screen
│   │   ├── attendance/
│   │   │   └── page.tsx                    # 36 District Information Offices Aadhaar biometric attendance (with date picker)
│   │   ├── command-center/
│   │   │   ├── loading.tsx                 # Command Center skeleton fallback
│   │   │   ├── page.tsx                    # Main Command Center operational view
│   │   │   ├── pipeline-flow/
│   │   │   │   ├── loading.tsx             # Pipeline flow skeleton
│   │   │   │   └── page.tsx                # Animated 6-stage telemetry data pipeline diagram
│   │   │   └── raw-ingestion/
│   │   │       ├── loading.tsx             # Ingestion monitor skeleton
│   │   │       └── page.tsx                # Raw Kafka/WebSocket event stream inspector
│   │   ├── crisis/
│   │   │   ├── loading.tsx                 # Crisis room skeleton
│   │   │   └── page.tsx                    # 90-Minute Crisis SLA response desk & rebuttal engine
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # Primary Executive Three-Column Dashboard view
│   │   ├── districts/
│   │   │   ├── loading.tsx                 # Districts screen skeleton
│   │   │   └── page.tsx                    # 36 Districts Leaderboard, CPI scores, points-lost matrix
│   │   ├── fact-check/
│   │   │   ├── loading.tsx                 # Fact check skeleton
│   │   │   └── page.tsx                    # Fact-checking verification desk & rumor rebuttals (with source badges)
│   │   ├── glossary/
│   │   │   └── page.tsx                    # Interactive Metric Standards & Glossary dictionary screen
│   │   ├── konkan-index/
│   │   │   ├── loading.tsx                 # Konkan index skeleton
│   │   │   └── page.tsx                    # Konkan Revenue Division specialized performance index
│   │   ├── live-events/
│   │   │   └── page.tsx                    # Live CMO press briefing stream & schedule
│   │   ├── live-news/
│   │   │   ├── loading.tsx                 # Live news skeleton
│   │   │   └── page.tsx                    # 24/7 TV news channel split-view & live queue
│   │   ├── login/
│   │   │   └── page.tsx                    # Authenticated session server-guard & login page
│   │   ├── media/
│   │   │   ├── loading.tsx                 # Media center skeleton
│   │   │   └── page.tsx                    # Multi-channel media monitoring portal
│   │   ├── media-intelligence/
│   │   │   ├── loading.tsx                 # Media intelligence skeleton
│   │   │   └── page.tsx                    # Sentiment distribution & narrative clustering
│   │   ├── newspaper/
│   │   │   ├── loading.tsx                 # Newspaper archive skeleton
│   │   │   └── page.tsx                    # 516 newspaper clippings OCR reader
│   │   ├── notifications/
│   │   │   ├── loading.tsx                 # Notifications skeleton
│   │   │   └── page.tsx                    # System alert and operational notifications log
│   │   ├── press-releases/
│   │   │   ├── loading.tsx                 # Press release studio skeleton
│   │   │   └── page.tsx                    # Press release drafting & workflow (with Under Review explanations)
│   │   ├── profile/
│   │   │   ├── loading.tsx                 # Profile skeleton
│   │   │   └── page.tsx                    # Officer credentials and clearance details
│   │   ├── publications/
│   │   │   └── page.tsx                    # Official Lokrajya magazine, gazettes & statistical booklets
│   │   ├── reports/
│   │   │   ├── loading.tsx                 # Reports skeleton
│   │   │   └── page.tsx                    # Executive summary reports, PDF telemetry exporter
│   │   ├── settings/
│   │   │   ├── loading.tsx                 # Settings skeleton
│   │   │   └── page.tsx                    # Dashboard preferences, theme, font scaling, API keys
│   │   ├── system-monitoring/
│   │   │   ├── loading.tsx                 # System monitoring skeleton
│   │   │   ├── page.tsx                    # Telemetry mesh monitoring & system health
│   │   │   ├── pipeline-flow/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx                # Alias to command-center/pipeline-flow
│   │   │   └── raw-ingestion/
│   │   │       ├── loading.tsx
│   │   │       └── page.tsx                # Alias to command-center/raw-ingestion
│   │   │
│   │   └── api/                            # Backend Route Handlers (Next.js 16)
│   │       ├── ai/
│   │       │   └── chat/route.ts           # Route-aware AI chat completion endpoint with local KB
│   │       ├── auth/
│   │       │   ├── login/route.ts          # Authenticates credentials, signs JWT, sets HTTP-only cookie
│   │       │   ├── logout/route.ts         # Clears auth cookie & session
│   │       │   └── me/route.ts             # Returns verified user session from JWT cookie
│   │       ├── crisis/
│   │       │   └── incidents/
│   │       │       ├── route.ts            # Lists active crisis incidents
│   │       │       └── [id]/action/route.ts# Authorizes, refutes, or dismisses crisis incident
│   │       ├── dashboard/
│   │       │   └── overview/route.ts       # Returns aggregate statistics for key metrics
│   │       ├── departments/
│   │       │   └── daily-report/route.ts   # Daily operations dossier for 21 line departments
│   │       ├── districts/
│   │       │   ├── route.ts                # District ranking and CPI calculation list
│   │       │   └── points-lost/route.ts    # Points-lost deduction breakdown per district
│   │       ├── news/
│   │       │   └── route.ts                # News stream items with pagination & search
│   │       ├── ocr/
│   │       │   └── stream/route.ts         # Server-Sent Events (SSE) live OCR feed stream
│   │       └── v1/
│   │           ├── auth/webauthn/[...action]/route.ts # WebAuthn registration/verification
│   │           ├── copilot/[...path]/route.ts         # Open UI Copilot backend proxy
│   │           ├── districts/[code]/[section]/route.ts# District deep-dive data by section
│   │           ├── hoardings/
│   │           │   ├── route.ts                    # Statewide scheme hoardings data (with lastFetchedAt & stale status)
│   │           │   └── refresh/route.ts            # Protected nightly refresh endpoint (x-refresh-secret / cron)
│   │           ├── sources/[type]/[id]/route.ts       # Media provenance viewer
│   │           ├── ticker/route.ts                    # Live breaking news headlines
│   │           └── transcription/stream/route.ts      # Live audio transcription chunk streaming
│   │
│   ├── components/
│   │   ├── commandCenter/                  # Realtime Telemetry Views (folder on disk: src/components/commandCenter)
│   │   │   ├── AnimatedPipelineDiagram.tsx # 6-stage animated pipeline with 3 speed settings (1x, 2x, 0.5x)
│   │   │   ├── AnimatedTelemetryMesh.tsx   # Light-theme SVG optical bus & node telemetry network
│   │   │   ├── CommandCenterNavHeader.tsx  # Secondary sub-navigation header for Command Center
│   │   │   ├── CommandCenterView.tsx       # Composite 3-pane command center layout wrapper
│   │   │   ├── CoreOperationalSwitchDeck.tsx# Live operational switches, mock failure injection controls
│   │   │   ├── EurekaPipelineExplorer.tsx  # Interactive pipeline node inspection drawer
│   │   │   ├── OperationalCommandHeader.tsx# Live packet count, cluster uptime, active operator badge
│   │   │   ├── PipelineFlowView.tsx        # In-depth flow diagram with animated SVG bus line
│   │   │   ├── RawEventStreamInspector.tsx # Terminal-style raw event payload viewer
│   │   │   ├── RawIngestionView.tsx        # High-throughput table with 100+ buffer items
│   │   │   ├── SystemMonitoringNavHeader.tsx# Dedicated header for system monitoring view
│   │   │   ├── TelemetryOperationsView.tsx # Central hub enclosure, district packet counters
│   │   │   ├── center/
│   │   │   │   ├── CommandCenterCenterSection.tsx # Middle pane of Command Center
│   │   │   │   ├── DIODataDrawer.tsx              # Slide-out drawer with district officer directory
│   │   │   │   ├── DistrictSubHeadSelector.tsx    # Dropdown selector for division & district heads
│   │   │   │   ├── GovernmentPositionsSection.tsx # Directory of key government leadership
│   │   │   │   └── MaharashtraMapTopology.tsx     # Vector topology map with status pins
│   │   │   ├── left/
│   │   │   │   ├── CommandCenterLeftSection.tsx   # Left pane container
│   │   │   │   ├── NewspaperDataSection.tsx       # Print newspaper circulation and article volume
│   │   │   │   ├── SocialMediaDataSection.tsx     # Social media mentions and viral growth metrics
│   │   │   │   └── TVChannelDataSection.tsx       # TV broadcast airtime and prime-time share
│   │   │   └── right/
│   │   │       ├── CommandCenterRightSection.tsx  # Right pane container
│   │   │       ├── LeadershipMessagesSection.tsx  # Executive ministerial directives and alerts
│   │   │       └── LiveStreamingLinkSection.tsx   # Live video player and multi-camera stream feeds
│   │   │
│   │   ├── copilot/                        # Open UI Generative Co-Pilot System
│   │   │   ├── ai-assistant-widget.tsx     # Floating FAB with route-aware morphing drawer
│   │   │   ├── CopilotDrawer.tsx           # Generative Open UI drawer with chat and grounding modals
│   │   │   └── OpenUILibrary.tsx           # Canonical GIGW-accessible UI component renderer
│   │   │
│   │   ├── dashboard/                      # Core Dashboard Views & Shared Panels
│   │   │   ├── BreakingNewsTicker.tsx      # Saffron/crimson animated breaking news alert marquee
│   │   │   ├── CitizenServicesCard.tsx     # Citizen grievance resolution & charter tracking card (7 accountability fields)
│   │   │   ├── CitizenServiceDetailDrawer.tsx # Slide-out full record & escalation timeline drawer
│   │   │   ├── DIPRDivisionsPanel.tsx      # 9 DGIPR divisions hierarchical view & contacts
│   │   │   ├── GovernmentSchemeHoardingsPanel.tsx # 40x20ft Unipole campaign hoarding tracker (nightly sync & stale alert)
│   │   │   ├── KeyMetricsTrends.tsx        # Multi-channel coverage trend chart (ECharts)
│   │   │   ├── LiveNewsQueue.tsx           # Real-time streaming queue of incoming headlines
│   │   │   ├── MainDashboard.tsx           # Legacy single-view dashboard preserved for fallback
│   │   │   └── ThreeColumnDashboard.tsx    # Primary responsive executive cockpit (Left, Center, Right)
│   │   │
│   │   ├── layout/                         # Persistent Application Shell
│   │   │   ├── DashboardLayout.tsx         # Root container with Header, Sidebar, Toolbar, Skeletons, GlossaryDrawer
│   │   │   ├── DashboardToolbar.tsx        # Time range picker (24h, 7d, 30d), filters, PDF export
│   │   │   ├── GlobalSearchBar.tsx         # Keyboard-navigable (`Ctrl+K`) search modal
│   │   │   ├── Header.tsx                  # Top banner with Gov Emblem, User Profile, Language, Biometrics, Glossary trigger
│   │   │   └── Sidebar.tsx                 # Left navigation drawer with collapsible portals list & Glossary link
│   │   │
│   │   ├── leadership/
│   │   │   ├── GISMap/
│   │   │   │   └── GISMap.tsx              # Interactive SVG map of Maharashtra with district details
│   │   │   ├── LiveStreaming/
│   │   │   │   └── LiveStreaming.tsx       # Live CMO media center stream with multi-camera selector
│   │   │   ├── SocialMediaAnalysis/
│   │   │   │   └── SocialMediaAnalysis.tsx # Social platforms metrics cards and sentiment distribution
│   │   │   └── TopLowerMatrix/
│   │   │       └── TopLowerMatrix.tsx      # Top 5 and Bottom 5 performing districts matrix
│   │   │
│   │   ├── portal/                         # 20 Institutional Portal Screen Implementations
│   │   │   ├── ActivitiesScreen.tsx        # Daily ministerial schedule and field inspections
│   │   │   ├── AdvertisementsScreen.tsx    # Scheme hoardings audit, illumination check, GPS photos
│   │   │   ├── AttendanceScreen.tsx        # Biometric Aadhaar punch-in logs across 36 DIO offices (date picker & date in CSV)
│   │   │   ├── CrisisScreen.tsx            # Operational crisis triage room (90-min SLA timer, rebuttals)
│   │   │   ├── DistrictsScreen.tsx         # Comprehensive 36-district performance register
│   │   │   ├── FactCheckScreen.tsx         # State Fact-Check Cell bulletin editor (with false news source badges)
│   │   │   ├── GlossaryScreen.tsx          # Full-page Metric Standards & Glossary dictionary
│   │   │   ├── KonkanIndexScreen.tsx       # Dedicated regional cockpit for coastal districts
│   │   │   ├── LiveEventsScreen.tsx        # Official webcast streaming console for Chief Minister press conferences
│   │   │   ├── LiveNewsScreen.tsx          # Multi-view broadcast TV wall with continuous transcription
│   │   │   ├── LoginScreen.tsx             # Zero-friction credential switcher for 5 personas & WebAuthn
│   │   │   ├── MediaIntelligenceScreen.tsx # Deep NLP intelligence view with sentiment radar graphs
│   │   │   ├── MediaScreen.tsx             # Aggregated cross-media repository categorizing news
│   │   │   ├── NewspaperScreen.tsx         # High-fidelity digital archive of 516 newspaper clippings
│   │   │   ├── NotificationsScreen.tsx     # Central notification center (Urgent, Operational, Routine)
│   │   │   ├── PressReleasesScreen.tsx     # Press release studio (with Under Review explanation & reason)
│   │   │   ├── ProfileScreen.tsx           # Officer credential card & clearance grade
│   │   │   ├── PublicationsScreen.tsx      # Digital library of Lokrajya magazine & gazettes
│   │   │   ├── ReportsScreen.tsx           # Daily/weekly executive summary dossier generator
│   │   │   └── SettingsScreen.tsx          # System preferences, dark/light mode toggles, API keys
│   │   │
│   │   ├── shared/                         # Reusable GIGW 3.0 Accessible UI Components
│   │   │   ├── AccessibleTableModal.tsx    # Accessible data table alternative for ECharts
│   │   │   ├── ConfirmModal.tsx            # Confirmation modal for high-impact actions
│   │   │   ├── ExportTelemetryButton.tsx   # PDF export trigger button with loading state
│   │   │   ├── GlossaryDrawer.tsx          # Slide-out interactive glossary & standards dictionary
│   │   │   ├── GovEmblem.tsx               # Lion Capital of Ashoka official state emblem (SVG)
│   │   │   ├── MetricTip.tsx               # Hover & keyboard-focus accessible figure tooltip (<MetricTip>)
│   │   │   ├── MinimalCardHeader.tsx       # Unified Apple-style card header with hover-triggered Radix tooltip
│   │   │   ├── OutboundLink.tsx            # Secure outbound link with domain badge & external warning modal
│   │   │   ├── Skeleton.tsx                # Base pulse & shimmer skeleton building block
│   │   │   └── TermInfo.tsx                # Small '?' info icon beside labels with glossary definition popover
│   │   │
│   │   ├── skeletons/                      # 24 Precision Skeleton Loader Implementations
│   │   │   ├── ActivitiesSkeleton.tsx
│   │   │   ├── CommandCenterSkeleton.tsx
│   │   │   ├── CrisisPageSkeleton.tsx
│   │   │   ├── DashboardPageSkeleton.tsx
│   │   │   ├── DistrictsPageSkeleton.tsx
│   │   │   ├── EmergencyAlertSkeleton.tsx  # In-card skeleton return
│   │   │   ├── GISMapSkeleton.tsx          # In-card skeleton return
│   │   │   ├── KPIRibbonSkeleton.tsx       # In-card skeleton return
│   │   │   ├── LeaderboardSkeleton.tsx     # In-card skeleton return
│   │   │   ├── LeadershipOverviewSkeleton.tsx
│   │   │   ├── LiveNewsQueueSkeleton.tsx   # In-card skeleton return
│   │   │   ├── LiveStreamingSkeleton.tsx
│   │   │   ├── MediaMonitoringSkeleton.tsx
│   │   │   ├── NotificationsSkeleton.tsx
│   │   │   ├── PipelineFlowSkeleton.tsx
│   │   │   ├── PressReleasesSkeleton.tsx
│   │   │   ├── ProfileSkeleton.tsx
│   │   │   ├── RawIngestionSkeleton.tsx
│   │   │   ├── ReportsSkeleton.tsx
│   │   │   ├── ScoreDecompositionSkeleton.tsx # In-card skeleton return
│   │   │   ├── SocialMediaSkeleton.tsx
│   │   │   ├── SystemMonitoringSkeleton.tsx
│   │   │   └── TopLowerMatrixSkeleton.tsx  # In-card skeleton return
│   │   │
│   │   └── zones/                          # Domain-Specific Complex Modules
│   │       ├── DistrictLeaderboard/
│   │       │   ├── DistrictCard.tsx        # District summary tile with CPI badge
│   │       │   ├── DistrictLeaderboard.tsx # Main ranked list container with division filtering
│   │       │   ├── DistrictPerformanceChart.tsx # ECharts bar comparison chart
│   │       │   └── DistrictTable.tsx       # Sortable 36-district table with MetricTip & TermInfo
│   │       ├── EmergencyAlert/
│   │       │   ├── AlertCard.tsx           # Secondary incident summary card
│   │       │   ├── EmergencyAlert.tsx      # Main crisis alert container with 90-minute countdown
│   │       │   ├── IncidentTimeline.tsx    # Chronological crisis event progression
│   │       │   ├── MetricPill.tsx          # Compact metric pill with badge styling
│   │       │   ├── PrimaryIncidentCard.tsx # Flagship incident card (with false news source validation badge)
│   │       │   └── SLATimer.tsx            # Animated 90-minute circular progress timer
│   │       ├── KPIRibbon/
│   │       │   ├── KPICard.tsx             # Metric card with trend indicator, MetricTip, and TermInfo
│   │       │   └── KPIRibbon.tsx           # Horizontal 4-card ribbon (CPI, Sentiment Index, Speed, Crisis SLA Rate)
│   │       └── ScoreDecomposition/
│   │           ├── ScoreDecomposition.tsx  # Radar and horizontal bar decomposition
│   │           └── ScoreMetricBar.tsx      # Progress bar with weight indicator and MetricTip
│   │
│   ├── data/                               # Data Models, Constants & Fixtures
│   │   ├── citizenServicesData.ts          # Citizen grievance records (all 7 accountability fields)
│   │   ├── dashboardData.ts                # Default metrics, crisis alerts, and district rankings
│   │   ├── hoardingsSyncState.ts           # Singleton hoardings sync state (02:00 schedule & 36h stale logic)
│   │   ├── maharashtraGeo.generated.ts     # Pre-projected TopoJSON SVG geometry paths for 36 districts
│   │   ├── maharashtraGISDetailData.ts     # Physical features (rivers, Sahyadri ridges, highways, reservoirs)
│   │   ├── metricDefinitions.ts            # Central bilingual dictionary for all metrics & glossary terms
│   │   ├── newsQueueData.ts                # Default news queue fixtures for print, TV, social, and web
│   │   └── route-prompts.ts                # Route-aware AI suggestion pools and knowledge-base rules
│   │
│   ├── lib/                                # Core Business Logic, Security & Utilities
│   │   ├── api.ts                          # Fetch client wrappers with error handling & caching
│   │   ├── calculations.tsx                # Authoritative calculation engine (hooks, formulas, aggregators, UI badges)
│   │   ├── dataLocalization.ts             # Devanagari translation dictionaries for districts & departments
│   │   ├── domainAllowlist.ts              # Verified government and media domain allowlist
│   │   ├── exportTelemetryPdf.ts           # Multi-page institutional PDF telemetry report generator
│   │   ├── jwt.ts                          # Cryptographic JWT signing & verification (12h TTL)
│   │   ├── metricCalculations.ts           # Exact pure TS formulas for CPI, Volume, Speed, Sentiment Index, Attendance (Node test runner compatible)
│   │   ├── misinformationDetector.ts       # Dynamic ticket generation from flagged news & social items
│   │   ├── sentimentEngine.ts              # Dynamic multi-channel live sentiment calculator (Print 35%, TV 25%, Social 25%, User 15%)
│   │   ├── serverData.ts                   # In-memory mock databases, officer credentials, session store
│   │   ├── translations.ts                 # Full English & Marathi bilingual translation dictionary
│   │   ├── urlSecurity.ts                  # Protocol sanitizer blocking XSS & evil URL schemes
│   │   └── webauthnClient.ts               # Passkey / WebAuthn biometric client implementation
│   │
│   ├── stores/
│   │   └── dashboardStore.ts               # Master Zustand state store for auth, filters, newsQueue, glossary
│   │
│   └── types/
│       └── dashboard.ts                    # Complete TypeScript interfaces, schemas, and union types
│
└── tests/                                  # Automated Test Suites (Node.js Test Runner)
    ├── ai_assistant.test.mjs               # AI widget route awareness, local KB match, chat API tests
    ├── auth_redirect.test.mjs              # Active session redirection, middleware interceptor tests
    ├── calculations.test.mjs               # Authoritative calculations suite (20 tests: CPI, TAT, Sentiment, Attendance, Matrix)
    ├── copilot.test.mjs                    # Open UI Copilot library exports, GIGW accessibility tests
    ├── hoardings_refresh.test.mjs          # Nightly hoardings sync endpoint, secret auth, 36h stale threshold tests
    ├── jwt.test.mjs                        # 12-hour TTL expiration, signature verification, tampering tests
    ├── metric_calculations.test.mjs        # Exact calculation tests for all 15 formulas & CPI weights
    ├── sentiment_live_recompute.test.mjs   # Live sentiment & misinformation ticket recomputation tests
    ├── skeleton_loaders.test.mjs           # Skeleton loading state tests across all 15 routes
    ├── suite.test.mjs                      # Personas, telemetry consistency, Konkan structure tests
    ├── three_column_dashboard.test.mjs     # 3-column layout responsiveness and bug fix verification tests
    ├── url_security.test.mjs               # URL scheme sanitization and XSS rejection tests
    └── url_source_validation.test.mjs      # Domain allowlist, verified badges, unverified warnings tests
```

---

## 5. Detailed Component & Module Specifications

### 5.1 Application Shell & Layout System

#### `src/components/layout/DashboardLayout.tsx`
- **Role:** Master wrapper for all application views.
- **Key Responsibilities:**
  - Persistently mounts `<Header />`, `<Sidebar />`, `<DashboardToolbar />`, and `<GlossaryDrawer />`.
  - Integrates the 2px saffron loading bar (`animate-shimmer-amber`) on pending transitions.
  - Implements route-aware skeleton fallbacks via `getRouteSkeleton(pathname)` without unmounting navigation or displaying blocking full-screen spinners.
  - Hosts `<CopilotDrawer />` gated behind `NEXT_PUBLIC_COPILOT_ENABLED`.
  - Hosts the global `<GlossaryDrawer />` controlled by Zustand state (`glossaryDrawerOpen`, `glossaryTermKey`).
  - Manages mobile sidebar drawer collapse/expansion state.

#### `src/components/layout/Header.tsx`
- **Role:** Institutional top bar.
- **Key Responsibilities:**
  - Displays official Lion Capital Government Emblem (`GovEmblem.tsx`) with state branding.
  - Language toggle pill: instantaneous switch between English and Marathi (`Mukta` Devanagari font).
  - WebAuthn biometric status icon (Green badge when FIDO2 hardware passkey is bound).
  - Quick officer persona switcher / profile menu displaying active clearance level.
  - Glossary quick-access trigger button (`?` icon) opening the global `<GlossaryDrawer />`.
  - Global system clock and sync status pill.

#### `src/components/layout/Sidebar.tsx`
- **Role:** Primary left navigation drawer.
- **Key Responsibilities:**
  - Contains navigation links to all institutional portal modules, the Command Center, and "Glossary & Standards" (`/glossary`).
  - Collapsible Command Center accordion (`/command-center`, `/command-center/pipeline-flow`, `/command-center/raw-ingestion`).
  - Active route highlighting using `#1B2A4A` navy background and `#D97706` saffron accent border.
  - Badge counters for unread notifications and pending crisis incidents.

#### `src/components/layout/DashboardToolbar.tsx`
- **Role:** Dynamic action toolbar below Header.
- **Key Responsibilities:**
  - Time window filter toggle: `Last 24 Hours`, `7 Days`, `30 Days` (triggers live recomputation of Sentiment Index and Misinformation Tickets).
  - Division dropdown filter: Filters all child components by revenue division.
  - Direct "Export Telemetry PDF" button triggering publication-grade report generator (`exportTelemetryPdf.ts`).
  - Active filters reset button.

---

### 5.2 Primary Dashboard Stage (`ThreeColumnDashboard.tsx`)

Located at `src/components/dashboard/ThreeColumnDashboard.tsx`, this is the executive dashboard cockpit:
1. **Top Banner:** Full-width `<BreakingNewsTicker />` followed by full-width `<KPIRibbon layout="ribbon" />` with `<MetricTip>` on every KPI value and `<TermInfo>` on every title.
2. **Left Column (`xl:col-span-3`):**
   - `<ScoreDecomposition />`: Radar/bar analysis of CPI constituent scores (Volume, Speed, Sentiment Index 25 pts, Crisis SLA Resolution Rate 15 pts).
   - `<KeyMetricsTrends />`: 4-channel sentiment and volume trend over time with "Sentiment Index" standardization.
   - `<TopLowerMatrix />`: Tabbed view of top 5 and bottom 5 performing districts with accessible hover/focus tooltips.
3. **Center Column (`xl:col-span-5`):**
   - `<GISMap />`: High-precision topological SVG map of Maharashtra with hover pins, district quick-stats card, and full division borders.
   - `<DIPRDivisionsPanel />`: Interactive accordion of the 9 DGIPR divisions with office phone numbers and DIO names.
   - `<CitizenServicesCard />`: Citizen grievance resolution and charter tracking card. Hovering or focusing any item shows city/district name, issue details, affected people count, date raised, status, responsible office, and time to resolve. Clicking opens `<CitizenServiceDetailDrawer />`.
   - `<GovernmentSchemeHoardingsPanel />`: Real-time audit of 40x20ft unipole hoardings across major highways, displaying nightly sync schedule ("Updates nightly at 02:00") and 36-hour stale amber warning banner.
   - `<DistrictLeaderboard showChart={false} />`: Ranked list of all 36 districts with live search, division tabs, `<TermInfo>` on table headers, and `<MetricTip>` on cell figures.
4. **Right Column (`xl:col-span-4`):**
   - `<EmergencyAlert />`: Active crisis incident card with countdown to 90-minute SLA and rebuttal authorizer button. Flagship cards display "False news detected from <source> on <date>" with full provenance and refutation evidence.
   - `<LiveStreaming />`: Live video stream of CMO press briefing with multi-source switcher.
   - `<SocialMediaAnalysis />`: Mentions volume, viral reach, and sentiment polarity for X, Facebook, Instagram, and YouTube.
   - `<LiveNewsQueue />`: Real-time streaming feed of incoming headlines feeding the live Sentiment Index and Misinformation Ticket pipeline.

---

### 5.3 Command Center Views (Real-time Telemetry)

Located in `src/components/commandCenter/` (exact camelCase folder name on disk):
- **`PipelineFlowView.tsx` & `AnimatedPipelineDiagram.tsx`:** Visualizes the 6-stage telemetry processing pipeline:
  1. *Stage 1: Multi-Channel Ingestion* (Optical bus line, packet generators)
  2. *Stage 2: Kafka Partition Buffer* (Buffer utilization %, auto-scaling)
  3. *Stage 3: Devanagari OCR Vectorization* (Tesseract v5.2, confidence scoring)
  4. *Stage 4: Indic-BERT Sentiment Engine* (Positive/Neutral/Negative classification)
  5. *Stage 5: Verification & Rebuttal Desk* (90-min SLA timer, collector approvals)
  6. *Stage 6: Dual Persistence & Fanout* (TimescaleDB chunks, Redis WebSocket broadcast)
  Features speed controls (1x, 2x, 0.5x), simulated packet drops, and node-focus inspection.
- **`TelemetryOperationsView.tsx` & `AnimatedTelemetryMesh.tsx`:** Light-theme network mesh showing latency (ms) and packet throughput across all 36 district nodes connecting to the Mantralaya DGIPR Ingestion Core.
- **`RawIngestionView.tsx` & `RawEventStreamInspector.tsx`:** High-throughput streaming log of raw JSON telemetry events with hex inspection, regex filtering, and dead-letter queue indicators.

---

### 5.4 AI Assistant & Open UI Generative Copilot

- **`ai-assistant-widget.tsx`:** Floating Action Button (FAB) mounted globally in root layout (`src/app/layout.tsx`). Morphs into a slide-over panel on click with smooth Framer Motion spring physics.
  - Route-aware prompt suggestions (6-8 contextual queries dynamically sliced depending on whether the user is on `/crisis`, `/districts`, `/media`, etc.).
  - Local knowledge-base interceptor: Answers questions regarding CPI formulas, Crisis SLA Resolution Rate (15 pts), 90-minute SLA countdown rules, and login credentials without network latency.
  - Connects to `POST /api/ai/chat`.
- **`CopilotDrawer.tsx`:** Full-featured Open UI generative workspace. Allows natural language interface queries (e.g., "Show me attendance in Konkan division as a table").
  - Dynamically renders components from `OpenUILibrary.tsx` (`DataTable`, `BarChart`, `LineChart`, `KpiCard`, `Callout`).
  - Explains data provenance ("Explain This Number" modal).
  - "What I remember about you" transparent user memory view with "Forget Me" privacy control.

---

### 5.5 Institutional Portal Screens (20 Screen Implementations)

Located in `src/components/portal/`:
1. **`LoginScreen.tsx`:** Zero-friction credential switcher for 5 pre-configured government officer personas (State DG, Konkan Director, Palghar Collector, Thane Collector, DIO Desk). Supports WebAuthn biometric login and 4-digit PIN authentication.
2. **`ActivitiesScreen.tsx`:** Ministerial public engagements, inaugurations, foundation stone ceremonies, and press tour logs.
3. **`AdvertisementsScreen.tsx`:** Comprehensive tracking of state welfare scheme hoardings with geo-tagging, illumination status, and daily impression reach.
4. **`AttendanceScreen.tsx`:** Biometric Aadhaar-linked attendance dashboard tracking staff strength, present count, punch-in times, and punctuality percentages across all 36 District Information Offices + Mantralaya HQ. Features an interactive date picker defaulting to today, displays "Attendance for <date>", and exports selected date on every CSV row.
5. **`CrisisScreen.tsx`:** Operational crisis triage room. Visualizes countdown timers to 90-minute SLA limits, evidence attachments, social reach metrics, and one-click authorization for counter-statements.
6. **`DistrictsScreen.tsx`:** Comprehensive 36-district performance register with searchable tables, CSV exports, and points-lost deduction diagnostics.
7. **`FactCheckScreen.tsx`:** State Fact-Check Cell bulletin editor, rumor debunking cards, official verification stamp generator, and "False news detected from <source> on <date>" provenance badges.
8. **`GlossaryScreen.tsx`:** Full-page interactive Metric Standards & Glossary dictionary with search, category filtering, formula explanations, and live examples.
9. **`KonkanIndexScreen.tsx`:** Dedicated regional cockpit for the 5 coastal districts (Palghar, Thane, Raigad, Ratnagiri, Sindhudurg) tracking 21 line departments.
10. **`LiveEventsScreen.tsx`:** Official webcast streaming console for Chief Minister press conferences, with real-time transcribed key takeaways.
11. **`LiveNewsScreen.tsx`:** Multi-view broadcast TV wall (ABP Majha, TV9 Marathi, Zee 24 Taas, Saam TV) with continuous audio transcription stream.
12. **`MediaIntelligenceScreen.tsx`:** Deep NLP intelligence view with sentiment radar graphs, positive/negative headline polarity, and emerging narrative clusters.
13. **`MediaScreen.tsx`:** Aggregated cross-media repository categorizing news into Welfare Schemes, Infrastructure, Agriculture, and Health.
14. **`NewspaperScreen.tsx`:** High-fidelity digital archive of 516 newspaper clippings from major dailies with Devanagari OCR text extracts.
15. **`NotificationsScreen.tsx`:** Central notification center categorizing alerts into Urgent (Red), Operational (Amber), and Routine (Blue).
16. **`PressReleasesScreen.tsx`:** Bilingual press note drafting studio. Features an info icon and tooltip beside "Under Review" status explaining the reviewer, pending approval step, submission timestamp, what happens next, and specific reason field.
17. **`ProfileScreen.tsx`:** Officer credential card displaying government clearance grade, assigned jurisdictions, and security audit log.
18. **`PublicationsScreen.tsx`:** Digital library of official government periodicals, including the monthly *Lokrajya* magazine, *Maharashtra at a Glance* statistical digest, and government gazettes.
19. **`ReportsScreen.tsx`:** Daily and weekly executive summary dossier generator with printable HTML report export.
20. **`SettingsScreen.tsx`:** System preferences, dark/light mode toggles, font scaling, audio notification toggles, and backend API endpoints.

---

## 6. Global State Management (`src/stores/dashboardStore.ts`)

Zustand master store managing reactive state across the application:
- **Authentication & Clearance:** `officerPersona`, `isAuthenticated`, `token`, `biometricsRegistered`, `biometricsEnrolledAt`.
- **Telemetry Filters:** `timeRange` ('24h' | '7d' | '30d'), `selectedDivision`, `selectedDistrict`, `searchQuery`.
- **Live Intelligence Stream:**
  - `newsQueue`: Live array of incoming media items from Print, TV, Social, and Web feeds.
  - `lastSentimentComputedAt`: ISO timestamp updated whenever Sentiment Index recomputes.
  - `lastTicketsComputedAt`: ISO timestamp updated whenever Misinformation Tickets recompute.
  - `recomputeLiveIntelligence()`: Automatically computes composite Sentiment Index and creates linked Misinformation Tickets upon item ingestion or time range changes.
- **Glossary & Help State:**
  - `glossaryDrawerOpen`: Boolean controlling slide-out `<GlossaryDrawer />`.
  - `glossaryTermKey`: Pre-selected metric/term key when opened from a `<TermInfo />` icon.
- **UI & Presentation:** `language` ('en' | 'mr'), `isCollapsed` (sidebar state), `activePortalScreen`.
- **Race Condition Safeguard:** Uses sequence counter `filterRequestSeq` and clears pending timeouts to avoid race conditions during rapid filter transitions.

---

## 7. Security, Authentication & Role-Based Access Control (RBAC)

### 7.1 Officer Personas & Clearance Tiers
1. **State DG ( clearanceTier: 1 ):** Complete statewide read/write access. Authorizes rebuttals, dismisses crisis tickets, exports full telemetry.
2. **Konkan Regional Director ( clearanceTier: 2 ):** Scoped to Konkan division districts (Palghar, Thane, Raigad, Ratnagiri, Sindhudurg).
3. **District Collector Palghar ( clearanceTier: 3 ):** Scoped to Palghar district telemetry, grievance redressal, and local DIO attendance.
4. **District Collector Thane ( clearanceTier: 3 ):** Scoped to Thane district operations.
5. **DIO Desk Operator ( clearanceTier: 4 ):** Read-only media surveillance and biometric punch-in access.

### 7.2 Session Cryptography & JWT Security (`src/lib/jwt.ts`)
- Algorithm: HMAC-SHA256 (`HS256`) using `jose` library.
- Session Expiration: Strict 12-hour TTL (43,200 seconds). Expired tokens are rejected by `src/middleware.ts` which automatically redirects to `/login`.

### 7.3 WebAuthn Biometric Architecture (`src/lib/webauthnClient.ts`)
- Hardware-backed FIDO2 / Passkey registration via `navigator.credentials.create()` and `navigator.credentials.get()`.
- Supports platform authenticators: Apple Touch ID / Face ID, Windows Hello, Android Biometric Prompt, YubiKey hardware tokens.

### 7.4 URL Sanitization & Protocol Filtering (`src/lib/urlSecurity.ts` & `src/lib/domainAllowlist.ts`)
- Strict URL validation engine rejects malicious schemes: `javascript:`, `data:`, `vbscript:`, `file:`, `blob:`.
- Automatically strips backslash evasion attempts (`/\evil.com`) and protocol-relative phishing vectors (`//evil.com`).
- Verified Domain Allowlist: Enforces official government domains (`*.gov.in`, `*.nic.in`, `maharashtra.gov.in`, `dgipr.maharashtra.gov.in`) and verified media platforms.
- External Redirect Protection (`<OutboundLink>`): Displays source domain badge ("Source: <domain> · verified/unverified"), opens external links with `rel="noopener noreferrer" target="_blank"`, and requires an interactive confirmation modal before navigating to unverified external domains.

---

## 8. Bilingual Engine & Devanagari Localization

The application maintains 100% bilingual parity across English and Marathi:
- **`src/lib/translations.ts`:** Master translation dictionary containing 1000+ strings covering navigation labels, form fields, status badges, metrics, and error dialogues.
- **`src/data/metricDefinitions.ts`:** Dedicated bilingual dictionary providing full definitions, formulas, sources, and examples in both English and Marathi for every metric and glossary term.
- **`src/lib/dataLocalization.ts`:** Algorithmic Devanagari mapper for:
  - All 36 Maharashtra Districts (`Mumbai City` ↔ `मुंबई शहर`, `Gadchiroli` ↔ `गडचिरोली`, etc.)
  - All 6 Revenue Divisions (`Konkan` ↔ `कोकण`, `Nagpur` ↔ `नागपूर`, etc.)
  - All Government Departments & Portfolios
  - Media Channels, Publications, and Officer Designations
- **Typography:** Uses Google Font `Mukta` and `Noto Sans Devanagari` configured in `tailwind.config.ts`, ensuring crisp rendering of complex Marathi ligatures.

---

## 9. Geospatial & Topological Mapping Engine

Located at `scripts/build-maharashtra-geo.mjs` and `src/data/maharashtraGeo.generated.ts`:
- **Source Data:** Census-2011 district boundary shapefiles updated with the 2014 Palghar bifurcation from Thane.
- **Topology Preservation:** Visvalingam simplification via `topojson-server` and `mapshaper` retaining 8% vertex precision to ensure zero gaps or overlapping artifacts between neighbouring districts.
- **Pole of Inaccessibility (`polylabel`):** Each district geometry includes a mathematically calculated `pin: { x, y }` position deepest inside the polygon, preventing pin labels from rendering outside irregular district boundaries.
- **Physical Features Layer (`src/data/maharashtraGISDetailData.ts`):**
  - *Sahyadri Ridges:* Northern Ridge (Kalsubai), Southern Ridge (Koyna), Satpura Range.
  - *River Corridors:* Godavari, Krishna, Bhima, Tapi, Wainganga, Wardha.
  - *Water Reservoirs:* Koyna Dam (Shivsagar), Jayakwadi (Nath Sagar), Ujjani Dam.
  - *Transportation:* Samruddhi Mahamarg (ME-01), Mumbai-Pune Expressway (ME-02), Atal Setu MTHL, Central/Western/Konkan Railway trunk routes.

---

## 10. Automated Test Suite

The test suite runs using native Node.js test runner with zero third-party test framework overhead:

```bash
# Execute entire test suite
npm test
```

**Test Status:** 117 tests passing across 34 test suites.

### Complete Test Inventory
1. **`tests/jwt.test.mjs`:** Validates 12-hour expiration delta (43,200s), signature verification, tampered token rejection, and malformed input handling.
2. **`tests/url_security.test.mjs`:** Tests XSS rejection, safe route acceptance, `javascript:` and `data:` scheme blocking.
3. **`tests/auth_redirect.test.mjs`:** Verifies server-side and middleware redirects for active and expired sessions.
4. **`tests/ai_assistant.test.mjs`:** Validates route-aware prompt pools, local knowledge base matching, and `POST /api/ai/chat` handler.
5. **`tests/copilot.test.mjs`:** Checks Open UI component exports, GIGW 3.0 accessibility attributes (`scope="col"`, `caption`, `View as Table`).
6. **`tests/skeleton_loaders.test.mjs`:** Ensures persistent app shell rendering, absence of full-screen blocking spinners, and checks all route loading boundaries.
7. **`tests/three_column_dashboard.test.mjs`:** Tests responsive breakpoints (`md:col-span-12`, `xl:col-span-3/5/4`), layout containment, and widget decongestion fixes.
8. **`tests/suite.test.mjs`:** Verifies fictional dummy officer names (ensures no real human names leak), theme consistency, and Command Center navigation.
9. **`tests/metric_calculations.test.mjs`:** Validates all 15 mathematical formulas: CPI score decomposition (Volume 35, Speed 25, Sentiment Index 25, Crisis SLA Resolution Rate 15), bounds clamping (0-100), edge-case zero incident handling, and biometric attendance percentages.
10. **`tests/sentiment_live_recompute.test.mjs`:** Validates dynamic recomputation of Sentiment Index and Misinformation Tickets when new items arrive in the news queue across 24h, 7d, and 30d time windows, multi-channel weighting (Print 35%, TV 25%, Social 25%, User 15%), and ticket-to-item provenance linking.
11. **`tests/hoardings_refresh.test.mjs`:** Validates nightly hoardings refresh endpoint (`/api/v1/hoardings/refresh`), secret header authentication (`x-refresh-secret`), 36-hour stale detection logic, and default `02:00 IST` synchronization schedule.
12. **`tests/url_source_validation.test.mjs`:** Validates outbound URL security, allowlist domain verification, status badges ("Source: <domain> · verified/unverified"), warning dialog requirements for unverified domains, and malicious protocol rejection.

---

## 11. Maintenance Protocol & Continuous Update Guidelines

> [!IMPORTANT]
> **DEVELOPER & AGENT INSTRUCTION**:
> Whenever you modify existing components, introduce new portal screens, add API endpoints, update data fixtures, or refine styling:
> 1. Preserve institutional GIGW 3.0 accessibility (`aria-*` labels, keyboard focusable tooltips via `<MetricTip>`, table alternatives for charts).
> 2. Ensure all text strings have corresponding Marathi translations in `src/lib/translations.ts` or `src/data/metricDefinitions.ts`.
> 3. Verify that changes do not violate Next.js 16 breaking change rules specified in `AGENTS.md`.
> 4. Run `npm test` to ensure zero regression across the 117 unit and integration tests.
> 5. **IMMEDIATELY UPDATE THIS `docs/context/context.md` FILE (AND SYNC TO `doc/context.md`)** to document the modified files, altered schemas, new interfaces, or updated operational workflows.

---

## 12. Metric Standards, Dynamic Intelligence & Security Architecture

### 12.1 Unified Metric Standards Registry & Tooltip System
- **Central Dictionary (`src/data/metricDefinitions.ts`):** Single source of truth for all metrics, KPIs, and glossary terms. Every entry defines:
  - English & Marathi titles (`label`, `labelMr`)
  - Plain-language explanation (`definition`, `definitionMr`)
  - Calculation formula, inputs, weights, and time window (`formula`, `formulaMr`, `inputs`)
  - Authoritative data source (`dataSource`)
  - Update cadence (`updateFrequency`)
  - Concrete example (`example`, `exampleMr`)
  - Data veracity flag (`isSampleData`: renders "Sample data" badge if mock/static)
- **Accessible Figure Tooltip (`<MetricTip>`):** Built on Radix Tooltip (`@radix-ui/react-tooltip`). Wrapped around every number, score, percentage, count, and cell across the entire dashboard. Triggered on mouse hover AND keyboard focus (`tabIndex={0}`). Displays definition, formula, source, and last updated time.
- **Term Info Popover (`<TermInfo>`):** Renders a discrete `?` info icon beside terms (CPI, Volume Score, TAT / Speed Score, Sentiment Index, Crisis SLA Resolution Rate, etc.) with a popover and quick-link to open the full Glossary.
- **Global Glossary Drawer (`<GlossaryDrawer>`):** Slide-out drawer accessible from Header and Sidebar. Features bilingual search, category filters (CPI, Telemetry, Media, Governance, System), formula cards, and concrete examples.
- **Dedicated Route (`/glossary`):** Full-page institutional reference standard located at `src/app/glossary/page.tsx` and `src/components/portal/GlossaryScreen.tsx`.

### 12.2 Standardized Mathematical Formulas (`src/lib/metricCalculations.ts`)
1. **Communication Performance Index (CPI):**
   $$\text{CPI} = \text{Volume (35)} + \text{Speed (25)} + \text{Sentiment Index (25)} + \text{Crisis SLA Resolution Rate (15)}$$
   - Total Range: 0 to 100 points.
2. **Volume Score (35 pts max):**
   $$\text{Volume Score} = \min\left(35, \frac{\text{positiveArticles} \times 3 + \text{neutralArticles} \times 1}{\text{districtTarget}} \times 35\right)$$
3. **TAT / Speed Score (25 pts max):**
   $$\text{Speed Score} = \min\left(25, \max\left(0, \frac{180 - \text{avgTatMinutes}}{180} \times 25\right)\right)$$
4. **Sentiment Index (25 pts max):**
   $$\text{Sentiment Index} = \min\left(25, \max\left(0, \frac{\text{Sentiment Percentage}}{100} \times 25\right)\right)$$
5. **Crisis SLA Resolution Rate (15 pts max):**
   $$\text{Crisis SLA Resolution Rate} = \left(\frac{\text{incidentsResolvedWithin90m}}{\text{totalIncidents}} \times 100\right) \times 0.15$$
   - Defaults to 15.0 pts if total incidents in period is zero (no breach).
6. **Biometric Attendance Percentage:**
   $$\text{Attendance % } = \min\left(100, \frac{\text{presentStaff}}{\text{totalStaff}} \times 100\right)$$

### 12.3 Dynamic Live Sentiment Index & Misinformation Tickets Pipeline
- **Root Cause Diagnosed:** Previous implementation loaded static mock fixtures (`69.2%`, 3 tickets) in `sentimentEngine.ts` and `serverData.ts` without evaluating live items from `newsQueue`.
- **Dynamic Fix Implemented:**
  - `src/lib/sentimentEngine.ts` now evaluates all active items in `newsQueue` filtered by the selected time window (24h, 7d, 30d).
  - Items are classified (positive = +100, neutral = +50, negative = 0) and weighted by channel:
    - Print OCR: 35%
    - TV Broadcasts: 25%
    - Social Media: 25%
    - Citizen / User Feeds: 15%
  - Recomputes instantaneously whenever new news arrives or time window filter changes.
  - Updates `lastSentimentComputedAt` and displays "Last computed at: <time>" in the UI.
- **Misinformation Ticket Creation (`src/lib/misinformationDetector.ts`):**
  - Scans incoming news items for misinformation flags, fake news indicators, and high negative sentiment combined with viral velocity.
  - Creates linked tickets carrying the exact `originatingItemId` for complete audit provenance.
  - Updates `lastTicketsComputedAt` and displays "Last computed at: <time>" in the UI.

### 12.4 Statewide Terminology Standardization
- **"Crisis SLA Resolution Rate":** Renamed from "Crisis SLA" across all UI widgets, data tables, translations (`translations.ts`), AI prompt templates (`route-prompts.ts`), PDF telemetry export, and documentation.
  - Represents the percentage of crisis incidents resolved within the statutory 90-minute limit.
  - The animated 90-minute countdown timer retains the designation "SLA Timer" as it measures the operational countdown rather than the statewide resolution rate.
- **"Sentiment Index":** Standardized across all screens, replacing deprecated variants such as "Sentiment Score", "Sentiment", and lowercase "sentiment index".

### 12.5 Nightly Hoardings Sync Protocol & 36-Hour Stale Threshold
- **State Management (`src/data/hoardingsSyncState.ts`):** Tracks `lastFetchedAt`, synchronization schedule (`Nightly at 02:00 IST`), and calculates staleness.
- **Refresh Endpoint (`/api/v1/hoardings/refresh`):** Protected Next.js route handler requiring the `x-refresh-secret` header. Invoked by external cron scheduler or Hermes backend.
- **Stale Detection:** If `Date.now() - lastFetchedAt > 36 hours`, `<GovernmentSchemeHoardingsPanel>` displays a high-visibility amber alert banner: *"Data may be stale. Last synchronization was over 36 hours ago."*

### 12.6 Citizen Accountability & Outbound Link Security
- **Citizen Services Card (`<CitizenServicesCard>`):** Embedded directly on the main dashboard stage (`ThreeColumnDashboard.tsx`). Displays 7 accountability fields on hover and keyboard focus:
  1. City / District Name
  2. Issue Details (grievance / civic requirement)
  3. Number of People Affected
  4. Date Raised
  5. Current Resolution Status
  6. Responsible Administrative Office
  7. Time to Resolve (TAT)
  Clicking any item opens `<CitizenServiceDetailDrawer />` with complete escalation history and audit logs.
- **False News & Rumour Validation:** All fake news items and crisis alert cards (`PrimaryIncidentCard.tsx`, `FactCheckScreen.tsx`) display:
  *"False news detected from <source> on <date>"* alongside source platform, handle, URL, detection timestamp, verdict, and official refuting evidence.
- **Press Releases Under Review Transparency:** Press release status records include a detailed reason field (`reason` / `reasonMr`). An info icon beside "Under Review" reveals a tooltip detailing the reviewer, pending approval step, submission timestamp, and next workflow steps.
- **Biometric Attendance Tracking:** `AttendanceScreen.tsx` features a date picker defaulting to today, displays "Attendance for <date>", and writes the date to every exported CSV record.
- **Outbound Link Security (`src/lib/domainAllowlist.ts`, `src/lib/urlSecurity.ts`, `<OutboundLink>`):**
  - All outbound URLs are sanitized and checked against official allowlisted domains.
  - Outbound links render domain badges: *"Source: <domain> · verified"* or *"Source: <domain> · unverified"*.
  - Enforces `rel="noopener noreferrer" target="_blank"`.
  - Unverified domains trigger an interactive confirmation dialog (`ConfirmModal`) alerting the user that they are leaving the secure government portal.

---

## 13. UI/UX Craftsmanship & Visual Architecture Standards (Next.js 16 Overhaul)

### 13.1 Hallmark Architecture & Constraint Discipline
- **Hallmark Verification Stamp:** Line 1 of `src/app/globals.css` carries the official Hallmark stamp enforcing responsive containment (`overflow-x: clip`), explicit focus rings (`:focus-visible`), and eliminating unbounded page sprawl.
- **Strict Structural Constraints:** The master layout (`ThreeColumnDashboard.tsx`) is capped at `max-w-[1860px]` with disciplined 12-column grid tracks (`grid-cols-12 gap-5`).
- **Elimination of AI Slop Tropes:**
  - Removed all purple/indigo saturated hero gradients; dashboard uses institutional neutral slate backgrounds (`bg-[#f4f6fa]`) with white data cards (`bg-white`).
  - Replaced linear-gradient shimmer sweeps (`.animate-shimmer`) with subtle flat opacity pulses (`@keyframes skeletonPulse`) that produce zero Cumulative Layout Shift (CLS).
  - Eliminated ungrounded floating cards and heavy blurry box shadows (`shadow-2xl` / `shadow-indigo-500/20`), replacing them with crisp 1px borders (`border-slate-200/80`) and subtle elevation (`shadow-xs` / `shadow-sm`).

### 13.2 Apple HIG Design Sophistication & Feel
- **Visual Hierarchy:** Crisp, bold data headings paired with quiet, legible metadata (`text-slate-600 font-mono text-xs`).
- **Typography & Tabular Numbers:** High-density figures employ `tabular-nums` ensuring that real-time ticking values do not jitter or cause layout reflow.
- **Subtle Physicality:** Interactive cards feature micro-scale state transitions (`hover:border-slate-300 transition-colors duration-150`) without gaudy hover translations or tacky 3D tilts.

### 13.3 UI/UX Pro Max Interaction Standards
- **Cognitive Serenity:** Removed frantic animated ping dots (`animate-ping`) from headers, tickers, and sidebars. High-urgency indicators use steady high-contrast badges or smooth controlled pulses.
- **Defined Interactive States:** Every interactive button, tab, and clickable row implements explicit `:hover`, `:active`, and `:focus-visible` outlines.
- **Ergonomic Target Sizing:** Interactive buttons maintain minimum desktop click targets ($\ge 28$px height) and mobile touch targets ($\ge 44$px).
- **Icon Cleanliness:** Eliminated colorful emojis from UI controls and live streams; replaced with consistent monochromatic Heroicons and Material Design SVG vectors.

### 13.4 Taste-Skill & Anti-Slop App Screen Compliance
- **Colour on Data, Not Chrome:** Navigation chrome, sidebar panels, and structural card containers remain strictly neutral slate (`bg-slate-900` for primary auth buttons, `bg-white` for cards). Color is reserved solely for semantic data: Green (Positive / Verified), Amber (Notice / Warning), Red (Emergency / False News).
- **Elimination of Icon-Chips:** Removed artificial saturated tinted squares (`w-8 h-8 rounded-lg bg-amber-50`) behind icons in panels and list rows. Icons sit cleanly inline with primary label text.
- **Rigorous Contrast & GIGW 3.0 Accessibility:**
  - Every text label, timestamp, badge, and table header exceeds the statutory 4.5:1 contrast ratio against its background.
  - Saffron breaking news bar (`BreakingNewsTicker.tsx`) uses solid red (`bg-red-600`) with high-contrast white text (`text-white`).
  - Notice tickers use high-contrast dark amber text on light amber borders (`text-amber-950 bg-amber-100 border-amber-300` at > 9:1 contrast).
- **Automated Visual Verification:** Audited via headless Chrome CDP evaluation (`inspect.mjs http://localhost:3000 --app`) confirming **0 FAILs** across standard mobile (390px), tablet (768px), and desktop (1440px) viewports.

### 13.5 Executive Minimalist Refinement & Screen Scaling Architecture (100%, 125%, 150%)
- **Target Audience Profile:** Top state government leadership (Ministers, Chief Secretary, Principal Secretaries, Director General DGIPR) requiring maximum signal-to-noise ratio, zero filler decoration, and instantaneous cognitive scanning.
- **Display Scale Optimization (100% vs 125% vs 150% Windows Scaling):**
  - Indian government offices predominantly deploy Windows 11 enterprise laptops (14"–15.6") where the default recommended display scaling is **125%** (1536×864 CSS px) or **150%** (1280×720 CSS px).
  - Configured fluid density tokens in `src/app/globals.css`:
    - `@media (max-width: 1536px)`: `--app-card-padding: 1rem; --app-grid-gap: 1rem;`
    - `@media (max-width: 1280px)`: `--app-card-padding: 0.875rem; --app-grid-gap: 0.875rem; html { font-size: 14.5px; }`
  - Re-proportioned outer container in `ThreeColumnDashboard.tsx` (`p-3 sm:p-4 xl:p-4.5 2xl:p-6`, `gap-3.5 sm:gap-4 xl:gap-5`) ensuring all 3 columns fit within the viewport without clipping or vertical sprawl.
- **Unified `<MinimalCardHeader>` Component (`src/components/shared/MinimalCardHeader.tsx`):**
  - Replaces manual header boilerplate across all 12 core dashboard cards with an accessible, Apple-styled header component.
  - Heading titles sit in pure, bold typography (`text-sm sm:text-base font-bold text-slate-900 tracking-tight`).
  - Removes all visible static filler subheadings and explanatory paragraphs from card faces.
  - Hovering or keyboard-focusing anywhere across the card header bar triggers an Apple glass Radix tooltip (`.apple-glass-tooltip`, `bg-slate-900/95 backdrop-blur-md text-slate-100 border border-slate-700/60 shadow-xl`) presenting the complete contextual description.
  - Supports dark-themed headers (e.g. `EmergencyAlert`, `LiveNewsQueue`) via `titleClassName="text-white"`.
- **Streamlined Executive Briefing Header (`ThreeColumnDashboard.tsx`):**
  - Removed redundant filler paragraph: *"३६ जिल्ह्यांचे थेट संनियंत्रण, नागरिक तक्रार निवारण, लोकभावना विश्लेषण व अधिकृत वार्ताहर कक्ष."*
  - Replaced bulky 110px briefing card with an ultra-slim, dignified 44px bar.
  - Integrated the 5 workspace perspective filters (`GIS Map & Command`, `District Performance`, `Media & Broadcast`, `Crisis Desk`, `Command Wall`) into a compact Apple-style segmented control.
  - Retained the secondary breaking news ticker in Column 2 of the Command Wall (`all` view) as explicitly requested.

---

## 14. Authoritative Unified Calculations Architecture (`src/lib/calculations.tsx`, `src/calculations.tsx`, `src/lib/metricCalculations.ts`)

### 14.1 Architecture & Node.js Test Runner Isolation
To prevent fragmentation of critical metrics and ensure deterministic calculations statewide, all mathematical formulas, aggregators, formatters, React hooks, and visual badges are unified into an authoritative module:
- **`src/lib/metricCalculations.ts`**: Pure TypeScript computation engine containing zero JSX. Contains all raw deterministic mathematical functions, weighted scoring benchmarks, status thresholds, and aggregate functions. This guarantees that Node.js native test runners using `--experimental-strip-types` (which rejects `.tsx` syntax) execute with 100% fidelity.
- **`src/lib/calculations.tsx`**: The comprehensive application-layer calculations module. It re-exports all formulas from `metricCalculations.ts`, provides memoized React 19 hooks (`useDashboardCalculations`, `useDistrictScorecard`), and exports accessible UI indicators (`ScoreBadge`, `TATIndicator`, `MetricDelta`).
- **`src/calculations.tsx`**: Root shortcut re-export enabling clean imports anywhere in the application via `import { ... } from '@/calculations'` or `./calculations`.

### 14.2 Mathematical Formulas & Benchmarks

1. **Communication Performance Index (CPI) — 100.00 Composite Score**:
   $$\text{CPI} = \text{Volume (35)} + \text{TAT Speed (25)} + \text{Sentiment Index (25)} + \text{Crisis SLA Resolution Rate (15)}$$
   - **Clamping:** Each component is strictly clamped to $[0, \text{Max}]$, and the total composite is clamped to $[0.00, 100.00]$ rounded to two decimal places.
   - **Pillar Benchmarks (`CPI_PILLAR_BENCHMARKS`):**
     - Volume: Max 35.0, Target 30.0, Warning < 20.0
     - Speed / TAT: Max 25.0, Target 20.0, Warning < 15.0
     - Sentiment: Max 25.0, Target 18.0, Warning < 12.0
     - Crisis SLA Resolution Rate: Max 15.0, Target 12.0, Warning < 8.0

2. **Turnaround Time (TAT) / Speed Score (25.0 max)**:
   - Evaluates DIO publication and rebuttal response speed from event detection.
   - Formula:
     $$\text{Speed Score} = \begin{cases} 25.0 & \text{if } \text{TAT} \le 30 \text{ mins} \\ \max\left(0, 25.0 - (\text{TAT} - 30) \times 0.5\right) & \text{if } \text{TAT} > 30 \text{ mins} \end{cases}$$
   - When $\text{TAT} \ge 80 \text{ mins}$, the speed score is zero ($0.0$).
   - Status classifications (`getTATStatus`):
     - `optimal` ($\le 30$m): Green badge, full marks.
     - `acceptable` ($31-45$m): Blue badge, slight deduction.
     - `warning` ($46-60$m): Amber badge, moderate deduction.
     - `critical` ($> 60$m): Red badge, severe penalty.

3. **Volume Score (35.0 max)**:
   - Evaluates publishing output against target:
     $$\text{Volume Score} = \min\left(35.0, \max\left(0, \frac{\text{actual}}{\text{target}} \times 35.0\right)\right)$$
   - Minimum baseline guarantee: At least 2.0 points if actual volume $> 0$ even with high targets.

4. **Multi-Channel Sentiment Index (25.0 max & 100.0 Net Score)**:
   - Weighted by channel authority and public reach:
     - **Print Newspapers:** 35% weight
     - **Broadcast TV Channels:** 25% weight
     - **Social Media:** 25% weight
     - **User / Citizen Feedback:** 15% weight
   - Channel score formula: $\frac{\text{pos} \times 1.0 + \text{neu} \times 0.5}{\text{total}} \times 100$
   - 25-point CPI contribution: $\frac{\text{Composite Sentiment Score}}{100} \times 25.0$.

5. **Crisis SLA Resolution Rate (15.0 max)**:
   - Strictly measures crisis incidents resolved within the statutory 90-minute window:
     $$\text{Rate \%} = \frac{\text{incidents resolved within 90m}}{\text{total incidents}} \times 100$$
     $$\text{Pillar Score (15 max)} = \frac{\text{Rate \%}}{100} \times 15.0$$

6. **Biometric Attendance & Punctuality Summary**:
   - Computes:
     - `attendanceRate` = $\frac{\text{present} + \text{late}}{\text{totalEmployees}} \times 100$
     - `punctualityRate` = $\frac{\text{present}}{\text{present} + \text{late}} \times 100$
     - `fieldDutyRate` = $\frac{\text{onField}}{\text{totalEmployees}} \times 100$

7. **Government Scheme Hoardings Verification**:
   - Computes:
     - `illuminationRate` = $\frac{\text{illuminated}}{\text{totalHoardings}} \times 100$
     - `verificationRate` = $\frac{\text{verified}}{\text{totalHoardings}} \times 100$
     - `qrComplianceRate` = $\frac{\text{qrActive}}{\text{totalHoardings}} \times 100$

8. **Citizen Services Resolution TAT**:
   - Computes:
     - `averageHours` across resolved citizen grievances.
     - `withinSLAPercent` = $\frac{\text{resolved} \le 48\text{h}}{\text{total resolved}} \times 100$.
     - `slaBreachCount` = number of active grievances exceeding the 48-hour SLA.

9. **Deterministic Statewide District Rankings & Top/Lower Matrix**:
   - `calculateDistrictRankings`: Sorts all 36 districts strictly by CPI descending, using district code as deterministic tie-breaker. Calculates exact state rank (1-36), percentile, delta from state average, and color tier.
   - `calculateTopLowerMatrix`: Partitions districts into Top 5 and Lower 5 performers, extracting average scores, key lagging pillars, and positive leadership factors.

### 14.3 Exported React Components & Hooks
- **`useDashboardCalculations(districts, newsItems, incidents, timeRange)`**: Memoized React hook computing state averages, reactive CPI, live sentiment index, crisis SLA resolution rate, and top/lower matrices without unnecessary re-renders.
- **`useDistrictScorecard(district)`**: Hook computing detailed pillar breakdown, deductions, and ranking status for an individual district.
- **`<ScoreBadge score={score} maxScore={100} size="sm"|"md"|"lg" />`**: Accessible badge rendering score with color-coded token badges and screen reader labels.
- **`<TATIndicator minutes={minutes} showLabel showScore locale="en"|"mr" />`**: Accessible turnaround time badge with bilingual formatting and status pills.
- **`<MetricDelta current={current} previous={previous} isPercentage format="standard"|"percent" />`**: Renders directional delta arrows ($\uparrow$ / $\downarrow$) and percentage change.

### 14.4 Page & Screen Integration Points
1. **`src/components/zones/KPIRibbon/KPIRibbon.tsx`**: Replaced 85 lines of duplicate inline calculations with `calculateReactiveKPIs` from `@/calculations`.
2. **`src/components/zones/ScoreDecomposition/ScoreDecomposition.tsx`**: Replaced inline reduce loops with `calculateStatewideAggregates` from `@/calculations`.
3. **`src/components/leadership/TopLowerMatrix/TopLowerMatrix.tsx`**: Replaced 60 lines of inline ranking and sorting with `calculateTopLowerMatrix` from `@/calculations`.
4. **`src/components/portal/KonkanIndexScreen.tsx`**: Dynamically calculates Konkan regional pillar breakdown using `calculatePillarBreakdown` from `@/calculations`.
5. **`src/components/portal/AttendanceScreen.tsx`**: Computes dynamic attendance, punctuality, and field rates across filtered offices using `calculateAttendanceSummary` from `@/calculations`.

### 14.5 Unit Test Suite (`tests/calculations.test.mjs`)
A dedicated 20-test suite validates all formulas and edge cases:
- Full marks at boundary limits ($100.00$).
- Upper ceiling clamping and negative value clamping ($0.00$).
- TAT deductions ($-0.5$ pts/min after 30 mins) and severe delay cutoff ($0.0$ at $\ge 80$ mins).
- English and Marathi duration formatting (`"45 mins"` / `"४५ मिनिटे"`).
- Multi-channel sentiment weighted averaging (35/25/25/15).
- Crisis SLA 90-minute rate scaling.
- Pillar breakdown gaps and point deductions.
- Deterministic district ranking stability with tie-breaking.
- Top and lower matrix extraction and attendance summaries.
- Verified passing 20/20 tests, contributing to **137/137 total tests passing across 43 test suites**.

---

## 15. Executive Minimalist Refinement, Scale Optimization & Apple UI/UX Precision

### 15.1 Multi-Scale Display Optimization (Windows 100%, 125%, 150%)
To ensure that top government officials on diverse hardware (from 4K executive command displays to 14" and 15.6" laptops with 125% and 150% Windows display scaling) experience a unified, high-density, non-overflowing interface, root tokens and media queries were codified in `src/app/globals.css`:
1. **Dynamic Design Tokens:**
   - `--app-card-padding`: Adapts from `1.25rem` (100% scale) down to `1rem` (125% scale, $\le 1536$px) and `0.875rem` (150% scale, $\le 1280$px).
   - `--app-grid-gap`: Adapts from `1.25rem` down to `1rem` and `0.875rem` respectively.
2. **Fluid Typography Scaling:**
   - At $\le 1280$px (equivalent to 1920x1080 at 150% display scale), `html` font size is adjusted to `14.5px`, automatically scaling all relative `rem` units across Tailwind typography.
   - Eliminates vertical crowding and accidental horizontal scrollbars without breaking component layout contracts.

### 15.2 Subheading Elimination & Popover Architecture (`<MinimalCardHeader>`)
Card headers across the entire dashboard were refined to eliminate redundant subtitles, filler descriptions, and repetitive explanations:
- **Component Implementation (`src/components/shared/MinimalCardHeader.tsx`):**
  - Built with `@radix-ui/react-tooltip` conforming to GIGW 3.0 and WCAG 2.1 AA.
  - Apple Human Interface Guidelines bold title typography (`text-sm sm:text-base font-bold tracking-tight text-slate-800`).
  - Supports light and dark mode contexts via `titleClassName="text-white"`.
  - Floating dark-glass popover tooltip with information icon (`infoIcon?: boolean`), keyboard focus indicators, and smooth fade transitions.
  - Right-aligned `actionSlot` for contextual controls, badges, and filters.
- **Refactored Dashboard Cards (12 Modules):**
  1. `GISMap.tsx`: Subtitle moved to tooltip; map canvas maintains full responsive layout.
  2. `ScoreDecomposition.tsx`: Empty and populated states streamlined with `<MinimalCardHeader>`.
  3. `CitizenServicesCard.tsx`: Category filter pills updated with Apple pill styling; description moved to tooltip.
  4. `GovernmentSchemeHoardingsPanel.tsx`: Nightly 02:00 IST status indicator positioned in `actionSlot`.
  5. `KeyMetricsTrends.tsx`: Division badge positioned in `actionSlot`; subtitle moved to hover tooltip.
  6. `TopLowerMatrix.tsx`: Filter buttons converted to segmented pill controls; subtitle moved to tooltip.
  7. `DIPRDivisionsPanel.tsx`: Header converted to `<MinimalCardHeader>`; filler helper paragraph eliminated.
  8. `DistrictLeaderboard.tsx`: Converted to `<MinimalCardHeader>` with tooltip metadata.
  9. `EmergencyAlert.tsx`: Converted to `<MinimalCardHeader titleClassName="text-white">`.
  10. `SocialMediaAnalysis.tsx`: Stream filters updated to Apple-style pills; subtitle moved to tooltip.
  11. `LiveStreaming.tsx`: Subtitle moved to hover tooltip.
  12. `LiveNewsQueue.tsx`: Converted to `<MinimalCardHeader titleClassName="text-white">`.

### 15.3 Tactile Apple-Style Controls & Segmented Controls
Interactive controls across tables and tab bars were upgraded to tactile Apple-style segmented pill controls:
- **Interaction Styling:** `rounded-xl`, `border border-slate-200/90`, `bg-slate-100/80`, `shadow-xs`, `transition-all duration-150 active:scale-[0.98]`.
- **Accessibility:** Accessible `role="tablist"` and `role="tab"` attributes with `aria-selected` state tracking.
- **Upgraded Components:** `LeaderboardTabs.tsx`, `DistrictSearchBar.tsx`, `TopLowerMatrix.tsx`, `CitizenServicesCard.tsx`, and `SocialMediaAnalysis.tsx`.

### 15.4 High-Precision Telemetry & ECharts Dark Glass Visuals
- **Telemetry Tooltip:** `DistrictPerformanceChart.tsx` upgraded to a floating dark glass tooltip (`backdrop-blur-md bg-slate-900/90 border border-slate-800`), `JetBrains Mono` tabular figures, and color-coded series indicators.
- **Color Consistency:** Replaced indigo with official institutional emerald (`#059669`) for Crisis SLA Resolution Rate.
- **Axis Typography:** Switched axis ticks and labels to `Plus Jakarta Sans` for crisp rendering across all screen resolutions.

### 15.5 Ergonomic Chrome & Sticky Navigation
- **Header:** Streamlined `Header.tsx` from `h-16` to `h-14` (56px), reclaiming 8px of primary vertical viewport canvas for data visualization.
- **Toolbar:** `DashboardToolbar.tsx` refined with `py-2.5` padding, keycap styling, and tactile select controls.
- **Headline Invariants:** The duplicate breaking news ticker in Column 2 of the `all` view is strictly preserved as an operational necessity.

### 15.6 Verification & Test Invariants
- **Tests Passing:** 137/137 tests passing across 43 test suites (`npm test`).
- **TypeScript:** 0 errors (`npx tsc --noEmit`).
- **Build Status:** Clean production compilation (`npm run build`).

### 15.7 Width-Aware Redesign of CitizenServicesCard
The citizen services & grievance resolution card (`src/components/dashboard/CitizenServicesCard.tsx`) was redesigned to adapt gracefully across differing dashboard column widths:
1. **Multi-Width Adaptability:**
   - In Command Wall (`activeView === 'all'`), the card is mounted in Column 1 (`xl:col-span-3`, ~340px–420px wide).
   - In Primary Overview (`activeView === 'overview'`), the card is mounted in the Left Deck (`lg:col-span-7`, ~700px–1000px wide).
   - Layout transitions smoothly without horizontal overflow, text clipping, or broken layouts.
2. **Responsive Telemetry Pulse Ribbon:**
   - Positioned beneath the header: `grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 bg-slate-50/70 border-b border-slate-200/60`.
   - On narrow columns (~340px), neatly displays a 2x2 grid of micro-metrics (Total Tracked, In Progress with live amber pulse, Citizens Affected, Charter SLA On-Time rate). On wide columns (700px+), expands to 4 horizontal columns.
3. **Apple-Style Category Filter Switcher:**
   - Implements `role="tablist"` with `no-scrollbar flex items-center gap-1.5 overflow-x-auto`.
   - Category tabs include dynamic case counters: All (5), Health (1), Water (1), Infra (2), Agri (1).
4. **Adaptive 3-Tier Grievance Item Architecture:**
   - Tier 1: Location icon + City & District name (`font-bold text-xs truncate`) + Ticket number, paired with a right-aligned live status badge (`In Progress` with amber pulsing dot, `Resolved` with emerald checkmark).
   - Tier 2: Issue description with `line-clamp-2` and `text-xs text-slate-600 leading-relaxed`.
   - Tier 3: Category badge (color-coded) + affected citizen count (`MaterialIcon name="group"`), paired with SLA target/duration and a hover-revealed chevron.
5. **Interactive Accountability Dimensions:**
   - Hover and keyboard focus reveal all 7 accountability dimensions in an Apple dark glass tooltip.
   - Clicking opens `<CitizenServiceDetailDrawer>` for full chronological timeline and remediation actions.

---

## 16. Minimalist Full-Screen Auth Loading Screen & Zero-Flash Auth Gating

### 16.1 Architecture Overview
To eliminate unauthenticated layout flashing and protected data leakage during initial application boot or page reload, a zero-flash client-side authentication boundary was deployed.
- **Root-Level Interception (`src/components/auth/AuthGate.tsx`):**
  - Wraps `{children}` at the root level inside `src/app/layout.tsx`.
  - While authentication state is resolving (`!authInitialized || isAuthLoading`), mounts `<FullScreenAuthLoader message="Verifying session..." />`.
  - Strictly prevents mounting of `Header`, `Sidebar`, `DashboardToolbar`, telemetry charts, or login forms until JWT session status is completely resolved.
  - Automatically triggers `router.replace('/login')` for unauthenticated requests attempting to access protected command routes, and `router.replace('/')` for authenticated users attempting to access `/login`.

### 16.2 Minimalist Full-Screen Auth Loader (`src/components/auth/FullScreenAuthLoader.tsx`)
Conforms to Apple Human Interface Guidelines and state government visual design:
- **Canvas:** Fullscreen fixed overlay (`fixed inset-0 z-[9999] flex flex-col justify-between items-center bg-white select-none text-slate-900`).
- **Accessibility:** `role="status"`, `aria-live="polite"`, `aria-busy="true"`, plus a screen-reader announcement (`sr-only`).
- **Optical Centering:** Top and bottom spacers (`<div className="flex-1 w-full" />`) achieve balanced vertical composition across all desktop and mobile viewports.
- **Center Institutional Block:**
  - Scaled Government of Maharashtra emblem using `<GovEmblem size="xl" showText={false} className="scale-125 sm:scale-150 transform-gpu" />` in a `w-24 h-24 sm:w-28 sm:h-28` container.
  - Bilingual typography: English `h1` "Maha-Command Center" (`text-2xl sm:text-3xl font-extrabold text-slate-900`), Marathi Devanagari "महा-कमांड सेंटर" (`text-base sm:text-lg text-amber-600 font-marathi font-semibold`), and DGIPR subtitle (`text-xs sm:text-sm text-slate-500 font-medium`).
  - Rotating spinner: `w-16 h-16 rounded-full border-8 border-slate-200 border-t-amber-600 animate-spin` with status text (`{message}`) and optional subtext (`{subMessage}`).
- **Attribution Footer:**
  - Attribution strip: `w-full max-w-xl mx-auto pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono`.
  - Left: `महाराष्ट्र शासन • Government of Maharashtra`.
  - Right: `NIC • DGIPR Secure Gateway`.

### 16.3 Defense-in-Depth Layout Gating
- **`DashboardLayout.tsx`:** Adds a top fail-safe guard returning `<FullScreenAuthLoader message="Verifying credentials..." />` if `!authInitialized || !isAuthenticated`, guaranteeing that navigation chrome and child views never mount until authenticated.
- **`LoginScreen.tsx`:** Adds reverse-gating returning `<FullScreenAuthLoader message="Redirecting to command center..." subMessage="Active Government Officer Session Detected..." />` if `!authInitialized || isAuthenticated`, eliminating form flicker while preserving session-detection feedback.

### 16.4 Zustand Store Deduplication (`src/stores/dashboardStore.ts`)
- Added `isAuthLoading: boolean` (initial: `true`) and `authInitialized: boolean` (initial: `false`).
- Implemented module-level cached promise `checkAuthPromise` to deduplicate concurrent `checkAuth()` invocations from multiple components.
- On network error, gracefully validates cached tokens in `localStorage` using cryptographic verification via `verifyAuthToken` from `src/lib/jwt.ts`.

### 16.5 Automated Test Verification (`tests/auth-initialization.test.mjs`)
- 6 automated tests verify:
  1. `FullScreenAuthLoader.tsx` accessibility semantics, white background, emblem, and spinner.
  2. `AuthGate.tsx` client-side route boundary and redirect enforcement.
  3. `RootLayout` integration wrapping children in `AuthGate`.
  4. `DashboardLayout` fail-safe guard preventing unauthenticated canvas mounting.
  5. `LoginScreen` reverse-gating and session-detected messaging.
  6. `dashboardStore.ts` `isAuthLoading` declaration, deduplicated `checkAuthPromise`, and `verifyAuthToken` fallback.
- **Test Integrity:** 143/143 tests passing across 44 test suites (`npm test`).

---

## 17. 3-Column Operational Workspace Refactoring & Responsive Architecture (v5.5)

### 17.1 Responsive Grid Architecture (`ThreeColumnDashboard.tsx`)
- **Responsive CSS Grid Container:** `grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full`
- **Mobile / Tablet Stacking (`< 1024px`):** Single column with mobile-first CSS Grid ordering:
  - GIS Map first (`order-1 lg:order-2`)
  - Grievances second (`order-2 lg:order-1`)
  - Crisis + Social third (`order-3 lg:order-3`)
- **Standard Desktop (`1024px - 1439px` / `lg:`):**
  - Column 1 (Grievances & SLA): `lg:col-span-4`
  - Column 2 (Maharashtra GIS): `lg:col-span-5`
  - Column 3 (Crisis Monitor & Social Pulse): `lg:col-span-3`
- **Wide Command Center (`>= 1440px` / `xl:`):**
  - Column 1 (Grievances & SLA): `xl:col-span-3 xl:min-w-[310px]`
  - Column 2 (Maharashtra GIS): `xl:col-span-6`
  - Column 3 (Crisis Monitor & Social Pulse): `xl:col-span-3 xl:min-w-[310px]`
- **Synchronized Viewport Budget:** All 3 columns share an identical `lg:h-[640px] flex flex-col` budget with internal scrolling (`overflow-y-auto`) to ensure bottom baselines align cleanly without vertical drift.

### 17.2 Above-Grid KPI Empty State Alert Bar (`KPIRibbon.tsx`)
- Collapsed 160px placeholder into a slim, single-line alert bar (`h-11 px-4 py-2 flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 w-full`) when a selected district has no ingested telemetry.
- Bilingual messaging:
  - English: "No telemetry ingested for this district yet." / "Select an active reporting district above to inspect KPIs."
  - Marathi: "या जिल्ह्यासाठी टेलीमेट्री उपलब्ध नाही." / "केपीआय तपासण्यासाठी वरील सक्रिय जिल्हा निवडा."

### 17.3 Grievances & SLA Redesign (`CitizenServicesCard.tsx`)
- **Header:** Retitled to "Grievances & SLA" (Marathi: "तक्रारी व हमी कायदा (SLA)") with `94.2% SLA` emerald pill.
- **4-Cell Summary Strip:** `grid grid-cols-4 gap-1.5 p-2 bg-slate-50 rounded-lg border-b border-slate-100 text-center`:
  - `TOTAL`: 5
  - `ACTIVE`: 3 (amber)
  - `AFFECTED`: 13.4K (formatted with 'K' to eliminate text wrapping)
  - `RESOLVED`: 2/5 (emerald)
  - Removed wrapping sub-words ("Cases", "Active", "(On-Time)").
- **Category Filter Pills:** Smooth scrollable strip (`px-2.5 py-1 text-xs font-medium rounded-full shrink-0`) with zero clipping.
- **Card Collision Bugfix:**
  - Row 1: Status dot + District name (`truncate`) + Shortened ID (`#PAL-4412`, full in `title` tooltip) + compact status badge.
  - Row 2: Clamped to 2 lines (`line-clamp-2 leading-relaxed`).
  - Row 3: Category badge + Users icon + numeric count ONLY (`1,450`, dropped "affected") on left; right-aligned action link (`ml-auto font-medium hover:underline`).

### 17.4 Maharashtra GIS Optimization (`GISMap.tsx`)
- **Header:** Retitled to "Maharashtra GIS" (Marathi: "महाराष्ट्र जीआयएस (GIS)"). Removed redundant `36 Districts (#1 to #36)` status pill.
- **Compact 2-Select Filter Bar:** Replaced two multi-row pill strips ("Division:" and "Districts (#1-36):") with a compact 2-select filter bar:
  - Division dropdown (`<select className="h-8 px-2.5 ...">`)
  - District select with `#1 - #36` indices (`<select className="h-8 px-2.5 ...">`)
  - Reset / Zoom 100% button
- **Floating Layers Popover:** Replaced 7 floating black/white buttons that occluded the Konkan coastline with a top-right `[ Layers (activeCount) ▾ ]` popover button and dropdown menu.
- **SVG Halo Accessibility:** Added `aria-hidden="true"` and `pointerEvents="none"` to SVG halo/outline `<text>` elements.

### 17.5 Crisis Monitor & Social Pulse Optimization
- **`EmergencyAlert.tsx`:** Retitled to "Crisis Monitor" (Marathi: "संकट संनियंत्रण कक्ष"). Dynamic 44px status bar when 0 active incidents (`scopeIncidents.length === 0 && !isCrisisRoute`), displaying shield icon, "Crisis Monitor", and pulsing green dot with "0 Active (Konkan)".
- **`SocialMediaAnalysis.tsx`:** Retitled to "Social Pulse" (Marathi: "समाज माध्यम नाडी (Social Pulse)"). Compact segmented tabs (`All` | `X` | `Meta`), pulsing green dot with "Live", sticky minimalist channel divider (`X Feed` / `Meta / DD News` + `API Active`), and formatted metrics (`↻ 1.4K • ♥ 6.2K`, `👁 12K • 💬 1.1K`).

### 17.6 Test Suite Verification
- Added `tests/three_column_operational_workspace.test.mjs` verifying all architectural and UI specifications across 5 suites.
- **Overall Test Pass Rate:** 157/157 tests passing across all 50 test suites (`npm test`).

---

## 18. Complete Dashboard UI/UX Overhaul & Spatial Optimization (Apple HIG + Tailwind)

### 18.1 Executive Scope & Objectives
A total zero-defect overhaul eliminating all text truncation, badge overlapping, scroll collision, map occlusion, and spatial mispositioning across the executive dashboard cockpit:
1. **Top Command Header & Navigation (`Header.tsx`, `GlobalSearchBar.tsx`, `Sidebar.tsx`)**:
   - Expanded search footprint to `min-w-[260px] lg:min-w-[340px] max-w-md flex-1` with dedicated desktop keyboard shortcut badge (`⌘K`).
   - Removed `max-w-[140px]` string truncation on user profile pill using `shrink-0 min-w-fit pr-2` with `tabular-nums whitespace-nowrap`, rendering `"Divisional Director • Tier 2"` in full.
   - Relocated sidebar collapse toggle into a docked bottom rail footer (`border-t border-slate-800/80 shrink-0 bg-slate-900/60`).
2. **State Operations Bar & Ticker (`DashboardToolbar.tsx`, `BreakingNewsTicker.tsx`)**:
   - Centralized global scope selection with segmented Apple-style select pills: `[Division: Konkan ▾] [District: #4 Mumbai Suburban ▾] [Timeframe: Last 7 Days ▾]` with deterministic district numbering.
   - Applied smooth CSS gradient fade mask (`[mask-image:linear-gradient(to_right,transparent_0%,black_3%,black_92%,transparent_100%)]`) to `#continuous-news-ticker-container`.
3. **Key Performance Indicators (`KPIRibbon.tsx`, `KPICard.tsx`)**:
   - Relocated computed timestamp to a single unified sync badge in the ribbon section header (`Last synced • {lastSentimentComputedAt || '18:25 IST'}`).
   - Removed card footer truncation: passed clean `targetText` without appending `· Computed: ...`, and removed `max-w-[180px]` with `min-w-0 flex-1 mr-2` so `Above Target (>65%)` and `0 Active in SLA` display with zero truncation.
4. **Grievances & SLA (`CitizenServicesCard.tsx`)**:
   - Implemented 3-zone architecture: `shrink-0` header/metrics/pills, `flex-1 min-h-0 overflow-y-auto` grievance feed, `shrink-0` footer.
   - Compacted category filter pills with `flex-wrap gap-1.5` so all 5 pills (`All 5`, `Health 1`, `Water 1`, `Infra 2`, `Agri 1`) are 100% visible.
   - Provided `p-2.5 pt-3 space-y-2.5` list padding preventing the first grievance card from underlapping the filter bar.
   - Enforced `whitespace-nowrap shrink-0` on timeline CTA so `"Click row for timeline →"` never wraps the `→` arrow.
5. **Maharashtra State GIS & Bento Scorecard (`GISMap.tsx`)**:
   - Guaranteed dedicated `min-h-[300px] sm:min-h-[360px] shrink-0` map footprint so map canvas and district pins remain interactive.
   - Refactored District Scorecard into an Apple Bento 2×2 Grid (`grid grid-cols-1 sm:grid-cols-2 gap-3`):
     - Relocated `HQ: Bandra (East) • Literacy: 89.91%` to District Header subtitle.
     - Cell 1 (Leadership): Full collector name on line 1, DIO + on duty badge cleanly aligned.
     - Cell 2 (Composite Index): `94.2 / 100` alongside `Rank #4` pill on top; `Grade: A+ (High Compliance) • Top Quintile` cleanly stacked below.
     - Cell 3 (Citizen Services): Sub-grid (`grid grid-cols-2 gap-2 mt-1`) eliminating the horizontal collision between `385 Notices` and `98.6% Resolved`.
     - Cell 4 (Demographics & Assets): Grammatically correct pluralization (`1 Hoarding` vs `N Hoardings`) paired with `3 Talukas` pill and area/population stats.
     - 4-Pillar Quality Scorecard: Vertically stacked labels (`text-[10px] font-medium truncate`) and scores (`font-bold font-mono text-xs tabular-nums`) preventing multi-line text crushing.
6. **Crisis Monitor & Social Pulse (`SocialMediaAnalysis.tsx`, `EmergencyAlert.tsx`)**:
   - Stream channel headers (`X Feed`, `Meta / DD News`) structured as `shrink-0` siblings with `space-y-2.5 overflow-y-auto max-h-[240px] pr-1 pt-0.5 scroll-pt-1` ensuring Post 1 (`@MahaDGIPR 12m ago`) is 100% visible at scroll position 0.

### 18.2 Verification & Build Status
- **Automated Test Suite:** `tests/dashboard_ui_ux_overhaul.test.mjs` (19/19 tests passing).
- **Full Test Suite:** 176/176 tests passing across all 57 test suites (`npm test`).
- **Static Typing:** `npx tsc --noEmit` passed with 0 errors.
- **Production Build:** `npm run build` passed with 43/43 static pages prerendered.







