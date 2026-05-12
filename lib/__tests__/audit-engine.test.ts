import { describe, it, expect } from 'vitest';
import { runAudit, getToolPlans } from '@/lib/audit-engine';

describe('audit-engine', () => {
  it('sums total monthly spend across tools', () => {
    const result = runAudit(
      [
        { id: 'a', name: 'Cursor', plan: 'Pro', monthlySpend: 20, seats: 1 },
        { id: 'b', name: 'ChatGPT', plan: 'Plus', monthlySpend: 20, seats: 1 },
      ],
      'coding'
    );
    expect(result.totalMonthlySpend).toBe(40);
  });

  it('lists known plans for Cursor', () => {
    expect(getToolPlans('Cursor')).toEqual(expect.arrayContaining(['Free', 'Pro', 'Business']));
  });
});
