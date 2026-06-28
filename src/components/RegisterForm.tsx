import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import { AuthError, loginWithGoogle, register } from "@/services/authService";
import type { AuthSession } from "@/types/auth";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";
import { isStrongPassword } from "@/lib/passwordRules";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  function validate(): boolean {
    const errs: typeof fieldErrors = {};
    if (!name.trim()) errs.name = t("login.validation.name_required");
    if (!email.trim()) errs.email = t("login.validation.email_required");
    else if (!EMAIL_REGEX.test(email))
      errs.email = t("login.validation.email_invalid");
    if (!isStrongPassword(password))
      errs.password = t("login.validation.password_weak");
    if (password !== confirmPassword)
      errs.confirm = t("login.validation.password_mismatch");
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function authenticate(action: () => Promise<AuthSession>) {
    setError(null);
    setLoading(true);
    try {
      const session = await action();
      setSession(session);
      navigate(paths.dashboard, { replace: true });
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
    await authenticate(() => register({ name, email, password }));
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
          {t("login.form.title_register")}
        </h2>
        <p className="text-sm text-zinc-600">
          {t("login.form.description_register")}
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-zinc-900">
            {t("login.form.name_label")}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("login.form.name_placeholder")}
            className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          />
          {fieldErrors.name && (
            <p className="text-xs text-red-500">{fieldErrors.name}</p>
          )}
        </div>

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
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-900"
          >
            {t("login.form.password_label")}
          </label>
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
          <PasswordChecklist password={password} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-zinc-900"
          >
            {t("login.form.confirm_password_label")}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() =>
                setFieldErrors((prev) => ({
                  ...prev,
                  confirm:
                    confirmPassword && confirmPassword !== password
                      ? t("login.validation.password_mismatch")
                      : undefined,
                }))
              }
              placeholder={t("login.form.confirm_password_placeholder")}
              className="w-full h-12 px-4 pr-12 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
              aria-label="Toggle confirm password"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {fieldErrors.confirm && (
            <p className="text-xs text-red-500">{fieldErrors.confirm}</p>
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
              : t("login.actions.submit_register")}
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
          to={paths.login}
          className="text-sm text-brand-500 hover:underline w-full text-center font-medium block"
        >
          {t("login.actions.form_login")}
        </Link>
      </div>
    </form>
  );
}
