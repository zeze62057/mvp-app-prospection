-- 0050 : contact WhatsApp de support, reglable par l'admin pour chaque espace.
--
-- Sert au bouton "Contacter sur WhatsApp" de la page de paiement, pour un client qui n'arrive pas a payer.
-- Le numero est stocke en chiffres seulement, indicatif pays inclus, sans "+" (format attendu par
-- wa.me). Il est lisible du public comme le reste de la table espaces (le bouton l'affiche de toute
-- facon). Ecriture : uniquement par le serveur (aucune policy d'ecriture sur espaces).

alter table public.espaces
  add column if not exists whatsapp_support text,
  add column if not exists whatsapp_message text;

alter table public.espaces drop constraint if exists espaces_whatsapp_support_format;
alter table public.espaces
  add constraint espaces_whatsapp_support_format
  check (whatsapp_support is null or whatsapp_support ~ '^[0-9]{8,15}$');

alter table public.espaces drop constraint if exists espaces_whatsapp_message_longueur;
alter table public.espaces
  add constraint espaces_whatsapp_message_longueur
  check (whatsapp_message is null or char_length(whatsapp_message) <= 300);
