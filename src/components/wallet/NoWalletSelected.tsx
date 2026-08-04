import { useTranslation } from "react-i18next";
import { Wallet as WalletIcon } from "lucide-react";

/** Shown on wallet-scoped pages when the user has no wallet selected. */
export function NoWalletSelected() {
  const { t } = useTranslation();
  return (
    <div className="grid place-items-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
      <WalletIcon className="h-8 w-8 text-zinc-300" />
      <p className="text-sm text-zinc-500">{t("app.wallet_settings.no_wallet")}</p>
    </div>
  );
}
