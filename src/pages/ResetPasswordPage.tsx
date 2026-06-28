import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AuthError, resetPassword } from "@/services/authService";
import { isStrongPassword } from "@/lib/passwordRules";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";
import { paths } from "@/routes/paths";

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirm?: string;
  }>({});

  const tokenMissing = !token;

  function validate(): boolean {
    const errs: typeof fieldErrors = {};
    if (!isStrongPassword(password))
      errs.password = t("login.validation.password_weak");
    if (password !== confirmPassword)
      errs.confirm = t("login.validation.password_mismatch");
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await resetPassword(token ?? "", password);
      toast.success(t("login.reset.success"));
      navigate(paths.login, { replace: true });
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

  return (
    <div
      className="relative w-full max-w-md rounded-2xl bg-white p-8 lg:p-10 border border-zinc-200 animate-fade-in-up"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <div className="mb-8 space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
          {t("login.reset.title")}
        </h2>
        <p className="text-sm text-zinc-600">{t("login.reset.description")}</p>
      </div>

      {tokenMissing ? (
        <div className="space-y-6 text-center">
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {t("auth.errors.invalid_token")}
          </p>
          <Link
            to={paths.forgotPassword}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("login.recover.title")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-900"
            >
              {t("login.reset.new_password_label")}
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
            {fieldErrors.password && (
              <p className="text-xs text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-zinc-900"
            >
              {t("login.reset.confirm_label")}
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("login.form.confirm_password_placeholder")}
              className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
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
              {loading ? t("login.actions.loading") : t("login.actions.save")}
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
        </form>
      )}
    </div>
  );
}
