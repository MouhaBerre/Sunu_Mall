import type { Metadata } from "next";
import "@/styles.css";

export const metadata: Metadata = {
  title: "SUNU MALL — La marketplace du Sénégal",
  description: "SUNU MALL : marketplace sénégalaise moderne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
