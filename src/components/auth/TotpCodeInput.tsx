import { useTranslation } from "react-i18next";
import { sanitizeTotpInput } from "@/lib/totp";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** false: 6-digit code from the app; true: recovery code (XXXX-XXXX). */
  recovery: boolean;
  onToggleRecovery: () => void;
  autoFocus?: boolean;
};

/**
 * Code field for two-step verification. Starts in "app code" mode (digits only,
 * numeric keyboard on phones); a link switches to the recovery-code mode.
 */
export function TotpCodeInput({ id, value, onChange, recovery, onToggleRecovery, autoFocus }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-900">
        {recovery ? t("login.totp.recovery_label") : t("login.totp.code_label")}
      </label>
      <input
        // A new key remounts the input when the mode changes, so the keyboard type updates.
        key={recovery ? "recovery" : "app"}
        id={id}
        type="text"
        inputMode={recovery ? "text" : "numeric"}
        autoComplete="one-time-code"
        autoCapitalize="characters"
        spellCheck={false}
        autoFocus={autoFocus}
        maxLength={recovery ? 9 : 6}
        value={value}
        onChange={(e) => onChange(sanitizeTotpInput(e.target.value, recovery))}
        placeholder={recovery ? "XXXX-XXXX" : "123456"}
        className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-center text-lg tracking-widest text-zinc-900 placeholder:text-zinc-300 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
      />
      <button
        type="button"
        onClick={onToggleRecovery}
        className="text-xs font-medium text-brand-500 hover:underline cursor-pointer"
      >
        {recovery ? t("login.totp.use_app") : t("login.totp.use_recovery")}
      </button>
    </div>
  );
}
