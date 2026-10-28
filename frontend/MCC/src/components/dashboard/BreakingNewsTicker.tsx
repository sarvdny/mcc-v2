'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { INITIAL_QUEUE_ITEMS } from '@/data/newsQueueData';
import { getDistrictName } from '@/lib/dataLocalization';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ClockIcon,
} from '@heroicons/react/20/solid';

export const BreakingNewsTicker: React.FC = () => {
  const { language, selectedDistrictId } = useDashboardStore();
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isPaused = isUserPaused || isHovered;
  const [selectedArticle, setSelectedArticle] = useState<typeof INITIAL_QUEUE_ITEMS[0] | null>(null);

  // Filter items by district if selected, sorted with latest items first
  const rawItems = useMemo(() => {
    let list = INITIAL_QUEUE_ITEMS;
    if (selectedDistrictId && selectedDistrictId !== 'all') {
      const filtered = list.filter(
        (item) => item.district.toLowerCase() === selectedDistrictId.toLowerCase()
      );
      if (filtered.length > 0) list = filtered;
    }
    // Return latest first
    return [...list];
  }, [selectedDistrictId]);

  // Double items for continuous smooth 360 loop without jitter
  const marqueeItems = useMemo(() => {
    return [...rawItems, ...rawItems];
  }, [rawItems]);

  const handleManualScroll = useCallback((direction: 'left' | 'right') => {
    const el = document.getElementById('continuous-news-ticker-container');
    if (el) {
      el.scrollBy({ left: direction === 'right' ? 300 : -300, behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <div
        className="w-full h-10 bg-red-600 text-white rounded-xl px-4 py-1.5 flex items-center justify-between gap-3 shadow-xs border border-red-700 overflow-hidden select-none relative"
        role="region"
        aria-label={language === 'mr' ? 'थेट वृत्त टिकर' : 'Live Wire Ticker'}
      >
        {/* 1. Left: White Pill Badge with Pulsing Red Dot & LIVE Indicator */}
        <div className="shrink-0 z-20 flex items-center gap-2 bg-white text-red-600 font-bold text-xs px-3 py-1 rounded-md shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0 ring-2 ring-red-200" />
          <span className="font-black">{language === 'mr' ? 'थेट घडामोड' : 'BREAKING NEWS'}</span>
        </div>

        {/* 2. Center: Continuous Infinite Marquee Scroll with Semantic Inline Pills */}
        <div
          id="continuous-news-ticker-container"
          className="flex-1 min-w-0 overflow-hidden relative h-full flex items-center [mask-image:linear-gradient(to_right,transparent_0%,black_3%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_3%,black_92%,transparent_100%)]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`animate-marquee-scroll items-center gap-6 text-xs font-medium cursor-pointer ${
              isPaused ? '[animation-play-state:paused] animate-ticker-paused' : ''
            }`}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {marqueeItems.map((item, idx) => {
              const localizedDistrict = getDistrictName(item.district, language);
              const headline = language === 'mr' ? item.newsMr : item.newsEn;
              const isBreaking = item.sentiment === 'Critical' || item.scoreLevel === 'Critical';
              const isAlert = item.sentiment === 'Negative' || item.scoreLevel === 'High' || item.scoreLevel === 'Moderate';

              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => setSelectedArticle(item)}
                  className="inline-flex items-center gap-2 shrink-0 group hover:bg-red-700/80 px-2 py-0.5 rounded transition-all duration-150"
                  title={language === 'mr' ? 'तपशील पाहण्यासाठी क्लिक करा' : 'Click to inspect detailed dispatch'}
                >
                  {/* Semantic Inline Pill: [BREAKING • RED], [ALERT • AMBER], or [NOTICE • BLUE] */}
                  {isBreaking ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-amber-300 text-slate-900 border border-amber-400 shrink-0">
                      {language === 'mr' ? 'थेट • तातडीचे' : 'BREAKING • RED'}
                    </span>
                  ) : isAlert ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-amber-500/30 text-amber-100 border border-amber-400/50 shrink-0">
                      {language === 'mr' ? 'इशारा • सतर्क' : 'ALERT • AMBER'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-red-900/90 text-red-100 border border-red-500/60 shrink-0">
                      {language === 'mr' ? 'सूचना • अधिकृत' : 'NOTICE • BLUE'}
                    </span>
                  )}

                  {/* District / Source Pill */}
                  <span className="font-semibold text-xs bg-red-900/90 text-red-100 px-1.5 py-0.5 rounded font-mono shrink-0 border border-red-400/40">
                    {localizedDistrict} • {item.sourceShort || item.source}
                  </span>

                  {/* Timestamp */}
                  <span className="text-xs text-white/95 shrink-0 font-mono font-medium">
                    {item.timestamp || '2m ago'}
                  </span>

                  {/* Headline */}
                  <span className="text-white text-xs font-semibold group-hover:underline underline-offset-2 tracking-tight line-clamp-1 max-w-[340px] md:max-w-[480px]">
                    {headline}
                  </span>

                  {/* Arrow Icon */}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3 text-white/80 group-hover:text-white shrink-0 transition-colors" />

                  {/* Separator Bullet */}
                  <span className="text-red-200 font-bold ml-2 text-xs select-none">◆</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Right: Interactive Play/Pause & Scroll Navigation Controls */}
        <div className="shrink-0 z-20 flex items-center gap-1.5 text-white/95 text-xs bg-red-700/80 px-2 py-1 rounded-lg border border-red-500/80 shadow-xs">
          <button
            type="button"
            onClick={() => setIsUserPaused((prev) => !prev)}
            className="p-1 rounded hover:bg-red-800 hover:text-white text-white focus-visible:outline-none transition-colors cursor-pointer"
            title={
              isUserPaused
                ? language === 'mr' ? 'सुरू करा' : 'Resume Scrolling'
                : language === 'mr' ? 'थांबवा' : 'Pause Scrolling'
            }
            aria-label={isUserPaused ? 'Resume Ticker' : 'Pause Ticker'}
          >
            {isUserPaused ? <PlayIcon className="w-3.5 h-3.5" /> : <PauseIcon className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center border border-red-500/80 rounded overflow-hidden bg-red-800/80">
            <button
              type="button"
              onClick={() => handleManualScroll('left')}
              className="p-1 hover:bg-red-900 text-white border-r border-red-500/80 transition-colors cursor-pointer"
              title={language === 'mr' ? 'मागे सरकवा' : 'Scroll Left'}
              aria-label="Previous Headline"
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleManualScroll('right')}
              className="p-1 hover:bg-red-900 text-white transition-colors cursor-pointer"
              title={language === 'mr' ? 'पुढे सरकवा' : 'Scroll Right'}
              aria-label="Next Headline"
            >
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Full Article Inspection Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-lg w-full border border-slate-200/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]">
            {/* Modal Header */}
            <div className="bg-red-600 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <h4 className="font-bold text-sm tracking-tight">
                  {language === 'mr' ? 'थेट शासकीय वार्तापत्र तपशील' : 'DGIPR Live Wire Dispatch'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-4 text-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 flex-wrap gap-2">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">
                  ID: {selectedArticle.id}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                  {selectedArticle.timestamp || 'Just now'} • {selectedArticle.district}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedArticle.verification || 'Verified Official'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {language === 'mr' ? selectedArticle.newsMr : selectedArticle.newsEn}
                </h3>
                {language === 'mr' && (
                  <p className="text-xs text-slate-600 mt-2 font-sans italic border-l-2 border-red-500 pl-3">
                    {selectedArticle.newsEn}
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">
                    {language === 'mr' ? 'माहिती स्त्रोत:' : 'Ingestion Source:'}
                  </span>
                  <span className="font-bold text-slate-900">{selectedArticle.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">
                    {language === 'mr' ? 'जनभावना श्रेणी:' : 'Sentiment Assessment:'}
                  </span>
                  <span className="font-bold text-slate-800">{selectedArticle.sentiment}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href={selectedArticle.url || 'https://dgipR.maharashtra.gov.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-xs hover:shadow-sm active:scale-[0.98] transition-all duration-100 ease-out"
                >
                  <span>{language === 'mr' ? 'अधिकृत पोर्टलवर पहा' : 'View on Official Portal'}</span>
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl shadow-xs hover:shadow-sm active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer"
                >
                  {language === 'mr' ? 'बंद करा' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
