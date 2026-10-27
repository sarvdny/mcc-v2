import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MinimalCardHeader } from './MinimalCardHeader';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  accentColor?: 'navy' | 'saffron' | 'blue' | 'red' | 'none';
}

const accentClasses: Record<NonNullable<PanelProps['accentColor']>, string> = {
  navy: 'border-t-2 border-t-[var(--gov-primary)]',
  saffron: 'border-t-2 border-t-[var(--gov-accent)]',
  blue: 'border-t-2 border-t-[var(--gov-blue)]',
  red: 'border-t-2 border-t-[var(--status-danger)]',
  none: '',
};

export const Panel: React.FC<PanelProps> = ({
  title,
  subtitle,
  actions,
  accentColor = 'none',
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col overflow-hidden',
        accentClasses[accentColor],
        className
      )}
      {...props}
    >
      {(title || actions) && (
        <div className="px-4 py-3 border-b border-borderLine-subtle bg-surface">
          <MinimalCardHeader
            title={title}
            subtitle={subtitle}
            action={actions}
            className="w-full"
          />
        </div>
      )}
      <div className="p-4 flex-1">{children}</div>
    </div>
  );
};

export default Panel;
