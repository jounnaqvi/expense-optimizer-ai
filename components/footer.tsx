import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-emerald-400" />
              <span className="font-bold text-white">AI Spend Audit</span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500">
              Stop overpaying for AI tools. Analyze your stack and discover hidden savings instantly.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
            <div className="flex flex-col gap-2">
              <Link href="/audit" className="text-sm text-zinc-500 transition-colors hover:text-white">
                Start Audit
              </Link>
              <Link href="/#features" className="text-sm text-zinc-500 transition-colors hover:text-white">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-sm text-zinc-500 transition-colors hover:text-white">
                How it Works
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Resources</h4>
            <div className="flex flex-col gap-2">
              <Link href="/#faq" className="text-sm text-zinc-500 transition-colors hover:text-white">
                FAQ
              </Link>
              <Link href="/#features" className="text-sm text-zinc-500 transition-colors hover:text-white">
                Supported Tools
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-zinc-500">Privacy Policy</span>
              <span className="text-sm text-zinc-500">Terms of Service</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} AI Spend Audit. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Built for startups, by startups.
          </p>
        </div>
      </div>
    </footer>
  );
}
