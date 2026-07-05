import type { ReactNode } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KeyRound, LayoutDashboard, LogOut, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import { WaveMark } from "@/components/WaveMark";

/** Authenticated area shell: sidebar nav + top bar + content (Outlet). */
export function AppLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(paths.login, { replace: true });
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-zinc-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col border-r border-zinc-200 bg-white p-5">
        <div className="mb-8 flex items-center gap-2 px-2">
          <WaveMark className="h-7 w-7 text-brand-500" />
          <span className="text-lg font-bold text-zinc-900">Virta</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink
            to={paths.dashboard}
            icon={<LayoutDashboard className="h-4 w-4" />}
            label={t("app.nav.dashboard")}
          />
          <SidebarLink
            to={paths.wallets}
            icon={<Wallet className="h-4 w-4" />}
            label={t("app.nav.wallets")}
          />
          <SidebarLink
            to={paths.changePassword}
            icon={<KeyRound className="h-4 w-4" />}
            label={t("app.nav.change_password")}
          />
        </nav>

        <UserCard initial={initial} name={user?.name} email={user?.email} avatarUrl={user?.avatarUrl} />
      </aside>

      {/* Content */}
      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
          <div className="flex items-center gap-2 md:hidden">
            <WaveMark className="h-6 w-6 text-brand-500" />
            <span className="font-bold text-zinc-900">Virta</span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            <span className="hidden text-sm text-zinc-600 sm:inline">
              {user?.name}
            </span>
            <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-brand-500 text-sm font-semibold text-white">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("app.logout")}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-brand-500/10 text-brand-500"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

function UserCard({
  initial,
  name,
  email,
  avatarUrl,
}: {
  initial: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-500 text-sm font-semibold text-white">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-900">{name}</p>
        <p className="truncate text-xs text-zinc-500">{email}</p>
      </div>
    </div>
  );
}
