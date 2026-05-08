'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Send, CircleCheck as CheckCircle, Loader as Loader2 } from 'lucide-react';

interface LeadCaptureFormProps {
  auditId: string;
  monthlySavings: number;
}

export function LeadCaptureForm({ auditId, monthlySavings }: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('leads').insert({
        audit_id: auditId,
        email,
        company_name: companyName,
        role,
        monthly_savings: monthlySavings,
      });

      if (!error) {
        setSubmitted(true);
      }
    } catch {
      // Graceful failure
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center backdrop-blur-sm">
        <CheckCircle className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
        <h3 className="mb-2 text-lg font-semibold text-white">Thanks for your interest!</h3>
        <p className="text-sm text-zinc-400">
          We&apos;ll reach out with personalized cost optimization strategies.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h3 className="mb-2 text-lg font-semibold text-white">Get a personalized consultation</h3>
      <p className="mb-6 text-sm text-zinc-400">
        With ${monthlySavings.toFixed(0)}/mo in potential savings, our team can help you optimize further.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email *</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-emerald-500/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">Company Name</label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Inc."
            className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-emerald-500/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">Your Role</label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="CTO, Engineering Lead, etc."
            className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-emerald-500/50"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {loading ? 'Submitting...' : 'Get Free Consultation'}
        </Button>
      </form>
    </div>
  );
}
