"use client";

import { useForm } from "react-hook-form";

import { NgantriLogo } from "@/components/ngantri/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LoginInput, RegisterInput } from "@/lib/validation/auth";

export function AuthCard({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const form = useForm<LoginInput | RegisterInput>({
    defaultValues: isRegister
      ? { name: "", email: "", password: "" }
      : { email: "", password: "" },
  });

  return (
    <main className="grid min-h-screen place-items-center bg-[#F9FAFB] px-4 py-10">
      <Card className="w-full max-w-md rounded-[28px] border-slate-100 bg-white shadow-xl shadow-slate-900/5">
        <CardContent className="p-6">
          <div className="mb-7">
            <NgantriLogo iconClassName="size-12" showText={false} />
            <h1 className="mt-5 text-3xl font-black">{isRegister ? "Daftar Ngantri" : "Masuk ke Ngantri"}</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">Kelola antrean, booking, dan cabang dari satu tempat.</p>
          </div>

          <form className="space-y-4" onSubmit={form.handleSubmit(() => undefined)}>
            {isRegister && (
              <label className="block">
                <span className="text-sm font-black">Nama</span>
                <input className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-blue-600" placeholder="Adi Owner" {...form.register("name" as keyof RegisterInput)} />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-black">Email</span>
              <input className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-blue-600" placeholder="owner@barberadi.test" type="email" {...form.register("email")} />
            </label>
            <label className="block">
              <span className="text-sm font-black">Password</span>
              <input className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-blue-600" placeholder="Minimal 8 karakter" type="password" {...form.register("password")} />
            </label>
            <Button className="h-12 w-full rounded-2xl bg-blue-600 font-black hover:bg-blue-700">
              {isRegister ? "Daftar" : "Masuk"}
            </Button>
            <Button type="button" variant="outline" className="h-12 w-full rounded-2xl font-black">
              Continue with Google
            </Button>
            <p className="text-center text-sm font-semibold text-slate-500">Forgot password placeholder</p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
