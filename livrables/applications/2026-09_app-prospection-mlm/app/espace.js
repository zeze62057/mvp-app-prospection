/* Kora — espace prospect (etape 1 : coquille).
   Verifie la session prospet, affiche un accueil. La communaute et les
   meetings seront ajoutes ici aux etapes 2 et 3. */

(function () {
  "use strict";

  var cfg = window.KORA_CONFIG || {};
  var root = document.getElementById("espace");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  if (!window.supabase || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
    root.innerHTML = "<p>Configuration indisponible.</p>";
    return;
  }
  var sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

  sb.auth.getUser().then(function (r) {
    var u = r.data && r.data.user;
    var meta = (u && u.user_metadata) || {};
    if (!u || meta.role !== "prospect") {
      // Pas de session prospect valide : renvoyer vers la page publique.
      root.innerHTML =
        '<h1>Accès non trouvé</h1>' +
        '<p>Ouvre le lien qu\'on t\'a envoyé par WhatsApp pour accéder à ton espace.</p>' +
        '<div class="esp-actions"><a class="btn btn--secondary" href="index.html">Retour</a></div>';
      return;
    }

    var prenom = String(meta.nom || "").trim().split(/\s+/)[0] || "toi";
    root.innerHTML =
      '<h1>Bienvenue ' + esc(prenom) + '</h1>' +
      '<p>Ton espace est prêt. La communauté et tes meetings arrivent très bientôt ici.</p>' +
      '<div class="esp-soon">' +
        '<div>Communauté : discuter avec les autres membres et les agents.</div>' +
        '<div>Meetings : retrouver les liens Zoom / Meet et les horaires.</div>' +
      '</div>' +
      '<div class="esp-actions"><button class="btn btn--secondary" id="out">Se déconnecter</button></div>';

    var out = document.getElementById("out");
    if (out) {
      out.addEventListener("click", function () {
        sb.auth.signOut().then(function () { window.location.replace("index.html"); });
      });
    }
  }).catch(function () {
    root.innerHTML = "<p>Impossible de vérifier ta session. Réessaie plus tard.</p>";
  });
})();
