import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { AuthError, changePassword } from "@/services/authService";
import { isStrongPassword } from "@/lib/passwordRules";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";

export function ChangePasswordPage() {
  const { t } = useTranslation();
  const { token } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  function validate(): boolean {
    const errs: typeof fieldErrors = {};
    if (!currentPassword)
      errs.current = t("login.validation.password_required");
    if (!isStrongPassword(newPassword))
      errs.new = t("login.validation.password_weak");
    if (newPassword !== confirmPassword)
      errs.confirm = t("login.validation.password_mismatch");
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !validate()) return;
    setLoading(true);
    try {
      await changePassword(token, currentPassword, newPassword);
      toast.success(t("app.change_password.success"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors({});
    } catch (err) {
      if (err instanceof AuthError) {
        if (err.messageKey === "auth.errors.server_unreachable") {
          toast.error(t(err.messageKey));
        } else {
          // Backend business error (e.g. wrong current password) shown on the field.
          setFieldErrors((prev) => ({ ...prev, current: t(err.messageKey) }));
        }
      } else {
        toast.error(t("login.messages.generic_error"));
      }
    } finally {
      setLoading(false);
    }
  }

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

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 lg:p-8"
      >
        <PasswordField
          id="current"
          label={t("app.change_password.current_label")}
          value={currentPassword}
          onChange={setCurrentPassword}
          show={show}
          onToggle={() => setShow((v) => !v)}
          error={fieldErrors.current}
        />

        <div className="space-y-2">
          <PasswordField
            id="new"
            label={t("app.change_password.new_label")}
            value={newPassword}
            onChange={setNewPassword}
            show={show}
            onToggle={() => setShow((v) => !v)}
            error={fieldErrors.new}
          />
          <PasswordChecklist password={newPassword} />
        </div>

        <PasswordField
          id="confirm"
          label={t("app.change_password.confirm_label")}
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={show}
          onToggle={() => setShow((v) => !v)}
          error={fieldErrors.confirm}
        />

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-lg font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
          style={{ background: "var(--gradient-primary)" }}
        >
          {loading ? t("login.actions.loading") : t("login.actions.save")}
        </button>
      </form>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-900">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 px-4 pr-12 rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
          aria-label="Toggle password"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
