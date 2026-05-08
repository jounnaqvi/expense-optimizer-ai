'use client';

import { DollarSign, Users, TrendingDown, Building } from 'lucide-react';

const stats = [
  {
    icon: DollarSign,
    value: '$2.4M+',
    label: 'Savings Identified',
    description: 'Total savings found across all audits',
  },
  {
    icon: Users,
    value: '3,200+',
    label: 'Teams Audited',
    description: 'Startups and teams optimized',
  },
  {
    icon: TrendingDown,
    value: '32%',
    label: 'Average Savings',
    description: 'Typical reduction in AI spend',
  },
  {
    icon: Building,
    value: '8',
    label: 'Tools Supported',
    description: 'Major AI platforms covered',
  },
];

export function StatsSection() {
  return (
    <section className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Trusted by thousands of teams
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-400">
            Join the growing number of startups optimizing their AI spending.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/20"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="mb-1 text-3xl font-bold text-white">{stat.value}</div>
              <div className="mb-1 text-sm font-medium text-emerald-400">{stat.label}</div>
              <div className="text-xs text-zinc-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
