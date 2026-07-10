import type { Metadata } from "next";
import { PageViewTracker } from "../components/PageViewTracker";
import { Providers } from "../components/Providers";
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
      <body>
        <Providers>
          <PageViewTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
