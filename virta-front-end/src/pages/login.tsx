import { Waves } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      // simulação de request
      await new Promise((r) => setTimeout(r, 1000));

      if (isRegister) {
        console.log("registrando usuário...");
      } else {
        console.log("fazendo login...");
      }

      // sucesso
      console.log("success");
    } catch (err) {
      setError("Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <div className="w-full h-screen flex relative">
      {/* Seletor de Idioma - Topo Esquerda */}
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <button
          onClick={() => changeLanguage("pt")}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${i18n.language === "pt" ? "bg-white text-brand-500" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          PT
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${i18n.language === "en" ? "bg-white text-brand-500" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          EN
        </button>
      </div>
      {/* Logo */}
      <div className="flex-1 bg-brand-500 hidden lg:flex flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <Waves size={24} className="animate-float" />
          </div>
          <span>Virta</span>
        </div>
        {/* Proposta de valor */}
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            {t("login.branding.title")}
          </h1>
          <p className="text-lg font-bold mb-6">
            {t("login.branding.description")}
          </p>
        </div>
        {/* Rodapé */}
        <div className="text-sm text-brand-200">
          {t("login.branding.footer")}
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 bg-zinc-50 flex items-center justify-center">
        <form
          className="w-full max-w-md bg-zinc-50 p-8 rounded-2xl shadow-lg"
          onSubmit={handleSubmit}
        >
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}
          <h2 className="text-2xl font-bold text-zinc-900 mb-2 text-center">
            {t("login.form.title")}
          </h2>
          <p className="text-sm text-zinc-600 text-center mb-6 leading-tight">
            {t("login.form.description")}
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {t("login.form.email_label")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border  rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500/30"
              placeholder={t("login.form.email_placeholder")}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {t("login.form.password_label")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border  rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500/30"
                placeholder={t("login.form.password_placeholder")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? t("login.actions.loading") : t("login.actions.submit")}
          </button>
          <button
            type="button"
            onClick={() => setIsRegister((prev) => !prev)}
            className="mt-4 text-sm text-brand-500 hover:underline w-full"
          >
            {isRegister ? "Já tem conta? Entrar" : "Não tem conta? Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
