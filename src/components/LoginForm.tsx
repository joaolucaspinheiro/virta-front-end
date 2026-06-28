import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import { AuthError, login, loginWithGoogle } from "@/services/authService";
import type { AuthSession } from "@/types/auth";
import { GoogleButton } from "@/components/auth/GoogleButton";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Volta para a rota que o usuário tentou acessar antes de ser barrado.
  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? paths.dashboard;

  function validate(): boolean {
    const errs: typeof fieldErrors = {};
    if (!email.trim()) errs.email = t("login.validation.email_required");
    else if (!EMAIL_REGEX.test(email))
      errs.email = t("login.validation.email_invalid");
    if (!password) errs.password = t("login.validation.password_required");
    else if (password.length < 6)
      errs.password = t("login.validation.password_min");
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function authenticate(action: () => Promise<AuthSession>) {
    setError(null);
    setLoading(true);
    try {
      const session = await action();
      setSession(session);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err instanceof AuthError
          ? t(err.messageKey)
          : t("login.messages.generic_error"),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await authenticate(() => login({ email, password }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative w-full max-w-md rounded-2xl bg-white p-8 lg:p-10 border border-zinc-200 animate-fade-in-up"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <div className="mb-8 space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
          {t("login.form.title")}
        </h2>
        <p className="text-sm text-zinc-600">{t("login.form.description")}</p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-900">
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
          {fieldErrors.email && (
            <p className="text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-900"
            >
              {t("login.form.password_label")}
            </label>
            <Link
              to={paths.forgotPassword}
              className="text-xs font-medium text-brand-500 hover:underline"
            >
              {t("login.actions.forgot_password")}
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.form.password_placeholder")}
              className="w-full h-12 px-4 pr-12 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
              aria-label="Toggle password"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-xs text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full h-12 rounded-lg font-semibold text-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
          style={{ background: "var(--gradient-primary)" }}
        >
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            {loading ? t("login.actions.loading") : t("login.actions.submit")}
            {!loading && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs uppercase tracking-wide text-zinc-400">
            {t("login.google.or")}
          </span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>

        <GoogleButton
          onCredential={(credential) =>
            authenticate(() => loginWithGoogle(credential))
          }
          onError={() => setError(t("auth.errors.google_failed"))}
        />

        <Link
          to={paths.register}
          className="text-sm text-brand-500 hover:underline w-full text-center font-medium block"
        >
          {t("login.actions.form_register")}
        </Link>
      </div>
    </form>
  );
}
