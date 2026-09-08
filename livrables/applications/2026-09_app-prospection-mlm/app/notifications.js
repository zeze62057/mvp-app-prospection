/* Kora — Veille réseaux sociaux.
   Flux des interactions détectées (Facebook) ou saisies manuellement.
   Chaque interaction propose un message de premier contact pré-rempli,
   à envoyer manuellement (aucun envoi automatique). */

(function () {
  "use strict";

  var esc = koraEsc;
  var listEl = document.getElementById("nlist");
  var infoEl = document.getElementById("infoZone");

  var state = {
    notifs: [],
    settings: null,   // { messageModele, messageDefaut, slug, lienTunnel }
    social: null,
    current: null,    // notification ciblée par la modale d'envoi
    busy: false
  };

  var sendModal = document.getElementById("sendModal");
  var manualModal = document.getElementById("manualModal");
  var convModal = document.getElementById("convModal");

  function openModal(m) { if (m.showModal) m.showModal(); else m.setAttribute("open", ""); }
  function closeModal(m) { if (m.close) m.close(); else m.removeAttribute("open"); }

  function typeLabel(t) { return t === "like" ? "Like" : "Commentaire"; }
  function sourceLabel(s) { return s === "facebook" ? "Facebook" : s === "tiktok" ? "TikTok" : "Manuel"; }

  /* ---- Rendu ---- */

  function infoBanner() {
    var fb = state.social && state.social.facebook && state.social.facebook.connected;
    if (fb) return "";
    return '<div class="veille-info">' +
      'Aucune détection automatique active. Connecte ta <strong>Page Facebook</strong> dans ' +
      '<a href="parametres.html">Paramètres</a>, ou enregistre ici les likes et commentaires que tu repères toi-même. ' +
      'TikTok ne permet pas la détection (voir VEILLE-SOCIALE.md).</div>';
  }

  function cardHtml(n) {
    var who = n.prospectNom
      ? esc(n.prospectNom)
      : '<span class="muted">Profil non communiqué par ' + esc(sourceLabel(n.source)) + '</span>';

    var pub = "";
    if (n.publicationTitre || n.publicationUrl) {
      var label = esc(n.publicationTitre || "la publication");
      pub = '<div class="ncard__pub">Sur : ' +
        (n.publicationUrl ? '<a href="' + esc(n.publicationUrl) + '" target="_blank" rel="noopener">' + label + '</a>' : label) +
        '</div>';
    }

    var quote = (n.type === "commentaire" && n.commentaireTexte)
      ? '<div class="ncard__quote">' + esc(n.commentaireTexte) + '</div>'
      : "";

    var actions;
    if (n.messageEnvoye) {
      actions = '<span class="done-flag">Message envoyé</span>' +
        '<button type="button" class="btn btn--secondary" data-act="send" data-id="' + esc(n.id) + '">Revoir le message</button>';
    } else {
      actions = '<button type="button" class="btn btn--primary" data-act="send" data-id="' + esc(n.id) + '">Envoyer le message</button>';
    }
    if (!n.prospectId) {
      actions += '<button type="button" class="btn btn--secondary" data-act="conv" data-id="' + esc(n.id) + '">Ajouter aux prospects</button>';
    } else {
      actions += '<a class="btn btn--secondary" href="prospect.html?id=' + encodeURIComponent(n.prospectId) + '">Voir le prospect</a>';
    }
    if (!n.lu) {
      actions += '<button type="button" class="btn btn--tertiary" data-act="read" data-id="' + esc(n.id) + '">Marquer comme lu</button>';
    }

    return '<div class="ncard' + (n.lu ? "" : " is-unread") + '">' +
      '<div class="ncard__top">' +
        '<span class="ntag ntag--' + esc(n.source) + '">' + esc(sourceLabel(n.source)) + '</span>' +
        '<span class="ntag ntag--' + esc(n.type) + '">' + esc(typeLabel(n.type)) + '</span>' +
        '<span class="ncard__time">' + esc(koraAgo(n.createdAt)) + '</span>' +
      '</div>' +
      '<div class="ncard__who">' + who + '</div>' +
      pub + quote +
      '<div class="ncard__actions">' + actions + '</div>' +
    '</div>';
  }

  function render() {
    var unread = state.notifs.filter(function (n) { return !n.lu; }).length;
    document.getElementById("subline").textContent = state.notifs.length
      ? (state.notifs.length + " interaction" + (state.notifs.length > 1 ? "s" : "") +
         (unread ? " · " + unread + " non lue" + (unread > 1 ? "s" : "") : ""))
      : "Aucune interaction pour l'instant.";

    infoEl.innerHTML = infoBanner();

    if (!state.notifs.length) {
      listEl.innerHTML = '<div class="empty"><h2>Rien à afficher</h2>' +
        '<p>Les commentaires détectés sur ta Page Facebook apparaîtront ici. ' +
        'Tu peux aussi enregistrer une interaction repérée à la main.</p>' +
        '<div class="empty__actions"><button class="btn btn--primary" type="button" id="emptyAdd">Enregistrer une interaction</button></div></div>';
      var b = document.getElementById("emptyAdd");
      if (b) b.addEventListener("click", function () { openManual(); });
      return;
    }

    listEl.innerHTML = state.notifs.map(cardHtml).join("");
    Array.prototype.forEach.call(listEl.querySelectorAll("[data-act]"), function (btn) {
      btn.addEventListener("click", function () {
        onAction(this.getAttribute("data-act"), this.getAttribute("data-id"));
      });
    });
  }

  function reload() {
    return Kora.notifications.list().then(function (ns) { state.notifs = ns; render(); });
  }

  /* ---- Actions sur une carte ---- */

  function find(id) {
    for (var i = 0; i < state.notifs.length; i++) if (state.notifs[i].id === id) return state.notifs[i];
    return null;
  }

  function onAction(act, id) {
    var n = find(id);
    if (!n) return;
    if (act === "read") {
      Kora.notifications.markRead(id).then(reload);
      return;
    }
    if (act === "send") { openSend(n); return; }
    if (act === "conv") { openConv(n); return; }
  }

  /* ---- Modale d'envoi ---- */

  function openSend(n) {
    state.current = n;
    var txt = koraFillMessage(state.settings.messageModele, state.settings.slug);
    document.getElementById("sendText").value = txt;
    var st = document.getElementById("sendState");
    st.hidden = true; st.textContent = "";
    var openBtn = document.getElementById("openBtn");
    openBtn.disabled = !n.publicationUrl;
    openMod(sendModal);
  }
  function openMod(m) { openModal(m); }

  document.getElementById("sendClose").addEventListener("click", function () { closeModal(sendModal); });

  document.getElementById("copyBtn").addEventListener("click", function () {
    var txt = document.getElementById("sendText").value;
    var st = document.getElementById("sendState");
    function done(okMsg) { st.hidden = false; st.style.color = "#0F7A4A"; st.textContent = okMsg; }
    function fail() {
      st.hidden = false; st.style.color = "#B93232";
      st.textContent = "Copie automatique impossible. Sélectionne le texte et copie-le à la main (Ctrl+C).";
      var ta = document.getElementById("sendText"); ta.focus(); ta.select();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { done("Texte copié. Colle-le dans Messenger ou la plateforme."); }, fail);
    } else {
      try {
        var ta = document.getElementById("sendText"); ta.focus(); ta.select();
        document.execCommand("copy"); done("Texte copié.");
      } catch (e) { fail(); }
    }
  });

  document.getElementById("openBtn").addEventListener("click", function () {
    if (state.current && state.current.publicationUrl) {
      window.open(state.current.publicationUrl, "_blank", "noopener");
    }
  });

  document.getElementById("markSentBtn").addEventListener("click", function () {
    if (!state.current || state.busy) return;
    state.busy = true;
    this.disabled = true;
    var self = this;
    Kora.notifications.markSent(state.current.id).then(function () {
      state.busy = false; self.disabled = false;
      closeModal(sendModal);
      return reload();
    }).catch(function (e) {
      state.busy = false; self.disabled = false;
      var st = document.getElementById("sendState");
      st.hidden = false; st.style.color = "#B93232";
      st.textContent = "Impossible de marquer comme envoyé : " + (e && e.message ? e.message : e);
    });
  });

  /* ---- Modale saisie manuelle ---- */

  function openManual() {
    document.getElementById("manualForm").reset();
    openModal(manualModal);
  }
  document.getElementById("addManualBtn").addEventListener("click", openManual);

  document.getElementById("manualForm").addEventListener("submit", function (ev) {
    var val = ev.submitter && ev.submitter.value;
    if (val !== "ok") return;   // annulation : laisse le dialog se fermer
    ev.preventDefault();
    if (state.busy) return;
    state.busy = true;
    Kora.notifications.addManual({
      type: document.getElementById("mf-type").value,
      prospectNom: document.getElementById("mf-nom").value,
      publicationTitre: document.getElementById("mf-pub").value,
      publicationUrl: document.getElementById("mf-url").value,
      commentaireTexte: document.getElementById("mf-quote").value
    }).then(function () {
      state.busy = false;
      closeModal(manualModal);
      return reload();
    }).catch(function (e) {
      state.busy = false;
      window.alert("Enregistrement impossible : " + (e && e.message ? e.message : e));
    });
  });

  /* ---- Modale conversion en prospect ---- */

  function openConv(n) {
    state.current = n;
    document.getElementById("convForm").reset();
    document.getElementById("cf-nom").value = n.prospectNom || "";
    document.getElementById("cf-error").hidden = true;
    openModal(convModal);
  }

  document.getElementById("convForm").addEventListener("submit", function (ev) {
    var val = ev.submitter && ev.submitter.value;
    if (val !== "ok") return;   // annulation : laisse le dialog se fermer
    ev.preventDefault();
    var nom = document.getElementById("cf-nom").value.trim();
    var phone = document.getElementById("cf-phone").value.trim();
    var email = document.getElementById("cf-email").value.trim();
    if (!nom || (!phone && !email)) {
      document.getElementById("cf-error").hidden = false;
      return;
    }
    if (state.busy) return;
    state.busy = true;
    var nId = state.current.id;
    Kora.prospects.create({ name: nom, phone: phone, email: email })
      .then(function (p) { return Kora.notifications.linkProspect(nId, p.id); })
      .then(function () {
        state.busy = false;
        closeModal(convModal);
        return reload();
      })
      .catch(function (e) {
        state.busy = false;
        window.alert("Création impossible : " + (e && e.message ? e.message : e));
      });
  });

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

      return Promise.all([Kora.notifications.list(), Kora.settings.get(), Kora.social.status()]).then(function (r) {
        state.notifs = r[0];
        state.settings = r[1];
        state.social = r[2];
        render();
      });
    })
    .catch(function (e) {
      console.error("[Kora] init veille", e);
      var detail = (e && (e.message || e.msg)) || String(e);
      listEl.innerHTML = '<div style="padding:24px;color:#B93232">Chargement impossible.<br>Détail : ' + esc(detail) +
        '<br><span style="color:#5A6474">Ouvrez <a href="diag.html">diag.html</a> pour un diagnostic.</span></div>';
    });
})();
