'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { DocumentTextIcon, NewspaperIcon, ArrowDownTrayIcon, PlayIcon } from '@heroicons/react/20/solid';

interface PressReleaseItem {
  id: string;
  titleEn: string;
  titleMr: string;
  departmentEn: string;
  departmentMr: string;
  timeEn: string;
  timeMr: string;
  downloads: number;
  status: 'Published' | 'Under Review';
}

interface MediaClippingItem {
  id: string;
  source: string;
  headlineEn: string;
  headlineMr: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  type: 'print' | 'tv' | 'digital';
  timeEn: string;
  timeMr: string;
  thumbnailUrl?: string;
  videoAirtime?: string;
}

const PRESS_RELEASES: PressReleaseItem[] = [
  {
    id: 'pr-1',
    titleEn: 'Cabinet approves ₹4,200 Cr relief package for drought-affected farmers across Marathwada',
    titleMr: 'मराठवाड्यातील दुष्काळग्रस्त शेतकऱ्यांसाठी ₹४,२०० कोटींच्या मदत पॅकेजला मंत्रिमंडळाची मंजुरी',
    departmentEn: 'Agriculture & Disaster Relief',
    departmentMr: 'कृषी व मदत पुनर्वसन',
    timeEn: '25m ago',
    timeMr: '२५ मि पूर्वी',
    downloads: 1420,
    status: 'Published',
  },
  {
    id: 'pr-2',
    titleEn: 'CMO announces 100% solar energization of agricultural feeders by December 2026',
    titleMr: 'डिसेंबर २०२६ पर्यंत सर्व कृषी वाहिन्यांचे १००% सौर ऊर्जामध्ये रूपांतर: मुख्यमंत्री कार्यालय',
    departmentEn: 'Energy & Infrastructure',
    departmentMr: 'ऊर्जा व पायाभूत सुविधा',
    timeEn: '1h ago',
    timeMr: '१ तास पूर्वी',
    downloads: 890,
    status: 'Published',
  },
  {
    id: 'pr-3',
    titleEn: 'Direct Benefit Transfer under Mukhyamantri Majhi Ladki Bahin Yojana Phase 3 initiated',
    titleMr: 'मुख्यमंत्री माझी लाडकी बहीण योजना टप्पा ३ थेट बँक खात्यात वितरण सुरू',
    departmentEn: 'Women & Child Development',
    departmentMr: 'महिला व बालविकास',
    timeEn: '2h ago',
    timeMr: '२ तास पूर्वी',
    downloads: 2450,
    status: 'Published',
  },
  {
    id: 'pr-4',
    titleEn: 'State Environmental Council releases coastal mangrove restoration guideline 2026',
    titleMr: 'राज्य पर्यावरण परिषदेकडून किनारपट्टी खारफुटी संवर्धन मार्गदर्शक सूचना २०२६ जारी',
    departmentEn: 'Environment & Climate Change',
    departmentMr: 'पर्यावरण व हवामान बदल',
    timeEn: '3h ago',
    timeMr: '३ तास पूर्वी',
    downloads: 520,
    status: 'Under Review',
  },
];

const MEDIA_CLIPPINGS: MediaClippingItem[] = [
  {
    id: 'clip-1',
    source: 'Loksatta (लोकसत्ता)',
    headlineEn: 'Maharashtra achieves record industrial FDI inflows in Q3 FY2026',
    headlineMr: 'महाराष्ट्रात उद्योग क्षेत्रात थेट परकीय गुंतवणुकीचा नवा उच्चांक',
    sentiment: 'positive',
    type: 'print',
    timeEn: '15m ago',
    timeMr: '१५ मि पूर्वी',
  },
  {
    id: 'clip-2',
    source: 'ABP Majha (एबीपी माझा)',
    headlineEn: 'Prime Time Relay: Review of Samruddhi Expressway feeder networks and highway safety',
    headlineMr: 'प्राइम टाइम: समृद्धी महामार्ग जोड रस्ते व सुरक्षेचा विशेष आढावा',
    sentiment: 'positive',
    type: 'tv',
    timeEn: '32m ago',
    timeMr: '३२ मि पूर्वी',
    videoAirtime: '04:12 mins',
  },
  {
    id: 'clip-3',
    source: 'Sakal (सकाळ)',
    headlineEn: 'Pune Metro Line 3 reaches 92% completion ahead of operational deadline',
    headlineMr: 'पुणे मेट्रो मार्गिका ३ चे काम ९२% पूर्ण; लवकरच प्रवाशांच्या सेवेत',
    sentiment: 'positive',
    type: 'print',
    timeEn: '1h ago',
    timeMr: '१ तास पूर्वी',
  },
  {
    id: 'clip-4',
    source: 'TV9 Marathi (टीव्ही९ मराठी)',
    headlineEn: 'Live Fact-Check: Verification of ground-water reservoir levels in Solapur district',
    headlineMr: 'थेट पडताळणी: सोलापूर जिल्ह्यातील जलसाठ्याची सत्यता तपासणी',
    sentiment: 'neutral',
    type: 'tv',
    timeEn: '1.5h ago',
    timeMr: '१.५ तास पूर्वी',
    videoAirtime: '02:45 mins',
  },
];

