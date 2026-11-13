import { useTranslation } from "react-i18next";
import { ListSkeleton } from "@/components/LoadingSkeletons";
import { useWallet } from "@/context/WalletContext";
import { WalletTransactions } from "@/components/wallet/WalletTransactions";
import { NoWalletSelected } from "@/components/wallet/NoWalletSelected";

export function TransactionsPage() {
  const { t } = useTranslation();
  const { selectedWallet, loading } = useWallet();

  if (loading) {
    return <ListSkeleton rows={6} />;
  }

  const canWrite =
    selectedWallet?.role === "OWNER" || selectedWallet?.role === "EDITOR";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {t("app.transactions.title")}
        </h1>
        {selectedWallet && (
          <p className="text-sm text-zinc-600">{selectedWallet.name}</p>
        )}
      </header>

      {selectedWallet ? (
        <WalletTransactions walletId={selectedWallet.id} canWrite={canWrite} />
      ) : (
        <NoWalletSelected />
      )}
    </div>
  );
}
