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
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    orange: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    red: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    slate: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="rounded-[24px] shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <span className={`grid size-12 place-items-center rounded-2xl ${tones[tone]}`}>
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-muted-foreground">{label}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
