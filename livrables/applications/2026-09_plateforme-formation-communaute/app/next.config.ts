import type { NextConfig } from "next";

// En-tetes de securite appliques a toutes les routes. Pas de CSP stricte tant
// que les embeds YouTube et les liens signes Supabase ne sont pas inventaries :
// une CSP mal reglee casserait les videos et les images du fil.
const ENTETES_SECURITE = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: ENTETES_SECURITE }];
  },
};

export default nextConfig;
