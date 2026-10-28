'use client';

import React, { useState, useMemo } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { CITIZEN_SERVICES_DATA, CitizenServiceRecord } from '@/data/citizenServicesData';
import { CitizenServiceDetailDrawer } from './CitizenServiceDetailDrawer';
import { MetricTip } from '@/components/shared/MetricTip';
import { TermInfo } from '@/components/shared/TermInfo';
import { MinimalCardHeader } from '@/components/shared/MinimalCardHeader';

export const CitizenServicesCard: React.FC = () => {
  const { language } = useDashboardStore();
  const isMr = language === 'mr';

  const [selectedRecord, setSelectedRecord] = useState<CitizenServiceRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Dynamic Telemetry Metrics
  const totalAffected = useMemo(() => {
    return CITIZEN_SERVICES_DATA.reduce((acc, curr) => acc + curr.peopleAffected, 0);
  }, []);

  const inProgressCount = useMemo(() => {
    return CITIZEN_SERVICES_DATA.filter((i) => i.status === 'In Progress').length;
  }, []);

  const resolvedCount = useMemo(() => {
    return CITIZEN_SERVICES_DATA.filter((i) => i.status === 'Resolved').length;
  }, []);

  // Category counts for quick filter tabs
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: CITIZEN_SERVICES_DATA.length };
    CITIZEN_SERVICES_DATA.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredItems = useMemo(() => {
    if (filterCategory === 'ALL') return CITIZEN_SERVICES_DATA;
    return CITIZEN_SERVICES_DATA.filter((item) => item.category === filterCategory);
  }, [filterCategory]);

  const handleOpenDetail = (record: CitizenServiceRecord) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Healthcare':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Water Supply':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'Roads & Transport':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Agriculture':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/80';
    }
  };

  const categories = [
    { id: 'ALL', en: 'All', mr: 'सर्व' },
    { id: 'Healthcare', en: 'Health', mr: 'आरोग्य' },
    { id: 'Water Supply', en: 'Water', mr: 'पाणी' },
    { id: 'Roads & Transport', en: 'Infra', mr: 'पायाभूत' },
    { id: 'Agriculture', en: 'Agri', mr: 'शेती' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col overflow-hidden w-full h-full min-h-0">
      {/* 1. Card Header with MinimalCardHeader & Compact SLA Action */}
      <div className="p-3 sm:p-3.5 border-b border-slate-200/80 bg-white shrink-0">
        <MinimalCardHeader
          title={isMr ? 'तक्रारी व हमी कायदा (SLA)' : 'Grievances & SLA'}
          subtitle={
            isMr
              ? 'महाराष्ट्र राज्य जिल्हास्तरीय नागरिक तक्रारी, सेवा हमी कायदा SLA व थेट निवारण संनियंत्रण.'
              : 'Real-time tracking of civic grievances, citizen charter SLA resolution & citizen counts.'
          }
          children={<TermInfo termKey="crisisSlaResolutionRate" size="xs" />}
          action={
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                94.2% {isMr ? 'SLA साध्य' : 'SLA'}
              </span>
            </div>
          }
          className="w-full"
        />
      </div>

      {/* 2. Compact 4-Cell Telemetry Ribbon (No text wrapping) */}
      <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-50 rounded-lg border-b border-slate-100 text-center shrink-0">
        {/* Cell 1: Total */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {isMr ? 'एकूण' : 'TOTAL'}
          </span>
          <span className="text-sm font-bold font-mono text-slate-900">
            {CITIZEN_SERVICES_DATA.length}
          </span>
        </div>

        {/* Cell 2: Active */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
            {isMr ? 'सक्रिय' : 'ACTIVE'}
          </span>
          <span className="text-sm font-bold font-mono text-amber-600">
            {inProgressCount}
          </span>
        </div>

        {/* Cell 3: Affected */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {isMr ? 'बाधित' : 'AFFECTED'}
          </span>
          <MetricTip metricKey="tatScore" value={`${totalAffected.toLocaleString('en-IN')} Citizens`}>
            <span className="text-sm font-bold font-mono text-slate-900 cursor-help">
              {totalAffected >= 1000 ? `${(totalAffected / 1000).toFixed(1)}K` : totalAffected}
            </span>
          </MetricTip>
        </div>

        {/* Cell 4: Resolved */}
        <div className="flex flex-col items-center justify-center min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 truncate max-w-full">
            {isMr ? 'निवारित' : 'RESOLVED'}
          </span>
          <span className="text-sm font-bold font-mono text-emerald-600 tabular-nums">
            {resolvedCount}/{CITIZEN_SERVICES_DATA.length}
          </span>
        </div>

        {/* Graphical Representation: Active vs Resolved Proportional Indicator */}
        <div className="col-span-4 mt-1 px-1">
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex" title={`Resolved: ${resolvedCount}, Active: ${inProgressCount}`}>
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(resolvedCount / (CITIZEN_SERVICES_DATA.length || 1)) * 100}%` }} />
            <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${(inProgressCount / (CITIZEN_SERVICES_DATA.length || 1)) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* 3. Category Pill Filters (Clean wrapping strip so all pills are visible) */}
      <div
        role="tablist"
        aria-label="Filter citizen services by category"
        className="px-3 py-1.5 border-b border-slate-100 bg-white flex flex-wrap items-center gap-1.5 text-xs shrink-0"
      >
        {categories.map((cat) => {
          const count = categoryCounts[cat.id] || 0;
          const isSelected = filterCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-[0.98] shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gov-primary text-white shadow-xs border border-slate-800'
                  : 'bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-200/60'
              }`}
            >
              <span>{isMr ? cat.mr : cat.en}</span>
              <span
                className={`text-[10px] font-mono px-1 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Adaptive Grievance Item List with Internal Scroll & Padding Clearance */}
      <div className="overflow-y-auto flex-1 min-h-0 p-2.5 pt-3 space-y-2.5">
        {filteredItems.map((item) => {
          const isResolved = item.status === 'Resolved';
          const shortTicketNumber = item.ticketNumber.replace(/^GRV-([A-Z]{3})-\d{4}-(\d+)/, '#$1-$2');

          return (
            <Tooltip.Provider key={item.id} delayDuration={150}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={() => handleOpenDetail(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenDetail(item);
                      }
                    }}
                    className="group p-3 rounded-lg bg-white hover:bg-slate-50/90 border border-slate-200/80 hover:border-slate-300 hover:ring-1 hover:ring-slate-300 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent space-y-2"
                    aria-label={`${isMr ? item.cityMr : item.city}: ${isMr ? item.issueDetailsMr : item.issueDetails}`}
                  >
                    {/* Item Row 1: Status Dot + Town & District Name on left; Compact Status on right */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isResolved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                          }`}
                        />
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {isMr ? `${item.cityMr}, ${item.districtMr}` : `${item.city}, ${item.district}`}
                        </span>
                      </div>

                      <span
                        className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          isResolved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300/80'
                            : 'bg-amber-50 text-amber-800 border-amber-300/80'
                        }`}
                      >
                        {isMr ? item.statusMr : item.status}
                      </span>
                    </div>

                    {/* Item Row 2: Issue snippet (2 lines clamped with comfortable line-height) */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {isMr ? item.issueDetailsMr : item.issueDetails}
                    </p>

                    {/* Item Row 3: Category Pill + Ticket ID + Numeric Count on left; Action Link on right */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0 border ${getCategoryBadgeStyle(
                            item.category
                          )}`}
                        >
                          <span className="truncate">{isMr ? item.categoryMr : item.category}</span>
                        </span>
                        <span
                          className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium shrink-0"
                          title={item.ticketNumber}
                        >
                          {shortTicketNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-auto font-medium hover:underline text-xs text-slate-600">
                        <MaterialIcon name="group" size="xs" className="w-3.5 h-3.5 text-slate-400" />
                        <span className="tabular-nums">
                          {item.peopleAffected.toLocaleString('en-IN')} {isMr ? 'बाधित' : 'affected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Tooltip.Trigger>

                {/* Radix Popover Tooltip showing all 7 required dimensions on hover & keyboard focus */}
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    align="center"
                    sideOffset={8}
                    className="z-[9999] w-[320px] sm:w-[380px] bg-slate-900/95 backdrop-blur-md text-white rounded-xl p-4 text-xs shadow-2xl border border-slate-700/80 animate-in fade-in-0 zoom-in-95 leading-relaxed select-text"
                  >
                    <div className="flex items-start justify-between border-b border-slate-700/80 pb-2 mb-2.5">
                      <div>
                        <div className="font-bold text-amber-300 text-xs">
                          {isMr ? `${item.cityMr}, ${item.districtMr} जिल्हा` : `${item.city}, ${item.district} District`}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">{item.ticketNumber}</div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isResolved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {isMr ? item.statusMr : item.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="text-slate-400 block text-[10px] uppercase tracking-wider">
                          {isMr ? 'तक्रार / समस्या' : 'Issue Details'}
                        </strong>
                        <p className="text-slate-200 mt-0.5 leading-snug">
                          {isMr ? item.issueDetailsMr : item.issueDetails}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                        <div>
                          <span className="text-slate-400 text-[10px] block">{isMr ? 'बाधित नागरिक:' : 'People Affected:'}</span>
                          <strong className="text-slate-100 font-mono">{item.peopleAffected.toLocaleString('en-IN')}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">{isMr ? 'नोंदणी तारीख:' : 'Date Raised:'}</span>
                          <strong className="text-slate-100 font-mono">{item.dateRaised}</strong>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-slate-800">
                        <span className="text-slate-400 text-[10px] block">{isMr ? 'जबाबदार कार्यालय:' : 'Responsible Office:'}</span>
                        <strong className="text-amber-200">{isMr ? item.responsibleOfficeMr : item.responsibleOffice}</strong>
                      </div>

                      <div className="pt-1 border-t border-slate-800">
                        <span className="text-slate-400 text-[10px] block">{isMr ? 'निवारण कालावधी:' : 'Time to Resolve:'}</span>
                        <strong className="text-emerald-300 font-mono">{isMr ? item.timeToResolveMr : item.timeToResolve}</strong>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-700/80 text-right">
                      <span className="text-xs text-amber-400 font-semibold underline underline-offset-2">
                        {isMr ? 'सविस्तर रेकॉर्ड उघडण्यासाठी क्लिक करा →' : 'Click to view full case drawer →'}
                      </span>
                    </div>

                    <Tooltip.Arrow className="fill-slate-900/95" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          );
        })}
      </div>

      {/* 5. Card Footer with Status & Live Sync Indicator */}
      <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 whitespace-nowrap shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate">{isMr ? 'थेट माहिती संकलन • २४x७ तक्रार कक्ष' : 'Live Sync • 24x7 Grievance Desk'}</span>
        </div>
        <span className="font-medium text-slate-500 whitespace-nowrap shrink-0 ml-2">
          {filteredItems.length} {isMr ? 'तक्रारी' : 'Grievances'}
        </span>
      </div>

      {/* 6. Slide-out Detail Drawer */}
      <CitizenServiceDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
};

export default CitizenServicesCard;
