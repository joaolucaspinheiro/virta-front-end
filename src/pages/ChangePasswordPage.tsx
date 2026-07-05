import { useTranslation } from "react-i18next";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

export function ChangePasswordPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-lg">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {t("app.change_password.title")}
        </h1>
        <p className="text-sm text-zinc-600">
          {t("app.change_password.description")}
        </p>
      </header>
      <ChangePasswordForm />
    </div>
  );
}
