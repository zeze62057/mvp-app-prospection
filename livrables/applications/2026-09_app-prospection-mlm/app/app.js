/* Kora — tableau de bord agent (Section A du canvas).
   Liste filtrable, compteurs de pipeline, ajout manuel d'un prospect, état vide.
   Données via window.Kora (mode démo en mémoire ou mode live Supabase). */

(function () {
  "use strict";

  var state = { search: "", filter: "" };
  var prospects = [];

  var el = {
    hello: document.getElementById("hello"),
    portfolioLine: document.getElementById("portfolioLine"),
    counts: document.getElementById("counts"),
    rows: document.getElementById("rows"),
    emptyState: document.getElementById("emptyState"),
    searchInput: document.getElementById("searchInput"),
    statusFilter: document.getElementById("statusFilter"),
    navName: document.getElementById("navName"),
    navAvatar: document.getElementById("navAvatar"),
    logout: document.getElementById("logoutBtn"),
    addModal: document.getElementById("addModal"),
    addForm: document.getElementById("addForm"),
    npError: document.getElementById("np-error")
  };

  var esc = koraEsc;

  function paintIcons() {
    document.getElementById("bellBtn").innerHTML = koraIcon("bell", { size: 17, stroke: "#5A6474", width: 1.8 });
    document.getElementById("addBtnIcon").innerHTML = koraIcon("plus", { size: 16, stroke: "#fff", width: 2.2 });
    document.getElementById("searchIcon").innerHTML = koraIcon("search", { size: 17, stroke: "#8A93A3", width: 2 });
    document.getElementById("filterChevron").innerHTML = koraIcon("chevD", { size: 14, stroke: "#8A93A3", width: 2 });
    document.getElementById("sortChevron").innerHTML = koraIcon("chevD", { size: 14, stroke: "#8A93A3", width: 2 });
    document.getElementById("tabIcon1").innerHTML = koraIcon("list", { size: 21, stroke: "#E8590C", width: 2 });
    document.getElementById("tabIcon2").innerHTML = koraIcon("globe", { size: 21, stroke: "#8A93A3", width: 2 });
    document.getElementById("tabIcon3").innerHTML = koraIcon("user", { size: 21, stroke: "#8A93A3", width: 2 });
  }

  function renderCounts() {
    var total = prospects.length;
    var byStatus = {};
    prospects.forEach(function (p) { byStatus[p.statut] = (byStatus[p.statut] || 0) + 1; });

    el.hello.textContent = "Bonjour " + KORA_AGENT;
    el.portfolioLine.textContent = total === 0
      ? "Aucun prospect pour l'instant"
      : total + " prospects dans votre portefeuille · " + (byStatus.nouveau || 0) + " au statut « Nouveau »";

    el.counts.className = "counts" + (total === 0 ? " is-empty" : "");
    el.counts.innerHTML = KORA_STATUSES.map(function (s) {
      var n = total === 0 ? 0 : (byStatus[s.key] || 0);
      var live = s.key === "en_negociation" && n > 0;
      return '<div class="count' + (live ? " is-live" : "") + '">' +
        '<div class="count__label"><span class="dot" style="background:' + s.dot + '"></span>' + esc(s.label) + '</div>' +
        '<div class="count__n">' + n + '</div>' +
        '</div>';
    }).join("");
  }

  function fillStatusFilter() {
    var opts = ['<option value="">Tous les statuts</option>'];
    KORA_STATUSES.forEach(function (s) {
      opts.push('<option value="' + s.key + '">' + esc(s.label) + '</option>');
    });
    el.statusFilter.innerHTML = opts.join("");
  }

  function visibleProspects() {
    var q = state.search.trim().toLowerCase();
    return prospects.filter(function (p) {
      if (state.filter && p.statut !== state.filter) return false;
      if (!q) return true;
      return (p.name.toLowerCase().indexOf(q) !== -1) ||
             (p.phone && p.phone.toLowerCase().indexOf(q) !== -1) ||
             (p.email && p.email.toLowerCase().indexOf(q) !== -1);
    });
  }

  function contactCell(p) {
    if (p.phone) return '<span class="cell cell--contact">' + koraIcon("phone", { size: 15, stroke: "#8A93A3", width: 1.8 }) + esc(p.phone) + "</span>";
    if (p.email) return '<span class="cell cell--contact">' + koraIcon("mail", { size: 15, stroke: "#8A93A3", width: 1.8 }) + esc(p.email) + "</span>";
    return '<span class="cell cell--contact">—</span>';
  }
  function sourceCell(p) {
    var isForm = p.source === "formulaire_public";
    return '<span class="cell cell--source"><span class="source-mini">' +
      koraIcon(isForm ? "globe" : "plus", { size: 13, stroke: "#8A93A3", width: 2 }) +
      (isForm ? "Formulaire public" : "Ajout manuel") + "</span></span>";
  }

  function rowHtml(p) {
    var st = koraStatus(p.statut);
    return '<a class="row" href="prospect.html?id=' + encodeURIComponent(p.id) + '">' +
      '<span class="cell cell--who">' +
        '<span class="avatar avatar--row avatar--' + esc(p.avatar) + '">' + esc(p.initials) + '</span>' +
        '<span class="name' + (p.statut === "close_perdu" ? " name--muted" : "") + '">' + esc(p.name) +
          (p.isNew ? '<span class="tag-new">NOUVEAU</span>' : "") +
        '</span>' +
      '</span>' +
      contactCell(p) +
      '<span class="cell cell--status"><span class="badge badge--sm" data-status="' + st.key + '">' + esc(st.label) + '</span></span>' +
      '<span class="cell cell--date">' + esc(p.lastContact) + '</span>' +
      sourceCell(p) +
      '<span class="cell cell--chev">' + koraIcon("chevR", { size: 18, stroke: "#8A93A3", width: 2 }) + '</span>' +
      '<span class="rowcard__foot">' +
        '<span class="badge badge--sm" data-status="' + st.key + '">' + esc(st.label) + '</span>' +
        '<span class="meta">' + esc(p.lastContact) + ' · ' + (p.source === "formulaire_public" ? "Formulaire" : "Manuel") + '</span>' +
      '</span>' +
      '</a>';
  }

  function renderList() {
    var list = visibleProspects();

    if (prospects.length === 0) {
      el.rows.innerHTML = "";
      renderEmpty("Votre portefeuille est vide",
        "Ajoutez votre premier prospect, ou partagez votre page publique pour en recevoir automatiquement au statut « Nouveau ».", true);
      return;
    }
    if (list.length === 0) {
      el.rows.innerHTML = "";
      renderEmpty("Aucun prospect ne correspond",
        "Modifiez votre recherche ou le filtre de statut pour retrouver un prospect.", false);
      return;
    }

    el.emptyState.hidden = true;
    var head = '<div class="row row--head">' +
      '<span class="cell">Prospect</span><span class="cell">Contact</span><span class="cell">Statut</span>' +
      '<span class="cell">Dernier contact</span><span class="cell">Source</span><span class="cell"></span>' +
      '</div>';
    el.rows.innerHTML = head + list.map(rowHtml).join("");
  }

  function renderEmpty(title, text, offerShare) {
    el.emptyState.hidden = false;
    el.emptyState.innerHTML =
      '<div class="empty">' +
        '<div class="empty__icon">' + koraIcon("userplus", { size: 30, stroke: "#E8590C", width: 1.8 }) + '</div>' +
        '<h2>' + esc(title) + '</h2>' +
        '<p>' + esc(text) + '</p>' +
        '<div class="empty__actions">' +
          '<button class="btn btn--primary" type="button" id="emptyAdd">Ajouter un prospect</button>' +
          (offerShare ? '<a class="btn btn--secondary" href="index.html">Partager ma page</a>' : "") +
        '</div>' +
      '</div>';
    var b = document.getElementById("emptyAdd");
    if (b) b.addEventListener("click", openAdd);
  }

  /* ---- Ajout manuel ---- */
  function openAdd() {
    el.npError.hidden = true;
    el.addForm.reset();
    if (typeof el.addModal.showModal === "function") el.addModal.showModal();
    else fallbackAdd();
  }
  function fallbackAdd() {
    var name = window.prompt("Nom complet du prospect :");
    if (!name) return;
    var phone = window.prompt("Téléphone (laisser vide si aucun) :") || "";
    submitNew(name, phone, "");
  }

  function submitNew(name, phone, email) {
    Kora.prospects.create({ name: name, phone: phone, email: email })
      .then(function () { return Kora.prospects.list(); })
      .then(function (list) { prospects = list; renderCounts(); renderList(); })
      .catch(function (e) { window.alert("Création impossible : " + (e && e.message ? e.message : e)); });
  }

  el.addForm.addEventListener("submit", function (ev) {
    var val = ev.submitter && ev.submitter.value;
    if (val !== "ok") return;
    var name = document.getElementById("np-name").value.trim();
    var phone = document.getElementById("np-phone").value.trim();
    var email = document.getElementById("np-email").value.trim();
    if (!name || (!phone && !email)) {
      el.npError.hidden = false;
      ev.preventDefault();
      return;
    }
    submitNew(name, phone, email);
  });

  el.searchInput.addEventListener("input", function () { state.search = this.value; renderList(); });
  el.statusFilter.addEventListener("change", function () { state.filter = this.value; renderList(); });
  document.getElementById("addBtn").addEventListener("click", openAdd);
  document.getElementById("exportBtn").addEventListener("click", function () {
    window.alert("Export CSV : prévu en amélioration future (voir fonctionnalites-mvp.md).");
  });
  if (el.logout) {
    el.logout.addEventListener("click", function () {
      Kora.auth.signOut().then(function () { window.location.replace("auth.html"); });
    });
  }

  /* ---- Init ---- */
  paintIcons();
  fillStatusFilter();

  Kora.ready
    .then(function () { return Kora.auth.guard(); })
    .then(function (ok) {
      if (!ok) return;
      if (el.logout) el.logout.hidden = (Kora.mode === "demo");
      el.navName.textContent = KORA_AGENT;
      el.navAvatar.textContent = KORA_AGENT.charAt(0).toUpperCase();
      return Kora.prospects.list().then(function (list) {
        prospects = list;
        renderCounts();
        renderList();
      });
    })
    .catch(function (e) {
      console.error("[Kora] init", e);
      el.rows.innerHTML = '<div style="padding:24px;color:#B93232">Chargement impossible. Vérifiez la configuration Supabase (config.js).</div>';
    });
})();
