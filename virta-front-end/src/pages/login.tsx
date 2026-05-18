import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { WaveMark } from "@/components/WaveMark";

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      if (isRegister) console.log("registrando usuário...");
      else console.log("fazendo login...");
      console.log("success");
    } catch {
      setError("Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* HERO */}
      <section
        className="relative overflow-hidden flex flex-col justify-between p-8 lg:p-12 text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Ondas decorativas */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
          viewBox="0 0 800 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="wg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--wave-3)" />
              <stop offset="100%" stopColor="var(--wave-1)" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M0 ${120 + i * 130} Q 200 ${60 + i * 130}, 400 ${120 + i * 130} T 800 ${120 + i * 130}`}
              stroke="url(#wg)"
              strokeWidth="1.5"
              fill="none"
            />
          ))}
        </svg>

        {/* Orbs */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-40"
          style={{ background: "var(--wave-3)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-40 -right-20 h-112 w-md rounded-full blur-3xl opacity-30"
          style={{ background: "var(--wave-2)" }}
        />

        {/* Top bar */}
        <header className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/15 text-white">
              <WaveMark className="h-6 w-6 animate-[wave_4s_ease-in-out_infinite]" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Virta</span>
          </div>

          <div className="inline-flex rounded-full bg-white/10 ring-1 ring-white/15 p-1 backdrop-blur">
            {(["pt", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => changeLanguage(l)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  i18n.language === l
                    ? "bg-white text-brand-500 shadow"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {/* Headline */}
        <div className="relative z-10 max-w-xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/15 px-3 py-1 text-xs font-medium tracking-wide uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Virta
          </span>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            {t("login.branding.title")}
          </h1>
          <p className="text-base lg:text-lg text-white/75 max-w-md leading-relaxed">
            {t("login.branding.description")}
          </p>
          <WaveMark className="h-24 w-24 text-white/15 mt-4" />
        </div>

        <footer className="relative z-10 text-xs text-white/55">
          {t("login.branding.footer")}
        </footer>
      </section>

      {/* FORM */}
      <section className="flex items-center justify-center p-6 lg:p-12 relative bg-zinc-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.08) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-md rounded-2xl bg-white p-8 lg:p-10 border border-zinc-200"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <div className="mb-8 space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              {t("login.form.title")}
            </h2>
            <p className="text-sm text-zinc-600">
              {t("login.form.description")}
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-12 rounded-lg font-semibold text-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
              style={{ background: "var(--gradient-primary)" }}
            >
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                {loading
                  ? t("login.actions.loading")
                  : t("login.actions.submit")}
                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsRegister((prev) => !prev)}
              className="text-sm text-brand-500 hover:underline w-full text-center font-medium"
            >
              {isRegister
                ? t("login.actions.form_login")
                : t("login.actions.form_register")}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
