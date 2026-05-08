'use client';

import { Recommendation } from '@/lib/types';
import { ArrowRight, Check, TriangleAlert as AlertTriangle, TrendingDown } from 'lucide-react';

interface ToolCardProps {
  recommendation: Recommendation;
}

export function ToolCard({ recommendation }: ToolCardProps) {
  const hasSavings = recommendation.monthlySavings > 0;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/20">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{recommendation.toolName}</h3>
        {hasSavings ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <TrendingDown className="h-3 w-3" />
            Save ${recommendation.monthlySavings.toFixed(0)}/mo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/10 px-3 py-1 text-xs font-medium text-zinc-400">
            <Check className="h-3 w-3" />
            Optimal
          </span>
        )}
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-center">
          <div className="mb-1 text-xs text-zinc-500">Current</div>
          <div className="text-sm font-medium text-red-400">{recommendation.currentPlan}</div>
          <div className="text-lg font-bold text-white">${recommendation.currentSpend.toFixed(0)}/mo</div>
        </div>

        <ArrowRight className="h-5 w-5 shrink-0 text-zinc-600" />

        <div className="flex-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
          <div className="mb-1 text-xs text-zinc-500">Recommended</div>
          <div className="text-sm font-medium text-emerald-400">{recommendation.suggestedPlan}</div>
          <div className="text-lg font-bold text-white">${recommendation.suggestedSpend.toFixed(0)}/mo</div>
        </div>
      </div>

      <div className="flex items-start gap-2 text-sm text-zinc-400">
        {hasSavings ? (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        ) : (
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        )}
        <span>{recommendation.reasoning}</span>
      </div>
    </div>
  );
}
