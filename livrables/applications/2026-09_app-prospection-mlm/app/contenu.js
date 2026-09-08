/* Kora — "Mon contenu du jour".
   Affiche le post du jour (généré par l'IA à partir du positionnement de
   l'agent), avec régénération. Bloc Canva en attente des templates. */

(function () {
  "use strict";

  var esc = koraEsc;
  var root = document.getElementById("content");
  var state = { pos: null, contenu: null, busy: false, canva: null };

  function cardHtml() {
    var c = state.contenu;
    var posLbl = koraPositionnementLabel(state.pos.situation, state.pos.ton);

    var bloc;
    if (c) {
      bloc =
        '<div class="ct-hook">' + esc(c.hook) + '</div>' +
        '<div class="field" style="margin-top:12px">' +
          '<label class="field__label" for="ctTexte">Post complet (modifiable avant de publier)</label>' +
          '<textarea class="textarea" id="ctTexte" rows="8">' + esc(c.texte) + '</textarea>' +
        '</div>' +
        '<div class="ct-actions" style="margin-top:10px">' +
          '<button type="button" class="btn btn--primary" data-act="copier">Copier le texte</button>' +
          '<button type="button" class="btn btn--secondary" data-act="regenerer">Régénérer</button>' +
          '<span class="ct-state" id="ctState"></span>' +
        '</div>' +
        '<div class="ct-meta" style="margin-top:8px">' + (c.source === "manuel" ? "Saisi manuellement" : "Généré par l'IA") +
          (posLbl ? " · positionnement : " + esc(posLbl) : "") + '</div>';
    } else {
      bloc =
        '<p style="color:var(--ink-2)">Pas encore de contenu pour aujourd\'hui.</p>' +
        '<div class="ct-actions">' +
          '<button type="button" class="btn btn--primary" data-act="regenerer">Générer mon contenu du jour</button>' +
          '<span class="ct-state" id="ctState"></span>' +
        '</div>';
    }

    var canvaLbl = koraLabelOf(KORA_TONS, state.pos.ton) || "ton non défini";
    var canvaBloc = state.canva && state.canva.templateId
      ? 'Template Canva pour le ton « ' + esc(canvaLbl) + " » : <code>" + esc(state.canva.templateId) + '</code>. ' +
        "L'insertion automatique du hook dans le template (autofill Canva) sera branchée quand l'intégration Canva sera finalisée."
      : 'Template Canva pour le ton « ' + esc(canvaLbl) + " » : <strong>à venir</strong>. " +
        "BONJOUR crée les templates manuellement ; une fois leurs identifiants renseignés, l'image sera générée avec le hook du jour inséré automatiquement.";

    return '<div class="card"><div class="card__head"><div class="card__title">Texte du jour</div></div>' +
      '<div class="card__body" style="display:flex;flex-direction:column;gap:8px">' + bloc + '</div></div>' +
      '<div class="card" style="margin-top:16px"><div class="card__head"><div class="card__title">Image associée (Canva)</div></div>' +
      '<div class="card__body"><div class="ct-canva">' + canvaBloc + '</div></div></div>';
  }

  function render() {
    if (!state.pos.situation || !state.pos.ton) {
      root.innerHTML = '<div class="ct-info">Renseigne d\'abord ton positionnement pour recevoir un contenu personnalisé. ' +
        '<a href="positionnement.html">Le renseigner</a></div>';
      return;
    }
    root.innerHTML = cardHtml();
    Array.prototype.forEach.call(root.querySelectorAll("[data-act]"), function (b) {
      b.addEventListener("click", function () { onAction(this.getAttribute("data-act")); });
    });
  }

  function setState(msg, cls) {
    var el = document.getElementById("ctState");
    if (el) { el.textContent = msg || ""; el.className = "ct-state" + (cls ? " " + cls : ""); }
  }

  function onAction(act) {
    if (act === "copier") {
      var ta = document.getElementById("ctTexte");
      var txt = ta ? ta.value : (state.contenu && state.contenu.texte) || "";
      if (ta) { ta.focus(); ta.select(); }
      function ok() { setState("Texte copié.", "ok"); }
      function fail() { setState("Copie auto bloquée. Sélectionne le texte et fais Ctrl+C.", "bad"); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(ok, function () {
          try { if (document.execCommand("copy")) { ok(); return; } } catch (e) {}
          fail();
        });
      } else {
        try { if (document.execCommand("copy")) { ok(); return; } } catch (e) {}
        fail();
      }
      return;
    }
    if (act === "regenerer") {
      if (state.busy) return;
      state.busy = true;
      setState("Génération en cours… (quelques secondes)");
      Kora.contenu.generer().then(function (c) {
        state.busy = false;
        state.contenu = c;
        render();
        setState("Nouveau contenu généré.", "ok");
      }).catch(function (e) {
        state.busy = false;
        setState((e && e.message) ? e.message : "Génération impossible.", "bad");
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

      return Kora.positionnement.get().then(function (p) {
        state.pos = p;
        if (!p.situation || !p.ton) { render(); return; }
        return Promise.all([
          Kora.contenu.dujour().catch(function () { return null; }),
          Kora.contenu.canvaTemplate(p.ton).catch(function () { return null; })
        ]).then(function (r) {
          state.contenu = r[0];
          state.canva = r[1];
          render();
        });
      });
    })
    .catch(function (e) {
      console.error("[Kora] init contenu", e);
      var detail = (e && (e.message || e.msg)) || String(e);
      root.innerHTML = '<div style="padding:24px;color:#B93232">Chargement impossible.<br>Détail : ' + esc(detail) +
        '<br><span style="color:#5A6474">Ouvrez <a href="diag.html">diag.html</a> pour un diagnostic.</span></div>';
    });
})();
