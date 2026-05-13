import { Building2, CreditCard, Users } from "lucide-react";

import { DashboardShell } from "@/components/ngantri/dashboard-shell";
import { MetricCard } from "@/components/ngantri/metric-card";

export default function AdminPage() {
  return (
    <DashboardShell title="SaaS Admin" description="Pantau tenant, subscription, dan usage limit Ngantri.">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Building2} label="Businesses" value={1} />
        <MetricCard icon={Users} label="Users" value={2} tone="green" />
        <MetricCard icon={CreditCard} label="Free tenants" value={1} tone="orange" />
      </div>
    </DashboardShell>
  );
}
