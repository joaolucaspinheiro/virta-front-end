import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  disableTotp,
  enableTotp,
  getMe,
  setupTotp,
  type TotpSetup,
} from "@/services/userService";

/** "idle": shows the status; "setup": QR + confirm; "codes": the recovery codes, shown once. */
type View = "idle" | "setup" | "codes";

const inputClass =
  "w-full h-11 px-4 rounded-lg border border-zinc-200 text-center text-lg tracking-widest outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

/** Profile card to turn two-step verification (TOTP) on and off. */
export function TwoFactorSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [enabled, setEnabled] = useState<boolean | null>(null); // null = loading
  const [view, setView] = useState<View>("idle");
  const [setup, setSetup] = useState<TotpSetup | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((me) => {
        if (!cancelled) setEnabled(me.totpEnabled);
      })
      .catch(() => {
        if (!cancelled) setEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function fail(err: unknown) {
    toast.error(err instanceof Error ? err.message : t("login.messages.generic_error"));
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  }

  function startSetup() {
    void run(async () => {
      setSetup(await setupTotp());
      setCode("");
      setView("setup");
    });
  }

  function confirmSetup(e: React.FormEvent) {
    e.preventDefault();
    void run(async () => {
      const res = await enableTotp(code.trim());
      setRecoveryCodes(res.recoveryCodes);
      setEnabled(true);
      setSetup(null);
      setCode("");
      setView("codes");
      toast.success(t("app.two_factor.enabled"));
    });
  }

  function disable(e: React.FormEvent) {
    e.preventDefault();
    void run(async () => {
      await disableTotp(code.trim());
      setEnabled(false);
      setCode("");
      toast.success(t("app.two_factor.disabled"));
    });
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("app.two_factor.copied"));
    } catch {
      fail(null);
    }
  }

  const card = "space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 lg:p-8";

  // Google sign-in skips TOTP here (Google has its own two-step verification).
  if (user?.provider === "google") {
    return (
      <div className={card}>
        <h3 className="font-semibold text-zinc-900">{t("app.two_factor.title")}</h3>
        <p className="text-sm text-zinc-600">{t("app.two_factor.google_account")}</p>
      </div>
    );
  }

  if (enabled === null) {
    return (
      <div className={`${card} grid place-items-center`}>
        <Loader2 className="h-5 w-5 animate-spin text-brand-500" aria-label={t("login.actions.loading")} />
      </div>
    );
  }

  return (
    <div className={card}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-zinc-900">{t("app.two_factor.title")}</h3>
          <p className="text-sm text-zinc-600">{t("app.two_factor.description")}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            enabled ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {enabled ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
          {enabled ? t("app.two_factor.status_on") : t("app.two_factor.status_off")}
        </span>
      </div>

      {/* Recovery codes: right after enabling, shown only once. */}
      {view === "codes" && (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-900">{t("app.two_factor.codes_title")}</p>
          <p className="text-sm text-amber-800">{t("app.two_factor.codes_description")}</p>
          <ul className="grid grid-cols-2 gap-2 font-mono text-sm text-zinc-900">
            {recoveryCodes.map((c) => (
              <li key={c} className="rounded-md bg-white px-3 py-1.5 text-center">
                {c}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copy(recoveryCodes.join("\n"))}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-4 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-100 cursor-pointer"
            >
              <Copy className="h-4 w-4" />
              {t("app.two_factor.copy_codes")}
            </button>
            <button
              type="button"
              onClick={() => {
                setRecoveryCodes([]);
                setView("idle");
              }}
              className="h-10 rounded-lg px-4 text-sm font-semibold text-white cursor-pointer"
              style={{ background: "var(--gradient-primary)" }}
            >
              {t("app.two_factor.codes_saved")}
            </button>
          </div>
        </div>
      )}

      {/* Setup: QR code + manual key + confirmation code. */}
      {view === "setup" && setup && (
        <form onSubmit={confirmSetup} className="space-y-4">
          <p className="text-sm font-medium text-zinc-900">{t("app.two_factor.step_scan")}</p>
          <div className="grid place-items-center rounded-xl border border-zinc-200 bg-white p-4">
            <QRCodeSVG value={setup.otpauthUri} size={176} title={t("app.two_factor.step_scan")} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-zinc-500">{t("app.two_factor.step_manual")}</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 break-all rounded-md bg-zinc-100 px-3 py-2 font-mono text-sm text-zinc-800">
                {setup.secret.match(/.{1,4}/g)?.join(" ")}
              </code>
              <button
                type="button"
                onClick={() => void copy(setup.secret)}
                aria-label={t("app.two_factor.copy")}
                className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 cursor-pointer"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="totp-setup-code" className="text-sm font-medium text-zinc-900">
              {t("app.two_factor.step_confirm")}
            </label>
            <input
              id="totp-setup-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className={inputClass}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className="h-11 rounded-lg px-5 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              style={{ background: "var(--gradient-primary)" }}
            >
              {busy ? t("login.actions.loading") : t("app.two_factor.confirm")}
            </button>
            <button
              type="button"
              onClick={() => {
                setSetup(null);
                setCode("");
                setView("idle");
              }}
              className="h-11 rounded-lg px-4 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 cursor-pointer"
            >
              {t("app.two_factor.cancel")}
            </button>
          </div>
        </form>
      )}

      {/* Off: start the setup. */}
      {view === "idle" && !enabled && (
        <button
          type="button"
          onClick={startSetup}
          disabled={busy}
          className="inline-flex h-11 items-center gap-2 rounded-lg px-5 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
          style={{ background: "var(--gradient-primary)" }}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          {t("app.two_factor.enable")}
        </button>
      )}

      {/* On: turning off also asks for a code. */}
      {view === "idle" && enabled && (
        <form onSubmit={disable} className="space-y-3">
          <label htmlFor="totp-disable-code" className="block text-sm text-zinc-600">
            {t("app.two_factor.disable_description")}
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              id="totp-disable-code"
              autoComplete="one-time-code"
              maxLength={9}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("app.two_factor.code_label")}
              className={`${inputClass} max-w-48 flex-1`}
            />
            <button
              type="submit"
              disabled={busy || code.trim().length < 6}
              className="h-11 rounded-lg px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            >
              {t("app.two_factor.disable")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
