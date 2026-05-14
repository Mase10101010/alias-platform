import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

import { cyan } from '@/lib/data';
import { sendChatMessage } from '@/lib/api';

type Message = {
  role: 'guest' | 'concierge';
  content: string;
};

export function Concierge() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'concierge',
      content:
        'Good evening. I am Alias Concierge. I can help guests with reservations, availability, and service requests.',
    },
  ]);

  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      const response = await sendChatMessage(userMessage, sessionId);

      setSessionId(response.session_id);

      setMessages((current) => [
        ...current,
        {
          role: 'concierge',
          content: response.reply,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'concierge',
          content:
            'Sorry, something went wrong while contacting the AI service.',
        },
      ]);

      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.28em]"
            style={{ color: cyan }}
          >
            Concierge AI
          </p>

          <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
            Guest conversation layer.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
            This is the future customer-facing concierge that will take bookings
            and service requests automatically.
          </p>
        </div>

        <div
          className="flex items-center gap-3 rounded-full px-4 py-3 text-sm"
          style={{
            color: cyan,
            background: `${cyan}12`,
          }}
        >
          <Sparkles size={16} />
          AI live connection
        </div>
      </div>

      <div className="glass mt-10 flex h-[620px] flex-col rounded-3xl p-6">
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {messages.map((message, index) => {
            const isGuest = message.role === 'guest';

            return (
              <div
                key={index}
                className={`flex ${isGuest ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[75%] rounded-3xl px-5 py-4 text-sm leading-6"
                  style={{
                    background: isGuest ? cyan : 'rgba(255,255,255,.045)',
                    color: isGuest ? '#050707' : 'rgba(255,255,255,.82)',
                  }}
                >
                  {message.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-3xl bg-white/[.045] px-5 py-4 text-sm text-white/50">
                Alias is thinking…
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSend();
              }
            }}
            placeholder="Ask Alias Concierge for a table..."
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
    </div>
  );
}