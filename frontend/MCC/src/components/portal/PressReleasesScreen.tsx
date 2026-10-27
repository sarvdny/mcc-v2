'use client';

import React, { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { DEPARTMENTS_DATA } from '@/data/dashboardData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  getLocalizedDepartment,
  getLocalizedPressReleaseTitle,
  getLocalizedStatus,
} from '@/lib/dataLocalization';

type ReleaseFilter = 'All' | 'Published' | 'Under Review' | 'Draft';

interface PressReleaseItem {
  id: string;
  title: string;
  department: string;
  date: string;
  status: 'Published' | 'Under Review' | 'Draft';
  downloads: number;
  district?: string;
  tatMinutes?: number;
  reason?: string;
  reasonMr?: string;
  reviewDetails?: {
    reviewer: string;
    reviewerMr: string;
    pendingStep: string;
    pendingStepMr: string;
    submittedAt: string;
    submittedAtMr: string;
    nextStep: string;
    nextStepMr: string;
  };
}

export const PressReleasesScreen: React.FC = () => {
  const { language, userRole } = useDashboardStore();
  const [filter, setFilter] = useState<ReleaseFilter>('All');
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  // Draft form state
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDept, setDraftDept] = useState('Agriculture Department');
  const [draftContent, setDraftContent] = useState('');
  const [draftSubmitted, setDraftSubmitted] = useState(false);

  const initialReleases: PressReleaseItem[] = DEPARTMENTS_DATA.flatMap((d) =>
    d.pressReleases.map((pr, index) => {
      const isUnderReview = pr.status === 'Under Review';
      return {
        ...pr,
        department: d.name,
        district: pr.district || 'State HQ',
        tatMinutes: pr.tatMinutes || 30,
        reason: isUnderReview
          ? (index % 2 === 0
              ? 'Collector sign-off and administrative budget verification pending'
              : 'Statistical audit clearance pending from Joint Secretary (Desk 4)')
          : undefined,
        reasonMr: isUnderReview
          ? (index % 2 === 0
              ? 'जिल्हाधिकारी स्वाक्षरी व प्रशासकीय निधी तरतूद पडताळणी प्रलंबित'
              : 'सहसचिव (कार्यासन ४) यांच्याकडून सांख्यिकी माहिती पडताळणी प्रलंबित')
          : undefined,
        reviewDetails: isUnderReview
          ? {
              reviewer: index % 2 === 0 ? 'District Collector, Palghar / Desk 2' : 'Directorate Scrutiny Cell, Mumbai',
              reviewerMr: index % 2 === 0 ? 'जिल्हाधिकारी, पालघर / कार्यासन २' : 'माहिती संचलनालय छाननी कक्ष, मुंबई',
              pendingStep: index % 2 === 0 ? 'Collector Official Digital Sign-off' : 'Departmental Scheme Clearance',
              pendingStepMr: index % 2 === 0 ? 'जिल्हाधिकारी डिजिटल स्वाक्षरी' : 'विभागीय योजना मंजुरी',
              submittedAt: 'Today, 11:20 IST',
              submittedAtMr: 'आज, ११:२० IST',
              nextStep: 'Release order issuance & dispatch to 18 regional daily newspapers & PIB',
              nextStepMr: 'प्रसिद्धी आदेश जारी करून १८ प्रादेशिक वर्तमानपत्रे व पीआयबीकडे प्रसारण',
            }
          : undefined,
      };
    })
  );

  const [releasesList, setReleasesList] = useState<PressReleaseItem[]>(initialReleases);

  const isLeadershipRole = userRole === 'dg_admin' || userRole === 'director_konkan';

  const filtered = releasesList.filter((pr) => {
    const matchesFilter = filter === 'All' || pr.status === filter;
    const matchesSearch =
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.department.toLowerCase().includes(search.toLowerCase()) ||
      (pr.district && pr.district.toLowerCase().includes(search.toLowerCase())) ||
      pr.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs: ReleaseFilter[] = ['All', 'Published', 'Under Review', 'Draft'];

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      // Increment download counter
      setReleasesList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, downloads: r.downloads + 1 } : r))
      );
    }, 1200);
  };

  const handleApprove = (id: string) => {
    setReleasesList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Published' as const } : r))
    );
  };

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;

    const newRelease: PressReleaseItem = {
      id: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: draftTitle,
      department: draftDept,
      date: language === 'mr' ? 'आज, १४:४०' : 'Today, 14:40 IST',
      status: 'Under Review',
      downloads: 0,
      reason: 'Draft submitted by DIO desk; awaiting Department Secretary clearance and Collector sign-off',
      reasonMr: 'जिल्हा माहिती कक्षाकडून मसुदा सादर; विभाग सचिव मंजुरी व जिल्हाधिकारी स्वाक्षरी प्रलंबित',
      reviewDetails: {
        reviewer: 'Department Review Committee / State Scrutiny Desk',
        reviewerMr: 'विभाग पुनरावलोकन समिती / राज्य छाननी कक्ष',
        pendingStep: 'Initial Scrutiny & Collector Digital Sign-off',
        pendingStepMr: 'प्राथमिक छाननी व जिल्हाधिकारी डिजिटल स्वाक्षरी',
        submittedAt: 'Today, 14:40 IST',
        submittedAtMr: 'आज, १४:४० IST',
        nextStep: 'Official publication to DGPR media wire & regional dailies',
        nextStepMr: 'डीजीपीआर मीडिया वायर व प्रादेशिक वर्तमानपत्रांमध्ये अधिकृत प्रकाशन',
      },
    };

    setReleasesList([newRelease, ...releasesList]);
    setDraftSubmitted(true);
    setTimeout(() => {
      setDraftSubmitted(false);
      setIsDraftModalOpen(false);
      setDraftTitle('');
      setDraftContent('');
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="description" size="md" className="text-gov-primary" />
            <h2 className="text-base sm:text-lg font-bold text-gov-primary tracking-tight">
              {language === 'mr' ? 'राज्य प्रसिद्धीपत्रक वितरण प्रणाली' : 'State Press Release Distribution Pipeline'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'अधिकृत प्रसिद्धीपत्रके, मंत्रालयीन माहिती आणि अधिकृत माध्यम फीड'
              : 'Official Press Notes, Ministerial Dispatches & Accredited Media Feeds'}
          </p>
        </div>

        <button
          onClick={() => setIsDraftModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-primary text-white rounded text-xs font-semibold hover:bg-gov-primary-dark transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <MaterialIcon name="add" size="xs" className="text-amber-400" />
          <span>
            {isLeadershipRole
              ? (language === 'mr' ? 'राज्य निर्देश / प्रसिद्धी टिपण जारी करा' : 'Issue State Directive / Press Note')
              : (language === 'mr' ? '+ नवीन स्थानिक प्रसिद्धीपत्रक मसुदा' : '+ Draft Local Press Release')}
          </span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-surface border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filter === tab
                  ? 'bg-gov-primary text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'All'
                ? (language === 'mr' ? 'सर्व' : 'All')
                : getLocalizedStatus(tab, language)}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <MaterialIcon name="search" size="xs" className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={language === 'mr' ? 'शीर्षक, विभाग किंवा आयडीने शोधा...' : 'Search by title, dept, or ID...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-gov-blue text-slate-800"
          />
        </div>
      </div>

      {/* Releases Table */}
      <div className="bg-surface border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            {language === 'mr' ? 'अधिकृत प्रसिद्धीपत्रक नोंदवही' : 'Official Dispatches Ledger'}
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            {language === 'mr' ? `${filtered.length} प्रसिद्धीपत्रके उपलब्ध` : `${filtered.length} Dispatches Listed`}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <MaterialIcon name="description" size="xl" className="text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">
              {language === 'mr' ? 'कोणतीही प्रसिद्धीपत्रके जुळत नाहीत' : 'No press releases match your filter'}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === 'mr'
                ? 'कृपया शोध शब्द तपासा किंवा सर्व प्रसिद्धीपत्रके निवडा.'
                : 'Try adjusting your search query or switching to All dispatches.'}
            </p>
            <button
              onClick={() => {
                setFilter('All');
                setSearch('');
              }}
              className="mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
            >
              {language === 'mr' ? 'फिल्टर पूर्ववत करा' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'पीआर आयडी' : 'PR ID'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'शीर्षक व विषय' : 'Title & Subject'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'विभाग' : 'Department'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'जिल्हा' : 'District'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'दिनांक' : 'Release Date'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'mr' ? 'प्रकाशन वेळ' : 'Publish Time'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'mr' ? 'डाउनलोड्स' : 'Downloads'}</th>
                  <th className="py-2.5 px-3 text-center">{language === 'mr' ? 'कृती' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filtered.map((pr) => {
                  const isDownloading = downloadingId === pr.id;
                  const localizedTitle = getLocalizedPressReleaseTitle(pr.id, pr.title, language);
                  const localizedDept = getLocalizedDepartment(pr.department, language);
                  const tat = pr.tatMinutes || 35;

                  return (
                    <tr key={pr.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{pr.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-md">{localizedTitle}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{localizedDept}</td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">{pr.district || 'State HQ'}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{pr.date}</td>
                      <td className="py-2.5 px-3 font-mono">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="font-bold text-slate-900">{tat}m</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold whitespace-nowrap ${
                              tat <= 45
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : tat <= 120
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {tat <= 45
                              ? language === 'mr'
                                ? 'विहित वेळेत'
                                : 'SLA Met (≤45m)'
                              : tat <= 120
                              ? language === 'mr'
                                ? 'विलंबित'
                                : 'Degraded'
                              : language === 'mr'
                              ? 'उल्लंघन'
                              : 'Breached'}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="inline-flex items-center justify-start gap-1.5 text-xs font-semibold whitespace-nowrap text-slate-700">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              pr.status === 'Published'
                                ? 'bg-emerald-500'
                                : pr.status === 'Under Review'
                                ? 'bg-amber-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                          />
                          <span
                            className={
                              pr.status === 'Published'
                                ? 'text-emerald-700'
                                : pr.status === 'Under Review'
                                ? 'text-amber-700'
                                : 'text-slate-600'
                            }
                          >
                            {getLocalizedStatus(pr.status, language)}
                          </span>

                          {/* Info Icon & Detailed Reason Tooltip for Under Review (Item 8c) */}
                          {pr.status === 'Under Review' && (
                            <Tooltip.Provider delayDuration={150}>
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <button
                                    type="button"
                                    aria-label={
                                      language === 'mr'
                                        ? 'पुनरावलोकन स्थितीचे कारण व सविस्तर तपशील'
                                        : 'Under review reason and pending approval details'
                                    }
                                    className="p-0.5 rounded text-amber-600 hover:text-amber-800 hover:bg-amber-100 transition-colors cursor-help focus:outline-none focus:ring-1 focus:ring-amber-500 inline-flex items-center justify-center ml-0.5"
                                  >
                                    <MaterialIcon name="info" size="xs" />
                                  </button>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content
                                    side="top"
                                    align="start"
                                    sideOffset={6}
                                    className="z-[9999] max-w-[340px] sm:max-w-[380px] bg-slate-900 text-white rounded-xl p-3.5 text-xs shadow-2xl border border-slate-700/80 animate-in fade-in-0 zoom-in-95 leading-relaxed select-text"
                                  >
                                    <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
                                      <span className="font-bold text-amber-300">
                                        {language === 'mr' ? 'पुनरावलोकन स्थिती (Under Review)' : 'Under Review Details'}
                                      </span>
                                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1 rounded">
                                        {pr.id}
                                      </span>
                                    </div>

                                    <div className="space-y-2 text-[11px]">
                                      {/* Reason */}
                                      <div>
                                        <strong className="text-slate-400 block text-[10px] uppercase tracking-wider">
                                          {language === 'mr' ? 'प्रलंबित असण्याचे कारण:' : 'Why in this state:'}
                                        </strong>
                                        <p className="text-slate-200 mt-0.5">
                                          {language === 'mr' ? (pr.reasonMr || pr.reason) : pr.reason}
                                        </p>
                                      </div>

                                      {/* Reviewer & Pending Step */}
                                      {pr.reviewDetails && (
                                        <>
                                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                                            <div>
                                              <span className="text-slate-400 text-[10px] block">
                                                {language === 'mr' ? 'तपासणी अधिकारी:' : 'Who is reviewing:'}
                                              </span>
                                              <strong className="text-slate-200">
                                                {language === 'mr' ? pr.reviewDetails.reviewerMr : pr.reviewDetails.reviewer}
                                              </strong>
                                            </div>
                                            <div>
                                              <span className="text-slate-400 text-[10px] block">
                                                {language === 'mr' ? 'सादर केल्याची वेळ:' : 'Submitted At:'}
                                              </span>
                                              <strong className="text-slate-200 font-mono">
                                                {language === 'mr' ? pr.reviewDetails.submittedAtMr : pr.reviewDetails.submittedAt}
                                              </strong>
                                            </div>
                                          </div>

                                          <div className="pt-1 border-t border-slate-800">
                                            <span className="text-slate-400 text-[10px] block">
                                              {language === 'mr' ? 'प्रलंबित मंजुरी पायरी:' : 'Pending Approval Step:'}
                                            </span>
                                            <strong className="text-amber-200">
                                              {language === 'mr' ? pr.reviewDetails.pendingStepMr : pr.reviewDetails.pendingStep}
                                            </strong>
                                          </div>

                                          <div className="pt-1 border-t border-slate-800">
                                            <span className="text-slate-400 text-[10px] block">
                                              {language === 'mr' ? 'पुढील प्रक्रिया (What happens next):' : 'What happens next:'}
                                            </span>
                                            <p className="text-emerald-300">
                                              {language === 'mr' ? pr.reviewDetails.nextStepMr : pr.reviewDetails.nextStep}
                                            </p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    <Tooltip.Arrow className="fill-slate-900" />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>
                            </Tooltip.Provider>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">{pr.downloads}</td>
                      <td className="py-2.5 px-3 text-center">
                        {pr.status === 'Under Review' ? (
                          isLeadershipRole ? (
                            <button
                              onClick={() => handleApprove(pr.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] border border-amber-300 bg-amber-50 text-amber-800 rounded font-semibold hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
                              title="Review and approve draft dispatch"
                            >
                              <MaterialIcon name="verified_user" size="xs" className="text-amber-600" />
                              <span>{language === 'mr' ? 'पुनरावलोकन व मंजुरी' : 'Review & Approve'}</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span>{language === 'mr' ? 'मंजुरी प्रलंबित' : 'Pending Approval'}</span>
                            </span>
                          )
                        ) : (
                          <button
                            onClick={() => handleDownload(pr.id)}
                            disabled={isDownloading}
                            aria-label={`Download PDF for ${localizedTitle}`}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] border rounded transition-colors shadow-2xs cursor-pointer ${
                              isDownloading
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {isDownloading ? (
                              <>
                                <MaterialIcon name="check" size="xs" className="text-emerald-600" />
                                <span>{language === 'mr' ? 'डाउनलोड केले' : 'Downloaded'}</span>
                              </>
                            ) : (
                              <>
                                <MaterialIcon name="download" size="xs" className="text-slate-500" />
                                <span>{language === 'mr' ? 'पीडीएफ डाउनलोड' : 'Download PDF'}</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drafting Modal */}
      {isDraftModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={language === 'mr' ? 'अधिकृत प्रसिद्धीपत्रक मसुदा तयार करा' : 'Draft Official Press Release'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 transition-opacity duration-150 ease-out"
        >
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-5 space-y-4 shadow-xl transition-all duration-150 ease-out">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <MaterialIcon name="description" size="sm" className="text-gov-primary" />
                <h3 className="text-sm font-bold text-gov-primary">
                  {language === 'mr' ? 'अधिकृत प्रसिद्धीपत्रक मसुदा तयार करा' : 'Draft Official Press Release'}
                </h3>
              </div>
              <button
                onClick={() => setIsDraftModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close dialog"
              >
                <MaterialIcon name="close" size="sm" />
              </button>
            </div>

            <form onSubmit={handleCreateDraft} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'प्रसिद्धीपत्रक शीर्षक / विषय' : 'Release Headline / Subject'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    language === 'mr'
                      ? 'उदा. राज्य मंत्रिमंडळ बैठकीत महत्वपूर्ण निर्णयांना मंजुरी...'
                      : 'e.g. State cabinet approves key infrastructure initiatives...'
                  }
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-gov-blue text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'संबंधित विभाग' : 'Originating Department'}
                </label>
                <select
                  value={draftDept}
                  onChange={(e) => setDraftDept(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-900 focus:outline-none focus:border-gov-blue cursor-pointer"
                >
                  <option value="Agriculture Department">
                    {language === 'mr' ? 'कृषी विभाग' : 'Agriculture Department'}
                  </option>
                  <option value="Public Health Department">
                    {language === 'mr' ? 'सार्वजनिक आरोग्य विभाग' : 'Public Health Department'}
                  </option>
                  <option value="Home Department">
                    {language === 'mr' ? 'गृह विभाग' : 'Home Department'}
                  </option>
                  <option value="Revenue & Forest Department">
                    {language === 'mr' ? 'महसूल व वन विभाग' : 'Revenue & Forest Department'}
                  </option>
                  <option value="CMO Press Wing">
                    {language === 'mr' ? 'मुख्यमंत्री कार्यालय कक्ष' : 'CMO Press Wing'}
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'संक्षिप्त प्रसिद्धीपत्रक सारांश' : 'Brief Dispatch Summary'}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    language === 'mr'
                      ? 'तपशीलवार प्रसिद्धीपत्रक किंवा घोषणा सारांश प्रविष्ट करा...'
                      : 'Enter detailed press notes or gazette summary...'
                  }
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-gov-blue text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                >
                  {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={draftSubmitted}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                    draftSubmitted
                      ? 'bg-emerald-700 text-white'
                      : 'bg-gov-primary hover:bg-gov-primary-dark text-white'
                  }`}
                >
                  {draftSubmitted ? (
                    <>
                      <MaterialIcon name="check" size="xs" />
                      <span>{language === 'mr' ? 'पुनरावलोकनासाठी सादर' : 'Submitted for Review'}</span>
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="send" size="xs" />
                      <span>{language === 'mr' ? 'संपादकीय पुनरावलोकनासाठी पाठवा' : 'Submit for Editorial Review'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
