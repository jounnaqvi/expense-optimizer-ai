'use client';

import { Sparkles, Loader as Loader2 } from 'lucide-react';

interface AIReportSummaryProps {
  summary: string;
  isLoading?: boolean;
}

export function AIReportSummary({ summary, isLoading }: AIReportSummaryProps) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Generating your personalized summary...</span>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-zinc-300">{summary}</p>
      )}
    </div>
  );
}
