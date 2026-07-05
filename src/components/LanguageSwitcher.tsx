import { useTranslation } from "react-i18next";

const LANGS = ["pt", "en"] as const;

type Props = {
  /** "dark" for use over the colored hero; "light" for light backgrounds. */
  variant?: "light" | "dark";
};

/** Reusable PT/EN language toggle. */
export function LanguageSwitcher({ variant = "light" }: Props) {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith("en") ? "en" : "pt";

  const container =
    variant === "dark"
      ? "bg-white/10 ring-1 ring-white/15 backdrop-blur"
      : "bg-zinc-100 ring-1 ring-zinc-200";

  return (
    <div className={`inline-flex rounded-full p-1 ${container}`}>
      {LANGS.map((lng) => {
        const active = current === lng;
        const idle =
          variant === "dark"
            ? "text-white/80 hover:text-white"
            : "text-zinc-500 hover:text-zinc-800";
        return (
          <button
            key={lng}
            type="button"
            onClick={() => i18n.changeLanguage(lng)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              active ? "bg-white text-brand-500 shadow-sm" : idle
            }`}
          >
            {lng.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
