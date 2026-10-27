'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { METRIC_DEFINITIONS, MetricDefinition } from '@/data/metricDefinitions';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export interface GlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermKey?: string;
}

export const GlossaryDrawer: React.FC<GlossaryDrawerProps> = ({
  isOpen,
  onClose,
  initialTermKey,
}) => {
  const { language } = useDashboardStore();
  const lang = language === 'mr' ? 'mr' : 'en';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<string | null>(initialTermKey || null);

  useEffect(() => {
    if (initialTermKey) {
      setSelectedTerm(initialTermKey);
    }
  }, [initialTermKey]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
        def.formula.en.toLowerCase().includes(q)
      );
    });
  }, [allDefinitions, selectedCategory, search]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'mr' ? 'शासकीय संज्ञा व मोजमाप शब्दकोश' : 'Government Metrics & Terminology Glossary'}
      className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl backdrop-blur-xl bg-white/95 h-full shadow-2xl flex flex-col z-10 border-l border-slate-200/80 animate-in slide-in-from-right duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]">
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gov-accent/20 border border-gov-accent/30 flex items-center justify-center text-gov-accent shadow-xs">
              <MaterialIcon name="menu_book" size="sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {lang === 'mr' ? 'शासकीय संज्ञा व मोजमाप शब्दकोश' : 'Metrics & Standards Glossary'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === 'mr' ? 'सर्व आकड्यांचे सूत्र, व्याख्या आणि अधिकृत स्रोत' : 'Formulas, definitions, and official data sources'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer"
            aria-label="Close glossary drawer"
          >
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 bg-slate-50/90 border-b border-slate-200/80 space-y-3 shrink-0">
          <div className="relative">
            <MaterialIcon name="search" size="sm" className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'mr' ? 'संज्ञा, सूत्र किंवा आकडा शोधा...' : 'Search term, formula, or figure...'}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white/95 border border-slate-300/80 rounded-xl text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-gov-primary focus:border-transparent transition-all duration-100 ease-out"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 active:scale-[0.96] transition-all duration-100 cursor-pointer"
              >
                <MaterialIcon name="cancel" size="xs" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer active:scale-[0.98] transition-all duration-100 ease-out min-w-fit shadow-xs ${
                selectedCategory === 'all'
                  ? 'bg-gov-primary text-white border border-slate-800/80'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {lang === 'mr' ? 'सर्व संज्ञा' : 'All Terms'}
            </button>
            {categories.map(([catKey, catLabel]) => (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 cursor-pointer active:scale-[0.98] transition-all duration-100 ease-out min-w-fit shadow-xs ${
                  selectedCategory === catKey
                    ? 'bg-gov-primary text-white border border-slate-800/80'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {catLabel[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Accordion / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MaterialIcon name="search_off" size="lg" className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">{lang === 'mr' ? 'कोणतीही संज्ञा सापडली नाही' : 'No definitions found'}</p>
              <p className="text-xs">{lang === 'mr' ? 'दुसरा शब्द टाकून पहा' : 'Try searching with another keyword'}</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isExpanded = selectedTerm === item.key;
              return (
                <div
                  key={item.key}
                  id={`glossary-item-${item.key}`}
                  className={`rounded-xl border transition-all ${
                    isExpanded
                      ? 'border-gov-primary/40 bg-slate-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setSelectedTerm(isExpanded ? null : item.key)}
                    className="w-full text-left p-3.5 flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{item.name[lang]}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {item.categoryLabel[lang]}
                        </span>
                        {item.isSampleData && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            {lang === 'mr' ? 'नमुना डेटा' : 'Sample data'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{item.shortDescription[lang]}</p>
                    </div>
                    <MaterialIcon
                      name={isExpanded ? 'expand_less' : 'expand_more'}
                      size="sm"
                      className="text-slate-400 shrink-0 mt-0.5"
                    />
                  </button>

                  {/* Expanded Detailed View */}
                  {isExpanded && (
                    <div className="px-3.5 pb-4 pt-1 border-t border-slate-200/80 space-y-3 text-xs leading-relaxed">
                      <div>
                        <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                          {lang === 'mr' ? 'सविस्तर अर्थ व महत्त्व' : 'Detailed Meaning'}
                        </h4>
                        <p className="text-slate-700">{item.detailedMeaning[lang]}</p>
                      </div>

                      <div className="bg-slate-900 text-amber-300 p-3 rounded-lg font-mono text-[11px] border border-slate-800">
                        <div className="text-[10px] font-sans font-bold uppercase text-slate-400 tracking-wider mb-1">
                          {lang === 'mr' ? 'गणितीय सूत्र / कार्यप्रणाली' : 'Calculation Formula'}
                        </div>
                        <div className="font-medium break-words">{item.formula[lang]}</div>
                      </div>

                      {item.inputs && item.inputs[lang]?.length > 0 && (
                        <div>
                          <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                            {lang === 'mr' ? 'इनपुट घटक' : 'Inputs Evaluated'}
                          </h4>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                            {item.inputs[lang].map((inp, idx) => (
                              <li key={idx}>{inp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.example && item.example[lang] && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-blue-900 text-[11px]">
                          <strong className="font-bold">{lang === 'mr' ? 'प्रात्यक्षिक उदाहरण: ' : 'Practical Example: '}</strong>
                          <span>{item.example[lang]}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                        <div>
                          <span className="font-bold text-slate-700">{lang === 'mr' ? 'स्रोत: ' : 'Data Source: '}</span>
                          <span>{item.source[lang]}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-700">{lang === 'mr' ? 'कालावधी: ' : 'Time Window: '}</span>
                          <span>{item.timeWindow[lang]}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer Link to full /glossary */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500 text-[11px]">
            {filtered.length} {lang === 'mr' ? 'संज्ञा उपलब्ध' : 'metrics documented'}
          </span>
          <a
            href="/glossary"
            className="text-gov-primary hover:text-gov-primary-dark font-bold flex items-center gap-1"
          >
            <span>{lang === 'mr' ? 'पूर्ण स्क्रीन शब्दकोश उघडा' : 'Open Full Screen Page'}</span>
            <MaterialIcon name="arrow_forward" size="xs" />
          </a>
        </div>
      </div>
    </div>
  );
};
