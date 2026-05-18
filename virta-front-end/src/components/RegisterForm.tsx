import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

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
      await new Promise((r) => setTimeout(r, 1500));
      console.log("Usuário criado pendente de ativação no Java Spring:", {
        name,
        email,
        password,
      });
      onSignUpSuccess();
    } catch {
      setError("login.messages.generic_error"); // Usando a chave genérica do seu JSON
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
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
        <p className="text-red-500 text-sm text-center mb-4">{t(error)}</p>
      )}

      <div className="space-y-5">
        <div className="space-y-2">
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
            className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          />
        </div>

        <div className="space-y-2">
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
            className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          />
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
              required
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
        </div>
        {password.length > 0 && (
          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1.5 text-xs transition-all animate-fade-in-up">
            <div
              className={`flex items-center gap-2 ${hasMinLength ? "text-emerald-600 font-medium" : "text-zinc-400"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${hasMinLength ? "bg-emerald-500" : "bg-zinc-300"}`}
              />
              {t("login.validation.req_length")}
            </div>
            <div
              className={`flex items-center gap-2 ${hasUpper ? "text-emerald-600 font-medium" : "text-zinc-400"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${hasUpper ? "bg-emerald-500" : "bg-zinc-300"}`}
              />
              {t("login.validation.req_upper")}
            </div>
            <div
              className={`flex items-center gap-2 ${hasLower ? "text-emerald-600 font-medium" : "text-zinc-400"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${hasLower ? "bg-emerald-500" : "bg-zinc-300"}`}
              />
              {t("login.validation.req_lower")}
            </div>
            <div
              className={`flex items-center gap-2 ${hasNumber ? "text-emerald-600 font-medium" : "text-zinc-400"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${hasNumber ? "bg-emerald-500" : "bg-zinc-300"}`}
              />
              {t("login.validation.req_number")}
            </div>
            <div
              className={`flex items-center gap-2 ${hasSpecial ? "text-emerald-600 font-medium" : "text-zinc-400"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${hasSpecial ? "bg-emerald-500" : "bg-zinc-300"}`}
              />
              {t("login.validation.req_special")}
            </div>
          </div>
        )}
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
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
