'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { loadCesium } from '@/lib/cesiumLoader';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getDistrictName, getOfficerInfo, getLocalizedStatus } from '@/lib/dataLocalization';
import { DISTRICT_BY_ID, DIVISIONS, DIVISION_ORDER, type DistrictId } from '@/data/maharashtraGeo.generated';
import { ALL_HOARDINGS, DISTRICT_DETAILS_BY_ID } from '@/data/maharashtraDistrictsData';
import { DIO_BY_DISTRICT } from '@/data/dioDirectory';
import { GISMapSkeleton } from '@/components/skeletons/GISMapSkeleton';
import { MinimalCardHeader } from '@/components/shared/MinimalCardHeader';
import { XMarkIcon } from '@heroicons/react/24/solid';

/* ───────────── Types ───────────── */

export type CesiumMapLayer = 'cpi' | 'coverage' | 'sentiment' | 'crisis' | 'events' | 'hoardings';
type District = ReturnType<typeof useDashboardStore.getState>['districts'][number];
// lon/lat = look-at target; hw/hh = half-width / half-height (km) of the area that must fit on screen
type Preset = { label: string; lon: number; lat: number; hw: number; hh: number; pitch: number; heading: number; range?: number };

export interface Cesium3DMapProps {
  selectedDistrictId?: string | null;
  activeLayer?: CesiumMapLayer;
  onLayerChange?: (layer: CesiumMapLayer) => void;
  onSelectDistrict?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  showHoardings?: boolean;
  className?: string;
  divisionFilter?: string;
  is2DMode?: boolean;
  on2DModeChange?: (is2D: boolean) => void;
}

/* ───────────── Constants ───────────── */

// Census 2011 dtcode11: 497–531 are sequential in this order; Palghar (2014 split) is 732.
const CENSUS_IDS: DistrictId[] = [
  'nandurbar', 'dhule', 'jalgaon', 'buldhana', 'akola', 'washim', 'amravati', 'wardha', 'nagpur',
  'bhandara', 'gondia', 'gadchiroli', 'chandrapur', 'yavatmal', 'nanded', 'hingoli', 'parbhani',
  'jalna', 'chhatrapati-sambhajinagar', 'nashik', 'thane', 'mumbai-suburban', 'mumbai-city', 'raigad',
  'pune', 'ahilyanagar', 'beed', 'latur', 'dharashiv', 'solapur', 'satara', 'ratnagiri', 'sindhudurg',
  'kolhapur', 'sangli',
];
const CENSUS_CODE_TO_ID: Record<string, DistrictId> = {
  ...Object.fromEntries(CENSUS_IDS.map((id, i) => [String(497 + i), id])),
  '732': 'palghar',
};

export const DISTRICT_NUMBERS: Record<string, number> = {
  thane: 1,
  pune: 2,
  'mumbai-city': 3,
  'mumbai-suburban': 4,
  nagpur: 5,
  'chhatrapati-sambhajinagar': 6,
  nashik: 7,
  kolhapur: 8,
  solapur: 9,
  amravati: 10,
  nanded: 11,
  jalgaon: 12,
  ahilyanagar: 13,
  sangli: 14,
  satara: 15,
  raigad: 16,
  palghar: 17,
  ratnagiri: 18,
  sindhudurg: 19,
  akola: 20,
  latur: 21,
  dhule: 22,
  chandrapur: 23,
  parbhani: 24,
  jalna: 25,
  beed: 26,
  yavatmal: 27,
  buldhana: 28,
  gondia: 29,
  wardha: 30,
  dharashiv: 31,
  bhandara: 32,
  washim: 33,
  hingoli: 34,
  nandurbar: 35,
  gadchiroli: 36,
};

const DTNAME_TO_ID: Record<string, DistrictId> = {
  gondiya: 'gondia',
  buldana: 'buldhana',
  ahmadnagar: 'ahilyanagar',
  bid: 'beed',
  mumbai: 'mumbai-city',
  osmanabad: 'dharashiv',
  aurangabad: 'chhatrapati-sambhajinagar',
  raigarh: 'raigad',
  'mumbai suburban': 'mumbai-suburban',
};

const PRESETS: Record<string, Preset> = {
  statewide: { label: 'All 36 Statewide', lon: 76.85, lat: 19.1, hw: 520, hh: 430, pitch: -52, heading: 0, range: 1180000 },
  konkan: { label: 'Konkan Coast', lon: 73.45, lat: 18.1, hw: 160, hh: 280, pitch: -48, heading: 350, range: 580000 },
  ghats: { label: 'Western Ghats', lon: 74.88, lat: 17.65, hw: 190, hh: 290, pitch: -50, heading: 355, range: 520000 },
  pune: { label: 'Pune Division', lon: 74.88, lat: 17.65, hw: 190, hh: 290, pitch: -50, heading: 355, range: 520000 },
  nashik: { label: 'Nashik Division', lon: 74.82, lat: 20.8, hw: 200, hh: 210, pitch: -50, heading: 0, range: 480000 },
  marathwada: { label: 'Marathwada', lon: 76.5, lat: 19.15, hw: 220, hh: 190, pitch: -50, heading: 0, range: 520000 },
  'chhatrapati-sambhajinagar': { label: 'Chhatrapati Sambhajinagar', lon: 76.5, lat: 19.15, hw: 220, hh: 190, pitch: -50, heading: 0, range: 520000 },
  amravati: { label: 'Amravati Division', lon: 77.88, lat: 20.6, hw: 200, hh: 190, pitch: -50, heading: 0, range: 440000 },
  nagpur: { label: 'Nagpur Division', lon: 79.48, lat: 20.2, hw: 210, hh: 200, pitch: -50, heading: 0, range: 460000 },
  vidarbha: { label: 'Vidarbha', lon: 78.75, lat: 20.3, hw: 300, hh: 220, pitch: -50, heading: 0, range: 600000 },
  topdown: { label: '2D Plan', lon: 76.85, lat: 19.0, hw: 520, hh: 430, pitch: -89, heading: 0, range: 1050000 },
};

