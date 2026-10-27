'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

export interface MinimalCardHeaderProps {
  /** Main card heading text or element */
  title: React.ReactNode;
  /** Subtitle/contextual text moved to the hover/focus tooltip */
  subtitle?: string | React.ReactNode;
  /** Optional custom tooltip text (defaults to subtitle) */
  tooltip?: string | React.ReactNode;
  /** Optional badge or counter adjacent to the title */
  badge?: React.ReactNode;
  /** Optional right-hand action controls (buttons, tabs, selectors) */
  action?: React.ReactNode;
  /** Optional container CSS class name */
  className?: string;
  /** Optional title element heading tag (default: 'h3') */
  headingLevel?: 'h2' | 'h3' | 'h4';
  /** Optional custom title text color/styling (defaults to 'text-slate-900') */
  titleClassName?: string;
  /** Optional children for inline content */
  children?: React.ReactNode;
}

export const MinimalCardHeader: React.FC<MinimalCardHeaderProps> = ({
  title,
  subtitle,
  tooltip,
  badge,
  action,
  className = '',
  headingLevel = 'h3',
  titleClassName = 'text-slate-900',
  children,
}) => {
  const tooltipContent = tooltip ?? subtitle;
  const HeadingTag = headingLevel;

  const headerTitleNode = (
    <div className="flex items-center gap-2 select-none min-w-0">
      <HeadingTag className={`text-sm sm:text-base font-bold tracking-tight leading-snug truncate ${titleClassName}`}>
        {title}
      </HeadingTag>
      {badge && <div className="shrink-0">{badge}</div>}
      {children}
    </div>
  );

  return (
    <div className={`flex items-center justify-between gap-3 min-w-0 ${className}`}>
      {tooltipContent ? (
        <Tooltip.Provider delayDuration={150}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div
                tabIndex={0}
                className="flex items-center gap-2 cursor-help group focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent/60 rounded px-1 -mx-1 py-0.5 transition-colors hover:bg-slate-50/80 min-w-0"
                aria-label={typeof tooltipContent === 'string' ? tooltipContent : undefined}
              >
                {headerTitleNode}
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                align="start"
                sideOffset={6}
                className="z-50 max-w-sm rounded-xl px-3 py-2 text-xs leading-relaxed text-slate-100 bg-slate-900/95 backdrop-blur-md border border-slate-700/60 shadow-xl transition-opacity animate-in fade-in-0 zoom-in-95 pointer-events-none"
              >
                <div className="font-normal text-slate-200">
                  {tooltipContent}
                </div>
                <Tooltip.Arrow className="fill-slate-900/95" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      ) : (
        headerTitleNode
      )}

      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
};

export default MinimalCardHeader;
