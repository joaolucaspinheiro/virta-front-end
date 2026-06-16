import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { apiRegister } from "@/lib/api";

type RegisterFormProps = {
  onToggleLogin: () => void;
  onSignUpSuccess: () => void;
};

export function RegisterForm({
  onToggleLogin,
  onSignUpSuccess,
}: RegisterFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Estados Derivados: Validando 1 a 1 em tempo real conforme digita
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&#]/.test(password);
  const isPasswordValid =
    hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      return;
    }
    if (password !== confirmPassword) {
      setError("login.validation.password_mismatch");
      return;
    }

    setLoading(true);
    try {
      await apiRegister(name, email, password);
      onSignUpSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "login.messages.generic_error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute w-full max-w-md rounded-2xl bg-white p-6 lg:p-8 border border-zinc-200 animate-fade-in-up"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <div className="mb-4 space-y-1 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          {t("login.form.title_register")}
        </h2>
        <p className="text-sm text-zinc-600">
          {t("login.form.description_register")}
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{t(error)}</p>
      )}

      <div className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-zinc-900">
            {t("login.form.name_label")}
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("login.form.name_placeholder")}
            className="w-full h-10 px-4 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-zinc-900">
            {t("login.form.email_label")}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("login.form.email_placeholder")}
            className="w-full h-10 px-4 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          />
        </div>

        <div className="space-y-1">
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.form.password_placeholder")}
              className="w-full h-10 px-4 pr-12 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
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
            {password.length > 0 && (
              <div className="top-full left-0 right-0 z-10 mt-1 p-2 bg-white rounded-lg border border-zinc-200 shadow-md text-xs grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  { ok: hasMinLength, label: t("login.validation.req_length") },
                  { ok: hasUpper,     label: t("login.validation.req_upper") },
                  { ok: hasLower,     label: t("login.validation.req_lower") },
                  { ok: hasNumber,    label: t("login.validation.req_number") },
                  { ok: hasSpecial,   label: t("login.validation.req_special") },
                ].map(({ ok, label }) => (
                  <div key={label} className={`flex items-center gap-1.5 ${ok ? "text-emerald-600 font-medium" : "text-zinc-400"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${ok ? "bg-emerald-500" : "bg-zinc-300"}`} />
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
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
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("login.form.confirm_password_placeholder")}
              className="w-full h-10 px-4 pr-12 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full h-10 rounded-lg font-semibold text-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
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

        <button
          type="button"
          onClick={onToggleLogin}
          className="text-sm text-brand-500 hover:underline w-full text-center font-medium cursor-pointer"
        >
          {t("login.actions.form_login")}
        </button>
      </div>
    </form>
  );
}
