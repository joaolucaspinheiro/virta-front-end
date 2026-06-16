import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { VerificationForm } from "@/components/VerificationForm";

export function LoginPage() {
  // Substituímos o booleano por uma Máquina de Estados profissional de 3 etapas
  const [step, setStep] = useState<"login" | "register" | "verify">("login");

  return (
    <main className="h-screen grid lg:grid-cols-2 bg-background overflow-hidden">
      {/* HERO SECTION (Lado Esquerdo) */}
      <HeroSection />

      {/* CONTAINER DOS FORMULÁRIOS (Lado Direito) */}
      <section className="flex items-center justify-center p-6 lg:p-12 relative bg-zinc-50 overflow-y-auto">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.08) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Gerenciamento das 3 Telas baseadas no Step */}
        {step === "login" && (
          <LoginForm onToggleRegister={() => setStep("register")} />
        )}

        {step === "register" && (
          <RegisterForm
            onToggleLogin={() => setStep("login")}
            onSignUpSuccess={() => setStep("verify")}
          />
        )}

        {step === "verify" && (
          <VerificationForm
            onSuccess={() =>
              console.log("Usuário Confirmado! Redirecionar pro Dashboard.")
            }
            onCancel={() => setStep("login")}
          />
        )}
      </section>
    </main>
  );
}
