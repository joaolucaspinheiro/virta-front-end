import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, MailCheck, RotateCw } from "lucide-react";
import { resendVerification } from "@/services/authService";

/** "Resend confirmation e-mail" with its own sending/sent states. */
export function ResendVerificationButton({ email }: { email: string }) {
  const { t } = useTranslation();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function resend() {
    setState("sending");
    try {
      await resendVerification(email);
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p role="status" className="inline-flex items-center justify-center gap-1.5 text-sm text-emerald-700">
        <MailCheck className="h-4 w-4" aria-hidden="true" />
        {t("login.verify.resent")}
      </p>
    );
  }

  return (
    <div className="space-y-1 text-center">
      <button
        type="button"
        onClick={resend}
        disabled={state === "sending"}
        className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-brand-500 hover:underline cursor-pointer disabled:opacity-50"
      >
        {state === "sending" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <RotateCw className="h-4 w-4" aria-hidden="true" />
        )}
        {t("login.verify.resend")}
      </button>
      {state === "error" && (
        <p role="alert" className="text-xs text-red-500">{t("login.messages.generic_error")}</p>
      )}
    </div>
  );
}
