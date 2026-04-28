import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Lightbulb, Loader2, ChevronDown } from 'lucide-react';
import { aiChat } from '../../lib/ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'How should I price my gig?',
  'Help me write a proposal',
  'Tips to improve my profile',
  'What skills are in demand?',
  'How to get my first order?',
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m SkillSwap AI. I can help you find work, price your services, write proposals, and more. What would you like help with?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const result = await aiChat(text.trim(), history);

      if (result.success && result.data) {
        const content = typeof result.data === 'object' && 'text' in result.data
          ? (result.data as { text: string }).text
          : JSON.stringify(result.data);
        setMessages(prev => [...prev, { role: 'assistant', content }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: result.error || 'Sorry, I couldn\'t process that. Please try again.',
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please try again in a moment.',
      }]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
        >
          <Bot className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">SkillSwap AI</h3>
                <p className="text-[10px] text-emerald-100">Your freelance assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl rounded-bl-sm">
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    <span className="text-xs text-slate-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex items-center gap-1 mb-2">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Quick prompts</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-700">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Inline AI widgets for embedding in pages ──────────────────────── */

export function AIGigSuggestor({ onApply }: { onApply: (suggestion: { title: string; description: string; priceMin: number; priceMax: number; deliveryDays: number; tags: string[] }) => void }) {
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; description: string; priceMin: number; priceMax: number; deliveryDays: number; tags: string[] } | null>(null);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!skill.trim()) return;
    setLoading(true);
    setError('');
    const res = await aiChat(`Suggest a gig listing for the skill: ${skill}. Return JSON with: title, description, priceMin, priceMax, deliveryDays, tags (array).`, []);
    try {
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (data?.title) {
        setResult(data);
      } else {
        setError('Could not generate suggestion. Try a different skill.');
      }
    } catch {
      setError('Could not parse AI response. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-emerald-500" />
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">AI Gig Suggestor</h3>
      </div>
      <div className="flex gap-2 mb-3">
        <input
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Enter a skill (e.g., React, Logo Design)"
          className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <button
          onClick={generate}
          disabled={loading || !skill.trim()}
          className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Generate
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      {result && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <h4 className="font-semibold text-sm text-emerald-800 dark:text-emerald-300 mb-1">{result.title}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{result.description}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {result.tags?.map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">{tag}</span>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>INR {result.priceMin} - {result.priceMax}</span>
            <span>{result.deliveryDays} days delivery</span>
          </div>
          <button
            onClick={() => onApply(result)}
            className="mt-2 w-full py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Use This Suggestion
          </button>
        </div>
      )}
    </div>
  );
}

export function AITaskDescriber({ onApply }: { onApply: (desc: { title: string; description: string; skills: string[]; budgetMin: number; budgetMax: number; deadline: number }) => void }) {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; description: string; skills: string[]; budgetMin: number; budgetMax: number; deadline: number } | null>(null);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError('');
    const res = await aiChat(`Generate a detailed task description for: ${idea}. Return JSON with: title, description, skills (array), budgetMin, budgetMax, deadline (days).`, []);
    try {
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (data?.title) {
        setResult(data);
      } else {
        setError('Could not generate description. Try being more specific.');
      }
    } catch {
      setError('Could not parse AI response. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-emerald-500" />
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">AI Task Describer</h3>
      </div>
      <div className="flex gap-2 mb-3">
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your task idea briefly..."
          className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <button
          onClick={generate}
          disabled={loading || !idea.trim()}
          className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Generate
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      {result && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <h4 className="font-semibold text-sm text-emerald-800 dark:text-emerald-300 mb-1">{result.title}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{result.description}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {result.skills?.map((s: string) => (
              <span key={s} className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">{s}</span>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Budget: INR {result.budgetMin} - {result.budgetMax}</span>
            <span>Deadline: {result.deadline} days</span>
          </div>
          <button
            onClick={() => onApply(result)}
            className="mt-2 w-full py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Use This Description
          </button>
        </div>
      )}
    </div>
  );
}

export function AIPriceAdvisor() {
  const [service, setService] = useState('');
  const [level, setLevel] = useState('beginner');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ suggestedMin: number; suggestedMax: number; recommended: number; reasoning: string; marketTrend: string } | null>(null);
  const [error, setError] = useState('');

  const getAdvice = async () => {
    if (!service.trim()) return;
    setLoading(true);
    setError('');
    const res = await aiChat(`Suggest pricing for: Service: ${service}, Level: ${level}, Category: ${category || 'general'}. Return JSON with: suggestedMin, suggestedMax, recommended, reasoning, marketTrend.`, []);
    try {
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (data?.recommended) {
        setResult(data);
      } else {
        setError('Could not get pricing advice. Try a different service.');
      }
    } catch {
      setError('Could not parse AI response. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-emerald-500" />
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">AI Price Advisor</h3>
      </div>
      <div className="space-y-2 mb-3">
        <input
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="Service (e.g., Logo Design, React App)"
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <div className="flex gap-2">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
        <button
          onClick={getAdvice}
          disabled={loading || !service.trim()}
          className="w-full py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Get Pricing Advice
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      {result && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
          <div className="text-center mb-2">
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">INR {result.recommended}</span>
            <p className="text-[10px] text-slate-500">Recommended Price</p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
            <span>Range: INR {result.suggestedMin} - {result.suggestedMax}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              result.marketTrend === 'rising' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              result.marketTrend === 'falling' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}>
              {result.marketTrend}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">{result.reasoning}</p>
        </div>
      )}
    </div>
  );
}

export function AIMatchIndicator({ score, reason }: { score: number; reason: string }) {
  const color = score >= 80 ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' :
    score >= 60 ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' :
    'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400';

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${color}`}>
      <Sparkles className="w-3 h-3" />
      <span>{score}% match</span>
      <ChevronDown className="w-3 h-3" />
      <span className="sr-only">{reason}</span>
    </div>
  );
}
