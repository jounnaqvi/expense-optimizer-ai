'use client';

import { Search, Zap, ChartBar as BarChart3, Shield, Lightbulb, Share2 } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Smart Detection',
    description: 'Automatically identifies overpriced plans and unused seats across your AI tool stack.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get your personalized savings report in under 2 minutes with zero setup required.',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Interactive charts break down your spending and show exactly where money is wasted.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays yours. We never sell your information or share it with third parties.',
  },
  {
    icon: Lightbulb,
    title: 'AI Recommendations',
    description: 'Get AI-powered suggestions for cheaper alternatives and optimal plan tiers.',
  },
  {
    icon: Share2,
    title: 'Shareable Reports',
    description: 'Generate shareable audit reports to align your team on cost optimization.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Everything you need to cut AI costs
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-400">
            Powerful features designed to help startups and teams optimize their AI tool spending.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.08]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
