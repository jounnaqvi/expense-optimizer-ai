import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { ReportContent } from './report-content';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: audit } = await supabase
    .from('audits')
    .select('monthly_savings, tools')
    .eq('id', params.id)
    .maybeSingle();

  if (!audit) {
    return {
      title: 'Audit Report - AI Spend Audit',
      description: 'AI tool spending audit report.',
    };
  }

  const toolNames = (audit.tools as { name: string }[]).map((t) => t.name).join(', ');

  return {
    title: `AI Spend Audit Report - $${Number(audit.monthly_savings).toFixed(0)}/mo Savings`,
    description: `Audit results for ${toolNames}. Potential savings of $${Number(audit.monthly_savings).toFixed(0)}/month found.`,
    openGraph: {
      title: `AI Spend Audit - $${Number(audit.monthly_savings).toFixed(0)}/mo Savings Found`,
      description: `Audit results for ${toolNames}. Potential savings of $${Number(audit.monthly_savings).toFixed(0)}/month found.`,
      type: 'website',
      siteName: 'AI Spend Audit',
    },
    twitter: {
      card: 'summary_large_image',
      title: `AI Spend Audit - $${Number(audit.monthly_savings).toFixed(0)}/mo Savings Found`,
      description: `Audit results for ${toolNames}. Potential savings of $${Number(audit.monthly_savings).toFixed(0)}/month found.`,
    },
  };
}

export default function ReportPage({ params }: Props) {
  return <ReportContent id={params.id} />;
}
