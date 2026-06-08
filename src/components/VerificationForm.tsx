import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, KeyRound } from "lucide-react";

type VerificationFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export function VerificationForm({
  onSuccess,
  onCancel,
}: VerificationFormProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 6) {
      setError(t("login.validation.code_invalid"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Simulação da verificação do código com o Java Spring
      await new Promise((r) => setTimeout(r, 1500));
      console.log("Código validado com sucesso no backend!", code);
      onSuccess();
    } catch {
      setError(t("login.messages.error"));
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
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-500/10 text-brand-500 mb-2">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
          {t("login.form.title_verify")}
        </h2>
        <p className="text-sm text-zinc-600">
          {t("login.form.description_verify")}
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="code" className="text-sm font-medium text-zinc-900">
            {t("login.form.code_label")}
          </label>
          <input
            id="code"
            type="text"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} // Aceita apenas números
            placeholder="000000"
            className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-zinc-900 tracking-[0.5em] text-center font-bold text-lg placeholder:text-zinc-300 placeholder:tracking-normal outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          />
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
              : t("login.actions.submit_verify")}
            {!loading && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-zinc-500 hover:text-zinc-800 w-full text-center font-medium cursor-pointer transition-colors"
        >
          {t("login.actions.cancel")}
        </button>
      </div>
    </form>
  );
}
