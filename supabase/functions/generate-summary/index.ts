import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateFallbackSummary(tools: string[], monthlySavings: number, recommendations: { toolName: string; suggestedPlan: string; reasoning: string }[]): string {
  if (recommendations.length === 0) {
    return `Your AI tool stack (${tools.join(', ')}) is well-optimized. You're spending efficiently across your current plans with no significant savings opportunities detected. Keep monitoring your usage as your team grows.`;
  }

  const topRecs = recommendations.slice(0, 3).map((r) => `${r.toolName} → ${r.suggestedPlan}`).join(', ');
  return `Your AI stack (${tools.join(', ')}) has savings potential of $${monthlySavings.toFixed(0)}/mo. Key opportunities: ${topRecs}. Reviewing your plan tiers and seat allocation could unlock significant annual savings.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { tools, monthlySavings, recommendations } = await req.json();

    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      const fallback = generateFallbackSummary(tools, monthlySavings, recommendations);
      return new Response(JSON.stringify({ summary: fallback }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are an AI cost optimization expert. Based on the following audit results, write a concise 100-word personalized summary for a startup founder.

Tools: ${tools.join(', ')}
Monthly savings potential: $${monthlySavings}
Recommendations: ${recommendations.map((r: { toolName: string; currentPlan: string; suggestedPlan: string; reasoning: string }) => `${r.toolName}: ${r.currentPlan} → ${r.suggestedPlan} (${r.reasoning})`).join('; ')}

Write a professional, actionable summary. Be specific about the biggest savings opportunity.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const fallback = generateFallbackSummary(tools, monthlySavings, recommendations);
      return new Response(JSON.stringify({ summary: fallback }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content?.trim() || generateFallbackSummary(tools, monthlySavings, recommendations);

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate summary" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
