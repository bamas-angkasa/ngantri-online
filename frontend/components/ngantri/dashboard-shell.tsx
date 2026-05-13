"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { NgantriLogo } from "@/components/ngantri/logo";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout as logoutRequest } from "@/lib/api/auth";

const navItems = [
  ["Overview", "/dashboard"],
  ["Live Queue", "/dashboard/queues"],
  ["Bookings", "/dashboard/bookings"],
  ["Branches", "/dashboard/branches"],
  ["Staff", "/dashboard/staff"],
  ["Services", "/dashboard/services"],
  ["Customers", "/dashboard/customers"],
  ["Theme", "/dashboard/theme"],
  ["QR Code", "/dashboard/qr"],
  ["Analytics", "/dashboard/analytics"],
  ["Subscription", "/dashboard/subscription"],
  ["Settings", "/dashboard/settings"],
] as const;

export function DashboardShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  async function logout() {
    await logoutRequest();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-card p-5 lg:block">
        <Link href="/" className="flex items-center gap-3">
          <NgantriLogo />
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded-2xl px-4 py-3 text-sm font-bold text-muted-foreground transition hover:bg-accent hover:text-accent-foreground">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black">{title}</h1>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-black">{user.name}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{user.email}</p>
                </div>
              )}
              <Button asChild className="hidden h-11 rounded-2xl font-black sm:inline-flex">
                <Link href="/dashboard/queues">Ambil Nomor</Link>
              </Button>
              <Button type="button" variant="outline" className="h-11 rounded-2xl font-black" onClick={logout}>
                Keluar
              </Button>
            </div>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </section>
    </main>
  );
}
