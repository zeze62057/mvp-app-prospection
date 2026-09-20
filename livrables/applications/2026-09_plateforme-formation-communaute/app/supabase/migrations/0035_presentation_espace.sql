-- Lot 8 : page "A propos" d'un espace. Une video de presentation (YouTube) et un texte,
-- reglables par l'admin, lisibles par les membres de l'espace (meme regle que le message
-- d'accueil, migration 0024).
--
-- La video est stockee sous forme d'identifiant YouTube (11 caracteres), jamais d'adresse
-- libre : la page ne peut donc integrer que youtube-nocookie.com, pas un site quelconque.
-- L'ecriture n'a pas de policy : seul le service_role (actions admin) peut ecrire.

create table if not exists presentations_espace (
  espace_id uuid primary key references espaces (id) on delete cascade,
  video_youtube_id text check (video_youtube_id is null or video_youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  description text not null default '' check (length(description) <= 4000),
  updated_at timestamptz not null default now()
);

alter table presentations_espace enable row level security;

create policy "un membre lit la presentation de son espace"
  on presentations_espace for select
  to authenticated
  using (
    public.a_acces_zone(auth.uid(), espace_id, 'gratuite')
    or public.a_acces_zone(auth.uid(), espace_id, 'payante')
  );

revoke all on public.presentations_espace from anon;
revoke insert, update, delete on public.presentations_espace from authenticated;
