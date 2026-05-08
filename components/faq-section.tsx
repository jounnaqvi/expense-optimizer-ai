'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Is the audit really free?',
    answer: 'Yes, 100% free. No credit card required, no sign-up needed. Just enter your AI tools and get instant results.',
  },
  {
    question: 'What AI tools are supported?',
    answer: 'We currently support Cursor, ChatGPT, Claude, GitHub Copilot, Gemini, OpenAI API, Anthropic API, and Windsurf. More tools are added regularly.',
  },
  {
    question: 'How accurate are the savings estimates?',
    answer: 'Our estimates are based on current published pricing from each AI tool provider. Actual savings may vary based on your specific usage patterns and any custom enterprise agreements.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use Supabase with row-level security for data storage. Your audit data is only accessible via a unique shareable link. We never sell or share your information.',
  },
  {
    question: 'Can I share my audit results with my team?',
    answer: 'Yes! Every audit generates a unique shareable link that you can send to your team or stakeholders. The shared report shows recommendations without any private information.',
  },
  {
    question: 'How often should I run an audit?',
    answer: 'AI tool pricing changes frequently. We recommend running an audit quarterly or whenever you add a new tool to your stack.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-zinc-400">
            Everything you need to know about AI Spend Audit.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20"
            >
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-medium text-white">{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-sm leading-relaxed text-zinc-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
