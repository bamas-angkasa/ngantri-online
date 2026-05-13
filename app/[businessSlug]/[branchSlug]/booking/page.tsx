import { CalendarClock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PublicBookingPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F9FAFB] px-4 py-10">
      <Card className="w-full max-w-xl rounded-[28px] border-slate-100 bg-white shadow-xl shadow-slate-900/5">
        <CardContent className="p-6">
          <div className="grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-700">
            <CalendarClock className="size-7" />
          </div>
          <h1 className="mt-5 text-3xl font-black">Booking Online</h1>
          <p className="mt-2 text-slate-600">Pilih layanan, staff, tanggal, dan jam. Form ini siap dihubungkan ke endpoint booking.</p>
          <div className="mt-6 grid gap-3">
            {["Layanan", "Staff", "Tanggal", "Jam"].map((label) => (
              <div key={label} className="rounded-2xl border border-slate-200 p-4 font-bold text-slate-500">{label}</div>
            ))}
          </div>
          <Button className="mt-6 h-12 w-full rounded-2xl bg-blue-600 font-black hover:bg-blue-700">Konfirmasi Booking</Button>
        </CardContent>
      </Card>
    </main>
  );
}
