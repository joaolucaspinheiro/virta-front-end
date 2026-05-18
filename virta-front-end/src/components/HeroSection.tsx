import { useTranslation } from "react-i18next";
import { WaveMark } from "@/components/WaveMark";

export function HeroSection() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  return (
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
  );
}
