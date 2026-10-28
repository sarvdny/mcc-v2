'use client';

/**
 * Client-side loader for CesiumJS from local public/cesium assets.
 * Ensures zero Webpack bundling issues and 100% native WebGL execution.
 */

declare global {
  interface Window {
    Cesium?: any;
    CESIUM_BASE_URL?: string;
  }
}

let cesiumLoadingPromise: Promise<any> | null = null;

export function loadCesium(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Cesium can only be loaded in the browser.'));
  }

  if (window.Cesium) {
    return Promise.resolve(window.Cesium);
  }

  if (cesiumLoadingPromise) {
    return cesiumLoadingPromise;
  }

  cesiumLoadingPromise = new Promise((resolve, reject) => {
    // 1. Set Cesium base URL
    window.CESIUM_BASE_URL = '/cesium';

    // 2. Ensure Cesium CSS is injected
    const cssId = 'cesium-widgets-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = '/cesium/Widgets/widgets.css';
      document.head.appendChild(link);
    }

    // 3. Inject Cesium.js script
    const scriptId = 'cesium-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = '/cesium/Cesium.js';
      script.async = true;

      script.onload = () => {
        if (window.Cesium) {
          resolve(window.Cesium);
        } else {
          reject(new Error('Cesium script loaded but window.Cesium is undefined.'));
        }
      };

      script.onerror = (err) => {
        cesiumLoadingPromise = null;
        reject(new Error('Failed to load CesiumJS from /cesium/Cesium.js: ' + err));
      };

      document.body.appendChild(script);
    } else {
      // Script already attached, wait for load
      const checkInterval = setInterval(() => {
        if (window.Cesium) {
          clearInterval(checkInterval);
          resolve(window.Cesium);
        }
      }, 50);

      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.Cesium) {
          reject(new Error('Timed out waiting for CesiumJS to initialize.'));
        }
      }, 10000);
    }
  });

  return cesiumLoadingPromise;
}
