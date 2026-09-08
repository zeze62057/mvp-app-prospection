/* Kora — écran Paramètres agent.
   Connexion des comptes réseaux sociaux (module Facebook) et
   personnalisation du message de premier contact, par agent.
   Données via window.Kora (mode démo ou mode live Supabase). */

(function () {
  "use strict";

  var esc = koraEsc;
  var root = document.getElementById("content");

  var state = {
    settings: null,     // { messageModele, messageDefaut, slug, lienTunnel, landing, landingDefauts }
    social: null,       // { facebook:{...}, tiktok:{...} }
    dirty: false,
    saving: false
  };

  /* ⚠️ A VALIDER : la demande ne fixe ni taille max d'upload ni formats.
     Valeurs par defaut retenues : photo 5 Mo, video 50 Mo, formats ci-dessous.
     Le bucket Supabase "landing-public" applique aussi sa propre limite
     (voir migration-page-publique.sql). */
  var LP_MAX = { photo: 5 * 1024 * 1024, video: 50 * 1024 * 1024 };
  var LP_TYPES = {
    photo: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    video: ["video/mp4", "video/webm"]
  };

  function elVal(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
  function elFile(id) { var el = document.getElementById(id); return el && el.files && el.files[0] ? el.files[0] : null; }
  function setState(id, msg, cls) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg || "";
    el.className = "save-state" + (cls ? " " + cls : "");
  }
  function validateFile(f, kind) {
    if (!f) return null;
    if (f.size > LP_MAX[kind]) {
      return "Fichier trop lourd (max " + Math.round(LP_MAX[kind] / 1048576) + " Mo pour " +
        (kind === "photo" ? "une photo" : "une vidéo") + ").";
    }
    if (LP_TYPES[kind].indexOf(f.type) === -1) {
      return "Format non accepté (" + (f.type || "type inconnu") + ").";
    }
    return null;
  }

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

  /* ---- Section "Ma page publique" ---- */

  function landingField(id, label, value, placeholder, isTextarea) {
    var input = isTextarea
      ? '<textarea class="textarea" id="' + id + '" rows="3" placeholder="' + esc(placeholder || "") + '">' + esc(value || "") + '</textarea>'
      : '<input class="input" type="text" id="' + id + '" value="' + esc(value || "") + '" placeholder="' + esc(placeholder || "") + '">';
    return '<div class="field"><label class="field__label" for="' + id + '">' + esc(label) + '</label>' + input + '</div>';
  }

  function landingMedia(kind, label, url) {
    var isImg = kind === "photo";
    var thumb = "";
    if (url) {
      thumb = isImg
        ? '<img class="lp-thumb" src="' + esc(url) + '" alt="">'
        : '<a class="lp-hint" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(url) + '</a>';
    }
    return '<div class="lp-media">' +
      '<div class="lp-media__title">' + esc(label) + '</div>' +
      '<div class="lp-media__row">' +
        '<input class="input" type="url" id="lp' + kind + 'Url" value="' + esc(url || "") + '" placeholder="' +
          (isImg ? "URL d\'une image déjà en ligne" : "Lien YouTube, Vimeo ou fichier .mp4") + '">' +
      '</div>' +
      '<div class="lp-media__row">' +
        '<label class="lp-hint" for="lp' + kind + 'File">ou téléverse un fichier :</label>' +
        '<input type="file" id="lp' + kind + 'File" accept="' + LP_TYPES[kind].join(",") + '">' +
      '</div>' +
      (thumb ? '<div class="lp-media__row">' + thumb + '</div>' : "") +
      '<div class="lp-hint">Vide = visuel par défaut. ' +
        (isImg ? "Formats : JPG, PNG, WebP, GIF (max 5 Mo)." : "Un lien YouTube est le plus léger. Upload : MP4 ou WebM (max 50 Mo).") +
        '</div>' +
    '</div>';
  }

  function landingCard() {
    var L = state.settings.landing || {};
    var D = state.settings.landingDefauts || {};
    return '<div class="card">' +
      '<div class="card__head"><div class="card__title">Ma page publique</div>' +
        '<div class="card__meta"><a href="' + esc(state.settings.lienTunnel) + '" target="_blank" rel="noopener">Voir ma page</a></div></div>' +
      '<div class="card__body lp-body">' +
        landingField("lpBadge", "Badge", L.badge, D.badge) +
        landingField("lpTitre", "Titre principal", L.titre, D.titre) +
        landingField("lpSousTitre", "Sous-titre", L.sousTitre, koraLandingSousTitre(D.sousTitre, KORA_AGENT), true) +
        '<div class="msg-help">Dans le sous-titre, <code>{agent}</code> est remplacé par ton nom.</div>' +
        landingField("lpCta", "Texte du bouton d'action", L.cta, D.cta) +
        landingField("lpPreuve", "Mention sociale", L.preuve, D.preuve) +
        landingMedia("photo", "Photo", L.photoUrl) +
        landingMedia("video", "Vidéo", L.videoUrl) +
        '<div class="save-row">' +
          '<button type="button" class="btn btn--primary" data-act="landing-save" id="lpSave">Enregistrer la page publique</button>' +
          '<button type="button" class="btn btn--secondary" data-act="landing-reset">Tout remettre par défaut</button>' +
          '<span class="save-state" id="lpState"></span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function saveLanding(btn) {
    if (state.saving) return;
    var payload = {
      badge: elVal("lpBadge"), titre: elVal("lpTitre"), sousTitre: elVal("lpSousTitre"),
      cta: elVal("lpCta"), preuve: elVal("lpPreuve"),
      photoUrl: elVal("lpphotoUrl"), videoUrl: elVal("lpvideoUrl")
    };
    var photoFile = elFile("lpphotoFile"), videoFile = elFile("lpvideoFile");
    var err = validateFile(photoFile, "photo") || validateFile(videoFile, "video");
    if (err) { setState("lpState", err, "bad"); return; }

    state.saving = true;
    if (btn) btn.disabled = true;
    setState("lpState", "Enregistrement…");

    var chain = Promise.resolve();
    if (photoFile) {
      chain = chain.then(function () {
        return Kora.settings.uploadLandingAsset("photo", photoFile).then(function (r) {
          if (r && r.url) payload.photoUrl = r.url;
        });
      });
    }
    if (videoFile) {
      chain = chain.then(function () {
        return Kora.settings.uploadLandingAsset("video", videoFile).then(function (r) {
          if (r && r.url) payload.videoUrl = r.url;
        });
      });
    }
    chain.then(function () { return Kora.settings.setLanding(payload); })
      .then(function (r) {
        state.saving = false;
        if (btn) btn.disabled = false;
        if (r && r.error) { setState("lpState", "Échec : " + r.error, "bad"); return; }
        state.settings.landing = {
          badge: payload.badge || null, titre: payload.titre || null, sousTitre: payload.sousTitre || null,
          cta: payload.cta || null, preuve: payload.preuve || null,
          photoUrl: payload.photoUrl || null, videoUrl: payload.videoUrl || null
        };
        render();
        setState("lpState", "Enregistré. Recharge ta page publique pour voir le résultat.", "ok");
      })
      .catch(function (e) {
        state.saving = false;
        if (btn) btn.disabled = false;
        setState("lpState", "Échec : " + (e && e.message ? e.message : e), "bad");
      });
  }

  function render() {
    root.innerHTML =
      oauthBanner() +
      '<div class="card"><div class="card__head"><div class="card__title">Comptes réseaux sociaux</div>' +
        '<div class="card__meta">Chaque agent connecte uniquement ses propres comptes</div></div>' +
        '<div class="card__body">' + fbCard() + ttCard() + '</div></div>' +
      messageCard() +
      landingCard();
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
    if (act === "landing-save") {
      saveLanding(btn);
      return;
    }
    if (act === "landing-reset") {
      if (!window.confirm("Remettre toute la page publique aux valeurs par défaut ?")) return;
      ["lpBadge", "lpTitre", "lpSousTitre", "lpCta", "lpPreuve",
       "lpphotoUrl", "lpvideoUrl", "lpphotoFile", "lpvideoFile"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = "";
      });
      saveLanding(document.getElementById("lpSave"));
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
