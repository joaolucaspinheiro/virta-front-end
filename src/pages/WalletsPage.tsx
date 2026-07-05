import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, Plus, Wallet as WalletIcon, X } from "lucide-react";
import { createWallet, listWallets } from "@/services/walletService";
import type { Wallet } from "@/types/wallet";
import { paths } from "@/routes/paths";
import { RoleBadge } from "@/components/wallet/RoleBadge";

export function WalletsPage() {
  const { t } = useTranslation();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      setWallets(await listWallets());
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("login.messages.generic_error"),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await createWallet({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success(t("app.wallets.created"));
      setName("");
      setDescription("");
      setShowForm(false);
      await load();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("login.messages.generic_error"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {t("app.wallets.title")}
          </h1>
          <p className="text-sm text-zinc-600">{t("app.wallets.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 h-10 font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          style={{ background: "var(--gradient-primary)" }}
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? t("app.wallets.cancel") : t("app.wallets.new")}
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 animate-fade-in-up"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-900">
              {t("app.wallets.name_label")}
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("app.wallets.name_placeholder")}
              className="w-full h-11 px-4 rounded-lg border border-zinc-200 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-zinc-900"
            >
              {t("app.wallets.description_label")}
            </label>
            <input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("app.wallets.description_placeholder")}
              className="w-full h-11 px-4 rounded-lg border border-zinc-200 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="h-10 rounded-lg px-5 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
            style={{ background: "var(--gradient-primary)" }}
          >
            {submitting ? t("login.actions.loading") : t("app.wallets.create")}
          </button>
        </form>
      )}

      {loading ? (
        <div className="grid place-items-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      ) : wallets.length === 0 ? (
        <div className="grid place-items-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <WalletIcon className="h-8 w-8 text-zinc-300" />
          <p className="text-sm text-zinc-500">{t("app.wallets.empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <Link
              key={wallet.id}
              to={paths.walletDetailTo(wallet.id)}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
                  <WalletIcon className="h-5 w-5" />
                </div>
                <RoleBadge role={wallet.role} />
              </div>
              <h3 className="font-semibold text-zinc-900 group-hover:text-brand-500">
                {wallet.name}
              </h3>
              {wallet.description && (
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                  {wallet.description}
                </p>
              )}
              <p className="mt-3 text-xs text-zinc-400">
                {t("app.wallets.owner")}: {wallet.ownerName}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
