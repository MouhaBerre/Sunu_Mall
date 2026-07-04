import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "SUNU MALL — La marketplace sénégalaise",
  description: "Achetez et vendez en ligne, partout au Sénégal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
