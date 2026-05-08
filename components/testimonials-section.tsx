'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'DevFlow',
    quote: 'We were spending $800/mo on AI tools. AI Spend Audit found $340 in monthly savings in under 2 minutes. Game changer.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Engineering Lead',
    company: 'Stackwise',
    quote: 'Turns out we were on ChatGPT Team with only 2 seats. Downgrading to Plus saved us $120/month instantly.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Founder',
    company: 'DataPulse',
    quote: 'The shareable report feature made it easy to get buy-in from our finance team. We cut AI costs by 28%.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            What teams are saying
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-400">
            Real feedback from teams that optimized their AI spending.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/20"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-zinc-500">
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
