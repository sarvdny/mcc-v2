import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlossaryScreen } from '@/components/portal/GlossaryScreen';

export const metadata: Metadata = {
  title: 'Metrics & Terminology Glossary | Maha-Command Center',
  description:
    'Authoritative mathematical formulas, data provenance, input weights, and contextual definitions for all figures across the Maha-Command Center.',
};

export default function GlossaryPage() {
  return (
    <DashboardLayout>
      <GlossaryScreen />
    </DashboardLayout>
  );
}
