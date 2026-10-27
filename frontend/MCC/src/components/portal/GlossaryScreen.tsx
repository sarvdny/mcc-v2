'use client';

import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { METRIC_DEFINITIONS } from '@/data/metricDefinitions';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export const GlossaryScreen: React.FC = () => {
  const { language } = useDashboardStore();
  const lang = language === 'mr' ? 'mr' : 'en';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allDefinitions = useMemo(() => Object.values(METRIC_DEFINITIONS), []);

  const categories = useMemo(() => {
    const map = new Map<string, { en: string; mr: string }>();
    allDefinitions.forEach((d) => {
      if (!map.has(d.category)) {
        map.set(d.category, d.categoryLabel);
      }
    });
    return Array.from(map.entries());
  }, [allDefinitions]);

  const filtered = useMemo(() => {
    return allDefinitions.filter((def) => {
      if (selectedCategory !== 'all' && def.category !== selectedCategory) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        def.name.en.toLowerCase().includes(q) ||
        def.name.mr.includes(q) ||
        def.shortDescription.en.toLowerCase().includes(q) ||
        def.shortDescription.mr.includes(q) ||
        def.formula.en.toLowerCase().includes(q) ||
        def.source.en.toLowerCase().includes(q)
      );
    });
  }, [allDefinitions, selectedCategory, search]);

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] w-full mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>{lang === 'mr' ? 'अधिकृत संस्थात्मक मानके' : 'Official Institutional Standards'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gov-primary flex items-center gap-2">
            <MaterialIcon name="menu_book" size="md" className="text-gov-primary" />
            <span>
              {lang === 'mr'
                ? 'शासकीय संज्ञा, आकडेवारी व मोजमाप शब्दकोश'
                : 'Metrics, Figures & Terminology Glossary'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            {lang === 'mr'
              ? 'महा-कमांड सेंटर डॅशबोर्डवरील सर्व आकडे, निर्देशांक, सीपीआय गुण, संकट निवारण आणि प्रशासकीय संज्ञांचे अचूक गणितीय सूत्र, व्याख्या व डेटा स्रोत.'
              : 'Authoritative mathematical formulas, data provenance, input weights, and contextual definitions for all figures across the Maha-Command Center.'}
          </p>
        </div>

        {/* Quick Search */}
        <div className="w-full md:w-80">
          <div className="relative">
            <MaterialIcon name="search" size="sm" className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'mr' ? 'संज्ञा किंवा सूत्र शोधा...' : 'Search term or formula...'}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <MaterialIcon name="cancel" size="xs" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gov-primary text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {lang === 'mr' ? 'सर्व संज्ञा' : 'All Standards'} ({allDefinitions.length})
        </button>
        {categories.map(([catKey, catLabel]) => {
          const count = allDefinitions.filter((d) => d.category === catKey).length;
          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === catKey
                  ? 'bg-gov-primary text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {catLabel[lang]} ({count})
            </button>
          );
        })}
      </div>

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.key}
            id={item.key}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all p-5 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">{item.name[lang]}</h2>
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {item.categoryLabel[lang]}
                  </span>
                </div>
                {item.isSampleData && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    {lang === 'mr' ? 'नमुना डेटा' : 'Sample data'}
                  </span>
                )}
              </div>

              {/* Meaning */}
              <p className="text-xs text-slate-600 leading-relaxed">{item.detailedMeaning[lang]}</p>

              {/* Calculation Formula Block */}
              <div className="bg-slate-900 text-amber-300 rounded-xl p-3.5 font-mono text-xs border border-slate-800 space-y-1">
                <div className="font-sans text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {lang === 'mr' ? 'गणितीय सूत्र / कार्यपद्धती' : 'Calculation Formula'}
                </div>
                <div className="font-medium break-words leading-normal">{item.formula[lang]}</div>
              </div>

              {/* Inputs */}
              {item.inputs && item.inputs[lang]?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    {lang === 'mr' ? 'मूल्यांकन घटक (Inputs)' : 'Evaluated Inputs'}
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-xs">
                    {item.inputs[lang].map((inp, idx) => (
                      <li key={idx}>{inp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Example */}
              {item.example && item.example[lang] && (
                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 text-xs text-blue-950">
                  <strong className="font-bold">{lang === 'mr' ? 'प्रात्यक्षिक उदाहरण: ' : 'Practical Example: '}</strong>
                  <span>{item.example[lang]}</span>
                </div>
              )}
            </div>

            {/* Footer Metadata */}
            <div className="pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div>
                <span className="font-bold text-slate-700">{lang === 'mr' ? 'स्रोत: ' : 'Data Source: '}</span>
                <span>{item.source[lang]}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-700">{lang === 'mr' ? 'कालावधी: ' : 'Window: '}</span>
                <span>{item.timeWindow[lang]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
