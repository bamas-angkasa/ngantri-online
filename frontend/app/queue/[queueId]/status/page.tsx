import { Clock3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default async function QueueStatusPage({
  params,
}: {
  params: Promise<{ queueId: string }>;
}) {
  const { queueId } = await params;
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-md rounded-[28px] shadow-xl shadow-slate-900/5 dark:shadow-black/20">
        <CardContent className="p-6 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Clock3 className="size-7" />
          </div>
          <p className="mt-5 text-sm font-black uppercase text-muted-foreground">Status antrean</p>
          <h1 className="mt-2 text-5xl font-black">A-16</h1>
          <p className="mt-3 font-semibold text-muted-foreground">ID: {queueId}</p>
          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">3 antrean lagi, silakan bersiap.</div>
        </CardContent>
      </Card>
    </main>
  );
}
