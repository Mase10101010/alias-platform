import {
  Check,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  ShieldOff,
  Sparkles,
} from 'lucide-react';

import type {
  SmartLayoutRuleResponse,
  SmartLayoutRuleStatus,
  TableResponse,
} from '@/lib/api';

type SmartLayoutPanelProps = {
  rules: SmartLayoutRuleResponse[];
  tables: TableResponse[];
  loading: boolean;
  analyzing: boolean;
  updatingRuleId: string | null;
  onAnalyze: () => void;
  onStatusChange: (
    ruleId: string,
    status: SmartLayoutRuleStatus,
  ) => void;
};

function getTableLabel(
  tableId: string,
  tables: TableResponse[],
): string {
  const table = tables.find(
    (candidate) => candidate.id === tableId,
  );

  if (!table) {
    return 'Unknown table';
  }

  return `Table ${table.table_number}`;
}

function getRuleLabel(
  rule: SmartLayoutRuleResponse,
  tables: TableResponse[],
): string {
  return rule.members
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((member) =>
      getTableLabel(member.table_id, tables),
    )
    .join(' + ');
}

function getStatusCopy(
  status: SmartLayoutRuleStatus,
): {
  label: string;
  description: string;
} {
  switch (status) {
    case 'confirmed':
      return {
        label: 'Confirmed',
        description: 'Confirmed by your team.',
      };

    case 'blocked':
      return {
        label: 'Blocked',
        description: 'Alias will not use this combination.',
      };

    case 'auto':
    default:
      return {
        label: 'Auto',
        description: 'Automatically detected by Alias.',
      };
  }
}

export function SmartLayoutPanel({
  rules,
  tables,
  loading,
  analyzing,
  updatingRuleId,
  onAnalyze,
  onStatusChange,
}: SmartLayoutPanelProps) {
  const busy =
    analyzing ||
    loading ||
    updatingRuleId !== null;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[.035] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles
              size={16}
              className="text-cyanAlias"
            />

            <p className="text-[10px] uppercase tracking-[.24em] text-white/30">
              Smart combinations
            </p>
          </div>

          <h2 className="mt-2 font-display text-2xl font-light text-white">
            Table layout intelligence
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/40">
            Alias detects nearby tables that can be joined
            for larger parties. Automatic combinations work
            immediately, and you only need to correct
            exceptions.
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={onAnalyze}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyanAlias px-4 py-2.5 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {analyzing ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <RefreshCw size={16} />
          )}

          {analyzing
            ? 'Analyzing...'
            : 'Analyze layout'}
        </button>
      </div>

      <div className="mt-5 border-t border-white/[.06] pt-5">
        {loading ? (
          <div className="flex items-center gap-3 py-6 text-sm text-white/40">
            <LoaderCircle
              size={17}
              className="animate-spin text-cyanAlias"
            />
            Loading smart combinations...
          </div>
        ) : rules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-5 py-7 text-center">
            <Sparkles
              size={20}
              className="mx-auto text-white/25"
            />

            <p className="mt-3 text-sm text-white/60">
              No smart combinations detected yet.
            </p>

            <p className="mx-auto mt-1 max-w-lg text-xs leading-relaxed text-white/30">
              Analyze this layout and Alias will look for
              physically plausible table combinations.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm text-white/55">
                {rules.length}{' '}
                {rules.length === 1
                  ? 'combination'
                  : 'combinations'}
              </p>

              <p className="text-xs text-white/25">
                Correct exceptions only
              </p>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {rules.map((rule) => {
                const status = getStatusCopy(rule.status);
                const updating =
                  updatingRuleId === rule.id;

                return (
                  <article
                    key={rule.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/85">
                          {getRuleLabel(rule, tables)}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[.14em] ${
                              rule.status === 'confirmed'
                                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                                : rule.status === 'blocked'
                                  ? 'border-red-400/20 bg-red-400/10 text-red-200'
                                  : 'border-cyanAlias/20 bg-cyanAlias/10 text-cyanAlias'
                            }`}
                          >
                            {status.label}
                          </span>

                          <span className="text-xs text-white/30">
                            {status.description}
                          </span>
                        </div>
                      </div>

                      {updating && (
                        <LoaderCircle
                          size={17}
                          className="shrink-0 animate-spin text-cyanAlias"
                        />
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {rule.status !== 'confirmed' && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            onStatusChange(
                              rule.id,
                              'confirmed',
                            )
                          }
                          className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200 transition hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Check size={14} />
                          Confirm
                        </button>
                      )}

                      {rule.status !== 'blocked' && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            onStatusChange(
                              rule.id,
                              'blocked',
                            )
                          }
                          className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-200 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ShieldOff size={14} />
                          Block
                        </button>
                      )}

                      {rule.status !== 'auto' && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            onStatusChange(
                              rule.id,
                              'auto',
                            )
                          }
                          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-white/50 transition hover:bg-white/[.06] hover:text-white/75 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <RotateCcw size={14} />
                          Return to Auto
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}