const LAYERS: { key: CesiumMapLayer; en: string; mr: string; title: string }[] = [
  { key: 'cpi', en: 'Performance Index', mr: 'कामगिरी (CPI)', title: 'Communication Performance Index (CPI)' },
  { key: 'coverage', en: 'Media Coverage', mr: 'माध्यम प्रसार', title: 'Media Coverage & Release Volume' },
  { key: 'sentiment', en: 'Sentiment', mr: 'लोकभावना', title: 'Public & Social Sentiment Score' },
  { key: 'crisis', en: 'Crisis Alerts', mr: 'आपत्कालीन इशारे', title: 'Active Crisis Incidents & 90-min SLA' },
  { key: 'events', en: 'Field Events', mr: 'क्षेत्रीय कार्यक्रम', title: 'Field Engagements & Ministerial Briefings' },
];

// [min score, color, legend label]
const SCORE_STOPS = [
  [80, '#22C55E', '80+'],
  [60, '#84CC16', '60+'],
  [40, '#FACC15', '40+'],
  [20, '#F97316', '20+'],
  [0, '#EF4444', '<20'],
] as const;
const HEAT_LEGEND: [string, string][] = SCORE_STOPS.map(([, c, l]) => [c, l]);

const BASE_FILL = '#CBD5E1'; // light slate: the default look of every district
const SELECTED_FILL = '#1D4ED8';

const FIT_MARGIN = 1.35; // breathing room for the floating controls
const WAR_ROOM_MIN_WIDTH = 2560; // idle orbit only on wall displays
const IDLE_RESUME_MS = 30_000;
const SPIN_STEP = 0.0003; // rad per frame
const MAX_HOARDINGS = 45;
const PIN_HEIGHT = 56000; // above the tallest extrusion (52000)
const CARD_W = 288;
const CARD_H = 190;

const PANEL = 'bg-white/75 backdrop-blur-md border border-white/60 shadow-sm ring-1 ring-slate-900/5';
const pill = (on: boolean) =>
  `px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
    on ? 'bg-[#1D4ED8] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
  }`;

/* ───────────── Pure helpers ───────────── */

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const scoreColor = (s: number) => SCORE_STOPS.find(([min]) => s >= min)![1];

const resolveDistrictId = (entity: any): DistrictId | null => {
  const p = entity.properties;
  const code = String(p?.dtcode11?.getValue() ?? '');
  const name = String(p?.dtname?.getValue() ?? '').toLowerCase();
  return CENSUS_CODE_TO_ID[code] ?? DTNAME_TO_ID[name] ?? (name in DISTRICT_BY_ID ? (name as DistrictId) : null);
};

const scoreOf = (d: District | undefined, layer: CesiumMapLayer): number => {
  if (!d) return 75;
  switch (layer) {
    case 'coverage': return Math.min(100, ((d.volumeScore ?? 25) / 35) * 100);
    case 'sentiment': return d.sentimentScore ?? d.sentiment ?? 72;
    case 'crisis': {
      const c = d.crisisScore ?? 100 - (d.crisisSLA || 90);
      return c > 30 ? 35 : c > 15 ? 65 : 95; // 2 / 1 / 0 active incidents
    }
    case 'events': return Math.min(100, (((d.id.length * 7) % 20) + 5) * 5); // placeholder metric
    default: return d.cpi ?? 80;
  }
};

type Style = { h: number; fill: string; line: string; w: number };
// layer === null → plain base map. Otherwise the layer's score colours (highlights) every district.
const styleFor = (layer: CesiumMapLayer | null, score: number, selected: boolean, is2D = false): Style => {
  if (is2D) {
    if (selected) return { h: 0, fill: SELECTED_FILL, line: '#93C5FD', w: 3 };
    if (!layer) return { h: 0, fill: BASE_FILL, line: '#FFFFFF', w: 1.5 };
    if (layer === 'crisis' && score < 90) return { h: 0, fill: '#EF4444', line: '#FFFFFF', w: 2.5 };
    return { h: 0, fill: scoreColor(score), line: '#FFFFFF', w: 1.5 };
  }
  if (selected) return { h: 52000, fill: SELECTED_FILL, line: '#93C5FD', w: 3 };
  if (!layer) return { h: 16000, fill: BASE_FILL, line: '#FFFFFF', w: 1 };
  if (layer === 'crisis' && score < 90) return { h: 40000, fill: '#EF4444', line: '#FFFFFF', w: 2 };
  return { h: 22000 + (100 - score) * 350, fill: scoreColor(score), line: '#FFFFFF', w: 1.5 };
};

// Camera distance at which the preset's area fits the canvas, whatever its aspect ratio.
const fitRange = (viewer: any, p: Preset) => {
  const { clientWidth: w, clientHeight: h } = viewer.canvas;
  const ar = w && h ? w / h : 1;
  const t = Math.tan(viewer.camera.frustum.fov / 2); // fov spans the larger canvas side
  const tanH = ar >= 1 ? t : t * ar;
  const tanV = ar >= 1 ? t / ar : t;
  const tilt = Math.sin((Math.abs(p.pitch) * Math.PI) / 180); // N–S extent foreshortens when tilted
  return FIT_MARGIN * 1000 * Math.max(p.hw / tanH, (p.hh * tilt) / tanV);
};

const place = (C: any, viewer: any, key: string, duration = 0, is2D = false) => {
  const p = PRESETS[key] ?? PRESETS.statewide;
  const target = new C.BoundingSphere(C.Cartesian3.fromDegrees(p.lon, p.lat, 0), 1);
  const range = (p.range ?? fitRange(viewer, p)) * (is2D ? 0.95 : 1);
  const pitch = is2D ? -89.5 : p.pitch;
  const heading = is2D ? 0 : p.heading;
  const offset = new C.HeadingPitchRange(C.Math.toRadians(heading), C.Math.toRadians(pitch), range);
  if (duration) viewer.camera.flyToBoundingSphere(target, { offset, duration });
  else viewer.camera.viewBoundingSphere(target, offset);
};

