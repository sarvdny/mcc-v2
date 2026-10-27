'use client';

import React from 'react';
import { GovEmblem } from '@/components/shared/GovEmblem';

export interface FullScreenAuthLoaderProps {
  message?: string;
  subMessage?: string;
  className?: string;
}

export const FullScreenAuthLoader: React.FC<FullScreenAuthLoaderProps> = ({
  message = 'Loading...',
  subMessage,
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`fixed inset-0 z-[9999] flex flex-col justify-between items-center bg-white select-none text-slate-900 ${className}`}
    >
      <span className="sr-only">Verifying government credentials...</span>

      {/* Top optical balancing spacer */}
      <div className="flex-1 w-full" />

      {/* Center institutional block */}
      <div className="flex flex-col items-center text-center px-6 max-w-lg w-full">
        {/* Large scaled government emblem */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <GovEmblem size="xl" showText={false} className="scale-125 sm:scale-150 transform-gpu" />
        </div>

        {/* Institutional Titles */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-6 sm:mt-8">
          Maha-Command Center
        </h1>
        <p className="text-base sm:text-lg text-amber-600 font-marathi font-semibold mt-1">
          महा-कमांड सेंटर
        </p>
        <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide pt-0.5">
          Directorate General of Information & Public Relations (DGIPR)
        </p>

        {/* Rotating Spinner & Real-Time Status */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-8 border-slate-200 border-t-amber-600 animate-spin" />
          <p className="text-xs text-slate-500 font-bold mt-4 tracking-wide">{message}</p>
          {subMessage && (
            <p className="text-[11px] text-slate-400 mt-1">{subMessage}</p>
          )}
        </div>
      </div>

      {/* Institutional Attribution Footer */}
      <div className="flex-1 w-full flex flex-col justify-end pb-6 px-6">
        <div className="w-full max-w-xl mx-auto pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>महाराष्ट्र शासन • Government of Maharashtra</span>
          <span>NIC • DGIPR Secure Gateway</span>
        </div>
      </div>
    </div>
  );
};

export default FullScreenAuthLoader;
