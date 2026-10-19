import { useEffect, useMemo, useRef,  useState } from 'react';
import { AudioLines, CheckCircle2, Mic, Send, Sparkles, ShieldCheck, Square, X } from 'lucide-react';
import {
  detectDefaultLanguage,
  translations,
} from '@/lib/i18n';

import { cyan } from '@/lib/data';
import { 
  sendPublicChatMessage,
  getPublicRestaurant,
  type PublicRestaurantResponse,
} from '@/lib/api';

type SupportedLanguage = keyof typeof translations;

type Message = {
  role: 'guest' | 'concierge' | 'confirmation';
  content: string;
  reservationId?: string;
  reservationStatus?: string | null;
  modificationStatus?: string | null;
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
  const reservationAccessTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('reservation_access_token');

    if (accessToken) {
      reservationAccessTokenRef.current = accessToken;
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  const restaurantSlug = useMemo(() => getRestaurantSlug(), []);
  const restaurantName = useMemo(
    () => formatRestaurantName(restaurantSlug),
    [restaurantSlug],
  );
  const [language, setLanguage] = useState<SupportedLanguage>(
    detectDefaultLanguage() as SupportedLanguage,
  );
  const t = translations[language];
  const [restaurant, setRestaurant] = useState<PublicRestaurantResponse | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [publicSessionToken, setPublicSessionToken] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceClosing, setVoiceClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const voiceBaseInputRef = useRef('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const finalTranscriptRef = useRef('')
  

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'concierge',
      content: t.publicWelcome.replace(
        '{restaurantName}',
        restaurantName,
      ),
    },
  ]);

  useEffect(() => {
    async function loadPublicRestaurant() {
      try {
        const restaurant = await getPublicRestaurant(restaurantSlug);
        setRestaurant(restaurant);
        const restaurantLanguage = (
          restaurant.preferred_language || detectDefaultLanguage()
        ) as SupportedLanguage;

        setLanguage(restaurantLanguage);

        setMessages((current) =>
          current.length === 1 && current[0].role === 'concierge'
            ? [{
                role: 'concierge',
                content: translations[restaurantLanguage].publicWelcome.replace(
                  '{restaurantName}',
                  restaurant.name,
                ),
              }]
            : current,
        );
      } catch (error) {
        console.error('Failed to load public restaurant', error);
      }
    }

    loadPublicRestaurant();
  }, [restaurantSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, loading]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = '0px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [input]);

  async function sendMessage(message?: string) {
    const userMessage = (message ?? input).trim();
    if (!userMessage || loading || quickActionStage === 'finished') return;
    setQuickActionStage('hidden');

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
        publicSessionToken,
        reservationAccessTokenRef.current,
      );

      if (!sessionId && !response.public_session_token) {
        throw new Error('Public chat session token missing from server response');
      }

      setSessionId(response.session_id);

      if (response.public_session_token) {
        setPublicSessionToken(response.public_session_token);
      }

      setMessages((current) => [
        ...current,
        {
          role: 'concierge',
          content: response.reply,
        },
        ...(response.reservation_id
          ? [
              {
                role: 'confirmation' as const,
                content: 'Your reservation has been recorded successfully.',
                reservationId: response.reservation_id,
                reservationStatus: response.reservation_status ?? null,
                modificationStatus: response.modification_status ?? null,
              },
            ]
          : []),
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


  function handleSend() {
    void sendMessage();
  }

  function handleBookAction() {
    void sendMessage(
      language === 'it' ? 'Vorrei prenotare un tavolo.' :
      language === 'es' ? 'Quisiera reservar una mesa.' :
      language === 'fr' ? 'Je voudrais réserver une table.' :
      language === 'de' ? 'Ich möchte einen Tisch reservieren.' :
      'I would like to book a table.',
    );
  }

  const [quickActionStage, setQuickActionStage] = useState<
    'initial' | 'followup' | 'finished' | 'hidden'
  >('initial');

  function handleInfoAction() {
    if (!restaurant || loading) return;

    const details = [
      t.quickInfoIntro.replace('{restaurantName}', restaurant.name),
      restaurant.phone ? `${t.quickPhone}: ${restaurant.phone}` : null,
      restaurant.email ? `${t.quickEmail}: ${restaurant.email}` : null,
    ].filter(Boolean).join('\n\n');

    setMessages((current) => [
      ...current,
      { role: 'concierge', content: details },
      { role: 'concierge', content: t.quickFriendlyNext },
    ]);
    setQuickActionStage('followup');
  }

  function handleHoursAction() {
    if (!restaurant || loading) return;

    const schedule = restaurant.weekly_schedule || [];
    const hours = schedule.map((day) => {
      if (day.is_open === false || day.isOpen === false) {
        return `${day.day}: ${t.quickClosed}`;
      }

      const sessions = day.sessions || [];
      if (sessions.length > 0) {
        return `${day.day}: ${sessions.map((session) =>
          `${session.start}–${session.end}`
        ).join(' / ')}`;
      }

      const start = day.opening_hour || day.openingHour;
      const end = day.closing_hour || day.closingHour;
      return `${day.day}: ${start && end ? `${start}–${end}` : t.quickNotAvailable}`;
    });

    const closures = (restaurant.special_closures || []).map(
      (closure) => `${closure.date}: ${closure.reason}`,
    );

    const content = [
      t.quickHoursIntro,
      hours.length ? hours.join('\n') : t.quickNotAvailable,
      ...(closures.length
        ? ['', t.quickSpecialClosures, ...closures]
        : []),
    ].join('\n\n');

    setMessages((current) => [
      ...current,
      { role: 'concierge', content },
      { role: 'concierge', content: t.quickFriendlyNext },
    ]);
    setQuickActionStage('followup');
  }

  function handleFinishAction() {
    if (loading || quickActionStage === 'finished') return;

    setMessages((current) => [
      ...current,
      {
        role: 'concierge',
        content: t.quickGoodbye.replace(
          '{restaurantName}',
          restaurant?.name || restaurantName,
        ),
      },
    ]);
    setQuickActionStage('finished');
  }

  function handleRestartAction() {
    if (loading) return;

    setSessionId(null);
    setPublicSessionToken(null);
    reservationAccessTokenRef.current = null;
    setInput('');
    setMessages([
      {
        role: 'concierge',
        content: t.publicWelcome.replace(
          '{restaurantName}',
          restaurant?.name || restaurantName,
        ),
      },
    ]);
    setQuickActionStage('initial');
  }

  function handleVoiceInput() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice input is not supported on this browser.');
      return;
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;
    voiceBaseInputRef.current = input.trim();
    finalTranscriptRef.current = '';

    recognition.lang =
      language === 'it'
        ? 'it-IT'
        : language === 'fr'
          ? 'fr-FR'
          : language === 'es'
            ? 'es-ES'
            : language === 'de'
              ? 'de-DE'
              : 'en-US';

    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    setListening(true);
    

    recognition.onresult = (event: any) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcriptPart = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscriptRef.current += ` ${transcriptPart}`;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      const fullTranscript = `${finalTranscriptRef.current} ${interimTranscript}`
        .replace(/\s+/g, ' ')
        .trim();

      setInput(
        voiceBaseInputRef.current
          ? `${voiceBaseInputRef.current} ${fullTranscript}`.trim()
          : fullTranscript,
      );
    };

    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  }

  function finishVoiceUi(callback?: () => void) {
    setVoiceClosing(true);
    setListening(false);

    window.setTimeout(() => {
      setVoiceClosing(false);
      callback?.();
    }, 260);
  }

  function stopVoiceInput() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;

    finishVoiceUi();
  }

  function cancelVoiceInput() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;

    finishVoiceUi(() => {
      setInput(voiceBaseInputRef.current);
    });
  }

  function sendWhileListening() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;

    finishVoiceUi(() => {
      handleSend();
    });
}


  const voiceActive = listening || voiceClosing;

  return (
    <main className="grain relative flex min-h-screen items-center justify-center bg-ink px-4 py-8 text-white">
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
              {t.publicReserveTitle}
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
            {t.publicLiveAI}
          </div>
        </div>

        <div className="glass flex h-[640px] flex-col rounded-3xl p-5 shadow-2xl">
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.025] px-4 py-3 text-xs text-white/42">
            <ShieldCheck size={15} style={{ color: cyan }} />
            {t.publicSecure}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {messages.map((message, index) => {
              if (message.role === 'confirmation') {
                const isPendingModification =
                  message.modificationStatus === 'pending';

                const title = isPendingModification
                  ? t.publicReservationPending
                  : t.publicReservationConfirmed;

                const description = (
                  isPendingModification
                    ? t.publicBookingPending
                    : t.publicBookingRegistered
                ).replace('{restaurantName}', restaurantName);

                return (
                  <div key={index} className="flex justify-start">
                    <div
                      className="w-full rounded-3xl border px-5 py-5"
                      style={{
                        borderColor: `${cyan}30`,
                        background: `${cyan}10`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {isPendingModification ? (
                          <ShieldCheck size={22} style={{ color: cyan }} />
                        ) : (
                          <CheckCircle2 size={22} style={{ color: cyan }} />
                        )}

                        <div>
                          <p className="font-display text-2xl font-light text-white">
                            {title}
                          </p>

                          <p className="mt-1 text-sm text-white/50">
                            {description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[.22em] text-white/35">
                          {t.publicReservationId}
                        </p>

                        <p className="mt-2 break-all font-mono text-xs text-white/70">
                          {message.reservationId}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              const isGuest = message.role === 'guest';

              return (
                <div
                  key={index}
                  className={`flex ${
                    isGuest ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className="max-w-[80%] rounded-3xl px-5 py-4 text-sm leading-6 whitespace-pre-line"
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
                <div className="rounded-3xl bg-white/[.055] px-5 py-4 text-sm">
                  <span className="ai-thinking-shimmer">
                    {t.publicChecking}
                  </span> 
                </div>
              </div>
            )}
            {quickActionStage !== 'hidden' && (
                <div className="flex flex-wrap gap-2">
                  {(
                    quickActionStage === 'initial'
                      ? [
                          { label: t.quickBook, action: handleBookAction },
                          { label: t.quickInfo, action: handleInfoAction },
                          { label: t.quickHours, action: handleHoursAction },
                        ]
                      : quickActionStage === 'followup'
                        ? [
                            { label: t.quickBook, action: handleBookAction },
                            { label: t.quickFinish, action: handleFinishAction },
                          ]
                        : [
                            { label: t.quickRestart, action: handleRestartAction },
                          ]
                  ).map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={item.action}
                      disabled={loading}
                      className="rounded-full border border-white/15 bg-white/[.055] px-4 py-2.5 text-xs text-white/80 transition hover:border-cyanAlias/50 hover:bg-cyanAlias/10 hover:text-white disabled:opacity-40"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {quickActionStage === 'initial' && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSend();
                  }}
                  className="mt-4 flex items-center gap-2 rounded-full border border-white/15 bg-white/[.055] px-3 py-2 transition focus-within:border-cyanAlias/50 focus-within:bg-white/[.075]"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    disabled={loading}
                    placeholder={
                      language === 'it' ? 'Chiedi qualsiasi cosa...' :
                      language === 'es' ? 'Pregunta lo que quieras...' :
                      language === 'fr' ? 'Posez votre question...' :
                      language === 'de' ? 'Stelle eine Frage...' :
                      'Ask me anything...'
                    }
                    aria-label="Ask the concierge a question"
                    className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/35"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black transition disabled:opacity-35"
                    style={{ background: cyan }}
                  >
                    <Send size={16} />
                  </button>
                </form>
              )}

              <div ref={messagesEndRef} />
          </div>
          
          {voiceActive && (
            <div className="mb-3 flex items-center gap-3 rounded-2xl border border-cyanAlias/20 bg-cyanAlias/10 px-4 py-3 text-xs text-white/55">
              <AudioLines size={16} style={{ color: cyan }} />

              <span className="uppercase tracking-[.22em]">
                Listening
              </span>

              <div className="ml-auto flex items-end gap-1">
                {[10, 16, 22, 14, 18].map((height, index) => (
                  <span
                    key={index}
                    className="voice-wave-bar"
                    style={{
                      height,
                      animationDelay: `${index * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div
            className={`mt-5 flex items-end gap-3 rounded-2xl border p-3 transition-all duration-300 ${
              quickActionStage === 'initial' ? 'hidden' : ''
            } ${
              voiceActive
                ? 'border-cyanAlias/30 bg-white/[.045] shadow-[0_0_35px_rgba(92,242,255,0.12)]'
                : 'border-white/10 bg-white/[.03]'
            }`}
          >
            <div className="relative min-h-[44px] flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                disabled={quickActionStage === 'finished'}
                rows={1}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();

                    if (listening) {
                      sendWhileListening();
                    } else {
                      handleSend();
                    }
                  }
                }}
                placeholder={t.publicPlaceholder}
                className={`max-h-[120px] min-h-[44px] w-full resize-none bg-transparent px-3 py-3 text-sm leading-5 outline-none transition-all duration-200 placeholder:text-white/30 ${
                  listening ? 'opacity-0' : 'text-white'
                }`}
              />

              {voiceActive && (
                <div className="pointer-events-none absolute inset-0 max-h-[120px] overflow-y-auto px-3 py-3 text-sm leading-5 text-white/55">
                  {input || t.publicPlaceholder}
                  <span className="voice-inline-caret">|</span>
                </div>
              )}
            </div>

            
            {voiceActive && (
              <button
                type="button"
                onClick={cancelVoiceInput}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[.04] text-white/45 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="button"
              onClick={listening ? stopVoiceInput : handleVoiceInput}
              disabled={loading || quickActionStage === 'finished'}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition disabled:opacity-60 ${
                voiceActive
                  ? 'border-cyanAlias/30 bg-cyanAlias/10 text-white shadow-[0_0_28px_rgba(92,242,255,0.22)]'
                  : 'border-white/10 bg-white/[.04] text-white/55 hover:text-white'
              }`}
            >
              {voiceActive && (
                <span className="absolute inset-0 rounded-full animate-ping bg-cyanAlias/20" />
              )}

              <span className="relative z-10">
                {voiceActive ? (
                  <Square size={15} style={{ color: cyan }} />
                ) : (
                  <Mic size={17} />
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={listening ? sendWhileListening : handleSend}
              disabled={loading || quickActionStage === 'finished'}
              className="flex h-11 w-11 items-center justify-center rounded-full text-black disabled:opacity-60"
              style={{ background: cyan }}
            >
              {loading ? '...' : <Send size={17} />}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-white/35">
          {t.publicPoweredBy}
        </p>
      </div>
    </main>
  );
}