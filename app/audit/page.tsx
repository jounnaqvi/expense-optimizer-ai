'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AI_TOOLS, USE_CASES, ToolEntry, UseCase } from '@/lib/types';
import { getToolPlans } from '@/lib/audit-engine';
import { supabase } from '@/lib/supabase';
import { runAudit } from '@/lib/audit-engine';
import { Plus, Trash2, ArrowRight, Loader as Loader2, Shield } from 'lucide-react';

const STORAGE_KEY = 'ai-spend-audit-form';

const toolEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Select a tool'),
  plan: z.string().min(1, 'Select a plan'),
  monthlySpend: z.coerce.number().min(0, 'Must be 0 or more'),
  seats: z.coerce.number().min(1, 'At least 1 seat'),
});

const formSchema = z.object({
  teamSize: z.coerce.number().min(1, 'At least 1 team member'),
  primaryUseCase: z.string().min(1, 'Select a use case'),
  tools: z.array(toolEntrySchema).min(1, 'Add at least one tool'),
});

type FormValues = z.infer<typeof formSchema>;

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function loadSavedForm(): Partial<FormValues> | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function AuditPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const saved = loadSavedForm();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: saved || {
      teamSize: 5,
      primaryUseCase: 'mixed',
      tools: [{ id: generateId(), name: '', plan: '', monthlySpend: 0, seats: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tools',
  });

  const watchTools = form.watch('tools');
  const watchUseCase = form.watch('primaryUseCase');

  // Persist to localStorage
  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {}
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const tools: ToolEntry[] = data.tools.map((t) => ({
        id: t.id,
        name: t.name,
        plan: t.plan,
        monthlySpend: t.monthlySpend,
        seats: t.seats,
      }));

      const result = runAudit(tools, data.primaryUseCase as UseCase);

      const { data: audit, error } = await supabase
        .from('audits')
        .insert({
          team_size: data.teamSize,
          primary_use_case: data.primaryUseCase,
          tools: tools,
          total_monthly_spend: result.totalMonthlySpend,
          recommended_monthly_spend: result.recommendedMonthlySpend,
          monthly_savings: result.monthlySavings,
          annual_savings: result.annualSavings,
          recommendations: result.recommendations,
        })
        .select('id')
        .single();

      if (error) throw error;

      localStorage.removeItem(STORAGE_KEY);
      router.push(`/results?id=${audit.id}`);
    } catch (err) {
      console.error('Failed to submit audit:', err);
      setSubmitting(false);
    }
  };

  const addTool = () => {
    append({ id: generateId(), name: '', plan: '', monthlySpend: 0, seats: 1 });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-28">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
            <Shield className="h-4 w-4" />
            Free AI Spend Audit
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Audit Your AI Stack
          </h1>
          <p className="text-zinc-400">
            Enter your AI tools and spending below. We&apos;ll find savings opportunities instantly.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Team Info Section */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Team Information</CardTitle>
              <CardDescription className="text-zinc-400">
                Tell us about your team to get more accurate recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-300">Team Size</label>
                  <Controller
                    name="teamSize"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        min={1}
                        value={field.value}
                        onChange={field.onChange}
                        className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                      />
                    )}
                  />
                  {form.formState.errors.teamSize && (
                    <p className="mt-1 text-xs text-red-400">{form.formState.errors.teamSize.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-300">Primary Use Case</label>
                  <Controller
                    name="primaryUseCase"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="border-white/10 bg-white/5 text-white">
                          <SelectValue placeholder="Select use case" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-zinc-900">
                          {USE_CASES.map((uc) => (
                            <SelectItem key={uc.value} value={uc.value}>
                              {uc.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.primaryUseCase && (
                    <p className="mt-1 text-xs text-red-400">{form.formState.errors.primaryUseCase.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools Section */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">AI Tools</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Add each AI tool your team subscribes to.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTool}
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Tool
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => {
                const selectedTool = watchTools?.[index]?.name;
                const availablePlans = selectedTool ? getToolPlans(selectedTool) : [];

                return (
                  <div
                    key={field.id}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-400">Tool {index + 1}</span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-zinc-500 transition-colors hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Tool Name</label>
                        <Controller
                          name={`tools.${index}.name`}
                          control={form.control}
                          render={({ field: nameField }) => (
                            <Select
                              value={nameField.value}
                              onValueChange={(val) => {
                                nameField.onChange(val);
                                form.setValue(`tools.${index}.plan`, '');
                              }}
                            >
                              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                <SelectValue placeholder="Select tool" />
                              </SelectTrigger>
                              <SelectContent className="border-white/10 bg-zinc-900">
                                {AI_TOOLS.map((tool) => (
                                  <SelectItem key={tool} value={tool}>
                                    {tool}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {form.formState.errors.tools?.[index]?.name && (
                          <p className="mt-1 text-xs text-red-400">
                            {form.formState.errors.tools[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Current Plan</label>
                        <Controller
                          name={`tools.${index}.plan`}
                          control={form.control}
                          render={({ field: planField }) => (
                            <Select
                              value={planField.value}
                              onValueChange={planField.onChange}
                              disabled={!selectedTool}
                            >
                              <SelectTrigger className="border-white/10 bg-white/5 text-white disabled:opacity-50">
                                <SelectValue placeholder={selectedTool ? 'Select plan' : 'Select tool first'} />
                              </SelectTrigger>
                              <SelectContent className="border-white/10 bg-zinc-900">
                                {availablePlans.map((plan) => (
                                  <SelectItem key={plan} value={plan}>
                                    {plan}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {form.formState.errors.tools?.[index]?.plan && (
                          <p className="mt-1 text-xs text-red-400">
                            {form.formState.errors.tools[index]?.plan?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Monthly Spend ($)</label>
                        <Controller
                          name={`tools.${index}.monthlySpend`}
                          control={form.control}
                          render={({ field: spendField }) => (
                            <Input
                              type="number"
                              min={0}
                              step={1}
                              placeholder="0"
                              value={spendField.value}
                              onChange={spendField.onChange}
                              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                            />
                          )}
                        />
                        {form.formState.errors.tools?.[index]?.monthlySpend && (
                          <p className="mt-1 text-xs text-red-400">
                            {form.formState.errors.tools[index]?.monthlySpend?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-500">Number of Seats</label>
                        <Controller
                          name={`tools.${index}.seats`}
                          control={form.control}
                          render={({ field: seatsField }) => (
                            <Input
                              type="number"
                              min={1}
                              value={seatsField.value}
                              onChange={seatsField.onChange}
                              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                            />
                          )}
                        />
                        {form.formState.errors.tools?.[index]?.seats && (
                          <p className="mt-1 text-xs text-red-400">
                            {form.formState.errors.tools[index]?.seats?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {form.formState.errors.tools?.root && (
                <p className="text-xs text-red-400">{form.formState.errors.tools.root.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="group w-full bg-emerald-500 text-lg text-black hover:bg-emerald-400"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Running Audit...
              </>
            ) : (
              <>
                Run Free Audit
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
