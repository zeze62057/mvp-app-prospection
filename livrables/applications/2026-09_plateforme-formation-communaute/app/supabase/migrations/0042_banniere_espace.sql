-- Banniere hero de la carte communaute (sidebar), une image par espace,
-- changeable par l'admin. Bucket PUBLIC (simple lecture, l'image n'a rien
-- de confidentiel) : contrairement aux avatars (bucket prive + liens
-- signes), il n'y a pas besoin de restreindre qui peut la voir.
--
-- Ecriture : aucune policy Storage, seul le service_role (route
-- /api/admin/banniere-espace, apres verifierAdmin) televerse.

alter table espaces add column if not exists banniere_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('bannieres-espaces', 'bannieres-espaces', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
