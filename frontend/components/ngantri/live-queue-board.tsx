import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BranchStaff, QueueItem } from "@/lib/contracts";

type StaffLaneQueueBoardProps = {
  staff: BranchStaff[];
  queues: QueueItem[];
};

export function StaffLaneQueueBoard({ staff, queues }: StaffLaneQueueBoardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {staff.map((person) => {
        const laneQueues = queues.filter((queue) => queue.staffId === person.id);
        const serving = laneQueues.find((queue) => queue.status === "serving");
        const waiting = laneQueues.filter((queue) => queue.status === "waiting");

        return (
          <Card key={person.id} className="rounded-[24px] border-slate-100 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black">{person.name}</h3>
                  <p className="text-sm font-semibold text-slate-500">{person.roleLabel}</p>
                </div>
                <Badge className={person.isAvailable ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}>
                  {person.isAvailable ? "Aktif" : "Istirahat"}
                </Badge>
              </div>

              <div className="mt-5 rounded-[22px] bg-slate-950 p-4 text-white">
                <p className="text-xs font-bold text-slate-300">Serving</p>
                <p className="mt-2 text-4xl font-black">{serving?.queueNumber ?? "-"}</p>
              </div>

              <div className="mt-4 space-y-2">
                {waiting.length > 0 ? (
                  waiting.map((queue) => (
                    <div key={queue.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <span className="font-black">{queue.queueNumber}</span>
                      <span className="text-xs font-bold text-slate-500">{queue.estimatedWaitMinutes} menit</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm font-bold text-slate-500">
                    Belum ada antrean
                  </div>
                )}
              </div>

              <Button className="mt-5 h-12 w-full rounded-2xl bg-blue-600 font-black hover:bg-blue-700">
                Panggil Berikutnya
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
