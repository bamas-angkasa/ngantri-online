import { Card, CardContent } from "@/components/ui/card";

export default function CustomerProfilePage() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <Card className="mx-auto max-w-2xl rounded-[28px] shadow-sm">
        <CardContent className="p-6">
          <h1 className="text-3xl font-black">Profil Customer</h1>
          <p className="mt-2 text-muted-foreground">Kelola nama, email, dan preferensi notifikasi.</p>
        </CardContent>
      </Card>
    </main>
  );
}
