/* Kora — écran Paramètres agent.
   Connexion des comptes réseaux sociaux (module Facebook) et
   personnalisation du message de premier contact, par agent.
   Données via window.Kora (mode démo ou mode live Supabase). */

(function () {
  "use strict";

  var esc = koraEsc;
  var root = document.getElementById("content");

  var state = {
    settings: null,     // { messageModele, messageDefaut, slug, lienTunnel }
    social: null,       // { facebook:{...}, tiktok:{...} }
    dirty: false,
    saving: false
  };

  function qs(name) {
    var m = new RegExp("[?&]" + name + "=([^&]+)").exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : "";
  }

  /* Bandeau de retour du flux OAuth Facebook (redirigé par la fonction Edge). */
  function oauthBanner() {
    var fb = qs("fb");
    if (!fb) return "";
    var ok = fb === "ok";
    var txt = ok
      ? "Compte Facebook connecté. La détection des commentaires démarre au prochain passage du scanner."
      : "La connexion Facebook a échoué : " + esc(qs("msg") || "erreur inconnue") + ". Voir VEILLE-SOCIALE.md.";
    return '<div class="card" style="border-color:' + (ok ? "#0F7A4A" : "#B93232") +
      '"><div class="card__body" style="color:' + (ok ? "#0B6640" : "#B93232") + '">' + txt + '</div></div>';
  }

  function fbCard() {
    var f = state.social.facebook;
    var status = f.connected
      ? '<span class="on">Connecté</span> · Page « ' + esc(f.pageName || "sans nom") + ' »' +
        (f.lastScan ? ' · dernier scan ' + esc(koraAgo(f.lastScan)) : ' · pas encore scannée')
      : "Non connecté";

    var actions = f.connected
      ? '<button type="button" class="btn btn--secondary" data-act="fb-disconnect">Déconnecter</button>'
      : '<button type="button" class="btn btn--primary" data-act="fb-connect">Connecter Facebook</button>' +
        (Kora.mode === "demo" ? '<button type="button" class="btn btn--secondary" data-act="fb-simulate">Simuler la connexion</button>' : "");

    return '<div class="conncard">' +
      '<div class="conncard__logo conncard__logo--fb">f</div>' +
      '<div class="conncard__body">' +
        '<div class="conncard__title">Facebook</div>' +
        '<div class="conncard__status">' + status + '</div>' +
        '<div class="conncard__note">Nécessite une <strong>Page</strong> Facebook (pas un profil personnel), ' +
          'une app Meta validée et l\'app Kora en ligne en HTTPS. ' +
          'Seuls les <strong>commentaires</strong> sur tes publications sont détectés de façon fiable. ' +
          'Procédure complète : VEILLE-SOCIALE.md.</div>' +
      '</div>' +
      '<div class="conncard__actions">' + actions + '</div>' +
      '</div>';
  }

  function ttCard() {
    var t = state.social.tiktok;
    var status = t.connected
      ? '<span class="on">Connecté</span> · ' + esc(t.displayName || "compte lié")
      : "Non connecté";

    var actions = t.connected
      ? '<button type="button" class="btn btn--secondary" data-act="tt-disconnect">Déconnecter</button>'
      : '<button type="button" class="btn btn--secondary" data-act="tt-connect" disabled>Connecter TikTok</button>' +
        (Kora.mode === "demo" ? '<button type="button" class="btn btn--secondary" data-act="tt-simulate">Simuler la connexion</button>' : "");

    return '<div class="conncard">' +
      '<div class="conncard__logo conncard__logo--tt">t</div>' +
      '<div class="conncard__body">' +
        '<div class="conncard__title">TikTok</div>' +
        '<div class="conncard__status">' + status + '</div>' +
        '<div class="conncard__note"><strong>Détection indisponible.</strong> ' +
          'TikTok ne publie aucune API permettant de lire les likes ou les commentaires de tes vidéos. ' +
          'Le login existe mais n\'apporte rien pour la veille. Détail et sources : VEILLE-SOCIALE.md. ' +
          'En attendant, utilise la saisie manuelle dans l\'onglet Veille.</div>' +
      '</div>' +
      '<div class="conncard__actions">' + actions + '</div>' +
      '</div>';
  }

  function messageCard() {
    var s = state.settings;
    var preview = koraFillMessage(currentText(), s.slug);
    return '<div class="card">' +
      '<div class="card__head"><div class="card__title">Message de premier contact</div>' +
        '<div class="card__meta">Propre à ton compte</div></div>' +
      '<div class="card__body" style="display:flex;flex-direction:column;gap:14px">' +
        '<div class="field">' +
          '<label class="field__label" for="msgInput">Texte envoyé quand tu contactes un prospect repéré</label>' +
          '<textarea class="textarea" id="msgInput" rows="5">' + esc(s.messageModele) + '</textarea>' +
        '</div>' +
        '<div class="msg-help">Le jeton <code>[lien]</code> est remplacé automatiquement par le lien de ton tunnel : ' +
          '<code id="tunnelLink">' + esc(s.lienTunnel) + '</code></div>' +
        '<div class="field">' +
          '<div class="field__label">Aperçu</div>' +
          '<div class="msg-preview" id="msgPreview">' + esc(preview) + '</div>' +
        '</div>' +
        '<div class="save-row">' +
          '<button type="button" class="btn btn--primary" data-act="msg-save" id="saveBtn">Enregistrer</button>' +
          '<button type="button" class="btn btn--secondary" data-act="msg-reset">Réinitialiser au texte par défaut</button>' +
          '<span class="save-state" id="saveState"></span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function currentText() {
    var ta = document.getElementById("msgInput");
    return ta ? ta.value : state.settings.messageModele;
  }

  function render() {
    root.innerHTML =
      oauthBanner() +
      '<div class="card"><div class="card__head"><div class="card__title">Comptes réseaux sociaux</div>' +
        '<div class="card__meta">Chaque agent connecte uniquement ses propres comptes</div></div>' +
        '<div class="card__body">' + fbCard() + ttCard() + '</div></div>' +
      messageCard();
    wire();
  }

  function setSaveState(msg, cls) {
    var el = document.getElementById("saveState");
    if (!el) return;
    el.textContent = msg || "";
    el.className = "save-state" + (cls ? " " + cls : "");
  }

  function refreshPreview() {
    var pv = document.getElementById("msgPreview");
    if (pv) pv.textContent = koraFillMessage(currentText(), state.settings.slug);
  }

  function wire() {
    var ta = document.getElementById("msgInput");
    if (ta) {
      ta.addEventListener("input", function () {
        state.dirty = true;
        setSaveState("Modifié, pense à enregistrer.");
        refreshPreview();
      });
    }

    Array.prototype.forEach.call(root.querySelectorAll("[data-act]"), function (btn) {
      btn.addEventListener("click", function () { onAction(this.getAttribute("data-act"), this); });
    });
  }

  function reloadSocial() {
    return Kora.social.status().then(function (st) { state.social = st; render(); });
  }

  function onAction(act, btn) {
    if (act === "fb-connect") {
      btn.disabled = true;
      Kora.social.connectUrl("facebook").then(function (r) {
        if (r && r.url) {
          window.location.href = r.url;    // redirection vers le dialogue OAuth Facebook
        } else {
          btn.disabled = false;
          window.alert((r && r.raison) || "Connexion indisponible pour le moment.");
        }
      });
      return;
    }
    if (act === "tt-connect") {
      Kora.social.connectUrl("tiktok").then(function (r) {
        window.alert((r && r.raison) || "TikTok : détection indisponible.");
      });
      return;
    }
    if (act === "fb-simulate" || act === "tt-simulate") {
      var res = act === "fb-simulate" ? "facebook" : "tiktok";
      Kora.social.simulateConnect(res).then(reloadSocial);
      return;
    }
    if (act === "fb-disconnect" || act === "tt-disconnect") {
      var net = act === "fb-disconnect" ? "facebook" : "tiktok";
      if (!window.confirm("Déconnecter ce compte ? La détection s'arrête pour ce réseau.")) return;
      Kora.social.disconnect(net).then(reloadSocial).catch(function (e) {
        window.alert("Déconnexion impossible : " + (e && e.message ? e.message : e));
      });
      return;
    }
    if (act === "msg-reset") {
      var ta = document.getElementById("msgInput");
      if (ta) { ta.value = state.settings.messageDefaut; state.dirty = true; refreshPreview(); setSaveState("Texte par défaut chargé, pense à enregistrer."); }
      return;
    }
    if (act === "msg-save") {
      if (state.saving) return;
      state.saving = true;
      btn.disabled = true;
      setSaveState("Enregistrement…");
      var val = currentText();
      Kora.settings.setMessageModele(val).then(function (r) {
        state.saving = false;
        btn.disabled = false;
        if (r && r.error) { setSaveState("Échec : " + r.error, "bad"); return; }
        state.settings.messageModele = val;
        state.dirty = false;
        setSaveState("Enregistré.", "ok");
      }).catch(function (e) {
        state.saving = false;
        btn.disabled = false;
        setSaveState("Échec : " + (e && e.message ? e.message : e), "bad");
      });
      return;
    }
  }

  /* ---- Init ---- */
  document.getElementById("navName").textContent = "…";

  Kora.ready
    .then(function () { return Kora.auth.guard(); })
    .then(function (ok) {
      if (!ok) return;
      var lo = document.getElementById("logoutBtn");
      if (lo) {
        lo.hidden = (Kora.mode === "demo");
        lo.addEventListener("click", function () { Kora.auth.signOut().then(function () { window.location.replace("auth.html"); }); });
      }
      document.getElementById("navName").textContent = KORA_AGENT;
      document.getElementById("navAvatar").textContent = String(KORA_AGENT).charAt(0).toUpperCase();

      return Promise.all([Kora.settings.get(), Kora.social.status()]).then(function (r) {
        state.settings = r[0];
        state.social = r[1];
        render();
      });
    })
    .catch(function (e) {
      console.error("[Kora] init paramètres", e);
      var detail = (e && (e.message || e.msg)) || String(e);
      root.innerHTML = '<div style="padding:24px;color:#B93232">Chargement impossible.<br>Détail : ' + esc(detail) +
        '<br><span style="color:#5A6474">Ouvrez <a href="diag.html">diag.html</a> pour un diagnostic.</span></div>';
    });
})();
