"use client";

import React, { useState } from "react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useTranslation } from "@/lib/translations";
import { MinimalCardHeader } from "@/components/shared/MinimalCardHeader";

interface TwitterPost {
  id: string;
  handle: string;
  timestampEn: string;
  timestampMr: string;
  textEn: string;
  textMr: string;
  statsEn: string;
  statsMr: string;
  badgeEn: string;
  badgeMr: string;
}

interface MultiPlatformPost {
  id: string;
  platform: "facebook" | "instagram" | "youtube" | "linkedin";
  handle: string;
  timestampEn: string;
  timestampMr: string;
  textEn: string;
  textMr: string;
  statsEn: string;
  statsMr: string;
  badgeEn: string;
  badgeMr: string;
}

const TWITTER_STREAM: TwitterPost[] = [
  {
    id: "tw-1",
    handle: "@MahaDGIPR",
    timestampEn: "12m ago",
    timestampMr: "१२ मि पूर्वी",
    textEn:
      "Crucial State Disaster Management Authority review meeting concluded under the chairmanship of Hon. Chief Minister.",
    textMr:
      "माननीय मुख्यमंत्र्यांच्या अध्यक्षतेखाली राज्य आपत्ती निवारण प्राधिकरणाची महत्त्वपूर्ण आढावा बैठक संपली.",
    statsEn: "1.4K Reposts • 6.2K",
    statsMr: "१.४ हजार पुनपोस्ट • ६.२ हजार",
    badgeEn: "Verified Likes",
    badgeMr: "प्रमाणित पसंती",
  },
  {
    id: "tw-2",
    handle: "@CMOMaharashtra",
    timestampEn: "35m ago",
    timestampMr: "३५ मि पूर्वी",
    textEn:
      "Direct bank transfer of micro-irrigation subsidies to farmers initiated across all 36 districts of Maharashtra.",
    textMr:
      "शेतकऱ्यांना सूक्ष्म सिंचन अनुदानाचे थेट बँक खात्यात वितरण सुरू. ३६ जिल्ह्यांतील लाखो शेतकऱ्यांना लाभ.",
    statsEn: "890 Reposts • 4.1K",
    statsMr: "८९० पुनपोस्ट • ४.१ हजार",
    badgeEn: "Verified Likes",
    badgeMr: "प्रमाणित पसंती",
  },
  {
    id: "tw-3",
    handle: "@MahaCyber1",
    timestampEn: "1h ago",
    timestampMr: "१ तास पूर्वी",
    textEn:
      "Do not believe unverified rumors. Rely on official announcements from @MahaDGIPR. State Cyber Cell public advisory.",
    textMr:
      "अफवांवर विश्वास ठेवू नका. अधिकृत माहितीसाठी @MahaDGIPR चे अपडेट्स पहा. सायबर सेलचे आवाहन.",
    statsEn: "520 Reposts • 2.8K",
    statsMr: "५२० पुनपोस्ट • २.८ हजार",
    badgeEn: "Verified Likes",
    badgeMr: "प्रमाणित पसंती",
  },
];

const MULTI_PLATFORM_STREAM: MultiPlatformPost[] = [
  {
    id: "mp-1",
    platform: "facebook",
    handle: "DGIPR Maharashtra (FB)",
    timestampEn: "18m ago",
    timestampMr: "१८ मि पूर्वी",
    textEn:
      "Live Briefing: Comprehensive update on Public Health Department welfare schemes and Patient Care Council restructuring.",
    textMr:
      "थेट वार्तालाप: आरोग्य विभागाच्या नव्या योजनांची माहिती व रुग्ण कल्याण समिती पुनर्रचना निर्णय.",
    statsEn: "12K Views • 1.1K Comments •",
    statsMr: "१२ हजार दृश्ये • १.१ हजार टिप्पण्या •",
    badgeEn: "Official Relay",
    badgeMr: "अधिकृत प्रसारण",
  },
  {
    id: "mp-2",
    platform: "instagram",
    handle: "@maharashtragovt (Insta)",
    timestampEn: "42m ago",
    timestampMr: "४२ मि पूर्वी",
    textEn:
      "Reel: Mumbai Coastal Road new corridor inaugurated. Travel time slashed drastically from 70 mins to 25 mins.",
    textMr:
      "रील: मुंबई कोस्टल रोड प्रवासाचा नवीन टप्पा खुला. प्रवाशांचा वेळ वाचला ७० मिनिटांवरून २५ मिनिटांवर.",
    statsEn: "84.2K Plays • 9.4K Likes •",
    statsMr: "८४.२ हजार प्ले • ९.४ हजार लाईक्स •",
    badgeEn: "Official Relay",
    badgeMr: "अधिकृत प्रसारण",
  },
  {
    id: "mp-3",
    platform: "youtube",
    handle: "Maha Govt Official (YouTube)",
    timestampEn: "1h ago",
    timestampMr: "१ तास पूर्वी",
    textEn:
      "Full Press Conference: Live broadcast from Sahyadri Guest House, Mumbai detailing government cabinet decisions.",
    textMr:
      "पूर्ण पत्रकार परिषद: सह्याद्री अतिथीगृह, मुंबई येथून थेट प्रक्षेपण व शासकीय निर्णय स्पष्टीकरण.",
    statsEn: "35K Watched • 98% Upvote •",
    statsMr: "३५ हजार पाहिले • ९८% पसंती •",
    badgeEn: "Official Relay",
    badgeMr: "अधिकृत प्रसारण",
  },
];

export interface SocialMediaAnalysisProps {
  layout?: "default" | "column";
}

