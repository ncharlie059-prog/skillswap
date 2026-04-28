const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

type AIAction = 'match' | 'suggest' | 'describe' | 'chat' | 'review' | 'price';

interface AIResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
}

export async function callAI<T = unknown>(
  action: AIAction,
  context?: Record<string, unknown>,
  message?: string,
  history?: { role: string; content: string }[]
): Promise<AIResponse<T>> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, context, message, history }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, data: null as T, error: result.error || 'AI request failed' };
    }

    return { success: true, data: result.data as T };
  } catch (err) {
    return { success: false, data: null as T, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export interface MatchResult {
  taskId: string;
  score: number;
  reason: string;
}

export interface GigSuggestion {
  title: string;
  description: string;
  priceMin: number;
  priceMax: number;
  deliveryDays: number;
  tags: string[];
}

export interface TaskDescription {
  title: string;
  description: string;
  skills: string[];
  budgetMin: number;
  budgetMax: number;
  deadline: number;
}

export interface ReviewInsight {
  strengths: string[];
  improvements: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
}

export interface PriceSuggestion {
  suggestedMin: number;
  suggestedMax: number;
  recommended: number;
  reasoning: string;
  marketTrend: 'rising' | 'stable' | 'falling';
}

export const aiMatch = (skills: string[], level: number, tasks: unknown[]) =>
  callAI<MatchResult[]>('match', { skills, level, tasks });

export const aiSuggestGig = (skill: string, experience: string, college: string) =>
  callAI<GigSuggestion>('suggest', { skill, experience, college });

export const aiDescribeTask = (idea: string) =>
  callAI<TaskDescription>('describe', { idea });

export const aiChat = (message: string, history: { role: string; content: string }[]) =>
  callAI<{ text: string }>('chat', undefined, message, history);

export const aiReviewInsight = (reviews: unknown[]) =>
  callAI<ReviewInsight>('review', { reviews });

export const aiPriceSuggestion = (service: string, level: string, category: string) =>
  callAI<PriceSuggestion>('price', { service, level, category });
