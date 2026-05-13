import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const plans = [
  ["Free", "Mulai digital", "1 cabang, 10 antrean/bulan, 2 template"],
  ["Pro", "Rp49rb/bulan", "Multi cabang, warna custom, analytics"],
  ["Business", "Rp149rb/bulan", "Multi-admin, analytics lanjutan, priority support"],
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="font-black text-blue-700">Ngantri</Link>
        <h1 className="mt-8 text-4xl font-black">Harga yang ramah UMKM.</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Mulai dari antrean digital sederhana, lalu naik kelas saat bisnis makin ramai.</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {plans.map(([name, price, detail]) => (
            <Card key={name} className="rounded-[28px] border-slate-100 bg-white shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-black">{name}</h2>
                <p className="mt-3 text-3xl font-black">{price}</p>
                <p className="mt-3 min-h-14 text-sm leading-6 text-slate-600">{detail}</p>
                <Button className="mt-6 h-12 w-full rounded-2xl bg-blue-600 font-black hover:bg-blue-700">Pilih Paket</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
