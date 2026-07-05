import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/services/userService";
import { ApiError } from "@/lib/http";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

export function ProfilePage() {
  const { t } = useTranslation();
  const { user, token, setSession } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !token) return;
    if (name.trim().length < 2) {
      setNameError(t("app.profile.name_min"));
      return;
    }
    setNameError(null);
    setSaving(true);
    try {
      const updated = await updateProfile(name.trim());
      // Reflect the new name across the app (header, sidebar).
      setSession({ token, user: { ...user, name: updated.name } });
      toast.success(t("app.profile.updated"));
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : t("login.messages.generic_error"),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {t("app.profile.title")}
        </h1>
        <p className="text-sm text-zinc-600">{t("app.profile.subtitle")}</p>
      </header>

      {/* Account details */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">
          {t("app.profile.section_info")}
        </h2>
        <form
          onSubmit={handleSaveProfile}
          noValidate
          className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 lg:p-8"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-900">
              {t("app.profile.name_label")}
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-zinc-200 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            />
            {nameError && <p className="text-xs text-red-500">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-900">
              {t("app.profile.email_label")}
            </label>
            <input
              id="email"
              value={user?.email ?? ""}
              disabled
              className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="h-11 rounded-lg px-5 font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
            style={{ background: "var(--gradient-primary)" }}
          >
            {saving ? t("login.actions.loading") : t("app.profile.save")}
          </button>
        </form>
      </section>

      {/* Security */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">
          {t("app.profile.section_security")}
        </h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
