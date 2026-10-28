'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { loadCesium } from '@/lib/cesiumLoader';
import { useDashboardStore } from '@/stores/dashboardStore';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { getDistrictName } from '@/lib/dataLocalization';
import { DISTRICT_BY_ID, type DistrictId } from '@/data/maharashtraGeo.generated';
import { ALL_HOARDINGS, type HoardingRecord } from '@/data/maharashtraDistrictsData';

// Census 2011 dtcode11 to DistrictId mapping
const CENSUS_CODE_TO_ID: Record<string, DistrictId> = {
  '497': 'nandurbar',
  '498': 'dhule',
  '499': 'jalgaon',
  '500': 'buldhana',
  '501': 'akola',
  '502': 'washim',
  '503': 'amravati',
  '504': 'wardha',
  '505': 'nagpur',
  '506': 'bhandara',
  '507': 'gondia',
  '508': 'gadchiroli',
  '509': 'chandrapur',
  '510': 'yavatmal',
  '511': 'nanded',
  '512': 'hingoli',
  '513': 'parbhani',
  '514': 'jalna',
  '515': 'chhatrapati-sambhajinagar',
  '516': 'nashik',
  '517': 'thane',
  '518': 'mumbai-suburban',
  '519': 'mumbai-city',
  '520': 'raigad',
  '521': 'pune',
  '522': 'ahilyanagar',
  '523': 'beed',
  '524': 'latur',
  '525': 'dharashiv',
  '526': 'solapur',
  '527': 'satara',
  '528': 'ratnagiri',
  '529': 'sindhudurg',
  '530': 'kolhapur',
  '531': 'sangli',
  '732': 'palghar',
};

// District name alias fallback
const DTNAME_TO_ID: Record<string, DistrictId> = {
  'gondiya': 'gondia',
  'buldana': 'buldhana',
  'ahmadnagar': 'ahilyanagar',
  'bid': 'beed',
  'mumbai': 'mumbai-city',
  'osmanabad': 'dharashiv',
  'aurangabad': 'chhatrapati-sambhajinagar',
  'raigarh': 'raigad',
  'mumbai suburban': 'mumbai-suburban',
};

export type CesiumMapLayer = 'cpi' | 'coverage' | 'sentiment' | 'crisis' | 'events' | 'hoardings';

interface DistrictInspectData {
  id: DistrictId;
  name: string;
  nameMr: string;
  score: number;
  rank: number;
  pressCount: number;
  sentiment: string;
  activeCrisis: number;
  screenX: number;
  screenY: number;
}

export interface Cesium3DMapProps {
  selectedDistrictId?: string | null;
  activeLayer?: CesiumMapLayer;
  onLayerChange?: (layer: CesiumMapLayer) => void;
  onSelectDistrict?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  showHoardings?: boolean;
  className?: string;
}

