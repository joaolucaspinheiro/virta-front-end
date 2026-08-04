import { useState } from "react";
import { Dialog } from "radix-ui";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { X } from "lucide-react";
import { createWallet } from "@/services/walletService";
import { useWallet } from "@/context/WalletContext";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWalletDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const { reloadWallets, selectWallet } = useWallet();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full h-11 px-4 rounded-lg border border-zinc-200 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const wallet = await createWallet({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success(t("app.wallets.created"));
      await reloadWallets();
      selectWallet(wallet.id);
      setName("");
      setDescription("");
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("login.messages.generic_error"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl focus:outline-none">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-zinc-900">
              {t("app.wallets.new")}
            </Dialog.Title>
            <Dialog.Close
              className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
              aria-label={t("app.wallets.cancel")}
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="wallet-name" className="text-sm font-medium text-zinc-900">
                {t("app.wallets.name_label")}
              </label>
              <input
                id="wallet-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("app.wallets.name_placeholder")}
                className={inputClass}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="wallet-desc" className="text-sm font-medium text-zinc-900">
                {t("app.wallets.description_label")}
              </label>
              <input
                id="wallet-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("app.wallets.description_placeholder")}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-lg px-5 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
              style={{ background: "var(--gradient-primary)" }}
            >
              {submitting ? t("login.actions.loading") : t("app.wallets.create")}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
