import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build autonome : Docker ne copie que .next/standalone + .next/static
  output: "standalone",
  // Le lint (prettier/CRLF) est une préoccupation CI/dev, pas du build image.
  // Le checkout Windows introduit des CRLF qui feraient échouer ESLint ici.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
