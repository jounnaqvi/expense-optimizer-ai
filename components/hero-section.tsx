'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingDown } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4 pt-16">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[100px]" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[80px]" />
      </div>

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
          <TrendingDown className="h-4 w-4" />
          Average teams save $380/month
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          Stop Overpaying for{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            AI Tools
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 sm:text-xl">
          Analyze your AI stack and discover hidden monthly savings instantly.
          Get personalized recommendations to optimize your spending.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/audit">
            <Button
              size="lg"
              className="group bg-emerald-500 px-8 text-lg text-black hover:bg-emerald-400"
            >
              Start Free Audit
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 bg-transparent px-8 text-lg text-zinc-300 hover:border-zinc-500 hover:bg-zinc-900"
            >
              See How it Works
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            2-minute audit
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            100% free
          </span>
        </div>
      </div>
    </section>
  );
}
