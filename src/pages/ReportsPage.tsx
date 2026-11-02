import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Download, Loader2, RotateCcw } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { NoWalletSelected } from "@/components/wallet/NoWalletSelected";
import { getSummary } from "@/services/transactionService";
import { downloadStatement } from "@/services/reportServices";
import { formatCurrency, formatMonth } from "@/lib/format";
import type { DashboardSummary, TransactionType } from "@/types/transaction";

type TypeFilter = "ALL" | TransactionType;
type SummaryResult = { key: string; summary: DashboardSummary | null };

/** Current month as "YYYY-MM", in local time. */
function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** Adds (or subtracts) months to a "YYYY-MM" string. */
function addMonths(month: string, delta: number): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Last day of a "YYYY-MM" month as an ISO date (day 0 of the next month). */
function lastDayOf(month: string): string {
  const [year, m] = month.split("-").map(Number);
  return `${month}-${String(new Date(year, m, 0).getDate()).padStart(2, "0")}`;
}

const PRESETS = [
  { key: "this_month", range: (cur: string) => [cur, cur] },
  { key: "last_3", range: (cur: string) => [addMonths(cur, -2), cur] },
  { key: "last_6", range: (cur: string) => [addMonths(cur, -5), cur] },
  { key: "this_year", range: (cur: string) => [`${cur.slice(0, 4)}-01`, cur] },
] as const;

