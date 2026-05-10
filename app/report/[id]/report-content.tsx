'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuditRecord, Recommendation } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { SavingsCard } from '@/components/savings-card';
import { ToolCard } from '@/components/tool-card';
import { AIReportSummary } from '@/components/ai-report-summary';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Loader as Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ReportContentProps {
  id: string;
}

export function ReportContent({ id }: ReportContentProps) {
  const [audit, setAudit] = useState<AuditRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAudit() {
      try {
        const { data, error } = await supabase
          .from('audits')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) setAudit(data as AuditRecord);
      } catch (err) {
        console.error('Failed to fetch audit:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAudit();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-white">Report not found</h2>
          <p className="mb-6 text-zinc-400">This audit report doesn&apos;t exist or has been removed.</p>
          <Link href="/audit">
            <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
              Run Your Own Audit
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
  }));

  const savingsChart = audit.recommendations.map((r: Recommendation) => ({
    name: r.toolName,
    savings: r.monthlySavings,
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-400" />
            <span className="font-bold text-white">AI Spend Audit</span>
          </Link>
          <Link href="/audit">
            <Button size="sm" className="bg-emerald-500 text-black hover:bg-emerald-400">
              Run Your Own Audit
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-12">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
          <Shield className="h-4 w-4" />
          Shared Audit Report
        </div>

        <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
          AI Spend Audit Report
        </h1>
        <p className="mb-10 text-zinc-400">
          {audit.monthly_savings < 10
            ? 'This team is spending efficiently across their AI tools.'
            : `This team could save $${audit.monthly_savings.toFixed(0)}/month on AI tools.`}
        </p>

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
        {audit.ai_summary && (
          <div className="mb-8">
            <AIReportSummary summary={audit.ai_summary} isLoading={false} />
          </div>
        )}

        {/* Charts */}
        {audit.recommendations.length > 0 && (
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-6 text-lg font-semibold text-white">Current vs Recommended</h3>
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
            <h3 className="mb-2 text-xl font-semibold text-white">This team is already spending efficiently.</h3>
            <p className="text-sm text-zinc-400">No significant savings opportunities were found.</p>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 p-8 text-center backdrop-blur-sm">
          <h3 className="mb-2 text-xl font-semibold text-white">Want to find your own savings?</h3>
          <p className="mb-6 text-sm text-zinc-400">
            Run a free audit on your AI tool stack and discover how much you could save.
          </p>
          <Link href="/audit">
            <Button size="lg" className="bg-emerald-500 text-black hover:bg-emerald-400">
              Start Free Audit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
