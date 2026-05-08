'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-emerald-400" />
          <span className="text-lg font-bold text-white">AI Spend Audit</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/#features" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-sm text-zinc-400 transition-colors hover:text-white">
            How it Works
          </Link>
          <Link href="/#faq" className="text-sm text-zinc-400 transition-colors hover:text-white">
            FAQ
          </Link>
          <Link href="/audit">
            <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
              Start Free Audit
            </Button>
          </Link>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-4 py-6">
            <Link href="/#features" className="text-sm text-zinc-400 hover:text-white" onClick={() => setMobileOpen(false)}>
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm text-zinc-400 hover:text-white" onClick={() => setMobileOpen(false)}>
              How it Works
            </Link>
            <Link href="/#faq" className="text-sm text-zinc-400 hover:text-white" onClick={() => setMobileOpen(false)}>
              FAQ
            </Link>
            <Link href="/audit" onClick={() => setMobileOpen(false)}>
              <Button className="w-full bg-emerald-500 text-black hover:bg-emerald-400">
                Start Free Audit
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
