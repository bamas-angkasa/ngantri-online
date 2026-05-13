"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { NgantriLogo } from "@/components/ngantri/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APIClientError } from "@/lib/api/client";
import { login, register } from "@/lib/api/auth";
import type { LoginInput, RegisterInput } from "@/lib/validation/auth";

export function AuthCard({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isRegister = mode === "register";
  const form = useForm<LoginInput | RegisterInput>({
    defaultValues: isRegister
      ? { name: "", businessName: "", email: "", password: "" }
      : { email: "", password: "" },
  });
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: LoginInput | RegisterInput) {
    setError(null);

    try {
      if (isRegister) {
        const registerValues = values as RegisterInput;
        await register({
          name: registerValues.name,
          businessName: registerValues.businessName,
          email: registerValues.email,
          password: registerValues.password,
        });
      } else {
        await login({
          email: values.email,
          password: values.password,
        });
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof APIClientError) {
        setError(err.message);
        return;
      }
      setError("Gagal masuk. Coba lagi sebentar.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-md rounded-[28px] shadow-xl shadow-slate-900/5 dark:shadow-black/20">
        <CardContent className="p-6">
          <div className="mb-7">
            <NgantriLogo iconClassName="size-12" />
            <h1 className="mt-5 text-3xl font-black">{isRegister ? "Daftar Ngantri" : "Masuk ke Ngantri"}</h1>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">Kelola antrean, booking, dan cabang dari satu tempat.</p>
          </div>

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {isRegister && (
              <label className="block">
                <span className="text-sm font-black">Nama</span>
                <input className="mt-2 h-12 w-full rounded-2xl border border-input bg-background px-4 outline-none focus:border-primary" placeholder="Adi Owner" {...form.register("name" as keyof RegisterInput)} />
              </label>
            )}
            {isRegister && (
              <label className="block">
                <span className="text-sm font-black">Nama Bisnis</span>
                <input className="mt-2 h-12 w-full rounded-2xl border border-input bg-background px-4 outline-none focus:border-primary" placeholder="Barber Adi" {...form.register("businessName" as keyof RegisterInput)} />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-black">Email</span>
              <input className="mt-2 h-12 w-full rounded-2xl border border-input bg-background px-4 outline-none focus:border-primary" placeholder="owner@barberadi.test" type="email" {...form.register("email")} />
            </label>
            <label className="block">
              <span className="text-sm font-black">Password</span>
              <input className="mt-2 h-12 w-full rounded-2xl border border-input bg-background px-4 outline-none focus:border-primary" placeholder="Minimal 8 karakter" type="password" {...form.register("password")} />
            </label>
            {error && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-bold text-destructive">
                {error}
              </div>
            )}
            <Button className="h-12 w-full rounded-2xl font-black" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}
            </Button>
            <Button type="button" variant="outline" className="h-12 w-full rounded-2xl font-black">
              Lanjut dengan Google
            </Button>
            <p className="text-center text-sm font-semibold text-muted-foreground">Reset password segera hadir</p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
