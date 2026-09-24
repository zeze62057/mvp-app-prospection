// Administration de l'espace client Chatllow, en ligne de commande (aucun ecran d'admin en V1).
// A lancer depuis app/ :
//   node scripts/chatllow-admin.mjs client   <email> "<Entreprise>" "<Nom du contact>"
//   node scripts/chatllow-admin.mjs projet   <email> "<Titre>" [--statut a_venir|en_cours|termine] [--avancement 0-100] [--description "..."]
//   node scripts/chatllow-admin.mjs livrable <email> <strategie|analyse|documentation|ressource> "<Titre>" <chemin/fichier.pdf> [--description "..."]
//   node scripts/chatllow-admin.mjs liste    <email>
//
// La cle serveur est lue dans un fichier local (jamais collee dans une conversation) : d'abord
// app/.env.local si SUPABASE_SERVICE_ROLE_KEY y est, sinon le .env.local de Vivier Academies, meme projet Supabase.
// Le mot de passe d'un nouveau client s'affiche une seule fois dans ce terminal : transmettez-le par un
// canal prive et demandez au client de le garder.

import { readFileSync, existsSync, statSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { basename } from "node:path";
import { createClient } from "@supabase/supabase-js";

function lireEnv(chemin) {
  const env = {};
  if (!existsSync(chemin)) return env;
  readFileSync(chemin, "utf8").split("\n").forEach((l) => {
    const m = l.match(/^([A-Z_0-9]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  });
  return env;
}
const local = lireEnv(new URL("../.env.local", import.meta.url));
const vivier = lireEnv(new URL("../../2026-09_plateforme-formation-communaute/app/.env.local", import.meta.url));
const url = local.NEXT_PUBLIC_SUPABASE_URL || vivier.NEXT_PUBLIC_SUPABASE_URL;
const cle = local.SUPABASE_SERVICE_ROLE_KEY || vivier.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !cle) {
  console.error("Cle serveur introuvable (SUPABASE_SERVICE_ROLE_KEY dans un .env.local).");
  process.exit(1);
}
const admin = createClient(url, cle, { auth: { autoRefreshToken: false, persistSession: false } });

const args = process.argv.slice(2);
const options = {};
const positionnels = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) options[args[i].slice(2)] = args[++i];
  else positionnels.push(args[i]);
}
const [commande, email, ...reste] = positionnels;
const echec = (m) => { console.error("Erreur :", m); process.exit(1); };

async function trouverClient(courriel) {
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const u = (data?.users ?? []).find((x) => x.email?.toLowerCase() === courriel.toLowerCase());
  if (!u) echec(`aucun compte pour ${courriel}`);
  const { data: c } = await admin.from("chatllow_clients").select("profil_id, entreprise").eq("profil_id", u.id).maybeSingle();
  if (!c) echec(`${courriel} n'est pas un client Chatllow`);
  return c;
}

if (commande === "client") {
  const [entreprise, contact] = reste;
  if (!email || !entreprise || !contact) echec('usage : client <email> "<Entreprise>" "<Contact>"');
  const motDePasse = randomBytes(12).toString("base64url");
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: motDePasse,
    email_confirm: true,
    user_metadata: { origine: "chatllow" }, // le declencheur Vivier ne cree alors aucun profil
  });
  if (error) echec(error.message);
  const { error: e2 } = await admin.from("chatllow_clients").insert({ profil_id: data.user.id, entreprise, contact });
  if (e2) {
    await admin.auth.admin.deleteUser(data.user.id);
    echec(e2.message);
  }
  console.log(`Client cree : ${contact} (${entreprise})`);
  console.log(`Connexion : ${email}`);
  console.log(`Mot de passe (affiche une seule fois) : ${motDePasse}`);
} else if (commande === "projet") {
  const [titre] = reste;
  if (!email || !titre) echec('usage : projet <email> "<Titre>" [--statut ...] [--avancement N] [--description "..."]');
  const c = await trouverClient(email);
  const ligne = {
    client_id: c.profil_id,
    titre,
    description: options.description ?? null,
    statut: options.statut ?? "en_cours",
    avancement: options.avancement ? Number(options.avancement) : 0,
  };
  const { error } = await admin.from("chatllow_projets").insert(ligne);
  if (error) echec(error.message);
  console.log(`Projet ajoute pour ${c.entreprise} : ${titre}`);
} else if (commande === "livrable") {
  const [categorie, titre, fichier] = reste;
  if (!email || !categorie || !titre) echec('usage : livrable <email> <categorie> "<Titre>" [fichier] [--description "..."]');
  const c = await trouverClient(email);
  let fichierPath = null;
  let tailleOctets = null;
  if (fichier) {
    if (!existsSync(fichier)) echec(`fichier introuvable : ${fichier}`);
    const contenu = readFileSync(fichier);
    tailleOctets = statSync(fichier).size;
    const nomSur = basename(fichier).normalize("NFD").replace(/[^\w.-]+/g, "_");
    fichierPath = `${c.profil_id}/${Date.now()}-${nomSur}`;
    const { error: eUp } = await admin.storage.from("chatllow-livrables").upload(fichierPath, contenu, { upsert: false });
    if (eUp) echec(eUp.message);
  }
  const { error } = await admin.from("chatllow_livrables").insert({
    client_id: c.profil_id,
    categorie,
    titre,
    description: options.description ?? null,
    fichier_path: fichierPath,
    taille_octets: tailleOctets,
  });
  if (error) echec(error.message);
  console.log(`Livrable ajoute pour ${c.entreprise} : ${titre} (${categorie})${fichierPath ? " avec fichier" : ""}`);
} else if (commande === "liste") {
  const c = await trouverClient(email);
  const { data: p } = await admin.from("chatllow_projets").select("titre, statut, avancement").eq("client_id", c.profil_id);
  const { data: l } = await admin.from("chatllow_livrables").select("categorie, titre, fichier_path").eq("client_id", c.profil_id);
  console.log(`${c.entreprise}\nProjets :`, p ?? [], "\nLivrables :", l ?? []);
} else {
  console.log("Commandes : client | projet | livrable | liste (voir l'en-tete du fichier).");
}
