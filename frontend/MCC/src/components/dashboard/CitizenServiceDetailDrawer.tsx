'use client';

import React, { useEffect } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import type { CitizenServiceRecord } from '@/data/citizenServicesData';

interface CitizenServiceDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: CitizenServiceRecord | null;
}

export const CitizenServiceDetailDrawer: React.FC<CitizenServiceDetailDrawerProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { language } = useDashboardStore();
  const isMr = language === 'mr';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !record) return null;

  const statusColor =
    record.status === 'Resolved'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
      : record.status === 'In Progress'
      ? 'bg-amber-50 text-amber-800 border-amber-300'
      : 'bg-rose-50 text-rose-800 border-rose-300';

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-slate-950/60 backdrop-blur-md transition-opacity animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="citizen-service-drawer-title"
    >
      <div
        className="w-full max-w-lg backdrop-blur-xl bg-white/95 h-full shadow-2xl flex flex-col border-l border-slate-200/80 animate-in slide-in-from-right duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] select-text overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gov-primary/10 border border-gov-primary/20 text-gov-primary flex items-center justify-center shadow-xs">
              <MaterialIcon name="support_agent" size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="citizen-service-drawer-title" className="text-sm font-bold text-slate-900">
                  {isMr ? 'नागरिक सेवा व तक्रार निवारण तपशील' : 'Citizen Grievance & Service Record'}
                </h2>
                <span className="font-mono text-[10px] text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-xl border border-slate-300/60">
                  {record.ticketNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isMr ? `${record.cityMr}, ${record.districtMr} जिल्हा` : `${record.city}, ${record.district} District`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer"
            aria-label={isMr ? 'बंद करा' : 'Close drawer'}
          >
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs leading-relaxed">
          {/* Key Metric Bar */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 shadow-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {isMr ? 'बाधित नागरिक संख्या' : 'People Affected'}
              </span>
              <span className="text-base font-bold font-mono text-slate-900">
                {record.peopleAffected.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {isMr ? 'सद्यस्थिती' : 'Current Status'}
              </span>
              <span className={`inline-block font-semibold px-2.5 py-0.5 rounded-xl border text-[11px] mt-0.5 shadow-xs ${statusColor}`}>
                {isMr ? record.statusMr : record.status}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {isMr ? 'नोंदणी दिनांक व वेळ' : 'Date Raised'}
              </span>
              <span className="font-mono text-slate-800 text-[11px]">
                {record.dateRaised}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {isMr ? 'निवारण कालावधी' : 'Time to Resolve'}
              </span>
              <span className="font-mono font-bold text-amber-700 text-[11px]">
                {isMr ? record.timeToResolveMr : record.timeToResolve}
              </span>
            </div>
          </div>

          {/* Responsible Office */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl shadow-xs">
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
              {isMr ? 'जबाबदार कार्यालय / अधिकारी' : 'Responsible Office & Officer'}
            </span>
            <p className="font-semibold text-slate-900 text-xs">
              {isMr ? record.responsibleOfficeMr : record.responsibleOffice}
            </p>
          </div>

          {/* Issue Details */}
          <div>
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <MaterialIcon name="info" size="xs" className="text-slate-500" />
              <span>{isMr ? 'तक्रार व समस्येचा सविस्तर तपशील' : 'Issue & Grievance Details'}</span>
            </h3>
            <div className="p-3 bg-white/90 border border-slate-200/80 rounded-xl text-slate-700 shadow-xs">
              {isMr ? record.issueDetailsMr : record.issueDetails}
            </div>
          </div>

          {/* Resolution Summary */}
          {record.resolutionSummary && (
            <div>
              <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
                <span>{isMr ? 'सद्य कृती अहवाल' : 'Current Action & Resolution Status'}</span>
              </h3>
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-emerald-950 font-medium shadow-xs">
                {isMr ? record.resolutionSummaryMr : record.resolutionSummary}
              </div>
            </div>
          )}

          {/* Incident Timeline */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <MaterialIcon name="schedule" size="xs" className="text-slate-500" />
              <span>{isMr ? 'घटनाक्रम व पाठपुरावा' : 'Escalation & Resolution Timeline'}</span>
            </h3>
            <div className="border-l-2 border-slate-200 ml-2 space-y-3 pl-3">
              {record.timeline.map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-gov-accent border-2 border-white" />
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-slate-600 font-semibold">{item.timestamp}</span>
                    <span className="font-mono text-xs text-gov-primary font-bold">[{item.actor}]</span>
                  </div>
                  <p className="text-slate-700 text-xs mt-0.5">
                    {isMr ? item.actionMr : item.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            {isMr ? 'महाराष्ट्र शासन • लोकसेवा हक्क अधिनियम' : 'Govt of Maharashtra · RTS Portal'}
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-gov-primary text-white text-xs font-semibold rounded-xl hover:bg-gov-primary-light border border-slate-800/80 shadow-xs hover:shadow-sm active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer"
          >
            {isMr ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