const pinIcon = (fill: string) => {
  const c = document.createElement('canvas');
  c.width = 36;
  c.height = 44;
  const x = c.getContext('2d')!;
  x.fillStyle = fill;
  x.beginPath(); x.arc(18, 16, 12, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#FFFFFF';
  x.beginPath(); x.arc(18, 16, 6, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#0F172A';
  x.beginPath(); x.moveTo(18, 40); x.lineTo(10, 24); x.lineTo(26, 24); x.fill();
  return c;
};

/* ───────────── Component ───────────── */

export const Cesium3DMap: React.FC<Cesium3DMapProps> = ({
  selectedDistrictId: propSelectedDistrictId,
  activeLayer: controlledLayer,
  onLayerChange,
  onSelectDistrict,
  onViewDetails,
  showHoardings = false,
  className = '',
  divisionFilter,
  is2DMode: propIs2DMode,
  on2DModeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const compassRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const cesiumRef = useRef<any>(null);
  const idByEntity = useRef(new Map<any, DistrictId | null>());
  const appliedStyle = useRef(new Map<any, string>());
  const spinRef = useRef(false);
  const touchedRef = useRef(false); // user moved the camera → don't auto-refit on resize
  const perspectiveRef = useRef('statewide');
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { language, districts, selectedDistrictId: storeSelectedDistrictId, setSelectedDistrictId } = useDashboardStore();
  const selectedDistrictId = propSelectedDistrictId !== undefined ? propSelectedDistrictId : storeSelectedDistrictId;

  const [internalLayer, setInternalLayer] = useState<CesiumMapLayer>('cpi');
  const activeLayer = controlledLayer ?? internalLayer;
  const [layerOn, setLayerOn] = useState(false); // off = plain slate base map
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pick, setPick] = useState<{ id: DistrictId; x: number; y: number } | null>(null);
  const [perspective, setPerspective] = useState('statewide');
  const [is2DView, setIs2DView] = useState<boolean>(propIs2DMode ?? false);
  const is2DRef = useRef(is2DView);
  is2DRef.current = is2DView;

  // Sync with prop if passed
  useEffect(() => {
    if (propIs2DMode !== undefined && propIs2DMode !== is2DView) {
      setIs2DView(propIs2DMode);
      flyToPerspective(perspectiveRef.current, propIs2DMode);
    }
  }, [propIs2DMode]);

  const loading = !ready && !error;
  const tr = (en: string, mr?: string) => (language === 'mr' && mr) || en;

  // The Cesium click handler lives for the viewer's lifetime; keep its callback fresh via a ref.
  const selectRef = useRef<(id: DistrictId) => void>(() => {});
  selectRef.current = (id) => {
    setSelectedDistrictId(id);
    onSelectDistrict?.(id);
  };

  // Click a layer to highlight the map by it; click it again to return to the base map.
  const toggleLayer = (layer: CesiumMapLayer) => {
    const turnOff = layerOn && activeLayer === layer;
    setLayerOn(!turnOff);
    if (!turnOff) {
      setInternalLayer(layer);
      onLayerChange?.(layer);
    }
  };

  /* ── Viewer lifecycle (mount only) ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    let viewer: any;
    let handler: any;
    let ro: ResizeObserver | undefined;

    const armSpin = () => { spinRef.current = window.innerWidth >= WAR_ROOM_MIN_WIDTH; };
    const onUser = () => {
      touchedRef.current = true;
      spinRef.current = false;
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(armSpin, IDLE_RESUME_MS);
    };
    const USER_EVENTS = ['pointerdown', 'wheel'] as const;
    USER_EVENTS.forEach((e) => el.addEventListener(e, onUser, { passive: true }));

    (async () => {
      try {
        const Cesium = await loadCesium();
        if (cancelled) return;
        cesiumRef.current = Cesium;

        viewer = new Cesium.Viewer(el, {
          animation: false,
          baseLayerPicker: false,
          baseLayer: false, // no satellite imagery
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          sceneModePicker: false,
          selectionIndicator: false,
          timeline: false,
          navigationHelpButton: false,
          navigationInstructionsInitiallyVisible: false,
          scene3DOnly: true,
          skyBox: false,
          skyAtmosphere: false,
          requestRenderMode: true, // render only when something changes
          maximumRenderTimeChange: Infinity,
          contextOptions: { webgl: { alpha: true, preserveDrawingBuffer: true } },
        });
        viewerRef.current = viewer;
        const { scene, camera } = viewer;

        viewer.imageryLayers.removeAll(); // older Cesium ignores baseLayer:false
        scene.backgroundColor = Cesium.Color.fromCssColorString('#F8FAFC');
        scene.globe.baseColor = Cesium.Color.fromCssColorString('#F1F5F9');
        scene.globe.showGroundAtmosphere = false;
        scene.globe.enableLighting = false;
        scene.fog.enabled = false;
        if (scene.sun) scene.sun.show = false;
        if (scene.moon) scene.moon.show = false;
        scene.screenSpaceCameraController.minimumZoomDistance = 60_000;
        scene.screenSpaceCameraController.maximumZoomDistance = 4_000_000;
        place(Cesium, viewer, 'statewide', 0, is2DRef.current);

        const ds = await Cesium.GeoJsonDataSource.load('/data/maharashtra_districts.geojson', {
          stroke: Cesium.Color.WHITE,
          fill: Cesium.Color.fromCssColorString(BASE_FILL),
          strokeWidth: 2,
          clampToGround: false, // required for extrusion
        });
        if (cancelled) return;
        await viewer.dataSources.add(ds);
        ds.entities.values.forEach((e: any) => idByEntity.current.set(e, resolveDistrictId(e)));

        // Click → select district + open inspection card
        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(({ position }: any) => {
          const picked = scene.pick(position);
          const id = picked?.id ? idByEntity.current.get(picked.id) : null;
          if (!id) return setPick(null);
          selectRef.current(id);
          const { width, height } = el.getBoundingClientRect();
          setPick({
            id,
            x: clamp(position.x, 8, width - CARD_W - 8),
            y: clamp(position.y - 120, 8, height - CARD_H - 8),
          });
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Idle orbit around the map centre (axis = local vertical at map centre).
        const c = PRESETS.statewide;
        const up = Cesium.Cartesian3.normalize(Cesium.Cartesian3.fromDegrees(c.lon, c.lat), new Cesium.Cartesian3());
        viewer.clock.onTick.addEventListener(() => {
          if (spinRef.current) camera.rotate(up, SPIN_STEP);
        });
        armSpin();

        // Compass is updated straight on the DOM — no React re-render per camera move.
        camera.percentageChanged = 0.01;
        camera.changed.addEventListener(() => {
          if (compassRef.current)
            compassRef.current.style.transform = `rotate(${-Cesium.Math.toDegrees(camera.heading)}deg)`;
        });

        // Keep the whole area in frame when the card is resized (until the user takes the camera).
        ro = new ResizeObserver(() => {
          if (!touchedRef.current) place(Cesium, viewer, perspectiveRef.current, 0, is2DRef.current);
        });
        ro.observe(el);

        setReady(true);
      } catch (err: any) {
        console.error('Failed to initialize Cesium 3D map:', err);
        if (!cancelled) setError(err?.message || 'Cesium WebGL initialization failed');
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(idleTimer.current);
      USER_EVENTS.forEach((e) => el.removeEventListener(e, onUser));
      ro?.disconnect();
      handler?.destroy();
      if (viewer && !viewer.isDestroyed()) viewer.destroy();
      viewerRef.current = null;
      idByEntity.current.clear();
      appliedStyle.current.clear();
      setReady(false);
    };
  }, []);

  /* ── Polygon styling (only entities whose style changed are touched) ── */
  useEffect(() => {
    const C = cesiumRef.current;
    const viewer = viewerRef.current;
    if (!ready || !C || !viewer || viewer.isDestroyed()) return;

    const byId = new Map(districts.map((d) => [d.id, d]));
    idByEntity.current.forEach((id, entity) => {
      const poly = entity.polygon;
      if (!poly) return;
      const score = scoreOf(id ? byId.get(id) : undefined, activeLayer);
      const s = styleFor(layerOn ? activeLayer : null, score, !!id && id === selectedDistrictId, is2DView);
      const key = JSON.stringify(s);
      if (appliedStyle.current.get(entity) === key) return;
      appliedStyle.current.set(entity, key);

      poly.height = 0;
      poly.extrudedHeight = s.h;
      poly.material = C.Color.fromCssColorString(s.fill);
      poly.outline = true;
      poly.outlineColor = C.Color.fromCssColorString(s.line);
      poly.outlineWidth = s.w; // ignored by browsers that only draw 1px lines
    });
    viewer.scene.requestRender();
  }, [ready, activeLayer, layerOn, districts, selectedDistrictId, is2DView]);

  /* ── Hoarding pins (cleanup removes them when the layer is toggled off) ── */
  useEffect(() => {
    const C = cesiumRef.current;
    const viewer = viewerRef.current;
    if (!ready || !C || !viewer || viewer.isDestroyed()) return;
    if (activeLayer !== 'hoardings' && !showHoardings) return;

    const pins = viewer.scene.primitives.add(new C.BillboardCollection());
    const icons = { on: pinIcon('#22C55E'), off: pinIcon('#EAB308') }; // shared across all pins
    ALL_HOARDINGS.filter((h) => h.geotag).slice(0, MAX_HOARDINGS).forEach((h) => {
      const { lat, lng } = h.geotag!;
      pins.add({
        position: C.Cartesian3.fromDegrees(lng, lat, PIN_HEIGHT),
        image: h.illuminated ? icons.on : icons.off,
        verticalOrigin: C.VerticalOrigin.BOTTOM,
        scale: 0.9,
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // never hidden behind extrusions
      });
    });
    viewer.scene.requestRender();

    return () => {
      if (viewer.isDestroyed()) return;
      viewer.scene.primitives.remove(pins);
      viewer.scene.requestRender();
    };
  }, [ready, activeLayer, showHoardings]);

  /* ── Inspection card data: derived, so it always reflects the latest store data ── */
  const inspection = useMemo(() => {
    if (!pick) return null;
    const d = districts.find((x) => x.id === pick.id);
    if (!d) return null;
    const geo = DISTRICT_BY_ID[pick.id];
    const name = geo?.name ?? pick.id;
    const sent = d.sentimentScore ?? d.sentiment;
    return {
      ...pick,
      name,
      nameMr: geo?.nameMr || getDistrictName(name, 'mr'),
      score: clamp(scoreOf(d, 'cpi'), 0, 100),
      rank: d.rank ?? '–',
      releases: d.releases ?? '–',
      sentiment: sent != null ? `${sent}% Positive` : '—',
    };
  }, [pick, districts]);

  /* ── Camera actions ── */
  const flyToPerspective = (key: string, force2D?: boolean) => {
    const C = cesiumRef.current;
    const viewer = viewerRef.current;
    if (!C || !viewer || viewer.isDestroyed()) return;
    touchedRef.current = false;
    perspectiveRef.current = key;
    setPerspective(key);
    const target2D = force2D !== undefined ? force2D : is2DView;
    place(C, viewer, key, 1.2, target2D);
  };

  const toggle2DView = () => {
    const next2D = !is2DView;
    setIs2DView(next2D);
    on2DModeChange?.(next2D);
    flyToPerspective(perspective, next2D);
  };

  useEffect(() => {
    if (!divisionFilter || !ready) return;
    if (divisionFilter === 'all') {
      flyToPerspective('statewide');
    } else if (PRESETS[divisionFilter]) {
      flyToPerspective(divisionFilter);
    }
  }, [divisionFilter, ready]);

  const resetNorth = () => {
    const cam = viewerRef.current?.camera;
    if (!cam) return;
    cam.flyTo({
      destination: cam.positionWC.clone(),
      orientation: { heading: 0, pitch: cam.pitch, roll: 0 },
      duration: 0.8,
    });
  };

  const layerMeta = LAYERS.find((l) => l.key === activeLayer);
  const legend: [string, string][] = [
    ...(layerOn ? HEAT_LEGEND : [[BASE_FILL, tr('District', 'जिल्हा')] as [string, string]]),
    [SELECTED_FILL, tr('Selected', 'निवडलेला')],
  ];

  return (
    <div className={`relative w-full h-full min-h-[380px] bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs ${className}`}>
      <div ref={containerRef} className="w-full h-full absolute inset-0 select-none" />

      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
          <span className="mt-3 text-xs font-semibold text-slate-700">
            {tr('Initializing Cesium 3D Extruded Map...', '3D नकाशा लोड होत आहे...')}
          </span>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5">36 Districts • Isometric View</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/90 p-6 text-center text-xs font-semibold text-rose-600">
          {error}
        </div>
      )}

      {/* Top row: compass + layer toggles. Flex flow = controls can never overlap; gaps stay clickable on the map. */}
      <div className="absolute top-3 inset-x-3 z-20 flex items-start justify-between gap-2 pointer-events-none">
        <button
          type="button"
          onClick={resetNorth}
          className={`${PANEL} pointer-events-auto shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white active:scale-90 transition-all cursor-pointer`}
          title="Reset to True North"
          aria-label="Reset orientation to North"
        >
          <div ref={compassRef} className="w-4.5 h-4.5 relative flex items-center justify-center">
            <div className="absolute top-0 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[8px] border-b-rose-600" />
            <div className="absolute bottom-0 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[8px] border-t-slate-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800 z-10" />
          </div>
        </button>

        <div role="group" aria-label="Map layers" className={`${PANEL} pointer-events-auto flex items-center justify-end gap-1 p-0.5 rounded-full max-w-[calc(100%-110px)] overflow-x-auto no-scrollbar`}>
          {LAYERS.map((l) => (
            <button
              key={l.key}
              type="button"
              title={l.title}
              aria-pressed={layerOn && activeLayer === l.key}
              onClick={() => toggleLayer(l.key)}
              className={pill(layerOn && activeLayer === l.key)}
            >
              {tr(l.en, l.mr)}
            </button>
          ))}
        </div>
      </div>

      {/* District inspection card */}
      {inspection && (
        <div
          className={`${PANEL} absolute z-30 w-72 rounded-2xl p-4 text-xs animate-in fade-in zoom-in-95 duration-150`}
          style={{ left: inspection.x, top: inspection.y }}
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200/80">
                  #{inspection.rank}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">Live Reporting</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">
                {tr(inspection.name, inspection.nameMr)}
              </h4>
            </div>

            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="14" fill="none" strokeWidth="3" strokeLinecap="round"
                  stroke={scoreColor(inspection.score)}
                  strokeDasharray={`${(inspection.score / 100) * 88} 88`}
                />
              </svg>
              <span className="absolute font-mono font-bold text-xs text-slate-900 tabular-nums">
                {Math.round(inspection.score)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
            {[
              ['Releases Published', inspection.releases, 'text-slate-800'],
              ['Net Sentiment', inspection.sentiment, 'text-emerald-700'],
            ].map(([label, value, color]) => (
              <div key={label} className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] font-medium">{label}</span>
                <span className={`font-bold font-mono text-xs ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails?.(inspection.id)}
              className="flex-1 py-2 px-3 bg-[#1D4ED8] hover:bg-blue-800 text-white font-semibold rounded-xl transition-all cursor-pointer text-xs shadow-xs"
            >
              {tr('View District Details →', 'तपशील पहा →')}
            </button>
            <button
              type="button"
              onClick={() => setPick(null)}
              className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer text-xs shrink-0"
              aria-label="Close inspection popup"
            >
              <XMarkIcon className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom row: camera presets + legend */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className={`${PANEL} pointer-events-auto max-w-full overflow-x-auto no-scrollbar flex items-center gap-1 p-1 rounded-full`}>
          {[
            { key: 'statewide', label: 'All 36' },
            { key: 'konkan', label: 'Konkan' },
            { key: 'pune', label: 'Pune' },
            { key: 'nashik', label: 'Nashik' },
            { key: 'marathwada', label: 'Marathwada' },
            { key: 'vidarbha', label: 'Vidarbha' },
          ].map(({ key, label }) => (
            <button key={key} type="button" onClick={() => flyToPerspective(key)} className={pill(perspective === key)}>
              {label}
            </button>
          ))}

          {/* Subtle divider */}
          <div className="h-4 w-px bg-slate-300/60 mx-0.5 shrink-0" />

          {/* 2D View Clickable Checkbox Button */}
          <button
            type="button"
            role="checkbox"
            aria-checked={is2DView}
            onClick={toggle2DView}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 select-none active:scale-95 ${
              is2DView
                ? 'bg-[#1D4ED8] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
            title={language === 'mr' ? '२D ऑर्थोग्राफिक नकाशा व्ह्यू चालू/बंद करा' : 'Toggle 2D Orthographic Plan View'}
          >
            <span
              className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                is2DView
                  ? 'bg-white text-[#1D4ED8]'
                  : 'border border-slate-400/80 bg-white/70 text-transparent'
              }`}
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2 6 4.5 9 10 3" />
              </svg>
            </span>
            <span className="whitespace-nowrap font-medium">
              {language === 'mr' ? '२D व्ह्यू' : '2D View'}
            </span>
          </button>
        </div>

        <div className={`${PANEL} pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px]`}>
          <span className="font-semibold text-slate-800">
            {layerOn && layerMeta ? tr(layerMeta.en, layerMeta.mr) : tr('Base Map', 'मूळ नकाशा')}
          </span>
          <div className="flex items-center gap-2 font-medium text-slate-600">
            {legend.map(([color, label]) => (
              <span key={label} className="flex items-center gap-1">
                <i className="w-2.5 h-2.5 rounded-full border border-white/60 shadow-2xs" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────── GISMap Executive Center Column Component ───────────── */

export const GISMap: React.FC<Cesium3DMapProps> = (props) => {
  const { language, districts, selectedDistrictId: storeDistrictId, setSelectedDistrictId, isLoadingData } = useDashboardStore();
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);
  const [showHighways, setShowHighways] = useState<boolean>(true);
  const [showRailways, setShowRailways] = useState<boolean>(true);
  const [showWaterAndTerrain, setShowWaterAndTerrain] = useState<boolean>(true);
  const [showTowns, setShowTowns] = useState<boolean>(false);
  const [showGraticule, setShowGraticule] = useState<boolean>(false);
  const [showHoardings, setShowHoardings] = useState<boolean>(false);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  if (isLoadingData) {
    return <GISMapSkeleton />;
  }

  const selectedId = (props.selectedDistrictId ?? storeDistrictId ?? 'thane') as DistrictId;
  const inspectedId = selectedId || 'thane';
  const inspected = DISTRICT_BY_ID[inspectedId] ?? DISTRICT_BY_ID['thane'];
  const inspectedDetails = DISTRICT_DETAILS_BY_ID[inspectedId];
  const storeDistrict = districts.find((d) => d.id === inspectedId);
  const officerName = getOfficerInfo(inspectedId, language)?.name || (language === 'mr' ? 'माहिती अधिकारी' : 'District Information Officer');
  const inspectedStatus = DIO_BY_DISTRICT[inspectedId]?.status ?? 'Active';

  const activeLayersCount = [
    showHighways,
    showRailways,
    showWaterAndTerrain,
    showTowns,
    showGraticule,
    showHoardings,
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-150 overflow-hidden flex flex-col h-full min-h-0">
      {/* 1. Header Toolbar */}
      <div className="p-3 sm:p-3.5 border-b border-slate-200 flex flex-col gap-2.5 bg-white shrink-0">
        <MinimalCardHeader
          title={
            language === 'mr'
              ? 'महाराष्ट्र जीआयएस (GIS)'
              : 'Maharashtra GIS'
          }
          subtitle={
            language === 'mr'
              ? '३६ जिल्हे, महामार्ग, जलसंपदा व तालुका संपर्क जाळे (थेट संनियंत्रण)'
              : '36 Districts, Highway Network, Water Reservoirs & Sub-District Talukas'
          }
          badge={<span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 inline-block shrink-0" />}
          action={
            <div className="flex items-center gap-2 text-xs font-medium">
              <div className="inline-flex items-center p-0.5 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setIs3DMode(true)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    is3DMode
                      ? 'bg-[#EBF3FF] text-[#1D4ED8] shadow-xs border border-blue-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-pressed={is3DMode}
                >
                  {language === 'mr' ? '३D प्रिझम' : '3D Prism'}
                </button>
                <button
                  type="button"
                  onClick={() => setIs3DMode(false)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !is3DMode
                      ? 'bg-[#EBF3FF] text-[#1D4ED8] shadow-xs border border-blue-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-pressed={!is3DMode}
                >
                  {language === 'mr' ? '२D नकाशा' : '2D SVG'}
                </button>
              </div>
            </div>
          }
          className="w-full"
        />

        {/* Compact 2-Control High-Density Filter Bar (Responsive 12-Column Grid) */}
        <div className="grid grid-cols-12 gap-2 items-center p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          {/* 1. Division Dropdown */}
          <div className="col-span-5 min-w-0 flex items-center gap-1.5">
            <span className="text-slate-500 font-medium text-xs hidden lg:inline shrink-0">
              {language === 'mr' ? 'विभाग:' : 'Division:'}
            </span>
            <select
              value={selectedDivisionFilter}
              onChange={(e) => setSelectedDivisionFilter(e.target.value)}
              className="h-8 px-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-gov-accent w-full truncate"
              aria-label={language === 'mr' ? 'प्रशासकीय विभाग निवडा' : 'Select administrative division'}
            >
              <option value="all">
                {language === 'mr' ? 'सर्व विभाग (३६)' : 'All Divisions (36)'}
              </option>
              {DIVISION_ORDER.map((divId) => (
                <option key={divId} value={divId}>
                  {language === 'mr' ? DIVISIONS[divId].nameMr : DIVISIONS[divId].name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. District Select */}
          <div className="col-span-5 min-w-0 flex items-center gap-1.5">
            <span className="text-slate-500 font-medium text-xs hidden lg:inline shrink-0">
              {language === 'mr' ? 'जिल्हा:' : 'District:'}
            </span>
            <select
              value={selectedId || ''}
              onChange={(e) => {
                const dId = e.target.value as DistrictId;
                if (dId) {
                  setSelectedDistrictId(dId);
                }
              }}
              className="h-8 px-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-gov-accent w-full truncate"
              aria-label={language === 'mr' ? 'जिल्हा निवडा' : 'Select district'}
            >
              <option value="">
                {language === 'mr' ? '-- सर्व ३६ जिल्हे (#१-३६) --' : '-- All 36 Districts (#1-36) --'}
              </option>
              {CENSUS_IDS.map((id) => {
                const num = DISTRICT_NUMBERS[id] ?? 0;
                const dGeom = DISTRICT_BY_ID[id];
                return (
                  <option key={`opt-${id}`} value={id}>
                    #{num} {language === 'mr' ? dGeom?.nameMr : dGeom?.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 3. Reset Button */}
          <button
            type="button"
            onClick={() => setSelectedDivisionFilter('all')}
            className="col-span-2 shrink-0 h-8 px-2 bg-white border border-slate-200 rounded-md text-xs font-medium hover:bg-slate-100 flex items-center justify-center gap-1 text-slate-700 cursor-pointer shadow-2xs"
            title="Reset to 100% full view"
            aria-label="Reset view"
          >
            <span className="font-mono text-xs">100%</span>
            <span className="hidden sm:inline">{language === 'mr' ? 'पूर्ववत' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* 2. Map Canvas (CesiumJS 3D / Google Maps Progressive Rendering) */}
      <div className="p-3 sm:p-4 bg-[#F8FAFC] flex-1 min-h-0 overflow-y-auto">
        <div className="relative w-full aspect-[800/664] min-h-[300px] sm:min-h-[360px] max-h-[640px] shrink-0 flex items-center justify-center bg-[#F1F5F9] rounded-xl border border-slate-300 overflow-hidden shadow-inner">
          {/* Render User's Cesium3DMap */}
          <Cesium3DMap
            selectedDistrictId={inspectedId}
            onSelectDistrict={(id) => setSelectedDistrictId(id as DistrictId)}
            showHoardings={showHoardings}
            divisionFilter={selectedDivisionFilter}
            is2DMode={!is3DMode}
            on2DModeChange={(is2D) => setIs3DMode(!is2D)}
            className="w-full h-full"
            {...props}
          />

          {/* Floating Map Layers Popover */}
          <div className="absolute top-3 right-3 z-20">
            <button
              type="button"
              onClick={() => setIsLayersOpen(!isLayersOpen)}
              className="backdrop-blur-md bg-white/75 hover:bg-white/90 text-slate-800 text-xs px-3 py-1.5 rounded-full shadow-sm border border-white/60 ring-1 ring-slate-900/5 flex items-center gap-2 transition-all cursor-pointer font-medium active:scale-95"
              aria-expanded={isLayersOpen}
              aria-label="Toggle map layers menu"
            >
              <span>{language === 'mr' ? 'स्तर' : 'Layers'} ({activeLayersCount})</span>
              <span className="text-[10px] text-slate-400 shrink-0">▾</span>
            </button>

            {isLayersOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white/90 backdrop-blur-xl rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/70 ring-1 ring-slate-900/5 p-2.5 text-xs text-slate-700 space-y-1 animate-in fade-in-0 zoom-in-95">
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-100/70 cursor-pointer select-none">
                  <span className="text-xs font-medium text-slate-800">{language === 'mr' ? 'महामार्ग' : 'Highways'}</span>
                  <input
                    type="checkbox"
                    checked={showHighways}
                    onChange={(e) => setShowHighways(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-100/70 cursor-pointer select-none">
                  <span className="text-xs font-medium text-slate-800">{language === 'mr' ? 'रेल्वे लाईन' : 'Railways'}</span>
                  <input
                    type="checkbox"
                    checked={showRailways}
                    onChange={(e) => setShowRailways(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-100/70 cursor-pointer select-none">
                  <span className="text-xs font-medium text-slate-800">{language === 'mr' ? 'सह्याद्री व धरणे' : 'Terrain & Water'}</span>
                  <input
                    type="checkbox"
                    checked={showWaterAndTerrain}
                    onChange={(e) => setShowWaterAndTerrain(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-100/70 cursor-pointer select-none">
                  <span className="text-xs font-medium text-slate-800">{language === 'mr' ? 'तालुके / शहरे' : 'Talukas / Towns'}</span>
                  <input
                    type="checkbox"
                    checked={showTowns}
                    onChange={(e) => setShowTowns(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-100/70 cursor-pointer select-none">
                  <span className="text-xs font-medium text-slate-800">{language === 'mr' ? 'अक्षांश-रेखांश' : 'GIS Grid'}</span>
                  <input
                    type="checkbox"
                    checked={showGraticule}
                    onChange={(e) => setShowGraticule(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-100/70 cursor-pointer select-none">
                  <span className="text-xs font-medium text-slate-800">{language === 'mr' ? 'होर्डिंग्ज' : 'Hoardings'}</span>
                  <input
                    type="checkbox"
                    checked={showHoardings}
                    onChange={(e) => setShowHoardings(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* 3. District Live State Telemetry Sub-Panel (Clean Monochromatic Layout) */}
        <div className="w-full border border-slate-200 p-3.5 sm:p-4 rounded-xl bg-white shadow-xs flex flex-col gap-2.5 mt-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                #{DISTRICT_NUMBERS[inspected.id]}
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {inspected.name} ({inspected.nameMr})
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  District Live State • HQ: {inspectedDetails?.quickStats.headquarters || inspected.name} • Literacy: {inspectedDetails?.quickStats.literacyRate || '82.5%'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {language === 'mr' ? 'माहिती अधिकारी:' : 'DIO:'} {getLocalizedStatus(inspectedStatus as any, language)}
              </span>
            </div>
          </div>

          {/* Apple Bento 2x2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs items-stretch">
            {/* Box 1: Administrative Leadership */}
            <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 flex flex-col justify-between h-full">
              <div>
                <span className="text-slate-700 text-xs font-semibold block mb-1">
                  {language === 'mr' ? 'प्रशासकीय नेतृत्व:' : 'Administrative Leadership:'}
                </span>
                <div className="truncate">
                  <span className="text-[11px] text-slate-500 block">{language === 'mr' ? 'जिल्हाधिकारी:' : 'Collector & DM:'}</span>
                  <strong className="text-slate-900 truncate text-xs block font-bold" title={inspectedDetails?.dioOffice.collectorName}>
                    {inspectedDetails?.dioOffice.collectorName || 'District Collector, IAS'}
                  </strong>
                </div>
              </div>
              <div className="text-xs text-slate-600 truncate border-t border-slate-200/80 pt-1.5 mt-2 flex items-center justify-between">
                <div className="truncate min-w-0 pr-1">
                  <span className="text-[10px] text-slate-500 block">{language === 'mr' ? 'माहिती अधिकारी:' : 'Information Officer:'}</span>
                  <span className="font-semibold text-slate-800 text-xs truncate block">{officerName}</span>
                </div>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 ml-1">
                  {inspectedDetails?.dioOffice.staffPresentToday || 8} on duty
                </span>
              </div>
            </div>

            {/* Box 2: Composite Performance Index */}
            <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 flex flex-col justify-between h-full">
              <div>
                <span className="text-slate-700 text-xs font-semibold block mb-1">
                  {language === 'mr' ? 'कामगिरी निर्देशांक (CPI):' : 'Composite Index (CPI):'}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black font-mono text-slate-900 tracking-tight tabular-nums">
                    {inspectedDetails?.cpi || storeDistrict?.cpi || 88.5}{' '}
                    <span className="text-xs font-normal text-slate-500">/ 100</span>
                  </span>
                  <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-800 border border-amber-300 px-2 py-0.5 rounded shrink-0">
                    Rank #{DISTRICT_NUMBERS[inspected.id]}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-600 border-t border-slate-200/80 pt-1.5 mt-2 flex items-center justify-between">
                <span>{language === 'mr' ? 'दर्जा:' : 'Governance Grade:'} <strong className="text-emerald-700 font-semibold">A+ High Compliance</strong></span>
                <span className="text-slate-500 font-mono text-xs shrink-0">Top Quintile</span>
              </div>
            </div>

            {/* Box 3: Citizen Services & Resolution Rate */}
            <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 flex flex-col justify-between h-full">
              <div>
                <span className="text-slate-700 text-xs font-semibold block mb-1">
                  {language === 'mr' ? 'नागरिक सेवा व तक्रार निवारण:' : 'Citizen Services & Resolution:'}
                </span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                      {inspectedDetails?.releases || storeDistrict?.releases || 142}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{language === 'mr' ? 'सेवा प्रसिद्धी' : 'Notices'}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold font-mono text-emerald-600 tabular-nums">
                      {storeDistrict?.avgTAT != null ? (Math.min(99.8, Math.max(93.5, 100 - (storeDistrict.avgTAT / 25)))).toFixed(1) : '98.4'}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{language === 'mr' ? 'निवारण' : 'Resolved'}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-600 border-t border-slate-200/80 pt-1.5 mt-2 flex items-center justify-between">
                <span>{language === 'mr' ? 'तक्रार निवारण दर्जा:' : 'Citizen Charter:'}</span>
                <span className="font-bold text-emerald-700 font-mono text-xs">
                  ≥ 95% ({language === 'mr' ? 'साध्य' : 'Met'})
                </span>
              </div>
            </div>

            {/* Box 4: Hoardings & Demographics */}
            <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 flex flex-col justify-between h-full">
              <div>
                <span className="text-slate-700 text-xs font-semibold block mb-1">
                  {language === 'mr' ? 'होर्डिंग्ज व भौगोलिक व्याप्ती:' : 'Hoardings & Demographics:'}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                    {inspectedDetails?.hoardings?.length || 0}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      {(inspectedDetails?.hoardings?.length || 0) === 1 ? 'Hoarding' : 'Hoardings'}
                    </span>
                  </span>
                  <span className="text-xs font-mono text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded shrink-0">
                    {inspectedDetails?.quickStats.talukasCount || 8} Talukas
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-600 border-t border-slate-200/80 pt-1.5 mt-2 flex items-center justify-between">
                <span>Area: {inspectedDetails?.quickStats.areaKm2 || '8,420 km²'}</span>
                <span>Pop: {inspectedDetails?.quickStats.population || '2.4M'}</span>
              </div>
            </div>
          </div>

          {/* 2x2 Bento Sub-Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs items-stretch">
            {/* Left Bento: 4-Pillar Quality Scorecard */}
            <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wide">
                  {language === 'mr' ? '४-स्तंभ गुणवत्ता निर्देशांक:' : '4-Pillar Quality Scorecard:'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-500 font-medium truncate">1. Volume</span>
                <span className="font-bold font-mono text-xs text-slate-900 tabular-nums">
                    {(Math.min(35, storeDistrict?.volumeScore || 24.2)).toFixed(1)} / 35
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-500 font-medium truncate">2. Citizen Resolution</span>
                <span className="font-bold font-mono text-xs text-slate-900 tabular-nums">
                    {(Math.min(25, storeDistrict?.tatScore || 23.8)).toFixed(1)} / 25
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-500 font-medium truncate">3. Sentiment Index</span>
                <span className="font-bold font-mono text-xs text-slate-900 tabular-nums">
                    {(Math.min(25, storeDistrict?.sentimentScore || 21.5)).toFixed(1)} / 25
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-500 font-medium truncate">4. Crisis SLA Resolution</span>
                <span className="font-bold font-mono text-xs text-slate-900 tabular-nums">
                    {((storeDistrict?.crisisScore && storeDistrict.crisisScore > 15)
                      ? (storeDistrict?.crisisSLA ? (storeDistrict.crisisSLA / 100) * 15 : 14.25)
                      : Math.min(15, storeDistrict?.crisisScore || 14.25)).toFixed(1)} / 15
                  </span>
                </div>
              </div>
            </div>

            {/* Right Bento: District Centroid Halo & Quick Actions */}
            <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wide">
                  {language === 'mr' ? 'थेट केंद्रबिंदू:' : 'District Centroid:'}
                </span>
                <span style={{ paintOrder: 'stroke fill' }} className="text-xs font-mono font-bold text-blue-700">
                  #{DISTRICT_NUMBERS[inspected.id]} {inspected.name}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedDistrictId(inspected.id)}
                  className="flex-1 h-8.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  {language === 'mr'
                    ? `#${DISTRICT_NUMBERS[inspected.id]} ${inspected.nameMr} जिल्हा डॅशबोर्डवर निवडा`
                    : `Select #${DISTRICT_NUMBERS[inspected.id]} ${inspected.name} for Analysis`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GisMap = Cesium3DMap;
export default GISMap;