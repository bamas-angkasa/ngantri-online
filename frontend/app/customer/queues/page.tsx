import { Card, CardContent } from "@/components/ui/card";

export default function CustomerQueuesPage() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <Card className="mx-auto max-w-3xl rounded-[28px] shadow-sm">
        <CardContent className="p-6">
          <h1 className="text-3xl font-black">Antrean Saya</h1>
          <p className="mt-2 text-muted-foreground">Pantau antrean aktif dan riwayat kunjungan.</p>
        </CardContent>
      </Card>
    </main>
  );
}
