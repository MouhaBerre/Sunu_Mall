/** @type {import('next').NextConfig} */
const nextConfig = {
  // "standalone" permet au Dockerfile de ne copier que le strict
  // nécessaire pour faire tourner l'app, sans tout node_modules.
  output: "standalone",
  images: {
    // À adapter avec le vrai domaine MinIO/CDN une fois en place
    remotePatterns: [{ protocol: "http", hostname: "localhost" }],
  },
};

module.exports = nextConfig;
