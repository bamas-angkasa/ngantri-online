import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  icon: Icon,
  label,
  value,
  tone = "blue",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: "blue" | "orange" | "green" | "red" | "slate";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <Card className="rounded-[24px] border-slate-100 bg-white shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <span className={`grid size-12 place-items-center rounded-2xl ${tones[tone]}`}>
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
