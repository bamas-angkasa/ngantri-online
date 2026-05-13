import type { Metadata, Viewport } from "next";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://ngantri.id"),
  title: {
    default: "Ngantri - Datang pas giliranmu",
    template: "%s | Ngantri",
  },
  description:
    "Ngantri membantu UMKM jasa menampilkan antrean realtime, estimasi waktu, reservasi online, dan halaman antrean publik.",
  keywords: [
    "Ngantri",
    "antrean online",
    "reservasi online",
    "queue management",
    "UMKM Indonesia",
    "barbershop",
    "klinik",
    "bengkel",
    "salon",
  ],
  openGraph: {
    title: "Ngantri - Datang pas giliranmu",
    description:
      "Queue management dan reservasi online untuk UMKM jasa Indonesia.",
    url: "https://ngantri.id",
    siteName: "Ngantri",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ngantri - Datang pas giliranmu",
    description:
      "Queue management dan reservasi online untuk UMKM jasa Indonesia.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
