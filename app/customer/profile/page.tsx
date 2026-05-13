import { Card, CardContent } from "@/components/ui/card";

export default function CustomerProfilePage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 sm:p-8">
      <Card className="mx-auto max-w-2xl rounded-[28px] border-slate-100 bg-white shadow-sm">
        <CardContent className="p-6">
          <h1 className="text-3xl font-black">Profil Customer</h1>
          <p className="mt-2 text-slate-600">Kelola nama, email, dan preferensi notifikasi.</p>
        </CardContent>
      </Card>
    </main>
  );
}