export const DualFeedMediaStack: React.FC = () => {
  const { language } = useDashboardStore();
  const [activeTab, setActiveTab] = useState<'releases' | 'clippings'>('releases');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-full overflow-hidden hover:shadow-sm transition-all duration-150">
      {/* Header with Segmented Tab Selector */}
      <div className="p-3 sm:p-3.5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <h3 className="font-bold text-slate-900 text-sm">
            {language === 'mr' ? 'थेट प्रसिद्धी व माध्यम प्रवाह' : 'Live Media Feed Stack'}
          </h3>
        </div>

        {/* Tab Pills */}
        <div
          role="tablist"
          aria-label="Media Feed View"
          className="inline-flex rounded-xl bg-slate-100/90 p-0.5 text-xs font-medium border border-slate-200/80 shadow-2xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'releases'}
            onClick={() => setActiveTab('releases')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer ${
              activeTab === 'releases'
                ? 'bg-white text-[#1D4ED8] shadow-2xs border border-blue-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'mr' ? 'प्रेस नोट' : 'Press Releases'}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'clippings'}
            onClick={() => setActiveTab('clippings')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer ${
              activeTab === 'clippings'
                ? 'bg-white text-[#1D4ED8] shadow-2xs border border-blue-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'mr' ? 'बातम्या' : 'Media Clippings'}
          </button>
        </div>
      </div>

      {/* Feed List Container with Internal Scroll Isolation */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto min-h-0">
        {activeTab === 'releases' ? (
          PRESS_RELEASES.map((pr) => (
            <div
              key={pr.id}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px] gap-2">
                <span className="font-semibold text-blue-700 truncate">
                  {language === 'mr' ? pr.departmentMr : pr.departmentEn}
                </span>
                <span className="text-slate-400 font-mono shrink-0">
                  {language === 'mr' ? pr.timeMr : pr.timeEn}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                {language === 'mr' ? pr.titleMr : pr.titleEn}
              </h4>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold text-[10px] ${
                  pr.status === 'Published'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {pr.status}
                </span>

                <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                  <ArrowDownTrayIcon className="w-3 h-3 text-slate-400" />
                  <span>{pr.downloads.toLocaleString()} DLs</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          MEDIA_CLIPPINGS.map((clip) => (
            <div
              key={clip.id}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px] gap-2">
                <span className="font-bold text-slate-800 flex items-center gap-1 truncate">
                  {clip.type === 'tv' ? (
                    <PlayIcon className="w-3 h-3 text-rose-500 shrink-0" />
                  ) : (
                    <NewspaperIcon className="w-3 h-3 text-slate-600 shrink-0" />
                  )}
                  <span className="truncate">{clip.source}</span>
                </span>
                <span className="text-slate-400 font-mono shrink-0">
                  {language === 'mr' ? clip.timeMr : clip.timeEn}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                {language === 'mr' ? clip.headlineMr : clip.headlineEn}
              </h4>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold text-[10px] ${
                  clip.sentiment === 'positive'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : clip.sentiment === 'neutral'
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {clip.sentiment === 'positive' ? '● Positive Coverage' : '● Neutral Report'}
                </span>

                {clip.videoAirtime && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    Airtime: {clip.videoAirtime}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Summary Pill */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
        <span className="font-medium">
          {language === 'mr' ? '२४ तास माध्यम प्रवाह • सक्रिय' : '24h Stream • Active Monitoring'}
        </span>
        <span className="font-mono text-slate-700 font-semibold">18 Dailies • 6 TV Channels</span>
      </div>
    </div>
  );
};

export default DualFeedMediaStack;
