import {
  BrainCircuit,
  CheckCircle2,
  Eye,
  Gauge,
  Lightbulb,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getIntelligenceSnapshot,
  getRestaurants,
  type IntelligenceInsight,
  type IntelligenceSnapshotResponse,
} from '@/lib/api';

import {
  detectDefaultLanguage,
  translations,
} from '@/lib/i18n';


function percentage(value: number) {
  return `${Math.round(value * 100)}%`;
}


function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5">
      <p className="text-xs uppercase tracking-[.18em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold text-white">
        {value}
      </p>

      {detail && (
        <p className="mt-1 text-sm text-white/40">
          {detail}
        </p>
      )}
    </div>
  );
}


export function Intelligence() {
  const [
    snapshot,
    setSnapshot,
  ] = useState<IntelligenceSnapshotResponse | null>(
    null,
  );

  const language = detectDefaultLanguage();
  const t = translations[language];

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  function translatePreferredPlan(
  value: string,
) {
  const labels: Record<string, string> = {
    unknown: t.intelligenceUnknown,
    single_move: t.intelligenceSingleMove,
    multi_move: t.intelligenceMultiMove,
    low_seat_waste: t.intelligenceLowSeatWaste,
    flexible: t.intelligenceFlexible,
  };

  return labels[value] ?? value;
}

function translateTrust(
  value: string,
) {
  const labels: Record<string, string> = {
    unknown: t.intelligenceUnknown,
    developing: t.intelligenceDeveloping,
    low: t.intelligenceLow,
    medium: t.intelligenceMedium,
    high: t.intelligenceHigh,
  };

  return labels[value] ?? value;
}

function translateInsight(
  insight: IntelligenceInsight,
) {
  if (insight.code === 'manager_trust') {
    const trust = String(
      insight.value ?? 'unknown',
    );

    const descriptions: Record<
      string,
      string
    > = {
      unknown:
        t.intelligenceInsightManagerTrustUnknown,
      developing:
        t.intelligenceInsightManagerTrustDeveloping,
      low:
        t.intelligenceInsightManagerTrustLow,
      medium:
        t.intelligenceInsightManagerTrustMedium,
      high:
        t.intelligenceInsightManagerTrustHigh,
    };

    return {
      title:
        t.intelligenceInsightManagerTrustTitle,
      description:
        descriptions[trust]
        ?? t.intelligenceInsightManagerTrustUnknown,
    };
  }

  if (
    insight.code
    === 'accepted_score_reference'
  ) {
    return {
      title:
        t.intelligenceInsightAcceptedScoreTitle,
      description:
        t.intelligenceInsightAcceptedScoreDescription
          .replace(
            '{value}',
            String(insight.value ?? '—'),
          ),
    };
  }

  if (
    insight.code
    === 'preferred_plan_structure'
  ) {
    const plan = String(
      insight.value ?? 'unknown',
    );

    const descriptions: Record<
      string,
      string
    > = {
      single_move:
        t.intelligenceInsightPreferredPlanSingle,
      multi_move:
        t.intelligenceInsightPreferredPlanMulti,
      low_seat_waste:
        t.intelligenceInsightPreferredPlanLowWaste,
      flexible:
        t.intelligenceInsightPreferredPlanFlexible,
    };

    return {
      title:
        t.intelligenceInsightPreferredPlanTitle,
      description:
        descriptions[plan]
        ?? t.intelligenceInsightPreferredPlanFlexible,
    };
  }

  if (
    insight.code
    === 'expired_suggestions'
  ) {
    return {
      title:
        t.intelligenceInsightExpiredTitle,
      description:
        t.intelligenceInsightExpiredDescription
          .replace(
            '{value}',
            String(insight.value ?? 0),
          ),
    };
  }

  if (
    insight.code === 'low_review_rate'
  ) {
    return {
      title:
        t.intelligenceInsightLowReviewRateTitle,
      description:
        t.intelligenceInsightLowReviewRateDescription,
    };
  }

  if (
    insight.code === 'low_review_rate'
  ) {
    return {
      title:
        t.intelligenceInsightLowReviewRateTitle,
      description:
        t.intelligenceInsightLowReviewRateDescription,
    };
  }

  return {
    title: insight.title,
    description: insight.description,
  };
}

function translateAutomationRequirement(
  code: string,
  fallback: string,
) {
  const labels: Record<string, string> = {
    behaviour_confidence_above_low:
      t.intelligenceRequirementBehaviourConfidence,
    calibration_data_sufficient:
      t.intelligenceRequirementCalibrationData,
    manager_trust_high:
      t.intelligenceRequirementManagerTrustHigh,
    behaviour_confidence_high:
      t.intelligenceRequirementBehaviourConfidenceHigh,
    calibration_well_calibrated:
      t.intelligenceRequirementCalibrationWellCalibrated,
    automation_eligibility_reached:
      t.intelligenceRequirementAutomationReached,
  };

  return labels[code] ?? fallback;
}

function translateAutomation(
  value: string,
) {
  const labels: Record<string, string> = {
    advisory_only:
      t.intelligenceAdvisoryOnly,
    assisted:
      t.intelligenceAssisted,
    eligible_for_automation:
      t.intelligenceEligibleAutomation,
  };

  return labels[value] ?? value;
}

  const [
    error,
    setError,
  ] = useState<string | null>(null);


  const loadSnapshot = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const restaurants = await getRestaurants();
        const restaurant = restaurants[0];

        if (!restaurant) {
          throw new Error(
            'No restaurant workspace is available.',
          );
        }

        const result =
          await getIntelligenceSnapshot(
            restaurant.id,
          );

        setSnapshot(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load Alias Intelligence.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );


  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);


  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <BrainCircuit
            className="mx-auto animate-pulse text-cyan-300"
            size={34}
          />

          <p className="mt-4 text-sm text-white/45">
            {t.intelligenceLoading}
          </p>
        </div>
      </div>
    );
  }


  if (error || !snapshot) {
    return (
      <div className="rounded-3xl border border-red-400/15 bg-red-400/[.04] p-8">
        <p className="text-lg font-medium text-white">
          {t.intelligenceUnavailable}
        </p>

        <p className="mt-2 text-sm text-white/45">
          {error ??
            t.intelligenceUnavailableDescription}
        </p>

        <button
          type="button"
          onClick={() => {
            void loadSnapshot();
          }}
          className="mt-6 rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/70 transition hover:border-white/25 hover:text-white"
        >
          {t.intelligenceTryAgain}
        </button>
      </div>
    );
  }


  const {
    learning,
    behaviour,
    policy,
    calibration,
  } = snapshot;

  const calibrationGapPercent = Math.round(
    calibration.calibration_gap * 100,
  );

  const calibrationGapLabel =
    calibrationGapPercent > 0
      ? `+${calibrationGapPercent}%`
      : `${calibrationGapPercent}%`;

  const confidencePercent =
    Math.round(
      learning.confidence_score * 100,
    );

  const automationLabel = policy
    ? translateAutomation(
        policy.automation_level,
        )
    : t.intelligenceLearning;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.025]">
        <div className="relative p-7 sm:p-9">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[.2em] text-cyan-300/70">
                <Sparkles size={14} />
                {t.intelligenceEyebrow}
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {t.intelligenceTitle}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
                {t.intelligenceDescription}
              </p>
            </div>

            <button
              type="button"
              disabled={refreshing}
              onClick={() => {
                void loadSnapshot(true);
              }}
              className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2.5 text-xs uppercase tracking-[.16em] text-white/55 transition hover:border-white/20 hover:text-white disabled:opacity-40"
            >
              <RefreshCw
                size={14}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />
              {t.intelligenceRefresh}
            </button>
          </div>
        </div>
      </section>


      <section>
        <div className="mb-4 flex items-center gap-2">
          <Gauge
            size={18}
            className="text-cyan-300"
          />

          <h2 className="text-lg font-medium text-white">
            {t.intelligenceLearning}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label={t.intelligenceSuggestionsObserved}
            value={String(
                learning.suggestions_observed,
            )}
            detail={`${learning.manager_decisions} ${
                learning.manager_decisions === 1
                ? t.intelligenceManagerDecision
                : t.intelligenceManagerDecisions
            }`}
            />

          <Metric
            label={t.intelligenceAcceptanceRate}
            value={percentage(
                learning.acceptance_rate,
            )}
            detail={`${learning.suggestions_accepted} ${t.intelligenceAccepted}`}
            />

          <Metric
            label={t.intelligenceReadRate}
            value={percentage(
                learning.read_rate,
            )}
            detail={`${learning.suggestions_read} ${t.intelligenceReviewed}`}
            />

          <Metric
            label={t.intelligenceLearningConfidence}
            value={`${confidencePercent}%`}
            detail={`${t.intelligenceProfile} v${learning.profile_version}`}
            />
        </div>
      </section>


      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/[.025] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[.05] p-3 text-cyan-300">
              <BrainCircuit size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[.18em] text-white/30">
                {t.intelligenceBehaviour}
              </p>

              <h2 className="mt-1 text-lg font-medium text-white">
                {t.intelligenceWhatLearned}
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-sm text-white/45">
                {t.intelligencePreferredPlan}
              </span>

              <span className="text-sm font-medium text-white">
                {translatePreferredPlan(
                    behaviour.preferred_plan,
                    )}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-sm text-white/45">
                {t.intelligenceTypicalAcceptedMoves}
              </span>

              <span className="text-sm font-medium text-white">
                {behaviour.average_moves_accepted
                  ?? '—'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-sm text-white/45">
                {t.intelligenceTypicalSeatWaste}
              </span>

              <span className="text-sm font-medium text-white">
                {behaviour.average_seat_waste_accepted
                  ?? '—'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-white/45">
                {t.intelligenceManagerTrust}
              </span>

              <span className="text-sm font-medium text-white">
                {translateTrust(
                    behaviour.trust_level,
                    )}
              </span>
            </div>
          </div>
        </section>


        <section className="rounded-3xl border border-white/10 bg-white/[.025] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[.05] p-3 text-cyan-300">
              <ShieldCheck size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[.18em] text-white/30">
                {t.intelligenceAutomation}
              </p>

              <h2 className="mt-1 text-lg font-medium text-white">
                {t.intelligenceOperatingMode}
              </h2>
            </div>
          </div>

          <div className="mt-7">
            <div className="inline-flex rounded-full border border-cyan-300/15 bg-cyan-300/[.06] px-4 py-2 text-sm font-medium text-cyan-200">
              {automationLabel}
            </div>

            <p className="mt-5 max-w-lg text-sm leading-6 text-white/45">
              {policy?.automation_level
                === 'eligible_for_automation'
                ? t.intelligenceAutomationEligibleDescription
                : policy?.automation_level
                    === 'assisted'
                ? t.intelligenceAssistedDescription
                : t.intelligenceAdvisoryDescription}
            </p>
          </div>

          {policy && (
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/[.025] p-4">
                <Route
                  size={16}
                  className="text-white/35"
                />

                <p className="mt-3 text-xs text-white/35">
                  {t.intelligencePreferredMoves}
                </p>

                <p className="mt-1 text-lg font-medium text-white">
                  {policy.maximum_preferred_moves
                    ?? '—'}
                </p>
              </div>

              <div className="rounded-2xl bg-white/[.025] p-4">
                <CheckCircle2
                  size={16}
                  className="text-white/35"
                />

                <p className="mt-3 text-xs text-white/35">
                  {t.intelligencePreferredSeatWaste}
                </p>

                <p className="mt-1 text-lg font-medium text-white">
                  {policy.maximum_preferred_seat_waste
                    ?? '—'}
                </p>
              </div>
            </div>
          )}

          {snapshot.automation_path && (
            <div className="mt-7 border-t border-white/[.06] pt-7">
              <p className="text-xs uppercase tracking-[.18em] text-white/30">
                {t.intelligenceAutomationPath}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[.025] p-4">
                  <p className="text-xs text-white/35">
                    {t.intelligenceCurrentLevel}
                  </p>

                  <p className="mt-2 text-sm font-medium text-white/75">
                    {translateAutomation(
                      snapshot.automation_path.current_level,
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[.025] p-4">
                  <p className="text-xs text-white/35">
                    {t.intelligenceNextLevel}
                  </p>

                  <p className="mt-2 text-sm font-medium text-white/75">
                    {snapshot.automation_path.next_level
                      ? translateAutomation(
                          snapshot.automation_path.next_level,
                        )
                      : '—'}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {snapshot.automation_path.requirements.map(
                  (requirement) => (
                    <div
                      key={requirement.code}
                      className="flex items-start gap-3 rounded-2xl border border-white/[.06] bg-white/[.02] px-4 py-3"
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                          requirement.satisfied
                            ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
                            : 'border-white/10 bg-white/[.03] text-white/30'
                        }`}
                      >
                        {requirement.satisfied ? '✓' : '○'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-6 text-white/50">
                          {translateAutomationRequirement(
                            requirement.code,
                            requirement.description,
                          )}
                        </p>

                        {requirement.current_value !== null &&
                          requirement.target_value !== null &&
                          requirement.progress !== null && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between gap-3 text-xs text-white/35">
                                <span>
                                  {Math.round(
                                    requirement.current_value,
                                  )}{' '}
                                  /{' '}
                                  {Math.round(
                                    requirement.target_value,
                                  )}
                                </span>

                                <span>
                                  {Math.round(
                                    requirement.progress * 100,
                                  )}
                                  %
                                </span>
                              </div>

                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[.06]">
                                <div
                                  className="h-full rounded-full bg-cyan-300/60 transition-all"
                                  style={{
                                    width: `${Math.min(
                                      Math.max(
                                        requirement.progress * 100,
                                        0,
                                      ),
                                      100,
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[.025] p-6">
          <div>
            <p className="text-xs uppercase tracking-[.18em] text-white/30">
              {t.intelligencePredictionQuality}
            </p>

            <h2 className="mt-1 text-lg font-medium text-white">
              {t.intelligencePredictionReliability}
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              label={t.intelligencePredictionsEvaluated}
              value={String(
                calibration.predictions_evaluated,
              )}
            />

            <Metric
              label={t.intelligencePredictionAccuracy}
              value={percentage(
                calibration.prediction_accuracy,
              )}
            />

            <Metric
              label={t.intelligenceAverageConfidence}
              value={percentage(
                calibration.average_predicted_probability,
              )}
            />

            <Metric
              label={t.intelligenceCalibrationGap}
              value={calibrationGapLabel}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-white/[.06] bg-white/[.02] p-5">
            <p className="text-sm text-white/45">
              {t.intelligenceCalibrationStatus}
            </p>

            <p className="mt-2 text-lg font-medium text-white">
              {calibration.state === 'insufficient_data'
                ? t.intelligenceCalibrationInsufficient
                : calibration.state === 'overconfident'
                  ? t.intelligenceCalibrationOverconfident
                  : calibration.state === 'underconfident'
                    ? t.intelligenceCalibrationUnderconfident
                    : t.intelligenceCalibrationWellCalibrated}
            </p>
          </div>
        </section>
      </div>


      <section className="rounded-3xl border border-white/10 bg-white/[.025] p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[.05] p-3 text-cyan-300">
            <Lightbulb size={20} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[.18em] text-white/30">
              {t.intelligenceInsights}
            </p>

            <h2 className="mt-1 text-lg font-medium text-white">
              {t.intelligenceUnderstands}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {behaviour.insights.map(
            (insight) => {
              const translated =
                translateInsight(insight);

              return (
                <div
                  key={insight.code}
                  className="rounded-2xl border border-white/[.06] bg-white/[.02] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white/85">
                      {translated.title}
                    </p>

                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[.14em] text-white/35">
                      {translateTrust(
                        insight.confidence,
                      )}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-white/40">
                    {translated.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-white/25">
                    <Eye size={13} />
                    {insight.evidence_count}{' '}
                    {t.intelligenceEvidence}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </section>
    </div>
  );
}