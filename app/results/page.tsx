'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { SavingsCard } from '@/components/savings-card';
import { ToolCard } from '@/components/tool-card';
import { AIReportSummary } from '@/components/ai-report-summary';
import { LeadCaptureForm } from '@/components/lead-capture-form';
import { Button } from '@/components/ui/button';
import { supabase, SUPABASE_URL } from '@/lib/supabase';
import { AuditRecord, Recommendation } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Copy as CopyIcon, Check as CheckIcon, Share2, ArrowLeft, Loader as Loader2 } from 'lucide-react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const auditId = searchParams.get('id');

  const [audit, setAudit] = useState<AuditRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [aiSummaryLoading, setAiSummaryLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchAudit = useCallback(async () => {
    if (!auditId) return;
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', auditId)
        .maybeSingle();

      if (error) throw error;
      if (data) setAudit(data as AuditRecord);
    } catch (err) {
      console.error('Failed to fetch audit:', err);
    } finally {
      setLoading(false);
    }
  }, [auditId]);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  const fetchAISummary = useCallback(async () => {
    if (!audit) return;
    setAiSummaryLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: audit.tools.map((t) => t.name),
          monthlySavings: audit.monthly_savings,
          recommendations: audit.recommendations,
        }),
      });
      const data = await response.json();
      const summary = data.summary || 'Unable to generate summary.';
      setAiSummary(summary);

      // Save summary to audit record for shareable report
      if (auditId && summary) {
        await supabase
          .from('audits')
          .update({ ai_summary: summary })
          .eq('id', auditId);
      }
    } catch {
      setAiSummary(
        `Your AI stack has a potential savings of $${audit.monthly_savings.toFixed(0)}/month. ` +
        `Review the recommendations below to optimize your spending across ${audit.tools.length} tools.`
      );
    } finally {
      setAiSummaryLoading(false);
    }
  }, [audit]);

  useEffect(() => {
    if (audit) fetchAISummary();
  }, [audit, fetchAISummary]);

  const copyShareLink = () => {
    const url = `${window.location.origin}/report/${auditId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-zinc-400">Loading your audit results...</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-white">Audit not found</h2>
          <p className="mb-6 text-zinc-400">The audit you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/audit">
            <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
              Run a New Audit
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const chartData = audit.recommendations.map((r: Recommendation) => ({
    name: r.toolName,
    current: r.currentSpend,
    recommended: r.suggestedSpend,
    savings: r.monthlySavings,
  }));

  const savingsChart = audit.recommendations.map((r: Recommendation) => ({
    name: r.toolName,
    savings: r.monthlySavings,
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-28">
        {/* Back link */}
        <Link
          href="/audit"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Run Another Audit
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Your Audit Results
          </h1>
          <p className="text-zinc-400">
            {audit.monthly_savings < 10
              ? 'Great news! Your AI spending is already optimized.'
              : `We found potential savings across your AI tool stack.`}
          </p>
        </div>

        {/* Savings Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SavingsCard
            title="Current Spend"
            value={`$${audit.total_monthly_spend.toFixed(0)}`}
            subtitle="per month"
            icon="dollar"
            variant="spend"
          />
          <SavingsCard
            title="Recommended Spend"
            value={`$${audit.recommended_monthly_spend.toFixed(0)}`}
            subtitle="per month"
            icon="trending-down"
            variant="savings"
          />
          <SavingsCard
            title="Monthly Savings"
            value={`$${audit.monthly_savings.toFixed(0)}`}
            subtitle="per month"
            icon="trending-down"
            variant="savings"
          />
          <SavingsCard
            title="Annual Savings"
            value={`$${audit.annual_savings.toFixed(0)}`}
            subtitle="per year"
            icon="calendar"
            variant="savings"
          />
        </div>

        {/* AI Summary */}
        <div className="mb-8">
          <AIReportSummary summary={aiSummary} isLoading={aiSummaryLoading} />
        </div>

        {/* Charts */}
        {audit.recommendations.length > 0 && (
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            {/* Current vs Recommended */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-6 text-lg font-semibold text-white">Current vs Recommended Spend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} barGap={4}>
                  <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`$${value}/mo`, undefined]}
                  />
                  <Bar dataKey="current" name="Current" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recommended" name="Recommended" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Savings by Tool */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-6 text-lg font-semibold text-white">Savings by Tool</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={savingsChart} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`$${value}/mo`, 'Savings']}
                  />
                  <Bar dataKey="savings" radius={[0, 4, 4, 0]}>
                    {savingsChart.map((_, index) => (
                      <Cell key={index} fill="#10b981" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {audit.recommendations.length > 0 ? (
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Recommendations</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {audit.recommendations.map((rec: Recommendation, i: number) => (
                <ToolCard key={i} recommendation={rec} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center backdrop-blur-sm">
            <div className="mb-3 text-4xl">&#10003;</div>
            <h3 className="mb-2 text-xl font-semibold text-white">You are already spending efficiently.</h3>
            <p className="text-sm text-zinc-400">
              Your current AI tool plans are well-optimized. Keep monitoring as your team grows.
            </p>
          </div>
        )}

        {/* CTA for high savings */}
        {audit.monthly_savings > 500 && (
          <div className="mb-8">
            <LeadCaptureForm auditId={audit.id} monthlySavings={audit.monthly_savings} />
          </div>
        )}

        {/* Share Section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-white">Share Your Audit</h3>
              <p className="text-sm text-zinc-400">
                Send this report to your team or stakeholders.
              </p>
            </div>
            <Button
              onClick={copyShareLink}
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            >
              {copied ? (
                <>
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy Share Link
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
