import type { MetadataRoute } from "next";

// Les espaces membres et l'administration ne sont pas a indexer : seules les
// vitrines publiques (et la racine, qui redirige vers l'une d'elles) le sont.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/*/communaute", "/*/tunnel", "/*/formation"],
    },
  };
}
