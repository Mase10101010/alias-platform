import { useMemo, useState } from 'react';
import { Send, Sparkles, ShieldCheck } from 'lucide-react';

import { cyan } from '@/lib/data';
import { sendPublicChatMessage } from '@/lib/api';

type Message = {
  role: 'guest' | 'concierge';
  content: string;
};

function getRestaurantSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('restaurant') || 'alias-demo';
}

function formatRestaurantName(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function PublicConcierge() {
  const restaurantSlug = useMemo(() => getRestaurantSlug(), []);
  const restaurantName = useMemo(
    () => formatRestaurantName(restaurantSlug),
    [restaurantSlug],
  );

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'concierge',
      content: `Good evening. I am the AI Concierge for ${restaurantName}. I can help you reserve a table, check availability, or share special requests with the team.`,
    },
  ]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((current) => [
      ...current,
      {
        role: 'guest',
        content: userMessage,
      },
    ]);

    setInput('');
    setLoading(true);

    try {
      const response = await sendPublicChatMessage(
        restaurantSlug,
        userMessage,
        sessionId,
      );

      setSessionId(response.session_id);

      setMessages((current) => [
        ...current,
        {
          role: 'concierge',
          content: response.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          role: 'concierge',
          content:
            'Sorry, I am having trouble connecting right now. Please try again shortly or contact the restaurant directly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 py-8 text-white">
      <div
        className="absolute left-1/2 top-0 h-[420px] w-[680px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `${cyan}12` }}
      />

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.28em]"
              style={{ color: cyan }}
            >
              Alias Concierge
            </p>

            <h1 className="mt-2 font-display text-3xl font-light tracking-[-.04em]">
              {restaurantName}
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Reserve your table with the restaurant’s AI concierge.
            </p>
          </div>

          <div
            className="flex items-center gap-2 rounded-full px-3 py-2 text-xs"
            style={{
              color: cyan,
              background: `${cyan}12`,
            }}
          >
            <Sparkles size={14} />
            Live AI
          </div>
        </div>

        <div className="glass flex h-[640px] flex-col rounded-3xl p-5 shadow-2xl">
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.025] px-4 py-3 text-xs text-white/42">
            <ShieldCheck size={15} style={{ color: cyan }} />
            Your booking details are sent securely to the restaurant team.
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {messages.map((message, index) => {
              const isGuest = message.role === 'guest';

              return (
                <div
                  key={index}
                  className={`flex ${
                    isGuest ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className="max-w-[80%] rounded-3xl px-5 py-4 text-sm leading-6"
                    style={{
                      background: isGuest ? cyan : 'rgba(255,255,255,.055)',
                      color: isGuest ? '#050707' : 'rgba(255,255,255,.84)',
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-3xl bg-white/[.055] px-5 py-4 text-sm text-white/50">
                  Alias is checking availability…
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSend();
                }
              }}
              placeholder="Example: table for 2 tomorrow at 8pm"
              className="flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/30"
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="flex h-11 w-11 items-center justify-center rounded-full text-black disabled:opacity-60"
              style={{ background: cyan }}
            >
              {loading ? '...' : <Send size={17} />}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-white/35">
          Powered by Alias Concierge AI
        </p>
      </div>
    </main>
  );
}