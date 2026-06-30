import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { isGoogleEnabled } from "@/config/env";

type GoogleButtonProps = {
  /** Recebe o ID token (credential) devolvido pelo Google. */
  onCredential: (credential: string) => void;
  onError?: () => void;
};

export function GoogleButton({ onCredential, onError }: GoogleButtonProps) {
  const { t } = useTranslation();

  // With no Client ID configured, show a disabled, explanatory placeholder.
  if (!isGoogleEnabled) {
    return (
      <button
        type="button"
        disabled
        title={t("login.google.not_configured")}
        className="flex w-full items-center justify-center gap-2 h-11 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-400 cursor-not-allowed"
      >
        {t("login.actions.login_with_google")}
      </button>
    );
  }

  return (
    <div className="flex justify-center [color-scheme:light]">
      <GoogleLogin
        onSuccess={(res) => {
          if (res.credential) onCredential(res.credential);
          else onError?.();
        }}
        onError={() => onError?.()}
        text="signin_with"
        shape="rectangular"
      />
    </div>
  );
}
