import { useTranslation } from "react-i18next";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Placeholder do dashboard. A estrutura (cards + área de conteúdo) já está
 * pronta; os indicadores e o gráfico (Recharts) com dados mock entram no
 * próximo passo.
 */
export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {t("app.dashboard.title")}
        </h1>
        <p className="text-sm text-zinc-600">
          {t("app.dashboard.greeting", { name: user?.name ?? "" })}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={<Wallet className="h-5 w-5" />}
          label={t("app.dashboard.balance")}
          tone="brand"
        />
        <MetricCard
          icon={<ArrowUpRight className="h-5 w-5" />}
          label={t("app.dashboard.income")}
          tone="income"
        />
        <MetricCard
          icon={<ArrowDownRight className="h-5 w-5" />}
          label={t("app.dashboard.expense")}
          tone="expense"
        />
      </div>

      <div className="grid place-items-center rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center text-sm text-zinc-500">
        {t("app.dashboard.coming_soon")}
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "brand" | "income" | "expense";
}) {
  const toneClass =
    tone === "income"
      ? "bg-emerald-500/10 text-emerald-600"
      : tone === "expense"
        ? "bg-red-500/10 text-red-600"
        : "bg-brand-500/10 text-brand-500";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-600">{label}</span>
        <span className={`grid h-9 w-9 place-items-center rounded-lg ${toneClass}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-zinc-300">—</p>
    </div>
  );
}
