import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import { WaveMark } from "@/components/WaveMark";

/** Shown for any address that doesn't exist (instead of silently redirecting to the login). */
export function NotFoundPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-zinc-50 p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.08) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md text-center animate-fade-in-up">
        <WaveMark className="mx-auto h-16 w-16 text-brand-500" />
        <p
          className="mt-6 bg-clip-text text-7xl font-bold tracking-tight text-transparent"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">{t("not_found.title")}</h1>
        <p className="mt-2 text-sm text-zinc-600">{t("not_found.description")}</p>
        <Link
          to={isAuthenticated ? paths.dashboard : paths.login}
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ background: "var(--gradient-primary)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          {isAuthenticated ? t("not_found.go_dashboard") : t("not_found.go_login")}
        </Link>
      </div>
    </main>
  );
}
