'use client';

import { ClipboardList, Cpu, FileText } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Enter Your AI Stack',
    description: 'Add your AI tools, current plans, monthly spend, and number of seats. Takes under 2 minutes.',
  },
  {
    icon: Cpu,
    step: '02',
    title: 'Get Instant Analysis',
    description: 'Our audit engine compares your spending against optimal plans and identifies savings opportunities.',
  },
  {
    icon: FileText,
    step: '03',
    title: 'Review & Save',
    description: 'Get a detailed report with recommendations, savings breakdown, and a shareable link for your team.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-400">
            Three simple steps to start saving on your AI tool subscriptions.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.step} className="relative text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-emerald-500/30 to-transparent md:block" />
              )}

              <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                <step.icon className="h-10 w-10 text-emerald-400" />
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-black">
                  {step.step}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
