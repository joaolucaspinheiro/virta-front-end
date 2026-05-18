import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* HERO SECTION (Lado Esquerdo) */}
      <HeroSection />

      {/* CONTAINER DOS FORMULÁRIOS (Lado Direito) */}
      <section className="flex items-center justify-center p-6 lg:p-12 relative bg-zinc-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.08) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Escolha Dinâmica baseada no Estado */}
        {isRegister ? (
          <RegisterForm onToggleLogin={() => setIsRegister(false)} />
        ) : (
          <LoginForm onToggleRegister={() => setIsRegister(true)} />
        )}
      </section>
    </main>
  );
}
