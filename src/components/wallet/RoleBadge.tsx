import { useTranslation } from "react-i18next";
import type { WalletRole } from "@/types/wallet";

const styles: Record<WalletRole, string> = {
  OWNER: "bg-brand-500/10 text-brand-500",
  EDITOR: "bg-emerald-500/10 text-emerald-600",
  VIEWER: "bg-zinc-200 text-zinc-600",
};

export function RoleBadge({ role }: { role: WalletRole }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[role]}`}
    >
      {t(`app.wallets.roles.${role}`)}
    </span>
  );
}
