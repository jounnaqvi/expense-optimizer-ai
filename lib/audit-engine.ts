import { ToolEntry, Recommendation, AuditResult, UseCase } from './types';

interface PlanPricing {
  name: string;
  pricePerSeat: number;
  minSeats?: number;
}

interface ToolPricing {
  name: string;
  plans: PlanPricing[];
  freeAlternative?: string;
  freeAlternativeNote?: string;
}

const TOOL_PRICING: Record<string, ToolPricing> = {
  Cursor: {
    name: 'Cursor',
    plans: [
      { name: 'Free', pricePerSeat: 0 },
      { name: 'Pro', pricePerSeat: 20 },
      { name: 'Business', pricePerSeat: 40, minSeats: 5 },
    ],
    freeAlternative: 'Continue (VS Code extension)',
    freeAlternativeNote: 'Continue is a free open-source AI coding assistant for VS Code.',
  },
  ChatGPT: {
    name: 'ChatGPT',
    plans: [
      { name: 'Free', pricePerSeat: 0 },
      { name: 'Plus', pricePerSeat: 20 },
      { name: 'Team', pricePerSeat: 25, minSeats: 3 },
      { name: 'Enterprise', pricePerSeat: 60 },
    ],
  },
  Claude: {
    name: 'Claude',
    plans: [
      { name: 'Free', pricePerSeat: 0 },
      { name: 'Pro', pricePerSeat: 20 },
      { name: 'Team', pricePerSeat: 30, minSeats: 5 },
      { name: 'Enterprise', pricePerSeat: 75 },
    ],
  },
  'GitHub Copilot': {
    name: 'GitHub Copilot',
    plans: [
      { name: 'Individual', pricePerSeat: 10 },
      { name: 'Business', pricePerSeat: 19 },
      { name: 'Enterprise', pricePerSeat: 39 },
    ],
    freeAlternative: 'Codeium',
    freeAlternativeNote: 'Codeium offers a generous free tier for individual developers.',
  },
  Gemini: {
    name: 'Gemini',
    plans: [
      { name: 'Free', pricePerSeat: 0 },
      { name: 'Advanced', pricePerSeat: 20 },
      { name: 'Business', pricePerSeat: 30 },
      { name: 'Enterprise', pricePerSeat: 40 },
    ],
  },
  'OpenAI API': {
    name: 'OpenAI API',
    plans: [
      { name: 'Pay-as-you-go', pricePerSeat: 0 },
      { name: 'Tier 1', pricePerSeat: 100 },
      { name: 'Tier 2', pricePerSeat: 500 },
    ],
  },
  'Anthropic API': {
    name: 'Anthropic API',
    plans: [
      { name: 'Pay-as-you-go', pricePerSeat: 0 },
      { name: 'Tier 1', pricePerSeat: 100 },
      { name: 'Tier 2', pricePerSeat: 500 },
    ],
  },
  Windsurf: {
    name: 'Windsurf',
    plans: [
      { name: 'Free', pricePerSeat: 0 },
      { name: 'Pro', pricePerSeat: 15 },
      { name: 'Team', pricePerSeat: 25, minSeats: 3 },
    ],
  },
};

function getExpectedSpend(toolName: string, planName: string, seats: number): number {
  const tool = TOOL_PRICING[toolName];
  if (!tool) return 0;
  const plan = tool.plans.find((p) => p.name === planName);
  if (!plan) return 0;
  return plan.pricePerSeat * seats;
}

function findBestPlan(toolName: string, seats: number, useCase: UseCase): PlanPricing | null {
  const tool = TOOL_PRICING[toolName];
  if (!tool) return null;

  const eligiblePlans = tool.plans.filter((p) => {
    if (p.minSeats && seats < p.minSeats) return false;
    return true;
  });

  if (eligiblePlans.length === 0) return tool.plans[0];
  return eligiblePlans[0];
}

