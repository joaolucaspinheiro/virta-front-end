import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { deleteWallet, updateWallet } from "@/services/walletService";
import { useWallet } from "@/context/WalletContext";
import { RoleBadge } from "@/components/wallet/RoleBadge";
import { NoWalletSelected } from "@/components/wallet/NoWalletSelected";

export function WalletSettingsPage() {
  const { t } = useTranslation();
  const { selectedWallet, loading, reloadWallets } = useWallet();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedWallet) {
      setName(selectedWallet.name);
      setDescription(selectedWallet.description ?? "");
    }
  }, [selectedWallet]);

  const isOwner = selectedWallet?.role === "OWNER";
  const inputClass =
    "w-full h-11 px-4 rounded-lg border border-zinc-200 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:bg-zinc-50 disabled:text-zinc-500";

  function fail(err: unknown) {
    toast.error(
      err instanceof Error ? err.message : t("login.messages.generic_error"),
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedWallet || !name.trim()) return;
    setSaving(true);
    try {
      await updateWallet(selectedWallet.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success(t("app.wallets.updated"));
      await reloadWallets();
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedWallet) return;
    if (!window.confirm(t("app.wallets.confirm_delete"))) return;
    try {
      await deleteWallet(selectedWallet.id);
      toast.success(t("app.wallets.deleted"));
      await reloadWallets();
    } catch (err) {
      fail(err);
    }
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {t("app.wallet_settings.title")}
        </h1>
        <p className="text-sm text-zinc-600">
          {t("app.wallet_settings.subtitle")}
        </p>
      </header>

      {!selectedWallet ? (
        <NoWalletSelected />
      ) : (
        <section className="max-w-2xl space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">
              {t("app.wallets.owner")}: {selectedWallet.ownerName}
            </span>
            <RoleBadge role={selectedWallet.role} />
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="ws-name" className="text-sm font-medium text-zinc-900">
                {t("app.wallets.name_label")}
              </label>
              <input
                id="ws-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isOwner}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="ws-desc" className="text-sm font-medium text-zinc-900">
                {t("app.wallets.description_label")}
              </label>
              <input
                id="ws-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isOwner}
                placeholder={t("app.wallets.description_placeholder")}
                className={inputClass}
              />
            </div>

            {isOwner && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 rounded-lg px-5 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {saving ? t("login.actions.loading") : t("app.wallets.save")}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg px-4 font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("app.wallets.delete")}
                </button>
              </div>
            )}
          </form>
        </section>
      )}
    </div>
  );
}
