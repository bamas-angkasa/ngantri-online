"use client";

import { Building2, CreditCard, Users } from "lucide-react";

import { DashboardShell } from "@/components/ngantri/dashboard-shell";
import { MetricCard } from "@/components/ngantri/metric-card";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminData } from "@/lib/api/queries";

export default function AdminPage() {
  const { data, isLoading, error } = useAdminData();
  const freeTenants = data?.businesses.filter((business) => business.subscriptionPlan === "free").length ?? 0;

  return (
    <DashboardShell title="SaaS Admin" description="Pantau tenant, user, subscription, dan status Ngantri.">
      {isLoading && <p className="text-sm font-bold text-muted-foreground">Memuat admin...</p>}
      {error && <p className="text-sm font-bold text-destructive">Admin data belum bisa dimuat.</p>}
      {data && (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard icon={Building2} label="Businesses" value={data.businesses.length} />
            <MetricCard icon={Users} label="Users" value={data.users.length} tone="green" />
            <MetricCard icon={CreditCard} label="Free tenants" value={freeTenants} tone="orange" />
          </div>
          <Card className="rounded-[24px] shadow-sm">
            <CardContent className="p-5">
              <h2 className="text-xl font-black">Businesses</h2>
              <div className="mt-4 space-y-3">
                {data.businesses.map((business) => (
                  <div key={business.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4">
                    <div>
                      <p className="font-black">{business.name}</p>
                      <p className="text-sm font-semibold text-muted-foreground">/{business.slug}</p>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-black">{business.subscriptionPlan}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
