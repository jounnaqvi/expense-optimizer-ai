export type UseCase = 'coding' | 'writing' | 'research' | 'mixed' | 'data_analysis';

export interface ToolEntry {
  id: string;
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  tools: ToolEntry[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export interface Recommendation {
  toolName: string;
  currentPlan: string;
  suggestedPlan: string;
  currentSpend: number;
  suggestedSpend: number;
  monthlySavings: number;
  reasoning: string;
}

export interface AuditResult {
  totalMonthlySpend: number;
  recommendedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  recommendations: Recommendation[];
  isEfficient: boolean;
}

export interface AuditRecord {
  id: string;
  email: string;
  company_name: string;
  team_size: number;
  primary_use_case: string;
  tools: ToolEntry[];
  total_monthly_spend: number;
  recommended_monthly_spend: number;
  monthly_savings: number;
  annual_savings: number;
  recommendations: Recommendation[];
  ai_summary: string;
  created_at: string;
  isEfficient?: boolean;
}

export const AI_TOOLS = [
  'Cursor',
  'ChatGPT',
  'Claude',
  'GitHub Copilot',
  'Gemini',
  'OpenAI API',
  'Anthropic API',
  'Windsurf',
] as const;

export type AIToolName = (typeof AI_TOOLS)[number];

export const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: 'Coding' },
  { value: 'writing', label: 'Writing' },
  { value: 'research', label: 'Research' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'data_analysis', label: 'Data Analysis' },
];
