import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BranchStaff, QueueItem } from "@/lib/contracts";

type StaffLaneQueueBoardProps = {
  staff: BranchStaff[];
  queues: QueueItem[];
  mode?: "admin" | "public";
  onCallNext?: (staffId: string) => void;
  onStartServing?: (queueId: string) => void;
  onComplete?: (queueId: string) => void;
};

export function StaffLaneQueueBoard({ staff, queues, mode = "admin", onCallNext, onStartServing, onComplete }: StaffLaneQueueBoardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {staff.map((person) => {
        const laneQueues = queues.filter((queue) => queue.staffId === person.id);
        const called = laneQueues.find((queue) => queue.status === "called");
        const serving = laneQueues.find((queue) => queue.status === "serving") ?? called;
        const waiting = laneQueues.filter((queue) => queue.status === "waiting");

        return (
          <Card key={person.id} className="rounded-[24px] shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black">{person.name}</h3>
                  <p className="text-sm font-semibold text-muted-foreground">{person.roleLabel}</p>
                </div>
                <Badge className={person.isAvailable ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-muted text-muted-foreground hover:bg-muted"}>
                  {person.isAvailable ? "Aktif" : "Istirahat"}
                </Badge>
              </div>

              <div className="mt-5 rounded-[22px] bg-foreground p-4 text-background">
                <p className="text-xs font-bold text-background/70">{called ? "Dipanggil" : "Serving"}</p>
                <p className="mt-2 text-4xl font-black">{serving?.queueNumber ?? "-"}</p>
              </div>

              <div className="mt-4 space-y-2">
                {waiting.length > 0 ? (
                  waiting.map((queue) => (
                    <div key={queue.id} className="flex items-center justify-between rounded-2xl border border-border bg-muted p-3">
                      <span className="font-black">{queue.queueNumber}</span>
                      <span className="text-xs font-bold text-muted-foreground">{queue.estimatedWaitMinutes} menit</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border p-4 text-center text-sm font-bold text-muted-foreground">
                    Belum ada antrean
                  </div>
                )}
              </div>

              {mode === "admin" && (
                <div className="mt-5 grid gap-2">
                  {called && (
                    <Button variant="outline" className="h-11 w-full rounded-2xl font-black" onClick={() => onStartServing?.(called.id)}>
                      Mulai Layani
                    </Button>
                  )}
                  {serving?.status === "serving" && (
                    <Button variant="outline" className="h-11 w-full rounded-2xl font-black" onClick={() => onComplete?.(serving.id)}>
                      Selesai
                    </Button>
                  )}
                  <Button className="h-12 w-full rounded-2xl font-black" onClick={() => onCallNext?.(person.id)}>
                    Panggil Berikutnya
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
