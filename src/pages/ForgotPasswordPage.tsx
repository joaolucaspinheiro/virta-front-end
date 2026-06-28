import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import { forgotPassword } from "@/services/authService";
import { paths } from "@/routes/paths";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [debugToken, setDebugToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setFieldError(t("login.validation.email_required"));
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setFieldError(t("login.validation.email_invalid"));
      return;
    }
    setFieldError(null);
    setLoading(true);
    try {
      const { debugToken } = await forgotPassword(email);
      setDebugToken(debugToken ?? null);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative w-full max-w-md rounded-2xl bg-white p-8 lg:p-10 border border-zinc-200 animate-fade-in-up"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      {sent ? (
        <div className="space-y-6 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <MailCheck className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              {t("login.recover.title")}
            </h2>
            {/* Mensagem neutra: nunca revela se o e-mail existe. */}
            <p className="text-sm text-zinc-600">{t("login.recover.success")}</p>
          </div>

          {debugToken && (
            <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-left text-xs text-amber-800">
              <p className="mb-1 font-medium">{t("login.recover.debug_hint")}</p>
              <Link
                to={paths.resetPasswordTo(debugToken)}
                className="break-all font-mono text-brand-500 hover:underline"
              >
                {paths.resetPasswordTo(debugToken)}
              </Link>
            </div>
          )}

          <Link
            to={paths.login}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("login.actions.back_to_login")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-8 space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              {t("login.recover.title")}
            </h2>
            <p className="text-sm text-zinc-600">
              {t("login.recover.description")}
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-900"
              >
                {t("login.form.email_label")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.form.email_placeholder")}
                className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
              {fieldError && (
                <p className="text-xs text-red-500">{fieldError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-12 rounded-lg font-semibold text-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
              style={{ background: "var(--gradient-primary)" }}
            >
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                {loading
                  ? t("login.actions.loading")
                  : t("login.actions.send")}
                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </span>
            </button>

            <Link
              to={paths.login}
              className="inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium text-brand-500 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("login.actions.back_to_login")}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
