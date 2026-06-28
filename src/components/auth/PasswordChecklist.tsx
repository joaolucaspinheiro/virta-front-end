import { useTranslation } from "react-i18next";
import { passwordRules, passwordScore } from "@/lib/passwordRules";

/** Indicador reativo de força + checklist de requisitos da senha. */
export function PasswordChecklist({ password }: { password: string }) {
  const { t } = useTranslation();
  if (!password) return null;

  const score = passwordScore(password);
  const strength = score <= 2 ? "weak" : score <= 4 ? "medium" : "strong";

  const barColor =
    strength === "weak"
      ? "bg-red-500"
      : strength === "medium"
        ? "bg-amber-500"
        : "bg-emerald-500";

  const label =
    strength === "weak"
      ? t("login.validation.strength_weak")
      : strength === "medium"
        ? t("login.validation.strength_medium")
        : t("login.validation.strength_strong");

  return (
    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-2 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
          <div
            className={`h-full ${barColor} transition-all`}
            style={{ width: `${(score / passwordRules.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-zinc-600">{label}</span>
      </div>

      <div className="space-y-1.5 text-xs">
        {passwordRules.map((rule) => {
          const ok = rule.test(password);
          return (
            <div
              key={rule.key}
              className={`flex items-center gap-2 ${
                ok ? "text-emerald-600 font-medium" : "text-zinc-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  ok ? "bg-emerald-500" : "bg-zinc-300"
                }`}
              />
              {t(rule.key)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