export const Cesium3DMap: React.FC<Cesium3DMapProps> = ({
  selectedDistrictId: propSelectedDistrictId,
  activeLayer: controlledLayer,
  onLayerChange,
  onSelectDistrict,
  onViewDetails,
  showHoardings = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const entitiesRef = useRef<any[]>([]);
  const hoardingsDataSourceRef = useRef<any>(null);
  const idleTimerRef = useRef<any>(null);
  const rotatingRef = useRef<boolean>(false);

  const { language, districts, selectedDistrictId: storeSelectedDistrictId, setSelectedDistrictId } = useDashboardStore();
  const selectedDistrictId = propSelectedDistrictId !== undefined ? propSelectedDistrictId : storeSelectedDistrictId;
  const [internalLayer, setInternalLayer] = useState<CesiumMapLayer>('cpi');
  const activeLayer = controlledLayer || internalLayer;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInspection, setSelectedInspection] = useState<DistrictInspectData | null>(null);
  const [cameraHeading, setCameraHeading] = useState<number>(0);
  const [activePerspective, setActivePerspective] = useState<string>('statewide');
  const [renderMode, setRenderMode] = useState<'highlight' | 'heatmap'>('highlight');
  const [is2DView, setIs2DView] = useState<boolean>(false);

  // Score color gradient as defined in client specification:
  // 80–100: #22C55E (Excellent Green)
  // 60–80: #84CC16 (Good Lime)
  // 40–60: #FACC15 (Moderate Yellow)
  // 20–40: #F97316 (Attention Orange)
  // 0–20: #EF4444 (Critical Red)
  const getScoreColorHex = useCallback((score: number): string => {
    if (score >= 80) return '#22C55E';
    if (score >= 60) return '#84CC16';
    if (score >= 40) return '#FACC15';
    if (score >= 20) return '#F97316';
    return '#EF4444';
  }, []);

  // Compute metric per district based on activeLayer
  const getDistrictMetric = useCallback((distId: string, layer: CesiumMapLayer) => {
    const d = districts.find((item) => item.id === distId);
    if (!d) return { score: 75, rawValue: '75', label: 'Score: 75' };

    switch (layer) {
      case 'coverage': {
        const volume = d.volumeScore ?? 25;
        const score = Math.min(100, (volume / 35) * 100);
        return { score, rawValue: `${d.releases || 34}`, label: `${d.releases || 34} Releases` };
      }
      case 'sentiment': {
        const sIndex = d.sentimentScore ?? d.sentiment ?? 72;
        return { score: sIndex, rawValue: `${sIndex}%`, label: `${sIndex}% Positive` };
      }
      case 'crisis': {
        const crisisVal = d.crisisScore ?? (100 - (d.crisisSLA || 90));
        const active = crisisVal > 30 ? 2 : crisisVal > 15 ? 1 : 0;
        const score = active === 0 ? 95 : active === 1 ? 65 : 35;
        return { score, rawValue: `${active}`, label: `${active} Active Incidents` };
      }
      case 'events': {
        const ev = ((d.id.length * 7) % 20) + 5;
        const score = Math.min(100, ev * 5);
        return { score, rawValue: `${ev}`, label: `${ev} Events` };
      }
      case 'cpi':
      default: {
        const score = d.cpi ?? 80;
        return { score, rawValue: `${score.toFixed(1)}`, label: `CPI: ${score.toFixed(1)}` };
      }
    }
  }, [districts]);

  // Handle layer button switch
  const handleLayerSwitch = (layer: CesiumMapLayer) => {
    setInternalLayer(layer);
    if (onLayerChange) onLayerChange(layer);
  };

  // Initialize Cesium Viewer
  useEffect(() => {
    let isCancelled = false;

    async function initCesium() {
      if (!containerRef.current) return;
      try {
        setLoading(true);
        const Cesium = await loadCesium();
        if (isCancelled || !containerRef.current) return;

        // Clean up previous viewer if any
        if (viewerRef.current && !viewerRef.current.isDestroyed()) {
          viewerRef.current.destroy();
          viewerRef.current = null;
        }

        // Initialize viewer with Daylight Government Command settings
        const viewer = new Cesium.Viewer(containerRef.current, {
          animation: false,
          baseLayerPicker: false,
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
          contextOptions: {
            webgl: {
              alpha: true,
              preserveDrawingBuffer: true,
            },
          },
        });

        viewerRef.current = viewer;

        // Daylight Background & Clean Styling
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#F8FAFC');
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#F1F5F9');
        viewer.scene.globe.showGroundAtmosphere = false;
        viewer.scene.globe.enableLighting = false;
        if (viewer.scene.sun) viewer.scene.sun.show = false;
        if (viewer.scene.moon) viewer.scene.moon.show = false;

        // Camera Isometric Position: Centered on Maharashtra (lon: 76.85, lat: 19.1, range: 1,180,000m, pitch -52°)
        // Fits all 36 districts perfectly within the viewport with ample breathing room.
        const centerTarget = new Cesium.BoundingSphere(
          Cesium.Cartesian3.fromDegrees(76.85, 19.1, 0),
          1
        );
        const initialOffset = new Cesium.HeadingPitchRange(
          Cesium.Math.toRadians(0),
          Cesium.Math.toRadians(-52),
          1180000
        );
        viewer.camera.viewBoundingSphere(centerTarget, initialOffset);

        // Load 36 Districts GeoJSON
        const dataSource = await Cesium.GeoJsonDataSource.load('/data/maharashtra_districts.geojson', {
          stroke: Cesium.Color.WHITE.withAlpha(0.9),
          fill: Cesium.Color.TRANSPARENT,
          strokeWidth: 2,
        });

        if (isCancelled) {
          viewer.destroy();
          return;
        }

        viewer.dataSources.add(dataSource);
        const entities = dataSource.entities.values;
        entitiesRef.current = entities;

        // Attach Click Interaction
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

        handler.setInputAction((movement: any) => {
          const pickedObject = viewer.scene.pick(movement.position);
          if (Cesium.defined(pickedObject) && pickedObject.id) {
            const entity = pickedObject.id;
            const props = entity.properties;
            const dtcode = props?.dtcode11?.getValue()?.toString();
            const dtname = props?.dtname?.getValue()?.toLowerCase();

            let targetDistId: DistrictId = 'thane';
            if (dtcode && CENSUS_CODE_TO_ID[dtcode]) {
              targetDistId = CENSUS_CODE_TO_ID[dtcode];
            } else if (dtname && DTNAME_TO_ID[dtname]) {
              targetDistId = DTNAME_TO_ID[dtname];
            } else if (dtname && DISTRICT_BY_ID[dtname as DistrictId]) {
              targetDistId = dtname as DistrictId;
            }

            setSelectedDistrictId(targetDistId);
            if (onSelectDistrict) onSelectDistrict(targetDistId);

            // Calculate Inspection Card Details
            const dRecord = districts.find((d) => d.id === targetDistId);
            const distGeo = DISTRICT_BY_ID[targetDistId];
            const score = dRecord?.cpi ?? 85.5;

            // Constrain screen position within card viewport
            const rect = containerRef.current?.getBoundingClientRect();
            const posX = Math.min(Math.max(movement.position.x, 140), (rect?.width || 600) - 150);
            const posY = Math.min(Math.max(movement.position.y - 120, 20), (rect?.height || 500) - 140);

            setSelectedInspection({
              id: targetDistId,
              name: distGeo?.name || targetDistId,
              nameMr: distGeo?.nameMr || getDistrictName(distGeo?.name || targetDistId, 'mr'),
              score,
              rank: dRecord?.rank || 5,
              pressCount: dRecord?.releases || 38,
              sentiment: `${dRecord?.sentimentScore ?? dRecord?.sentiment ?? 78}% Positive`,
              activeCrisis: dRecord?.crisisScore && dRecord.crisisScore > 20 ? 1 : 0,
              screenX: posX,
              screenY: posY,
            });
          } else {
            setSelectedInspection(null);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Idle Camera Tour on War Room Displays (>2560px)
        const checkIdleRotate = () => {
          if (typeof window !== 'undefined' && window.innerWidth >= 2560) {
            rotatingRef.current = true;
          }
        };
        checkIdleRotate();

        viewer.clock.onTick.addEventListener(() => {
          if (rotatingRef.current && viewer && !viewer.isDestroyed()) {
            viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, 0.0003);
          }
        });

        // Real-time camera heading tracking for Apple Maps Compass
        viewer.camera.changed.addEventListener(() => {
          if (viewer && !viewer.isDestroyed()) {
            const deg = Cesium.Math.toDegrees(viewer.camera.heading);
            setCameraHeading(Math.round(deg));
          }
        });

        // Pause rotation on pointer down
        const onPointerDown = () => {
          rotatingRef.current = false;
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
          idleTimerRef.current = setTimeout(() => {
            if (typeof window !== 'undefined' && window.innerWidth >= 2560) {
              rotatingRef.current = true;
            }
          }, 30000);
        };

        containerRef.current.addEventListener('pointerdown', onPointerDown);

        setLoading(false);
      } catch (err: any) {
        console.error('Failed to initialize Cesium 3D map:', err);
        setError(err?.message || 'Cesium WebGL initialization failed');
        setLoading(false);
      }
    }

    initCesium();

    return () => {
      isCancelled = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []); // Run on mount

  // Update Polygon Heights and Colors on activeLayer, districts, selection, or renderMode changes
  useEffect(() => {
    if (!viewerRef.current || !window.Cesium || entitiesRef.current.length === 0) return;
    const Cesium = window.Cesium;

    entitiesRef.current.forEach((entity) => {
      const props = entity.properties;
      const dtcode = props?.dtcode11?.getValue()?.toString();
      const dtname = props?.dtname?.getValue()?.toLowerCase();

      let targetDistId: DistrictId = 'thane';
      if (dtcode && CENSUS_CODE_TO_ID[dtcode]) {
        targetDistId = CENSUS_CODE_TO_ID[dtcode];
      } else if (dtname && DTNAME_TO_ID[dtname]) {
        targetDistId = DTNAME_TO_ID[dtname];
      } else if (dtname && DISTRICT_BY_ID[dtname as DistrictId]) {
        targetDistId = dtname as DistrictId;
      }

      const { score } = getDistrictMetric(targetDistId, activeLayer);
      const isSelected = selectedDistrictId === targetDistId;
      const dRecord = districts.find((d) => d.id === targetDistId);
      const hasActiveCrisis = Boolean(dRecord?.crisisScore && dRecord.crisisScore > 20);
      const isCriticalDeficit = score < 50;
      const getExtrudedHeight = (h: number) => (is2DView ? 0 : h);

      if (renderMode === 'highlight') {
        // --- BASE COLOR + USER HIGHLIGHTS MODE (Apple Cartography Principle) ---
        if (isSelected) {
          // Highlight: User's explicitly clicked / selected district
          const extrudedHeight = getExtrudedHeight(52000);
          const materialColor = Cesium.Color.fromCssColorString('#1D4ED8').withAlpha(0.96);
          if (entity.polygon) {
            entity.polygon.extrudedHeight = new Cesium.ConstantProperty(extrudedHeight);
            entity.polygon.height = new Cesium.ConstantProperty(0);
            entity.polygon.material = new Cesium.ColorMaterialProperty(materialColor);
            entity.polygon.outline = new Cesium.ConstantProperty(true);
            entity.polygon.outlineColor = new Cesium.ConstantProperty(
              Cesium.Color.fromCssColorString('#60A5FA')
            );
            entity.polygon.outlineWidth = new Cesium.ConstantProperty(3.5);
          }
        } else if (activeLayer === 'crisis' && hasActiveCrisis) {
          // Highlight: Active Crisis SLA emergency
          const extrudedHeight = getExtrudedHeight(40000);
          const materialColor = Cesium.Color.fromCssColorString('#EF4444').withAlpha(0.92);
          if (entity.polygon) {
            entity.polygon.extrudedHeight = new Cesium.ConstantProperty(extrudedHeight);
            entity.polygon.height = new Cesium.ConstantProperty(0);
            entity.polygon.material = new Cesium.ColorMaterialProperty(materialColor);
            entity.polygon.outline = new Cesium.ConstantProperty(true);
            entity.polygon.outlineColor = new Cesium.ConstantProperty(Cesium.Color.WHITE);
            entity.polygon.outlineWidth = new Cesium.ConstantProperty(2.5);
          }
        } else if (isCriticalDeficit) {
          // Highlight: Low CPI deficit (<50) requiring executive intervention
          const extrudedHeight = getExtrudedHeight(22000 + (100 - score) * 350);
          const colorHex = getScoreColorHex(score);
          const materialColor = Cesium.Color.fromCssColorString(colorHex).withAlpha(0.88);
          if (entity.polygon) {
            entity.polygon.extrudedHeight = new Cesium.ConstantProperty(extrudedHeight);
            entity.polygon.height = new Cesium.ConstantProperty(0);
            entity.polygon.material = new Cesium.ColorMaterialProperty(materialColor);
            entity.polygon.outline = new Cesium.ConstantProperty(true);
            entity.polygon.outlineColor = new Cesium.ConstantProperty(
              Cesium.Color.fromCssColorString('#CBD5E1').withAlpha(0.9)
            );
            entity.polygon.outlineWidth = new Cesium.ConstantProperty(1.5);
          }
        } else {
          // Base Color: Calm architectural daylight cool-slate terrain
          const extrudedHeight = getExtrudedHeight(16000);
          const baseColor = Cesium.Color.fromCssColorString('#E2E8F0').withAlpha(0.7);
          if (entity.polygon) {
            entity.polygon.extrudedHeight = new Cesium.ConstantProperty(extrudedHeight);
            entity.polygon.height = new Cesium.ConstantProperty(0);
            entity.polygon.material = new Cesium.ColorMaterialProperty(baseColor);
            entity.polygon.outline = new Cesium.ConstantProperty(true);
            entity.polygon.outlineColor = new Cesium.ConstantProperty(
              Cesium.Color.fromCssColorString('#CBD5E1').withAlpha(0.75)
            );
            entity.polygon.outlineWidth = new Cesium.ConstantProperty(1.0);
          }
        }
      } else {
        // --- FULL HEATMAP CHOROPLETH MODE ---
        const extrudedHeight = getExtrudedHeight(22000 + (100 - score) * 350);
        const colorHex = getScoreColorHex(score);
        const alpha = isSelected ? 0.95 : 0.82;
        const baseColor = Cesium.Color.fromCssColorString(colorHex).withAlpha(alpha);

        if (entity.polygon) {
          entity.polygon.extrudedHeight = new Cesium.ConstantProperty(extrudedHeight);
          entity.polygon.height = new Cesium.ConstantProperty(0);
          entity.polygon.material = new Cesium.ColorMaterialProperty(baseColor);
          entity.polygon.outline = new Cesium.ConstantProperty(true);
          entity.polygon.outlineColor = new Cesium.ConstantProperty(
            isSelected
              ? Cesium.Color.fromCssColorString('#1D4ED8')
              : Cesium.Color.WHITE.withAlpha(0.9)
          );
          entity.polygon.outlineWidth = new Cesium.ConstantProperty(isSelected ? 3 : 1.5);
        }
      }
    });

    viewerRef.current.scene.requestRender();
  }, [activeLayer, districts, selectedDistrictId, renderMode, getDistrictMetric, getScoreColorHex, is2DView]);

  // Hoardings 3D Billboard Pin Layer (Page 5 & Layer Toggle)
  useEffect(() => {
    if (!viewerRef.current || !window.Cesium) return;
    const Cesium = window.Cesium;
    const viewer = viewerRef.current;

    if (activeLayer === 'hoardings' || showHoardings) {
      if (!hoardingsDataSourceRef.current) {
        const billboardCollection = viewer.scene.primitives.add(new Cesium.BillboardCollection());
        hoardingsDataSourceRef.current = billboardCollection;

        ALL_HOARDINGS.slice(0, 45).forEach((h) => {
          const lat = h.geotag?.lat || 19.076;
          const lon = h.geotag?.lng || 72.877;
          const isIlluminated = Boolean(h.illuminated);

          // Canvas marker pin
          const pinCanvas = document.createElement('canvas');
          pinCanvas.width = 36;
          pinCanvas.height = 44;
          const ctx = pinCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = isIlluminated ? '#22C55E' : '#EAB308';
            ctx.beginPath();
            ctx.arc(18, 16, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(18, 16, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0F172A';
            ctx.beginPath();
            ctx.moveTo(18, 40);
            ctx.lineTo(10, 24);
            ctx.lineTo(26, 24);
            ctx.closePath();
            ctx.fill();
          }

          billboardCollection.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat, 45000),
            image: pinCanvas,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 0.9,
          });
        });
      }
    } else {
      if (hoardingsDataSourceRef.current) {
        viewer.scene.primitives.remove(hoardingsDataSourceRef.current);
        hoardingsDataSourceRef.current = null;
      }
    }

    viewer.scene.requestRender();
  }, [activeLayer, showHoardings]);

  // Handle View Details Click from Inspection Card
  const handleInspectViewDetails = () => {
    if (selectedInspection && onViewDetails) {
      onViewDetails(selectedInspection.id);
    }
  };

  // Apple Maps Style Camera Presets & Smooth Flight Glides (Centers the entire division/region with ample margins)
  const flyToPerspective = useCallback((key: string, force2D?: boolean) => {
    if (!viewerRef.current || !window.Cesium) return;
    const Cesium = window.Cesium;
    const viewer = viewerRef.current;
    setActivePerspective(key);

    const use2D = force2D !== undefined ? force2D : is2DView;

    const presets: Record<string, { lon: number; lat: number; range: number; pitch: number; heading: number }> = {
      statewide: { lon: 76.85, lat: 19.1, range: 1180000, pitch: -52, heading: 0 },
      topdown: { lon: 76.85, lat: 19.0, range: 1050000, pitch: -89.5, heading: 0 },
      konkan: { lon: 73.45, lat: 18.1, range: 580000, pitch: -48, heading: 350 },
      ghats: { lon: 74.88, lat: 17.65, range: 520000, pitch: -50, heading: 355 },
      pune: { lon: 74.88, lat: 17.65, range: 520000, pitch: -50, heading: 355 },
      nashik: { lon: 74.82, lat: 20.8, range: 480000, pitch: -50, heading: 0 },
      marathwada: { lon: 76.5, lat: 19.15, range: 520000, pitch: -50, heading: 0 },
      'chhatrapati-sambhajinagar': { lon: 76.5, lat: 19.15, range: 520000, pitch: -50, heading: 0 },
      amravati: { lon: 77.88, lat: 20.6, range: 440000, pitch: -50, heading: 0 },
      nagpur: { lon: 79.48, lat: 20.2, range: 460000, pitch: -50, heading: 0 },
      vidarbha: { lon: 78.75, lat: 20.3, range: 600000, pitch: -50, heading: 0 },
    };

    const target = presets[key] || presets.statewide;
    const targetSphere = new Cesium.BoundingSphere(
      Cesium.Cartesian3.fromDegrees(target.lon, target.lat, 0),
      1
    );
    const targetPitch = use2D ? -89.5 : target.pitch;
    const targetHeading = use2D ? 0 : target.heading;
    const targetRange = use2D ? target.range * 0.95 : target.range;

    const offset = new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(targetHeading),
      Cesium.Math.toRadians(targetPitch),
      targetRange
    );
    viewer.camera.flyToBoundingSphere(targetSphere, {
      offset,
      duration: 1.2,
    });
  }, [is2DView]);

  const toggle2DView = useCallback(() => {
    const next2D = !is2DView;
    setIs2DView(next2D);
    flyToPerspective(activePerspective, next2D);
  }, [is2DView, activePerspective, flyToPerspective]);

  // Smooth Realign Camera to True North (Apple Maps compass interaction)
  const resetHeadingToNorth = useCallback(() => {
    if (!viewerRef.current || !window.Cesium) return;
    const Cesium = window.Cesium;
    const viewer = viewerRef.current;
    viewer.camera.flyTo({
      destination: viewer.camera.position,
      orientation: {
        heading: 0,
        pitch: viewer.camera.pitch,
        roll: 0,
      },
      duration: 0.8,
    });
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[380px] bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs ${className}`}>
      {/* Cesium Canvas Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 select-none" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs transition-opacity">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
          <span className="mt-3 text-xs font-semibold text-slate-700">
            {language === 'mr' ? '३D नकाशा लोड होत आहे...' : 'Initializing Cesium 3D Extruded Map...'}
          </span>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5">36 Districts • Isometric View</span>
        </div>
      )}

      {/* Top-Right: Translucent Apple Glass Toolbar (Render Mode + Layer Switcher) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 max-w-[calc(100%-110px)] overflow-x-auto no-scrollbar pointer-events-auto">
        {/* Apple Segmented Rendering Mode Switcher */}
        <div className="flex items-center p-0.5 bg-white/75 backdrop-blur-md rounded-full border border-white/60 shadow-xs ring-1 ring-slate-900/5 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setRenderMode('highlight')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              renderMode === 'highlight'
                ? 'bg-[#1D4ED8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
            title="Base terrain color with dynamic highlights on user selection and alerts"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${renderMode === 'highlight' ? 'bg-white' : 'bg-blue-600'} inline-block`} />
            <span>{language === 'mr' ? 'हायलाइट' : 'Base'}</span>
          </button>
          <button
            type="button"
            onClick={() => setRenderMode('heatmap')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              renderMode === 'heatmap'
                ? 'bg-[#1D4ED8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
            title="Full statewide 36-district choropleth extrusion"
          >
            <span>{language === 'mr' ? 'हीटमॅप' : 'Heatmap'}</span>
          </button>
        </div>

        {/* Dynamic Layer Switcher Pills */}
        <div className="flex items-center gap-1 bg-white/75 backdrop-blur-md p-1 rounded-full border border-white/60 shadow-sm ring-1 ring-slate-900/5 text-xs shrink-0">
          {[
            { key: 'cpi', en: 'Performance Index', mr: 'कामगिरी (CPI)', title: 'Communication Performance Index (CPI)' },
            { key: 'coverage', en: 'Media Coverage', mr: 'माध्यम प्रसार', title: 'Media Coverage & Release Volume' },
            { key: 'sentiment', en: 'Sentiment', mr: 'लोकभावना', title: 'Public & Social Sentiment Score' },
            { key: 'crisis', en: 'Crisis Alerts', mr: 'आपत्कालीन इशारे', title: 'Active Crisis Incidents & 90-min SLA' },
            { key: 'events', en: 'Field Events', mr: 'क्षेत्रीय कार्यक्रम', title: 'Field Engagements & Ministerial Briefings' },
          ].map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => handleLayerSwitch(l.key as CesiumMapLayer)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeLayer === l.key
                  ? 'bg-[#1D4ED8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              title={l.title}
            >
              {language === 'mr' ? l.mr : l.en}
            </button>
          ))}
        </div>
      </div>

      {/* Top-Left: Apple Maps Liquid Glass Compass & Stacked Compact Legend */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-auto">
        {/* Apple Maps Dynamic Rotating Compass */}
        <button
          type="button"
          onClick={resetHeadingToNorth}
          className="w-9 h-9 rounded-full bg-white/75 hover:bg-white/90 backdrop-blur-md border border-white/60 shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center active:scale-90 transition-all cursor-pointer group"
          title={`Heading: ${cameraHeading}°. Click to reset to True North.`}
          aria-label="Reset orientation to North"
        >
          <div
            className="w-4.5 h-4.5 relative flex items-center justify-center transition-transform duration-100"
            style={{ transform: `rotate(${-cameraHeading}deg)` }}
          >
            {/* North Red Needle */}
            <div className="absolute top-0 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[8px] border-b-rose-600" />
            {/* South Slate Needle */}
            <div className="absolute bottom-0 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[8px] border-t-slate-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800 z-10" />
          </div>
        </button>

        {/* 3D Prism Legend (Stacked neatly below compass, max-w-[190px], never colliding with top-right pills) */}
        <div className="hidden sm:flex flex-col gap-1 bg-white/75 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-white/60 shadow-sm ring-1 ring-slate-900/5 text-[10px] text-slate-700 max-w-[190px]">
          <div className="flex items-center justify-between font-semibold text-slate-800">
            <span>{language === 'mr' ? '३D स्तर' : '3D Extrusion'}</span>
            <span className="text-[9px] text-slate-500 font-mono">
              {renderMode === 'highlight' ? 'Base + Alerts' : 'Heatmap'}
            </span>
          </div>
          {renderMode === 'highlight' ? (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[9px] font-medium text-slate-600">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#CBD5E1] border border-slate-300" />
                <span>Base</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#1D4ED8]" />
                <span className="text-blue-700 font-bold">Selected</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#EF4444]" />
                <span>&lt;40</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#F97316]" />
                <span>40-50</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="flex items-center gap-0.5 font-mono text-[9px] text-slate-600"><span className="w-2 h-2 rounded-full bg-[#22C55E]" />80+</span>
              <span className="flex items-center gap-0.5 font-mono text-[9px] text-slate-600"><span className="w-2 h-2 rounded-full bg-[#84CC16]" />60+</span>
              <span className="flex items-center gap-0.5 font-mono text-[9px] text-slate-600"><span className="w-2 h-2 rounded-full bg-[#FACC15]" />40+</span>
              <span className="flex items-center gap-0.5 font-mono text-[9px] text-slate-600"><span className="w-2 h-2 rounded-full bg-[#F97316]" />20+</span>
              <span className="flex items-center gap-0.5 font-mono text-[9px] text-slate-600"><span className="w-2 h-2 rounded-full bg-[#EF4444]" />&lt;20</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Apple Liquid Glass District Inspection Popover (Triggered on LEFT_CLICK) */}
      {selectedInspection && (
        <div
          className="absolute z-30 w-72 bg-white/90 backdrop-blur-2xl rounded-2xl p-4 border border-white/80 shadow-[0_16px_40px_rgba(0,0,0,0.12)] ring-1 ring-slate-900/10 text-xs pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${selectedInspection.screenX}px`,
            top: `${selectedInspection.screenY}px`,
          }}
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200/80">
                  #{selectedInspection.rank}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">Live Reporting</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">
                {language === 'mr' ? selectedInspection.nameMr : selectedInspection.name}
              </h4>
            </div>

            {/* Circular Mini Gauge */}
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke={getScoreColorHex(selectedInspection.score)}
                  strokeWidth="3"
                  strokeDasharray={`${(selectedInspection.score / 100) * 88} 88`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono font-bold text-xs text-slate-900 tabular-nums">
                {Math.round(selectedInspection.score)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
            <div className="bg-slate-50/90 p-2 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-medium">Releases Published</span>
              <span className="font-bold text-slate-800 font-mono text-xs">{selectedInspection.pressCount}</span>
            </div>
            <div className="bg-slate-50/90 p-2 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-medium">Net Sentiment</span>
              <span className="font-bold text-emerald-700 font-mono text-xs">{selectedInspection.sentiment}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInspectViewDetails}
              className="flex-1 py-2 px-3 bg-[#1D4ED8] hover:bg-blue-800 text-white font-semibold rounded-xl text-center transition-all cursor-pointer text-xs shadow-xs"
            >
              {language === 'mr' ? 'तपशील पहा →' : 'View District Details →'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedInspection(null)}
              className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors cursor-pointer text-xs shrink-0"
              aria-label="Close inspection popup"
            >
              <XMarkIcon className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Apple Dock: Regional Division Presets (Bottom Center) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 max-w-[96%] flex items-center justify-center pointer-events-auto">
        <div className="flex items-center gap-1 bg-white/75 backdrop-blur-md p-1 rounded-full border border-white/60 shadow-md ring-1 ring-slate-900/5 text-xs overflow-x-auto no-scrollbar">
          {[
            { key: 'statewide', label: 'All 36' },
            { key: 'konkan', label: 'Konkan' },
            { key: 'pune', label: 'Pune' },
            { key: 'nashik', label: 'Nashik' },
            { key: 'marathwada', label: 'Marathwada' },
            { key: 'vidarbha', label: 'Vidarbha' },
          ].map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => flyToPerspective(preset.key)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activePerspective === preset.key
                  ? 'bg-[#1D4ED8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {preset.label}
            </button>
          ))}

          {/* Divider */}
          <div className="h-4 w-px bg-slate-300/60 mx-0.5 shrink-0" />

          {/* 2D View Checkbox Button */}
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
      </div>

      <style jsx global>{`
        .cesium-widget-credits,
        .cesium-credit-logoContainer,
        .cesium-credit-textContainer {
          opacity: 0.25 !important;
          font-size: 8px !important;
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
};

export default Cesium3DMap;
