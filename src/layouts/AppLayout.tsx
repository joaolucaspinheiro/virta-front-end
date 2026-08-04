import type { ReactNode } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DropdownMenu } from "radix-ui";
import {
  ArrowLeftRight,
  LayoutDashboard,
  LogOut,
  Settings,
  Tags,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";
import { paths } from "@/routes/paths";
import { WaveMark } from "@/components/WaveMark";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { WalletSwitcher } from "@/components/wallet/WalletSwitcher";

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
    <WalletProvider>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-zinc-50">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col border-r border-zinc-200 bg-white p-5">
          <Link
            to={paths.dashboard}
            className="mb-5 flex items-center gap-2 px-2 outline-none"
            aria-label="Virta"
          >
            <WaveMark className="h-7 w-7 text-brand-500" />
            <span className="text-lg font-bold text-zinc-900">Virta</span>
          </Link>

          <WalletSwitcher />

          <nav className="mt-6 flex-1 space-y-1">
            <SidebarLink
              to={paths.dashboard}
              icon={<LayoutDashboard className="h-4 w-4" />}
              label={t("app.nav.dashboard")}
            />
            <SidebarLink
              to={paths.transactions}
              icon={<ArrowLeftRight className="h-4 w-4" />}
              label={t("app.nav.transactions")}
            />
            <SidebarLink
              to={paths.members}
              icon={<Users className="h-4 w-4" />}
              label={t("app.nav.members")}
            />
            <SidebarLink
              to={paths.categories}
              icon={<Tags className="h-4 w-4" />}
              label={t("app.nav.categories")}
            />
            <SidebarLink
              to={paths.walletSettings}
              icon={<Settings className="h-4 w-4" />}
              label={t("app.nav.settings")}
            />
          </nav>

          <UserCard
            initial={initial}
            name={user?.name}
            email={user?.email}
            avatarUrl={user?.avatarUrl}
          />
        </aside>

        {/* Content */}
        <div className="flex flex-col">
          <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
            <Link to={paths.dashboard} className="flex items-center gap-2 md:hidden" aria-label="Virta">
              <WaveMark className="h-6 w-6 text-brand-500" />
              <span className="font-bold text-zinc-900">Virta</span>
            </Link>
            <div className="flex flex-1 items-center justify-end gap-3">
              <LanguageSwitcher />
              <UserMenu
                initial={initial}
                name={user?.name}
                email={user?.email}
                avatarUrl={user?.avatarUrl}
                onLogout={handleLogout}
              />
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </WalletProvider>
  );
}

function UserMenu({
  initial,
  name,
  email,
  avatarUrl,
  onLogout,
}: {
  initial: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  onLogout: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        title={name}
        className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-brand-500 text-sm font-semibold text-white outline-none transition-all hover:ring-2 hover:ring-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[13rem] rounded-xl border border-zinc-200 bg-white p-1 shadow-lg"
        >
          <div className="px-2 py-2">
            <p className="truncate text-sm font-medium text-zinc-900">{name}</p>
            <p className="truncate text-xs text-zinc-500">{email}</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-zinc-100" />
          <DropdownMenu.Item
            onSelect={() => navigate(paths.profile)}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-700 outline-none transition-colors data-[highlighted]:bg-zinc-100"
          >
            <User className="h-4 w-4" />
            {t("app.nav.profile")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={onLogout}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-red-600 outline-none transition-colors data-[highlighted]:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            {t("app.logout")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
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
  const { t } = useTranslation();
  return (
    <Link
      to={paths.profile}
      title={t("app.nav.profile")}
      className="mt-4 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:bg-zinc-100"
    >
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
    </Link>
  );
}
