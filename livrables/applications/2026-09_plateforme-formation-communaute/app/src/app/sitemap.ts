import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

// Une entree par espace actif : la vitrine publique est la seule page a
// indexer (voir robots.ts). Lecture cote serveur uniquement, jamais exposee.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_URL_SITE ?? "https://vivier-academies-zeze62057.vercel.app";

  const admin = createAdminClient();
  const { data: espaces } = await admin.from("espaces").select("slug").eq("actif", true);

  return (espaces ?? []).map((espace) => ({
    url: `${base}/${espace.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}
