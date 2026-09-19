// Applique un fichier de migration SQL contre la base Supabase du projet.
// Usage : node scripts/run-migration.mjs supabase/migrations/0001_espaces.sql
import { readFileSync } from "node:fs";
import { Client } from "pg";

const envPath = new URL("../.env.local", import.meta.url);
const env = {};
readFileSync(envPath, "utf8")
  .split("\n")
  .forEach((line) => {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  });

const migrationPath = process.argv[2];
if (!migrationPath) {
  console.error("Usage: node scripts/run-migration.mjs <fichier.sql>");
  process.exit(1);
}
const sql = readFileSync(migrationPath, "utf8");

// Hote/utilisateur/base du pooler Supabase (pas secrets, ref projet publique dans l'URL du site)
const client = new Client({
  host: "aws-0-eu-central-1.pooler.supabase.com",
  port: 5432,
  user: "postgres.uomcecactzqfxdhsfyey",
  password: env.SUPABASE_DB_PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log("Migration appliquee avec succes :", migrationPath);
} catch (err) {
  console.error("Echec de la migration :", err.message);
  process.exit(1);
} finally {
  await client.end();
}
