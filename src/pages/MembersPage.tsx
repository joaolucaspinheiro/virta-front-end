import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import {
  addMember,
  listMembers,
  removeMember,
  updateMemberRole,
} from "@/services/walletService";
import type { WalletMember, WalletRole } from "@/types/wallet";
import { useWallet } from "@/context/WalletContext";
import { RoleBadge } from "@/components/wallet/RoleBadge";
import { NoWalletSelected } from "@/components/wallet/NoWalletSelected";
import { paths } from "@/routes/paths";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ASSIGNABLE_ROLES: WalletRole[] = ["EDITOR", "VIEWER"];

export function MembersPage() {
  const { t } = useTranslation();
  const { selectedWallet, loading: loadingWallet } = useWallet();
  const walletId = selectedWallet?.id ?? null;

  const [members, setMembers] = useState<WalletMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<WalletRole>("VIEWER");
  const [addingMember, setAddingMember] = useState(false);

  const isOwner = selectedWallet?.role === "OWNER";

  async function load(id: number) {
    try {
      setMembers(await listMembers(id));
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (walletId == null) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void load(walletId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletId]);

  function fail(err: unknown) {
    toast.error(
      err instanceof Error ? err.message : t("login.messages.generic_error"),
    );
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (walletId == null || !memberEmail.trim()) return;
    setAddingMember(true);
    try {
      const res = await addMember(walletId, {
        email: memberEmail.trim(),
        role: memberRole,
      });
      if (res.created && res.debugToken) {
        const link = window.location.origin + paths.resetPasswordTo(res.debugToken);
        toast.success(t("app.wallets.member_invited"), { description: link });
      } else {
        toast.success(t("app.wallets.member_added"));
      }
      setMemberEmail("");
      setMemberRole("VIEWER");
      await load(walletId);
    } catch (err) {
      fail(err);
    } finally {
      setAddingMember(false);
    }
  }

  async function handleChangeRole(userId: number, role: WalletRole) {
    if (walletId == null) return;
    try {
      await updateMemberRole(walletId, userId, role);
      toast.success(t("app.wallets.member_updated"));
      await load(walletId);
    } catch (err) {
      fail(err);
    }
  }

  async function handleRemoveMember(userId: number) {
    if (walletId == null) return;
    if (!window.confirm(t("app.wallets.confirm_remove_member"))) return;
    try {
      await removeMember(walletId, userId);
      toast.success(t("app.wallets.member_removed"));
      await load(walletId);
    } catch (err) {
      fail(err);
    }
  }

  if (loadingWallet) {
    return (
      <div className="grid place-items-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!selectedWallet) {
    return (
      <div className="space-y-6">
        <PageHeader name={undefined} />
        <NoWalletSelected />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader name={selectedWallet.name} />

      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        {isOwner && (
          <form
            onSubmit={handleAddMember}
            className="mb-5 flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder={t("app.wallets.members.email_placeholder")}
              className="h-10 flex-1 rounded-lg border border-zinc-200 px-4 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
            <div className="sm:w-44">
              <Select
                value={memberRole}
                onValueChange={(v) => setMemberRole(v as WalletRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {t(`app.wallets.roles.${r}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button
              type="submit"
              disabled={addingMember}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-4 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
              style={{ background: "var(--gradient-primary)" }}
            >
              <UserPlus className="h-4 w-4" />
              {t("app.wallets.members.add")}
            </button>
          </form>
        )}

        {loading ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {members.map((member) => (
              <li
                key={member.userId}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {member.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {member.email}
                    </p>
                  </div>
                </div>

                {isOwner && member.role !== "OWNER" ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="w-40">
                      <Select
                        value={member.role}
                        onValueChange={(v) =>
                          handleChangeRole(member.userId, v as WalletRole)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSIGNABLE_ROLES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {t(`app.wallets.roles.${r}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.userId)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                      aria-label={t("app.wallets.members.remove")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <RoleBadge role={member.role} />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PageHeader({ name }: { name?: string }) {
  const { t } = useTranslation();
  return (
    <header>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        {t("app.wallets.members.title")}
      </h1>
      {name && <p className="text-sm text-zinc-600">{name}</p>}
    </header>
  );
}
