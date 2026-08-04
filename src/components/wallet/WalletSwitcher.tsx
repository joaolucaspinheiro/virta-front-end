import { useState } from "react";
import { DropdownMenu } from "radix-ui";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown, Plus, Wallet as WalletIcon } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { RoleBadge } from "@/components/wallet/RoleBadge";
import { CreateWalletDialog } from "@/components/wallet/CreateWalletDialog";

export function WalletSwitcher() {
  const { t } = useTranslation();
  const { wallets, selectedWallet, selectWallet } = useWallet();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="flex w-full items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2.5 text-left outline-none transition-colors hover:bg-zinc-50 focus-visible:border-brand-500 focus-visible:ring-4 focus-visible:ring-brand-500/10 cursor-pointer">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
            <WalletIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-900">
              {selectedWallet?.name ?? t("app.switcher.none")}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {t("app.switcher.label")}
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={6}
            className="z-50 min-w-[15rem] rounded-xl border border-zinc-200 bg-white p-1 shadow-lg"
          >
            <p className="px-2 py-1.5 text-xs font-medium text-zinc-400">
              {t("app.switcher.your_wallets")}
            </p>
            {wallets.map((wallet) => (
              <DropdownMenu.Item
                key={wallet.id}
                onSelect={() => selectWallet(wallet.id)}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-700 outline-none transition-colors data-[highlighted]:bg-brand-500/10 data-[highlighted]:text-brand-500"
              >
                <span className="min-w-0 flex-1 truncate">{wallet.name}</span>
                <RoleBadge role={wallet.role} />
                {selectedWallet?.id === wallet.id && (
                  <Check className="h-4 w-4 shrink-0 text-brand-500" />
                )}
              </DropdownMenu.Item>
            ))}

            <DropdownMenu.Separator className="my-1 h-px bg-zinc-100" />

            <DropdownMenu.Item
              onSelect={(e) => {
                e.preventDefault();
                setCreateOpen(true);
              }}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-brand-500 outline-none transition-colors data-[highlighted]:bg-brand-500/10"
            >
              <Plus className="h-4 w-4" />
              {t("app.wallets.new")}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <CreateWalletDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
