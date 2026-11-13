import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { paths } from "@/routes/paths";
import { AuthError, verifyEmail } from "@/services/authService";

type Status = "loading" | "success" | "error";

/** Opened from the link in the confirmation e-mail: activates the account. */
export function VerifyEmailPage() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  // The link works only once. In development, React StrictMode runs effects twice;
  // the ref makes sure the confirmation request is sent a single time.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!token) {
      // Deferred so the state change happens outside the effect body.
      queueMicrotask(() => setStatus("error"));
      return;
    }
    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err: unknown) => {
        // Network problems get their own message; anything else means invalid/expired link.
        const offline = err instanceof AuthError && err.messageKey === "auth.errors.server_unreachable";
        setError(offline ? t("auth.errors.server_unreachable") : null);
        setStatus("error");
      });
  }, [token, t]);

  return (
    <div
      className="relative w-full max-w-md rounded-2xl bg-white p-8 lg:p-10 border border-zinc-200 text-center animate-fade-in-up"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      {status === "loading" && (
        <div className="space-y-4" role="status">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-500" aria-hidden="true" />
          <p className="text-sm text-zinc-600">{t("login.verify.checking")}</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CircleCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{t("login.verify.success_title")}</h2>
            <p className="text-sm text-zinc-600">{t("login.verify.success_description")}</p>
          </div>
          <Link
            to={paths.login}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            {t("login.verify.go_to_login")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-red-500/10 text-red-600">
            <CircleAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{t("login.verify.error_title")}</h2>
            <p className="text-sm text-zinc-600">{error ?? t("login.verify.error_description")}</p>
            <p className="text-sm text-zinc-600">{t("login.verify.error_hint")}</p>
          </div>
          <Link to={paths.login} className="inline-block text-sm font-medium text-brand-500 hover:underline">
            {t("login.verify.go_to_login")}
          </Link>
        </div>
      )}
    </div>
  );
}
