import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

interface AIRequest {
  action: "match" | "suggest" | "describe" | "chat" | "review" | "price";
  context?: Record<string, unknown>;
  message?: string;
  history?: { role: string; content: string }[];
}

const SYSTEM_PROMPTS: Record<string, string> = {
  match: `You are SkillSwap AI, an expert freelancer-task matching engine for a student marketplace. Given a freelancer's skills and a list of tasks, rank and explain which tasks best match. Return JSON with a "matches" array, each having: taskId (string), score (0-100), reason (1 sentence). Keep reasons concise and actionable.`,
  suggest: `You are SkillSwap AI, a gig creation assistant for a student freelance marketplace. Help users create compelling gig listings. When given a skill or category, suggest: title, description, pricing range (INR), delivery days, and tags. Return JSON with: title, description, priceMin, priceMax, deliveryDays, tags (array of strings).`,
  describe: `You are SkillSwap AI, a task description generator. Given a brief task idea, generate a professional, detailed task description with: clear requirements, deliverables, skills needed, and estimated budget (INR). Return JSON with: title, description, skills (array), budgetMin, budgetMax, deadline (days).`,
  chat: `You are SkillSwap AI Assistant, a helpful AI for a student freelance marketplace called SkillSwap Campus. You help students with: finding work, pricing their services, writing proposals, improving their profiles, understanding platform features, and general freelancing advice. Be friendly, concise, and practical. Use INR for currency. Keep responses under 200 words unless asked for more detail.`,
  review: `You are SkillSwap AI, a review analyzer. Given a freelancer's reviews, provide insights on strengths, areas for improvement, and overall sentiment. Return JSON with: strengths (array of strings), improvements (array of strings), sentiment (positive/neutral/negative), summary (2-3 sentences).`,
  price: `You are SkillSwap AI, a pricing advisor for a student freelance marketplace. Given a service type, skill level, and market context, suggest fair pricing in INR. Return JSON with: suggestedMin, suggestedMax, recommended, reasoning (2-3 sentences), marketTrend (rising/stable/falling).`,
};

async function callOpenAI(systemPrompt: string, userMessage: string, history?: { role: string; content: string }[]): Promise<string> {
  const messages = [
    { role: "system", content: systemPrompt },
    ...(history ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: userMessage },
  ];

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured. Please set the OPENAI_API_KEY secret." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: AIRequest = await req.json();
    const { action, context, message, history } = body;

    const systemPrompt = SYSTEM_PROMPTS[action];
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let userMessage = "";
    if (action === "chat") {
      userMessage = message ?? "";
    } else if (action === "match") {
      userMessage = `Match this freelancer to tasks:\nFreelancer skills: ${JSON.stringify(context?.skills ?? [])}\nFreelancer level: ${context?.level ?? 1}\nTasks: ${JSON.stringify(context?.tasks ?? [])}`;
    } else if (action === "suggest") {
      userMessage = `Suggest a gig for: Skill/Category: ${context?.skill ?? "general"}, Experience: ${context?.experience ?? "beginner"}, College: ${context?.college ?? "unknown"}`;
    } else if (action === "describe") {
      userMessage = `Generate a detailed task description for: ${context?.idea ?? message ?? "a general task"}`;
    } else if (action === "review") {
      userMessage = `Analyze these reviews: ${JSON.stringify(context?.reviews ?? [])}`;
    } else if (action === "price") {
      userMessage = `Suggest pricing for: Service: ${context?.service ?? "general"}, Level: ${context?.level ?? "beginner"}, Category: ${context?.category ?? "general"}`;
    }

    const result = await callOpenAI(systemPrompt, userMessage, action === "chat" ? history : undefined);

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = { text: result };
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
