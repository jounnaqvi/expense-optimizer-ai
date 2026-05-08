'use client';

import { TrendingDown, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface SavingsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: 'trending-down' | 'trending-up' | 'dollar' | 'calendar';
  variant?: 'savings' | 'spend' | 'neutral';
}

const iconMap = {
  'trending-down': TrendingDown,
  'trending-up': TrendingUp,
  dollar: DollarSign,
  calendar: Calendar,
};

const variantStyles = {
  savings: 'border-emerald-500/20 bg-emerald-500/5',
  spend: 'border-red-500/20 bg-red-500/5',
  neutral: 'border-white/10 bg-white/5',
};

const iconStyles = {
  savings: 'bg-emerald-500/10 text-emerald-400',
  spend: 'bg-red-500/10 text-red-400',
  neutral: 'bg-zinc-500/10 text-zinc-400',
};

export function SavingsCard({ title, value, subtitle, icon, variant = 'neutral' }: SavingsCardProps) {
  const Icon = iconMap[icon];

  return (
    <div
      className={`rounded-xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${variantStyles[variant]}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-zinc-400">{title}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconStyles[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>}
    </div>
  );
}
