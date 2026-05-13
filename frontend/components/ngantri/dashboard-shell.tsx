import Link from "next/link";

import { NgantriLogo } from "@/components/ngantri/logo";
import { Button } from "@/components/ui/button";

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
  return (
    <main className="min-h-screen bg-[#F9FAFB] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <Link href="/" className="flex items-center gap-3">
          <NgantriLogo />
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black">{title}</h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">{description}</p>
            </div>
            <Button className="hidden h-11 rounded-2xl bg-blue-600 font-black hover:bg-blue-700 sm:inline-flex">
              Ambil Nomor
            </Button>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </section>
    </main>
  );
}
