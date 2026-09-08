/* Kora — vue détail d'un prospect (Section B du canvas).
   Sélecteur de statut, ajout d'interaction, timeline antéchronologique.
   Données via window.Kora (mode démo ou mode live Supabase). */

(function () {
  "use strict";

  var esc = koraEsc;
  function qs(name) {
    var m = new RegExp("[?&]" + name + "=([^&]+)").exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : "";
  }

  var id = qs("id");
  var prospect = null;
  var ui = { statusOpen: false, addOpen: false, addType: "appel", busy: false };
  var root = document.getElementById("detail");

  function nodeClass(ev) {
    if (ev.kind === "status") return "tl__node tl__node--accent";
    if (ev.kind === "created") return "tl__node tl__node--slate";
    if (ev.type === "relance") return "tl__node tl__node--amber";
    return "tl__node";
  }
  function nodeStroke(ev) {
    if (ev.kind === "status") return "#C9470A";
    if (ev.kind === "created") return "#475569";
    if (ev.type === "relance") return "#8F5A05";
    return "#5A6474";
  }

  function eventHtml(ev, isLast) {
    var icon = koraIcon(koraEventIcon(ev), { size: 17, stroke: nodeStroke(ev), width: 2 });
    var title, text = "";
    if (ev.kind === "status") {
      var st = koraStatus(ev.to);
      title = 'Statut changé en <span class="badge badge--sm" data-status="' + st.key + '">' + esc(st.label) + '</span>';
    } else if (ev.kind === "created") {
      var stc = koraStatus(ev.to);
      title = 'Prospect créé au statut <span class="badge badge--sm" data-status="' + stc.key + '">' + esc(stc.label) + '</span>';
    } else {
      title = esc(koraTypeLabel(ev.type));
      text = '<div class="tl__text">' + esc(ev.text) + '</div>';
    }
    return '<div class="tl">' +
      '<div class="tl__rail"><div class="' + nodeClass(ev) + '">' + icon + '</div>' +
        (isLast ? "" : '<div class="tl__line"></div>') + '</div>' +
      '<div class="tl__body">' +
        '<div class="tl__title">' + title + '</div>' + text +
        '<div class="tl__meta">' + esc(ev.when) + ' · ' + (ev.kind === "created" ? esc(ev.by) : "par " + esc(ev.by)) + '</div>' +
      '</div>' +
      '</div>';
  }

  function progressHtml() {
    var idx = koraStatusIndex(prospect.statut);
    var cells = [];
    for (var i = 0; i < 7; i++) {
      var cls = "";
      if (i <= idx) {
        if (prospect.statut === "close_gagne") cls = "win";
        else if (prospect.statut === "close_perdu") cls = "lost";
        else cls = "on";
      }
      cells.push('<i class="' + cls + '"></i>');
    }
    return cells.join("");
  }

  function statusMenuHtml() {
    var opts = KORA_STATUSES.map(function (s, i) {
      return '<button type="button" class="statusmenu__opt" data-key="' + s.key + '">' +
        '<span class="badge badge--sm" data-status="' + s.key + '">' + esc(s.label) + '</span>' +
        '<span class="step">Étape ' + (i + 1) + '</span>' +
        '</button>';
    }).join("");
    return '<div class="statusmenu__panel"' + (ui.statusOpen ? "" : " hidden") + '>' +
      '<div class="statusmenu__label">DÉPLACER VERS</div>' + opts + '</div>';
  }

  function addPanelHtml() {
    var chips = KORA_INTERACTION_TYPES.map(function (t) {
      return '<button type="button" class="chip' + (ui.addType === t.key ? " is-on" : "") + '" data-type="' + t.key + '">' + esc(t.label) + '</button>';
    }).join("");
    return '<div class="addpanel"' + (ui.addOpen ? "" : " hidden") + '>' +
      '<h3>Nouvelle interaction</h3>' +
      '<div class="field"><div class="field__label">Type d\'interaction</div><div class="chips">' + chips + '</div></div>' +
      '<div class="field"><label class="field__label" for="addText">Détail</label>' +
      '<textarea class="textarea" id="addText" rows="3" placeholder="Ex. Appel passé, pas de réponse"></textarea></div>' +
      '<div class="modal__actions">' +
        '<button type="button" class="btn btn--primary" id="addSave">Enregistrer</button>' +
        '<button type="button" class="btn btn--secondary" id="addCancel">Annuler</button>' +
      '</div>' +
      '</div>';
  }

  function contactRows() {
    var rows = "";
    if (prospect.phone) {
      rows += '<div class="kv"><div class="kv__ic">' + koraIcon("phone", { size: 16, stroke: "#5A6474", width: 1.9 }) + '</div>' +
        '<div><div class="kv__k">Téléphone · WhatsApp</div><div class="kv__v">' + esc(prospect.phone) + '</div></div></div>';
    }
    if (prospect.email) {
      rows += '<div class="kv"><div class="kv__ic">' + koraIcon("mail", { size: 16, stroke: "#5A6474", width: 1.9 }) + '</div>' +
        '<div><div class="kv__k">Email</div><div class="kv__v">' + esc(prospect.email) + '</div></div></div>';
    }
    if (!rows) rows = '<div class="kv__k">Aucun contact renseigné.</div>';
    return rows;
  }

  function render() {
    var st = koraStatus(prospect.statut);
    var idx = koraStatusIndex(prospect.statut);
    var srcLabel = prospect.source === "formulaire_public"
      ? "Formulaire public · page de " + KORA_AGENT
      : "Ajout manuel";

    root.innerHTML =
      '<div class="phead">' +
        '<div class="phead__id">' +
          '<div class="avatar avatar--' + esc(prospect.avatar) + '">' + esc(prospect.initials) + '</div>' +
          '<div>' +
            '<h1>' + esc(prospect.name) + '</h1>' +
            '<div class="phead__sub">' +
              '<span class="badge" data-status="' + st.key + '">' + esc(st.label) + '</span>' +
              '<span class="muted">Créé le ' + esc(prospect.createdAt) + ' · ' + esc(prospect.createdVia) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="phead__actions">' +
          '<button type="button" class="btn btn--secondary" id="toggleAdd">Ajouter une interaction</button>' +
          '<div class="statusmenu">' +
            '<button type="button" class="btn btn--primary" id="toggleStatus">Changer le statut ' +
              koraIcon("chevD", { size: 14, stroke: "#fff", width: 2.2 }) + '</button>' +
            statusMenuHtml() +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="detail-grid">' +
        '<div class="detail-main">' +
          addPanelHtml() +
          '<div class="card">' +
            '<div class="card__head"><div class="card__title">Historique de suivi</div>' +
              '<div class="card__meta">' + prospect.history.length + ' événements · du plus récent au plus ancien</div></div>' +
            '<div class="card__body"><div class="timeline">' +
              prospect.history.map(function (ev, i) { return eventHtml(ev, i === prospect.history.length - 1); }).join("") +
            '</div></div>' +
          '</div>' +
        '</div>' +

        '<div class="detail-side">' +
          '<div class="sidecard"><h3>Informations de contact</h3>' + contactRows() +
            '<div class="modal__actions">' +
              '<button type="button" class="btn btn--secondary btn--block" id="callBtn">Appeler</button>' +
              '<button type="button" class="btn btn--secondary btn--block" id="waBtn">WhatsApp</button>' +
            '</div>' +
          '</div>' +
          '<div class="sidecard"><h3>Avancement</h3>' +
            '<div class="progress">' + progressHtml() + '</div>' +
            '<div class="kv__k">Étape ' + (idx + 1) + ' sur 7 · dernier contact ' + esc(prospect.lastContact) + '.</div>' +
          '</div>' +
          '<div class="sidecard"><h3>Espace communauté</h3>' +
            '<div class="kv__k">Génère un lien d\'accès personnel à envoyer à ' + esc(koraFirstName(prospect.name)) + ' par WhatsApp.</div>' +
            '<button type="button" class="btn btn--secondary btn--block" id="inviteBtn">Générer le lien d\'accès</button>' +
            '<div id="inviteBox" hidden></div>' +
          '</div>' +
          '<div class="sidecard"><h3>Source</h3>' +
            '<div class="sideline">' + koraIcon("globe", { size: 15, stroke: "#8A93A3", width: 2 }) + esc(srcLabel) + '</div>' +
            '<div class="sideline">' + koraIcon("user", { size: 15, stroke: "#8A93A3", width: 2 }) + 'Agent responsable : ' + esc(KORA_AGENT) + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    wire();
  }

  function reload() {
    return Kora.prospects.get(id).then(function (p) { if (p) prospect = p; render(); });
  }

  function wire() {
    document.getElementById("toggleStatus").addEventListener("click", function (e) {
      e.stopPropagation();
      ui.statusOpen = !ui.statusOpen;
      render();
    });
    Array.prototype.forEach.call(document.querySelectorAll(".statusmenu__opt"), function (b) {
      b.addEventListener("click", function () {
        var key = this.getAttribute("data-key");
        ui.statusOpen = false;
        if (key === prospect.statut || ui.busy) { render(); return; }
        ui.busy = true;
        Kora.prospects.setStatus(prospect.id, key)
          .then(reload)
          .catch(function (e) { window.alert("Changement impossible : " + (e && e.message ? e.message : e)); render(); })
          .then(function () { ui.busy = false; });
      });
    });

    document.getElementById("toggleAdd").addEventListener("click", function () {
      ui.addOpen = !ui.addOpen;
      render();
      if (ui.addOpen) { var t = document.getElementById("addText"); if (t) t.focus(); }
    });
    Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (c) {
      c.addEventListener("click", function () { ui.addType = this.getAttribute("data-type"); render(); });
    });
    var save = document.getElementById("addSave");
    if (save) {
      save.addEventListener("click", function () {
        var ta = document.getElementById("addText");
        var textVal = (ta.value || "").trim();
        if (!textVal) { ta.focus(); return; }
        if (ui.busy) return;
        ui.busy = true;
        this.disabled = true;
        Kora.prospects.addInteraction(prospect.id, { type: ui.addType, text: textVal })
          .then(function () { ui.addOpen = false; return reload(); })
          .catch(function (e) { window.alert("Enregistrement impossible : " + (e && e.message ? e.message : e)); render(); })
          .then(function () { ui.busy = false; });
      });
    }
    var cancel = document.getElementById("addCancel");
    if (cancel) cancel.addEventListener("click", function () { ui.addOpen = false; render(); });

    document.getElementById("callBtn").addEventListener("click", function () {
      if (prospect.phone) window.location.href = "tel:" + prospect.phone.replace(/\s+/g, "");
    });
    document.getElementById("waBtn").addEventListener("click", function () {
      if (prospect.phone) window.open("https://wa.me/" + prospect.phone.replace(/[^0-9]/g, ""), "_blank");
    });

    var inv = document.getElementById("inviteBtn");
    if (inv) {
      inv.addEventListener("click", function () {
        if (ui.busy) return;
        ui.busy = true;
        inv.disabled = true;
        inv.textContent = "Génération…";
        Kora.prospects.creerAccesLien(prospect.id).then(function (r) {
          ui.busy = false;
          inv.disabled = false;
          inv.textContent = "Générer un nouveau lien";
          var msg = "Salut " + koraFirstName(prospect.name) + " ! Voici ton accès à l'espace communauté : " +
            r.url + "\nCe lien est personnel et à usage unique.";
          var box = document.getElementById("inviteBox");
          box.hidden = false;
          box.innerHTML =
            '<textarea class="textarea" id="inviteMsg" rows="4" readonly style="margin-top:8px">' + esc(msg) + '</textarea>' +
            '<button type="button" class="btn btn--primary btn--block" id="inviteCopy" style="margin-top:8px">Copier le message</button>';
          document.getElementById("inviteCopy").addEventListener("click", function () {
            var self = this;
            var ta = document.getElementById("inviteMsg");
            ta.focus(); ta.select();
            function ok() { self.textContent = "Copié"; }
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(msg).then(ok, function () {});
            } else { try { document.execCommand("copy"); ok(); } catch (e) {} }
          });
        }).catch(function (e) {
          ui.busy = false;
          inv.disabled = false;
          inv.textContent = "Générer le lien d'accès";
          window.alert("Impossible de générer le lien : " + (e && e.message ? e.message : e));
        });
      });
    }
  }

  document.addEventListener("click", function () {
    if (ui.statusOpen) { ui.statusOpen = false; render(); }
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
      document.getElementById("navAvatar").textContent = KORA_AGENT.charAt(0).toUpperCase();
      return Kora.prospects.get(id).then(function (p) {
        if (!p) {
          root.innerHTML = '<div class="empty"><h2>Prospect introuvable</h2>' +
            '<p>Ce prospect n\'existe pas ou n\'est pas visible avec votre compte.</p>' +
            '<div class="empty__actions"><a class="btn btn--primary" href="app.html">Retour au tableau de bord</a></div></div>';
          return;
        }
        prospect = p;
        render();
      });
    })
    .catch(function (e) {
      console.error("[Kora] init détail", e);
      var detail = (e && (e.message || e.error_description || e.msg)) || String(e);
      root.innerHTML = '<div style="padding:24px;color:#B93232">Chargement impossible.<br>' +
        'Détail : ' + esc(detail) + '<br>' +
        '<span style="color:#5A6474">Ouvrez <a href="diag.html">diag.html</a> pour un diagnostic complet.</span></div>';
    });
})();