export function ReportsPage() {
  const { t } = useTranslation();
  const { selectedWallet } = useWallet();

  const [from, setFrom] = useState(currentMonth);
  const [to, setTo] = useState(currentMonth);
  const [type, setType] = useState<TypeFilter>("ALL");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [downloading, setDownloading] = useState(false);

  const rangeValid = Boolean(from && to) && from <= to;
  const apiType = type === "ALL" ? undefined : type;

  // 1) Period + type, without the category filter: feeds the category chips
  //    (only categories that appear in the period) and, with no category
  //    selected, the report itself.
  const baseKey = selectedWallet && rangeValid ? `${selectedWallet.id}:${from}:${to}:${type}` : null;
  const [baseResult, setBaseResult] = useState<SummaryResult | null>(null);
  const base = baseResult?.key === baseKey ? baseResult.summary : null;
  const baseLoading = baseKey !== null && baseResult?.key !== baseKey;

  // Selected categories that still exist in this period/type.
  const options = base?.byCategory ?? [];
  const activeIds = selectedIds.filter((id) => options.some((c) => c.categoryId === id));
  const idsKey = [...activeIds].sort((a, b) => a - b).join(",");

  // 2) Same, filtered by the selected categories (only when there are any).
  const filteredKey = baseKey && idsKey ? `${baseKey}:${idsKey}` : null;
  const [filteredResult, setFilteredResult] = useState<SummaryResult | null>(null);
  const filteredLoading = filteredKey !== null && filteredResult?.key !== filteredKey;

  const loading = baseLoading || filteredLoading;
  const summary = filteredKey
    ? filteredResult?.key === filteredKey ? filteredResult.summary : null
    : base;

  useEffect(() => {
    if (!selectedWallet || baseKey === null) return;
    let cancelled = false;
    getSummary(selectedWallet.id, { startDate: `${from}-01`, endDate: lastDayOf(to), type: apiType })
      .then((data) => {
        if (!cancelled) setBaseResult({ key: baseKey, summary: data });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setBaseResult({ key: baseKey, summary: null });
        toast.error(err instanceof Error ? err.message : t("login.messages.generic_error"));
      });
    return () => {
      cancelled = true;
    };
  }, [selectedWallet, baseKey, from, to, apiType, t]);

  useEffect(() => {
    if (!selectedWallet || filteredKey === null) return;
    let cancelled = false;
    const categoryIds = idsKey.split(",").map(Number);
    getSummary(selectedWallet.id, {
      startDate: `${from}-01`,
      endDate: lastDayOf(to),
      type: apiType,
      categoryIds,
    })
      .then((data) => {
        if (!cancelled) setFilteredResult({ key: filteredKey, summary: data });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setFilteredResult({ key: filteredKey, summary: null });
        toast.error(err instanceof Error ? err.message : t("login.messages.generic_error"));
      });
    return () => {
      cancelled = true;
    };
  }, [selectedWallet, filteredKey, idsKey, from, to, apiType, t]);

  function applyPreset(range: (cur: string) => readonly [string, string] | string[]) {
    const [start, end] = range(currentMonth());
    setFrom(start);
    setTo(end);
  }

  function toggleCategory(id: number) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  function clearFilters() {
    const cur = currentMonth();
    setFrom(cur);
    setTo(cur);
    setType("ALL");
    setSelectedIds([]);
  }

  async function handleDownload() {
    if (!selectedWallet || !rangeValid) return;
    setDownloading(true);
    try {
      await downloadStatement(selectedWallet.id, { from, to, categoryIds: activeIds, type: apiType });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("login.messages.generic_error"));
    } finally {
      setDownloading(false);
    }
  }

  const hasFilters = type !== "ALL" || activeIds.length > 0 || from !== currentMonth() || to !== currentMonth();
  const maxCategory = Math.max(1, ...(summary?.byCategory.map((c) => c.total) ?? []));
  const maxMonth = Math.max(1, ...(summary?.byMonth.flatMap((m) => [m.income, m.expense]) ?? []));
  const inputClass =
    "block h-11 rounded-lg border border-zinc-200 px-4 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 aria-[invalid=true]:border-red-400";
  const chipClass =
    "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm transition-colors cursor-pointer";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{t("app.reports.title")}</h1>
        <p className="text-sm text-zinc-600">{t("app.reports.subtitle")}</p>
      </header>

      {!selectedWallet ? (
        <NoWalletSelected />
      ) : (
        <>
          {/* ---------- Filters ---------- */}
          <section className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <label htmlFor="report-from" className="text-sm font-medium text-zinc-900">
                  {t("app.reports.from_label")}
                </label>
                <input
                  id="report-from"
                  type="month"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  aria-invalid={!rangeValid}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="report-to" className="text-sm font-medium text-zinc-900">
                  {t("app.reports.to_label")}
                </label>
                <input
                  id="report-to"
                  type="month"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  aria-invalid={!rangeValid}
                  aria-describedby={!rangeValid ? "report-range-error" : undefined}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => {
                  const [start, end] = preset.range(currentMonth());
                  const active = from === start && to === end;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => applyPreset(preset.range)}
                      aria-pressed={active}
                      className={`h-11 rounded-lg border px-3 text-sm font-medium transition-colors cursor-pointer ${
                        active
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {t(`app.reports.presets.${preset.key}`)}
                    </button>
                  );
                })}
              </div>
            </div>
            {!rangeValid && (
              <p id="report-range-error" role="alert" className="text-sm text-red-600">
                {t("app.reports.invalid_range")}
              </p>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-900">{t("app.reports.type_label")}</p>
              <div className="inline-flex rounded-lg border border-zinc-200 p-1" role="group">
                {(["ALL", "INCOME", "EXPENSE"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    aria-pressed={type === value}
                    className={`h-9 rounded-md px-4 text-sm font-medium transition-colors cursor-pointer ${
                      type === value ? "bg-brand-500 text-white" : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {t(`app.reports.type_${value.toLowerCase()}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-900">{t("app.reports.categories_label")}</p>
              {options.length === 0 ? (
                <p className="text-sm text-zinc-500">{t("app.reports.categories_none")}</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2" role="group">
                    {options.map((c) => {
                      const active = activeIds.includes(c.categoryId);
                      return (
                        <button
                          key={c.categoryId}
                          type="button"
                          onClick={() => toggleCategory(c.categoryId)}
                          aria-pressed={active}
                          className={`${chipClass} ${
                            active
                              ? "border-brand-500 bg-brand-500/10 text-brand-500 font-medium"
                              : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                          }`}
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: c.categoryColor ?? "#94a3b8" }}
                            aria-hidden="true"
                          />
                          {c.categoryName}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-zinc-500">{t("app.reports.categories_hint")}</p>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-5">
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasFilters}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
                {t("app.reports.clear_filters")}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading || !rangeValid}
                className="inline-flex h-11 items-center gap-2 rounded-lg px-5 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                style={{ background: "var(--gradient-primary)" }}
              >
                {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {downloading ? t("app.reports.downloading") : t("app.reports.download")}
              </button>
            </div>
          </section>

          {/* ---------- Results ---------- */}
          {!rangeValid ? null : loading ? (
            <div className="grid place-items-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            </div>
          ) : summary && summary.transactionCount > 0 ? (
            <>
              <p className="text-sm text-zinc-500" aria-live="polite">
                {t("app.reports.count", { count: summary.transactionCount })}
              </p>

              <section className="grid gap-4 sm:grid-cols-3">
                <SummaryCard label={t("app.reports.income")} value={summary.totalIncome} tone="text-emerald-600" />
                <SummaryCard label={t("app.reports.expense")} value={summary.totalExpense} tone="text-red-600" />
                <SummaryCard
                  label={t("app.reports.balance")}
                  value={summary.balance}
                  tone={summary.balance >= 0 ? "text-zinc-900" : "text-red-600"}
                />
              </section>

              {summary.byMonth.length > 1 && (
                <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold text-zinc-900">{t("app.reports.by_month")}</h2>
                    <div className="flex gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        {t("app.reports.income")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden="true" />
                        {t("app.reports.expense")}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {summary.byMonth.map((m) => (
                      <li key={m.month} className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
                        <span className="text-sm font-medium text-zinc-700">{formatMonth(m.month)}</span>
                        <div className="space-y-1.5">
                          <Bar value={m.income} max={maxMonth} color="bg-emerald-500" />
                          <Bar value={m.expense} max={maxMonth} color="bg-red-500" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {summary.byCategory.length > 0 && (
                <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
                  <h2 className="font-semibold text-zinc-900">{t("app.reports.by_category")}</h2>
                  <ul className="space-y-3">
                    {summary.byCategory.map((c) => (
                      <li key={c.categoryId} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-zinc-700">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ background: c.categoryColor ?? "#94a3b8" }}
                              aria-hidden="true"
                            />
                            {c.categoryName}
                          </span>
                          <span className="font-medium text-zinc-900">{formatCurrency(c.total)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-100">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(c.total / maxCategory) * 100}%`,
                              background: c.categoryColor ?? "#94a3b8",
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">
              {t("app.reports.empty")}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone}`}>{formatCurrency(value)}</p>
    </div>
  );
}

/** Horizontal bar with the value next to it. */
function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-zinc-100">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="w-24 text-right text-xs tabular-nums text-zinc-600">{formatCurrency(value)}</span>
    </div>
  );
}
