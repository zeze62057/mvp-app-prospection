// Texte d'un post ou d'un commentaire, avec les @mentions mises en evidence. Purement visuel :
// c'est la base qui previent le membre nomme (migration 0033). Pas de lien : le pseudo n'est
// pas unique, on ne sait donc pas quel profil ouvrir.
//
// Une mention visible = "@" suivi d'un mot (lettres, chiffres, souligne, apostrophe, tiret, et
// point seulement au milieu d'un mot, pour ne pas avaler le point final d'une phrase). Un
// pseudo a espaces est bien notifie par la base, mais seul son premier mot est colore ici.
const MENTION = /(@[\p{L}\p{N}_](?:[\p{L}\p{N}_'-]|\.(?=[\p{L}\p{N}_]))*)/gu;

export function TexteAvecMentions({ texte }: { texte: string }) {
  const morceaux = texte.split(MENTION);
  return (
    <>
      {morceaux.map((morceau, i) =>
        // split avec groupe capturant : les indices impairs sont les mentions.
        i % 2 === 1 ? (
          <span key={i} className="font-bold text-[var(--sarcelle)]">
            {morceau}
          </span>
        ) : (
          morceau
        )
      )}
    </>
  );
}
