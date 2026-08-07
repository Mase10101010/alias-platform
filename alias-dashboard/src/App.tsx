import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  LogOut,
  Menu,
} from 'lucide-react';
import {
  detectDefaultLanguage,
  languages,
  saveLanguage,
  type LanguageCode
} from '@/lib/i18n' ;
import { cyan } from '@/lib/data';
import { translations } from '@/lib/i18n';
import { VerifyEmail } from '@/pages/VerifyEmail';
import { Privacy } from '@/pages/Privacy';
import { Terms } from '@/pages/Terms';
import { Billing } from '@/pages/Billing';
import { TrialGate } from '@/pages/TrialGate';
import {
  dismissAISuggestion,
  getAISuggestions,
  getBillingStatus,
  getReservations,
  getRestaurants,
  markAISuggestionRead,
  type AISuggestionResponse,
  type ReservationResponse,
} from '@/lib/api';
import { AISuggestionsPanel } from '@/components/AISuggestionsPanel';
import { Sidebar } from '@/components/Sidebar';
import { Intelligence } from '@/pages/Intelligence';
import { AliasMark } from '@/components/Brand';
import { Auth } from '@/pages/Auth';
import { Overview } from '@/pages/Overview';
import { Onboarding } from '@/pages/Onboarding';
import { Reservations } from '@/pages/Reservations';
import { Settings } from '@/pages/Settings';
import { Availability } from '@/pages/Availability';
import { PublicConcierge } from '@/pages/PublicConcierge';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { Support } from './pages/Support';
import { WelcomeFlow } from '@/pages/WelcomeFlow';
import { Landing } from '@/pages/Landing';
import { Tables } from '@/pages/Tables';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function Page({ active }: { active: string }) {
  if (active === 'onboarding') return <Onboarding />;
  if (active === 'reservations') return <Reservations />;
  if (active === 'availability') return <Availability />;
  if (active === 'billing') return <Billing />
  if (active === 'support') return <Support />;
  if (active === 'settings') return <Settings />;
  if (active === 'tables') return <Tables />;
  if (active === 'intelligence') {
    return <Intelligence />;
  }
  return <Overview />;
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [hasRestaurant, setHasRestaurant] = useState(false);
  const [
    onboardingCompleted,
    setOnboardingCompleted,
  ] = useState(false);
  const [welcomeCompleted, setWelcomeCompleted] = useState(
    localStorage.getItem('alias_welcome_completed') === 'true',
  );
  const [checkingWorkspace, setCheckingWorkspace] = useState(true);
  const [active, setActive] = useState('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [restaurantName, setRestaurantName] = useState('Restaurant');
  const [
    aiSuggestions,
    setAISuggestions,
  ] = useState<AISuggestionResponse[]>([]);

  const [
    aiSuggestionReservations,
    setAISuggestionReservations,
  ] = useState<ReservationResponse[]>([]);

  const [
    aiSuggestionsOpen,
    setAISuggestionsOpen,
  ] = useState(false);

  const [
    loadingAISuggestions,
    setLoadingAISuggestions,
  ] = useState(false);

  const [
    dismissingSuggestionId,
    setDismissingSuggestionId,
  ] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>(
    detectDefaultLanguage(),
  );
  const t = translations[language];
  const isPublicConcierge = window.location.pathname === '/concierge';
  const isForgotPassword = window.location.pathname === '/forgot-password';
  const isResetPassword = window.location.pathname === '/reset-password';
  const isVerifyEmail = window.location.pathname === '/verify-email';
  const isPrivacy = window.location.pathname === '/privacy';
  const isTerms = window.location.pathname === '/terms';
  const [hasActiveBilling, setHasActiveBilling] = useState(false);
  const isAuthPage = window.location.pathname === '/auth';
  const unreadAISuggestions =
    aiSuggestions.filter(
      (suggestion) => !suggestion.is_read,
    ).length;

  const loadAISuggestions = useCallback(
    async (showLoading = false) => {
      if (!authed) {
        return;
      }

      try {
        if (showLoading) {
          setLoadingAISuggestions(true);
        }

        const [
          suggestionResponse,
          reservationResponse,
        ] = await Promise.all([
          getAISuggestions(20),
          getReservations({
            limit: 100,
          }),
        ]);

        setAISuggestions(
          suggestionResponse.suggestions,
        );

        setAISuggestionReservations(
          reservationResponse,
        );
      } catch (error) {
        console.error(
          'Failed to load AI suggestions',
          error,
        );
      } finally {
        if (showLoading) {
          setLoadingAISuggestions(false);
        }
      }
    },
    [authed],
  );
  

  if (isPublicConcierge) {
    return <PublicConcierge />
  }

  if (isForgotPassword) {
    return <ForgotPassword />;
  }

  if (isResetPassword) {
    return <ResetPassword />;
  }

  if (isVerifyEmail) {
    return <VerifyEmail />;
  }

  if (isPrivacy) {
    return <Privacy />;
  }

  if (isTerms) {
    return <Terms />;
  }

  useEffect(() => {
    async function verifySession() {
      const token = localStorage.getItem('alias_access_token');

      if (!token) {
        setAuthed(false);
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Invalid session');
        }
        
        const user = await response.json();

        setCurrentUser(user);
        localStorage.setItem('alias_user', JSON.stringify(user));

        setAuthed(true);

      } catch {
        localStorage.removeItem('alias_access_token');
        localStorage.removeItem('alias_user');
        setAuthed(false);
      } finally {
        setCheckingAuth(false);
      }
      try {
        const restaurantResponse = await fetch(
        `${API_BASE_URL}/api/v1/restaurants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (restaurantResponse.ok) {
        const restaurantData = await restaurantResponse.json();
        const restaurant = restaurantData[0];

        setHasRestaurant(Boolean(restaurant));

        setOnboardingCompleted(
          Boolean(restaurant?.onboarding_completed),
        );
      }
      
      try {
        const billingStatus = await getBillingStatus();

        setHasActiveBilling(
          billingStatus.subscription_status === 'active' ||
            billingStatus.subscription_status === 'lifetime',
        );
      } catch {
        setHasActiveBilling(false);
      }
    } finally {
      setCheckingWorkspace(false);
    }
      
    }

    verifySession();
  }, []);

  useEffect(() => {
    async function loadRestaurantName() {
      if (!authed) return;

      try {
        const restaurants = await getRestaurants();
        setRestaurantName(restaurants[0]?.name || 'Restaurant');
      } catch (error) {
        console.error('Failed to load restaurant name', error);
      }
    }

    loadRestaurantName();
  }, [authed]);

  useEffect(() => {
    if (!authed) {
      setAISuggestions([]);
      setAISuggestionReservations([]);
      return;
    }

    void loadAISuggestions(true);

    const intervalId = window.setInterval(
      () => {
        void loadAISuggestions();
      },
      30_000,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [authed, loadAISuggestions]);

  useEffect(() => {
    function handleSuggestionResolved(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<{
          suggestionId?: string;
        }>;

      const suggestionId =
        customEvent.detail?.suggestionId;

      if (!suggestionId) {
        return;
      }

      setAISuggestions((current) =>
        current.filter(
          (suggestion) =>
            suggestion.id !== suggestionId,
        ),
      );
    }

    window.addEventListener(
      'alias-ai-suggestion-resolved',
      handleSuggestionResolved,
    );

    return () => {
      window.removeEventListener(
        'alias-ai-suggestion-resolved',
        handleSuggestionResolved,
      );
    };
  }, []);

  useEffect(() => {
    function handleSuggestionCreated(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<{
          suggestion?: AISuggestionResponse;
        }>;

      const suggestion =
        customEvent.detail?.suggestion;

      if (suggestion) {
        setAISuggestions((current) => {
          const withoutDuplicate =
            current.filter(
              (item) =>
                item.id !== suggestion.id,
            );

          return [
            suggestion,
            ...withoutDuplicate,
          ];
        });
      }

      /*
      * Sincronizza subito lo stato con il backend.
      * Non aspetta il polling di 30 secondi.
      */
      void loadAISuggestions();
    }

    window.addEventListener(
      'alias-ai-suggestion-created',
      handleSuggestionCreated,
    );

    return () => {
      window.removeEventListener(
        'alias-ai-suggestion-created',
        handleSuggestionCreated,
      );
    };
  }, [loadAISuggestions]);

  async function handleOpenAISuggestions() {
    setAISuggestionsOpen(true);

    const unreadSuggestions =
      aiSuggestions.filter(
        (suggestion) => !suggestion.is_read,
      );

    if (unreadSuggestions.length === 0) {
      return;
    }

    setAISuggestions((current) =>
      current.map((suggestion) => ({
        ...suggestion,
        is_read: true,
      })),
    );

    await Promise.allSettled(
      unreadSuggestions.map((suggestion) =>
        markAISuggestionRead(
          suggestion.id,
        ),
      ),
    );
  }

  async function handleDismissAISuggestion(
    suggestion: AISuggestionResponse,
  ) {
    if (dismissingSuggestionId) {
      return;
    }

    try {
      setDismissingSuggestionId(
        suggestion.id,
      );

      await dismissAISuggestion(
        suggestion.id,
      );

      setAISuggestions((current) =>
        current.filter(
          (item) =>
            item.id !== suggestion.id,
        ),
      );
    } catch (error) {
      console.error(
        'Failed to dismiss AI suggestion',
        error,
      );
    } finally {
      setDismissingSuggestionId(null);
    }
  }

  async function handleReviewAISuggestion(
    suggestion: AISuggestionResponse,
  ) {
    if (!suggestion.is_read) {
      try {
        await markAISuggestionRead(
          suggestion.id,
        );
      } catch (error) {
        console.error(
          'Failed to mark AI suggestion as read',
          error,
        );
      }
    }

    sessionStorage.setItem(
      'alias_ai_suggestion_review',
      JSON.stringify(suggestion),
    );

    setAISuggestions((current) =>
      current.map((item) =>
        item.id === suggestion.id
          ? {
              ...item,
              is_read: true,
            }
          : item,
      ),
    );

    setAISuggestionsOpen(false);
    setActive('reservations');
  }

  function handleLogout() {
    localStorage.removeItem('alias_access_token');
    localStorage.removeItem('alias_user');
    localStorage.removeItem('alias_welcome_completed');

    setCurrentUser(null);
    setAuthed(false);
    setHasRestaurant(false);
    setOnboardingCompleted(false);
    setWelcomeCompleted(false);
    setActive('home');

    window.location.href = '/auth';
  }

  if (checkingAuth) {
    return (
      <main className="grain flex min-h-screen items-center justify-center bg-ink text-white">
        <div className="text-center">
          <AliasMark />
          <p className="mt-6 text-sm uppercase tracking-[.28em] text-white/35">
            Securing workspace
          </p>
        </div>
      </main>
    );
  }

  if (!authed && !isAuthPage) {
  return <Landing />;
}

if (!authed && isAuthPage) {
  return (
    <Auth 
      onEnter={() => {
        window.location.reload();
      }} 
    />
  );
}

  const storedUser = localStorage.getItem('alias_user');
  const parsedUser = currentUser ?? (storedUser ? JSON.parse(storedUser) : null);

  if (authed && parsedUser && !parsedUser.is_email_verified) {
    return (
      <div className="relative min-h-screen bg-ink text-white">
        <button
          type="button"
          onClick={handleLogout}
          className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[.16em] text-white/60 backdrop-blur transition hover:border-white/20 hover:bg-white/[.06] hover:text-white sm:right-6 sm:top-6"
        >
          <LogOut size={14} />
          Use another email
        </button>

        <WelcomeFlow
          requireEmailVerification
          initialStep={welcomeCompleted ? 1 : 0}
          onComplete={() => {
            window.location.reload();
          }}
        />
      </div>
    );
  }

  if (authed && checkingWorkspace) {
    return (
      <main className="grain flex min-h-screen items-center justify-center bg-ink text-white">
        <div className="text-center">
          <AliasMark />
          <p className="mt-6 text-sm uppercase tracking-[.28em] text-white/35">
            Loading Workspace
          </p>
        </div>
      </main>
    );
  }

  const hasSelectedLanguage = Boolean(localStorage.getItem('alias_language'));

  if (authed && !hasRestaurant && !hasSelectedLanguage) {
    return (
      <WelcomeFlow
        onComplete={() => {
          localStorage.setItem('alias_welcome_completed', 'true');
          setWelcomeCompleted(true)
        }}
      />
    );
  }

  if (authed && !hasRestaurant && hasSelectedLanguage && !hasActiveBilling) {
    return <TrialGate />;
  }

  if (
    authed &&
    hasSelectedLanguage &&
    hasActiveBilling &&
    (!hasRestaurant || !onboardingCompleted)
  ) {
    return (
      <Onboarding
        existingRestaurant={hasRestaurant}
        onComplete={() => {
          setHasRestaurant(true);
          setOnboardingCompleted(true);
          setActive('home');
        }}
      />
    );
  }
 

  return (
    <div className="grain min-h-screen overflow-x-hidden bg-ink text-white">
      <div
        className="fixed inset-0 -z-10 opacity-[.06]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(circle at 55% 20%, black, transparent 70%)',
        }}
      />

      <div className="fixed left-1/2 top-0 -z-10 h-[520px] w-[800px] -translate-x-1/2 rounded-full bg-cyanAlias/10 blur-3xl" />

      <div className="flex">
        <Sidebar 
          active={active} 
          setActive={setActive} 
          language={language}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          restaurantName={restaurantName}
        />

        <main className="min-h-screen min-w-0 flex-1 overflow-x-hidden px-4 py-5 sm:px-5 md:px-8 lg:px-10">
          <header className="mb-8 flex items-center justify-between rounded-2xl border border-white/[.06] bg-white/[.025] px-4 py-3">
            <div className="lg:hidden">
              <AliasMark />
            </div>

            <div className="hidden lg:block">
              <p className="text-xs uppercase tracking-[.24em] text-white/30">
                {t.dashboard}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  void handleOpenAISuggestions();
                }}
                className="relative flex items-center justify-center rounded-full border border-white/10 bg-white/[.03] p-2.5 text-white/55 transition hover:border-white/20 hover:text-white"
                aria-label="Open AI suggestions"
              >
                <Bell size={17} />

                {aiSuggestions.length > 0 && (
                  <span
                    className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-black"
                    style={{
                      background: cyan,
                    }}
                  >
                    {aiSuggestions.length > 99
                      ? '99+'
                      : aiSuggestions.length}
                  </span>
                )}

                {unreadAISuggestions > 0 && (
                  <span
                    className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-ink"
                    style={{
                      background: cyan,
                    }}
                  />
                )}
              </button>
              <select
                value={language}
                onChange={(event) => {
                  const nextLanguage = event.target.value as LanguageCode;

                  setLanguage(nextLanguage);
                  saveLanguage(nextLanguage);
                }}
                className="rounded-full border border-white/10 bg-white/[.03] px-4 py-2 text-xs uppercase tracking-[.18em] text-white/70 outline-none"
              >
                {languages.map((item) => (
                  <option
                    key={item.code}
                    value={item.code}
                    className="bg-[#050816]"
                  >
                    {item.shortLabel}
                  </option>
                ))}
              </select>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2 text-xs uppercase tracking-[.18em] text-white/50 transition hover:border-white/20 hover:text-white"
              >
                <LogOut size={14} />
                {t.logout}
              </button>
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-full border border-white/10 p-2 text-white/60 transition hover:text-white lg:hidden"
                >
                  <Menu size={18} />
                </button>
              
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45 }}
              className="mx-auto w-full max-w-7xl py-6"
            >
              <Page active={active} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <AISuggestionsPanel
        open={aiSuggestionsOpen}
        suggestions={aiSuggestions}
        reservations={
          aiSuggestionReservations
        }
        loading={loadingAISuggestions}
        dismissingId={
          dismissingSuggestionId
        }
        onClose={() =>
          setAISuggestionsOpen(false)
        }
        onReview={(suggestion) => {
          void handleReviewAISuggestion(
            suggestion,
          );
        }}
        onDismiss={(suggestion) => {
          void handleDismissAISuggestion(
            suggestion,
          );
        }}
      />
    </div>
  );
}