import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Pencil, Trash2, UserPlus } from "lucide-react";
import {
  addMember,
  deleteWallet,
  getWallet,
  listMembers,
  removeMember,
  updateMemberRole,
  updateWallet,
} from "@/services/walletService";
import type { Wallet, WalletMember, WalletRole } from "@/types/wallet";
import { paths } from "@/routes/paths";
import { RoleBadge } from "@/components/wallet/RoleBadge";

const ASSIGNABLE_ROLES: WalletRole[] = ["EDITOR", "VIEWER"];

export function WalletDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const walletId = Number(id);
  const navigate = useNavigate();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [members, setMembers] = useState<WalletMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<WalletRole>("VIEWER");
  const [addingMember, setAddingMember] = useState(false);

  async function load() {
    try {
      const [w, m] = await Promise.all([
        getWallet(walletId),
        listMembers(walletId),
      ]);
      setWallet(w);
      setMembers(m);
      setName(w.name);
      setDescription(w.description ?? "");
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("login.messages.generic_error"),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletId]);

  const isOwner = wallet?.role === "OWNER";

  function fail(err: unknown) {
    toast.error(
      err instanceof Error ? err.message : t("login.messages.generic_error"),
    );
  }

  async function handleSaveWallet(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await updateWallet(walletId, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success(t("app.wallets.updated"));
      setEditing(false);
      await load();
    } catch (err) {
      fail(err);
    }
  }

  async function handleDeleteWallet() {
    if (!window.confirm(t("app.wallets.confirm_delete"))) return;
    try {
      await deleteWallet(walletId);
      toast.success(t("app.wallets.deleted"));
      navigate(paths.wallets, { replace: true });
    } catch (err) {
      fail(err);
    }
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    setAddingMember(true);
    try {
      await addMember(walletId, {
        email: memberEmail.trim(),
        role: memberRole,
      });
      toast.success(t("app.wallets.member_added"));
      setMemberEmail("");
      setMemberRole("VIEWER");
      await load();
    } catch (err) {
      fail(err);
    } finally {
      setAddingMember(false);
    }
  }

  async function handleChangeRole(userId: number, role: WalletRole) {
    try {
      await updateMemberRole(walletId, userId, role);
      toast.success(t("app.wallets.member_updated"));
      await load();
    } catch (err) {
      fail(err);
    }
  }

  async function handleRemoveMember(userId: number) {
    if (!window.confirm(t("app.wallets.confirm_remove_member"))) return;
    try {
      await removeMember(walletId, userId);
      toast.success(t("app.wallets.member_removed"));
      await load();
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

  if (error || !wallet) {
    return (
      <div className="space-y-4">
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error ?? t("login.messages.generic_error")}
        </p>
        <Link
          to={paths.wallets}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("app.wallets.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to={paths.wallets}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("app.wallets.back")}
      </Link>

      {/* Wallet header / edit */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        {editing ? (
          <form onSubmit={handleSaveWallet} className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-zinc-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("app.wallets.description_placeholder")}
              className="w-full h-11 px-4 rounded-lg border border-zinc-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="h-10 rounded-lg px-4 font-semibold text-white cursor-pointer"
                style={{ background: "var(--gradient-primary)" }}
              >
                {t("app.wallets.save")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setName(wallet.name);
                  setDescription(wallet.description ?? "");
                }}
                className="h-10 rounded-lg px-4 font-medium text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                {t("app.wallets.cancel")}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-2xl font-bold tracking-tight text-zinc-900">
                  {wallet.name}
                </h1>
                <RoleBadge role={wallet.role} />
              </div>
              {wallet.description && (
                <p className="mt-1 text-sm text-zinc-600">
                  {wallet.description}
                </p>
              )}
              <p className="mt-2 text-xs text-zinc-400">
                {t("app.wallets.owner")}: {wallet.ownerName}
              </p>
            </div>
            {isOwner && (
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                  aria-label={t("app.wallets.edit")}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDeleteWallet}
                  className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                  aria-label={t("app.wallets.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Members */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          {t("app.wallets.members.title")}
        </h2>

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
              className="h-10 flex-1 px-4 rounded-lg border border-zinc-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
            <select
              value={memberRole}
              onChange={(e) => setMemberRole(e.target.value as WalletRole)}
              className="h-10 rounded-lg border border-zinc-200 px-3 outline-none focus:border-brand-500"
            >
              {ASSIGNABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {t(`app.wallets.roles.${r}`)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={addingMember}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-4 font-semibold text-white disabled:opacity-50 cursor-pointer"
              style={{ background: "var(--gradient-primary)" }}
            >
              <UserPlus className="h-4 w-4" />
              {t("app.wallets.members.add")}
            </button>
          </form>
        )}

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
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleChangeRole(
                        member.userId,
                        e.target.value as WalletRole,
                      )
                    }
                    className="h-8 rounded-lg border border-zinc-200 px-2 text-sm outline-none focus:border-brand-500"
                  >
                    {ASSIGNABLE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {t(`app.wallets.roles.${r}`)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.userId)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
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
      </section>
    </div>
  );
}