export const SocialMediaAnalysis: React.FC<SocialMediaAnalysisProps> = ({
  layout = "default",
}) => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState<"all" | "x" | "meta">("all");

  const showXStream = activeTab === "all" || activeTab === "x";
  const showMetaStream = activeTab === "all" || activeTab === "meta";
  const isSingleStream =
    (activeTab === "x" && !showMetaStream) ||
    (activeTab === "meta" && !showXStream);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 flex flex-col h-auto overflow-hidden hover:shadow-sm transition-all duration-150">
      {/* Header matching Reference */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
        <MinimalCardHeader
          title={language === "mr" ? "समाज माध्यम विश्लेषण" : "Social Media Analysis"}
          subtitle={
            language === "mr"
              ? "ट्विटर/एक्स व बहु-प्लॅटफॉर्म वाहिन्यांचा विभागलेला थेट प्रवाह"
              : "Split streams for Twitter/X vs. Multi-Platform Channels"
          }
          action={
            <div className="flex items-center gap-2.5">
              {/* Stream Filter Pills */}
              <div
                role="tablist"
                aria-label="Filter social media channels"
                className="inline-flex rounded-xl bg-slate-100/90 p-0.5 text-xs font-medium border border-slate-200/80 shadow-xs"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "all"}
                  onClick={() => setActiveTab("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                    activeTab === "all"
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  {language === "mr" ? "सर्व" : "All"}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "x"}
                  onClick={() => setActiveTab("x")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                    activeTab === "x"
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  X
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "meta"}
                  onClick={() => setActiveTab("meta")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                    activeTab === "meta"
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  Meta/DD
                </button>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 inline-block"></span>
                <span>{language === "mr" ? "थेट समक्रमण" : "Live Sync"}</span>
              </div>
            </div>
          }
          className="w-full"
        />
      </div>

      {/* Internal Horizontal Stream Split Layout */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <div
          className={`grid gap-3.5 items-start ${
            isSingleStream ? "grid-cols-1" : "grid-cols-1 2xl:grid-cols-2"
          }`}
        >
          {/* Stream 1: Twitter / X Stream */}
          {showXStream && (
            <div className="border border-slate-200/90 rounded-xl p-3 bg-white flex flex-col min-w-0 shadow-2xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 min-w-0 truncate">
                  <span className="w-2 h-2 rounded-full bg-black shrink-0"></span>
                  <span className="truncate">
                    {language === "mr"
                      ? "ट्विटर / एक्स प्रवाह"
                      : "Twitter / X Stream"}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-slate-400 font-medium whitespace-nowrap uppercase tracking-wider shrink-0 ml-1">
                  {language === "mr" ? "थेट एपीआय" : "Live API"}
                </span>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-[240px] pr-1.5">
                {TWITTER_STREAM.map((post) => (
                  <div
                    key={post.id}
                    className="p-2.5 bg-white rounded-lg border border-slate-200/80 shadow-2xs text-xs space-y-1.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] gap-2">
                      <span className="font-bold text-slate-900 truncate">
                        {post.handle}
                      </span>
                      <span className="font-mono text-slate-400 text-[10px] shrink-0">
                        {language === "mr"
                          ? post.timestampMr
                          : post.timestampEn}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                      {language === "mr" ? post.textMr : post.textEn}
                    </p>
                    <div className="text-[10px] font-mono text-slate-500 pt-0.5 flex items-center gap-1 flex-wrap">
                      <span>
                        {language === "mr" ? post.statsMr : post.statsEn}
                      </span>
                      <span className="text-emerald-700 font-bold">
                        {language === "mr" ? post.badgeMr : post.badgeEn}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stream 2: FB / Insta / YouTube / LinkedIn */}
          {showMetaStream && (
            <div className="border border-slate-200/90 rounded-xl p-3 bg-white flex flex-col min-w-0 shadow-2xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 min-w-0 truncate">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                  <span className="truncate">
                    FB / Insta / YouTube / LinkedIn
                  </span>
                </span>
                <span className="font-mono text-[10px] text-slate-400 font-medium whitespace-nowrap uppercase tracking-wider shrink-0 ml-1">
                  {language === "mr" ? "एकत्रित" : "Unified"}
                </span>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-[240px] pr-1.5">
                {MULTI_PLATFORM_STREAM.map((post) => (
                  <div
                    key={post.id}
                    className="p-2.5 bg-white rounded-lg border border-slate-200/80 shadow-2xs text-xs space-y-1.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] gap-2">
                      <span className="font-bold text-slate-900 truncate">
                        {post.handle}
                      </span>
                      <span className="font-mono text-slate-400 text-[10px] shrink-0">
                        {language === "mr"
                          ? post.timestampMr
                          : post.timestampEn}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                      {language === "mr" ? post.textMr : post.textEn}
                    </p>
                    <div className="text-[10px] font-mono text-slate-500 pt-0.5 flex items-center gap-1 flex-wrap">
                      <span>
                        {language === "mr" ? post.statsMr : post.statsEn}
                      </span>
                      <span className="text-emerald-700 font-bold">
                        {language === "mr" ? post.badgeMr : post.badgeEn}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Metrics */}
        <div className="mt-1 pt-3 border-t border-slate-100 flex flex-col gap-1">
          <p className="text-[11px] text-slate-500 font-medium">
            {language === "mr"
              ? "सोशल मीडिया संनियंत्रण कक्ष: २४x७ थेट विश्लेषण"
              : "Social Media Listening Wing: 24x7 Real-Time Stream Monitoring"}
          </p>
          <p className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
            {language === "mr"
              ? "एकूण पोहोच: ३.३ दशलक्ष नागरिक संवाद आज"
              : "Total Reach: 3.3M Citizen Impressions Today"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAnalysis;