function generateRecommendation(
  tool: ToolEntry,
  useCase: UseCase
): Recommendation | null {
  const toolPricing = TOOL_PRICING[tool.name];
  if (!toolPricing) return null;

  const currentPlan = toolPricing.plans.find((p) => p.name === tool.plan);
  if (!currentPlan) return null;

  const expectedSpend = currentPlan.pricePerSeat * tool.seats;
  const bestPlan = findBestPlan(tool.name, tool.seats, useCase);

  if (!bestPlan) return null;

  const bestSpend = bestPlan.pricePerSeat * tool.seats;
  const savings = tool.monthlySpend - bestSpend;

  // Check for minimum seat requirement violations
  if (currentPlan.minSeats && tool.seats < currentPlan.minSeats) {
    const downgradedPlan = toolPricing.plans
      .filter((p) => !p.minSeats || tool.seats >= p.minSeats)
      .sort((a, b) => b.pricePerSeat - a.pricePerSeat)[0];

    if (downgradedPlan && downgradedPlan.name !== tool.plan) {
      const downgradedSpend = downgradedPlan.pricePerSeat * tool.seats;
      const downgradeSavings = tool.monthlySpend - downgradedSpend;
      if (downgradeSavings > 0) {
        return {
          toolName: tool.name,
          currentPlan: tool.plan,
          suggestedPlan: downgradedPlan.name,
          currentSpend: tool.monthlySpend,
          suggestedSpend: downgradedSpend,
          monthlySavings: downgradeSavings,
          reasoning: `Your team has ${tool.seats} seat(s), but ${tool.plan} requires a minimum of ${currentPlan.minSeats}. Downgrade to ${downgradedPlan.name} to avoid overpaying.`,
        };
      }
    }
  }

  // Check if user is overpaying compared to expected plan cost
  if (tool.monthlySpend > expectedSpend * 1.1) {
    return {
      toolName: tool.name,
      currentPlan: tool.plan,
      suggestedPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      suggestedSpend: expectedSpend,
      monthlySavings: tool.monthlySpend - expectedSpend,
      reasoning: `You are spending $${tool.monthlySpend}/mo but the expected cost for ${tool.plan} with ${tool.seats} seat(s) is $${expectedSpend}/mo. Review your usage for unused seats or overage charges.`,
    };
  }

  // Check if a cheaper plan would work
  if (bestPlan.name !== tool.plan && savings > 0) {
    let reasoning = `Switching from ${tool.plan} to ${bestPlan.name} saves $${savings}/mo`;
    if (useCase === 'coding' && toolPricing.freeAlternative) {
      reasoning += `. Also consider ${toolPricing.freeAlternative} as a free alternative — ${toolPricing.freeAlternativeNote || ''}`;
    }
    return {
      toolName: tool.name,
      currentPlan: tool.plan,
      suggestedPlan: bestPlan.name,
      currentSpend: tool.monthlySpend,
      suggestedSpend: bestSpend,
      monthlySavings: savings,
      reasoning,
    };
  }

  // Check for free alternatives for coding use case
  if (useCase === 'coding' && toolPricing.freeAlternative && tool.monthlySpend > 0) {
    return {
      toolName: tool.name,
      currentPlan: tool.plan,
      suggestedPlan: `${toolPricing.freeAlternative} (Free)`,
      currentSpend: tool.monthlySpend,
      suggestedSpend: 0,
      monthlySavings: tool.monthlySpend,
      reasoning: `Consider ${toolPricing.freeAlternative} as a free alternative. ${toolPricing.freeAlternativeNote || ''}`,
    };
  }

  return null;
}

export function runAudit(tools: ToolEntry[], useCase: UseCase): AuditResult {
  const recommendations: Recommendation[] = [];

  let totalMonthlySpend = 0;
  let recommendedMonthlySpend = 0;

  for (const tool of tools) {
    totalMonthlySpend += tool.monthlySpend;
    const rec = generateRecommendation(tool, useCase);
    if (rec) {
      recommendations.push(rec);
      recommendedMonthlySpend += rec.suggestedSpend;
    } else {
      recommendedMonthlySpend += tool.monthlySpend;
    }
  }

  const monthlySavings = totalMonthlySpend - recommendedMonthlySpend;
  const annualSavings = monthlySavings * 12;

  return {
    totalMonthlySpend,
    recommendedMonthlySpend,
    monthlySavings,
    annualSavings,
    recommendations,
    isEfficient: monthlySavings < 10,
  };
}

export function getToolPlans(toolName: string): string[] {
  const tool = TOOL_PRICING[toolName];
  if (!tool) return [];
  return tool.plans.map((p) => p.name);
}

export { TOOL_PRICING };
