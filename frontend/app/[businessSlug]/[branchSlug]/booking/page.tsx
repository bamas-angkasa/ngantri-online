"use client";

import { CalendarClock } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createBooking } from "@/lib/api/booking";
import { usePublicBusiness } from "@/lib/api/queries";

export default function PublicBookingPage() {
  const params = useParams<{ businessSlug: string; branchSlug: string }>();
  const { data, isLoading, error } = usePublicBusiness(params.businessSlug, params.branchSlug);
  const branch = data?.branches.find((item) => item.slug === params.branchSlug);
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const selectedServiceId = serviceId || data?.services[0]?.id || "";
  const selectedStaffId = staffId || data?.staff[0]?.id || "";
  const startTime = useMemo(() => {
    if (!date || !time) {
      return "";
    }
    return new Date(`${date}T${time}:00+07:00`).toISOString();
  }, [date, time]);

  const booking = useMutation({
    mutationFn: createBooking,
  });

  function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!branch || !selectedServiceId || !startTime || !customerName.trim()) {
      return;
    }
    booking.mutate({
      branchId: branch.id,
      serviceId: selectedServiceId,
      staffId: selectedStaffId || undefined,
      customerName,
      customerEmail,
      startTime,
    });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-xl rounded-[28px] shadow-xl shadow-slate-900/5 dark:shadow-black/20">
        <CardContent className="p-6">
          <div className="grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <CalendarClock className="size-7" />
          </div>
          <h1 className="mt-5 text-3xl font-black">Booking Online</h1>
          <p className="mt-2 text-muted-foreground">{branch ? `Pilih jadwal di ${branch.name}.` : "Pilih layanan, staff, tanggal, dan jam."}</p>

          {isLoading && <p className="mt-6 text-sm font-bold text-muted-foreground">Memuat data booking...</p>}
          {error && <p className="mt-6 text-sm font-bold text-destructive">Data booking belum tersedia.</p>}

          {data && branch && (
            <form className="mt-6 grid gap-3" onSubmit={submitBooking}>
              <label className="grid gap-2 text-sm font-black">
                Nama
                <input className="h-12 rounded-2xl border border-input bg-background px-4 font-semibold outline-none focus:border-primary" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Email
                <input className="h-12 rounded-2xl border border-input bg-background px-4 font-semibold outline-none focus:border-primary" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} type="email" />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Layanan
                <select className="h-12 rounded-2xl border border-input bg-background px-4 font-semibold outline-none focus:border-primary" value={selectedServiceId} onChange={(event) => setServiceId(event.target.value)}>
                  {data.services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.durationMinutes} menit
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black">
                Staff
                <select className="h-12 rounded-2xl border border-input bg-background px-4 font-semibold outline-none focus:border-primary" value={selectedStaffId} onChange={(event) => setStaffId(event.target.value)}>
                  {data.staff.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-black">
                  Tanggal
                  <input className="h-12 rounded-2xl border border-input bg-background px-4 font-semibold outline-none focus:border-primary" value={date} onChange={(event) => setDate(event.target.value)} type="date" required />
                </label>
                <label className="grid gap-2 text-sm font-black">
                  Jam
                  <input className="h-12 rounded-2xl border border-input bg-background px-4 font-semibold outline-none focus:border-primary" value={time} onChange={(event) => setTime(event.target.value)} type="time" required />
                </label>
              </div>
              <Button className="mt-3 h-12 w-full rounded-2xl font-black" disabled={booking.isPending || !selectedServiceId || !startTime}>
                {booking.isPending ? "Menyimpan booking..." : "Konfirmasi Booking"}
              </Button>
            </form>
          )}

          {booking.data && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-black text-emerald-800">
              Booking {booking.data.bookingCode} berhasil dibuat untuk {new Date(booking.data.startTime).toLocaleString("id-ID")}.
            </div>
          )}
          {booking.error && <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-black text-destructive">Booking gagal dibuat.</div>}
        </CardContent>
      </Card>
    </main>
  );
}
