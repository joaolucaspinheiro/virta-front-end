import { Outlet } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";

/** Public screens layout: hero on the left, form (Outlet) on the right. */
export function AuthLayout() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      <HeroSection />

      <section className="flex items-center justify-center p-6 lg:p-12 relative bg-zinc-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.08) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <Outlet />
      </section>
    </main>
  );
}
