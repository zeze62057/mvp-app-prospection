/* Kora — echange du lien d'acces prospect contre une session.
   Le prospect ouvre rejoindre.html?t=<token> (lien recu par WhatsApp).
   On appelle la fonction Edge prospect-login, puis verifyOtp pour ouvrir
   la session, puis on redirige vers espace.html. */

(function () {
  "use strict";

  var cfg = window.KORA_CONFIG || {};
  var out = document.getElementById("msg");
  function show(t) { if (out) out.textContent = t; }

  var m = /[?&]t=([^&#]+)/.exec(window.location.search);
  var token = m ? decodeURIComponent(m[1]) : "";

  if (!token) { show("Lien invalide : il manque le code d'accès."); return; }
  if (!window.supabase || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
    show("Configuration indisponible. Réessaie dans un moment."); return;
  }

  var sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  var fnUrl = cfg.supabaseUrl.replace(/\/+$/, "") + "/functions/v1/prospect-login";

  var messages = {
    lien_invalide: "Ce lien n'est pas valide.",
    lien_inconnu: "Ce lien n'existe pas ou a été annulé.",
    lien_deja_utilise: "Ce lien a déjà servi. Demande-en un nouveau à ton contact.",
    lien_expire: "Ce lien a expiré. Demande-en un nouveau à ton contact.",
    prospect_introuvable: "Ton profil est introuvable. Contacte la personne qui t'a invité.",
    creation_compte: "Création du compte impossible. Réessaie plus tard.",
    session_impossible: "Connexion impossible pour le moment. Réessaie plus tard.",
    erreur_serveur: "Une erreur est survenue. Réessaie plus tard."
  };

  show("Ouverture de ton accès…");

  fetch(fnUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": cfg.supabaseAnonKey },
    body: JSON.stringify({ token: token })
  })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }, function () { return { ok: r.ok, body: {} }; }); })
    .then(function (res) {
      if (!res.ok || !res.body || !res.body.token_hash) {
        var code = res.body && res.body.error;
        show(messages[code] || "Connexion impossible pour le moment.");
        return;
      }
      return sb.auth.verifyOtp({ token_hash: res.body.token_hash, type: "magiclink" }).then(function (v) {
        if (v.error) { show("Connexion impossible : " + (v.error.message || "erreur")); return; }
        window.location.replace("espace.html");
      });
    })
    .catch(function () {
      show("Connexion impossible. Vérifie ta connexion internet et réessaie.");
    });
})();
