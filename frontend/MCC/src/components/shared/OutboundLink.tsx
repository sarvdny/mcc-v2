'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { validateOutboundUrl, sanitizeUrl } from '@/lib/urlSecurity';

export interface OutboundLinkProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
  showDomainBadge?: boolean;
  title?: string;
}

export const OutboundLink: React.FC<OutboundLinkProps> = ({
  href,
  children,
  className = '',
  showDomainBadge = true,
  title,
}) => {
  const { language } = useDashboardStore();
  const isMr = language === 'mr';

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const validation = validateOutboundUrl(href);
  const safeHref = sanitizeUrl(href);

  if (!safeHref) {
    return <span className={`text-slate-400 line-through ${className}`}>{children || href}</span>;
  }

  // Internal links don't need external security confirmation
  if (validation.isInternal) {
    return (
      <a href={safeHref} className={className} title={title}>
        {children || href}
      </a>
    );
  }

  const domain = validation.domain || 'external-site';
  const isVerified = validation.isAllowlisted;

  const handleClick = (e: React.MouseEvent) => {
    if (!isVerified) {
      e.preventDefault();
      setConfirmModalOpen(true);
    }
  };

  const handleProceed = () => {
    setConfirmModalOpen(false);
    window.open(safeHref, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <span className="inline-flex items-center gap-1.5 flex-wrap">
        <a
          href={safeHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className={`inline-flex items-center gap-0.5 hover:underline focus:outline-none focus:ring-1 focus:ring-gov-accent rounded transition-colors ${className}`}
          title={title || `Open ${domain} in a new tab`}
        >
          <span>{children || href}</span>
          <MaterialIcon name="open_in_new" size="xs" className="text-slate-400 ml-0.5 shrink-0" />
        </a>

        {/* Small source label: "Source: <domain> · verified/unverified" */}
        {showDomainBadge && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded border ${
              isVerified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title={
              isVerified
                ? (isMr ? 'अधिकृत मान्यताप्राप्त शासकीय/वृत्त माध्यम' : 'Verified & Allowlisted Domain')
                : (isMr ? 'अनोळखी बाह्य संकेतस्थळ' : 'Unverified External Domain')
            }
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isVerified ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>
              {isMr ? 'स्त्रोत:' : 'Source:'} {domain} · {isVerified ? (isMr ? 'प्रमाणित' : 'verified') : (isMr ? 'अप्रमाणित' : 'unverified')}
            </span>
          </span>
        )}
      </span>

      {/* Confirmation Modal for Unknown / Unverified External Domains */}
      {confirmModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 p-5 space-y-4 animate-in zoom-in-95 duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                <MaterialIcon name="warning" size="md" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">
                  {isMr ? 'तुम्ही हे शासकीय पोर्टल सोडत आहात' : 'You are leaving this official portal'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isMr
                    ? `तुम्ही बाह्य संकेतस्थळ "${domain}" वर पुनर्निर्देशित होत आहात. महाराष्ट्र शासन या बाह्य संकेतस्थळावरील सामग्रीसाठी जबाबदार नाही.`
                    : `You are about to be redirected to external domain "${domain}". Government of Maharashtra does not endorse or take responsibility for external content.`}
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                {isMr ? 'लक्ष्य URL:' : 'Destination URL:'}
              </span>
              <span className="font-mono text-slate-800 break-all select-all">{safeHref}</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer"
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleProceed}
                className="px-3.5 py-1.5 bg-gov-primary hover:bg-gov-primary-light border border-slate-800/80 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer flex items-center gap-1.5"
              >
                <span>{isMr ? 'पुढे जा (संकेतस्थळ उघडा)' : 'Proceed to External Site'}</span>
                <MaterialIcon name="open_in_new" size="xs" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
