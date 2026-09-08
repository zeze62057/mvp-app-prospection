/* Kora — questionnaire de positionnement de l'agent.
   Deux choix : situation personnelle + ton de communication.
   Passage obligatoire au premier login (app.js redirige ici si vide),
   modifiable ensuite depuis les Paramètres. */

(function () {
  "use strict";

  var esc = koraEsc;
  var card = document.getElementById("card");
  var state = { situation: null, ton: null, saving: false, premierPassage: true };

  function options(list, selected) {
    return '<option value="">— choisir —</option>' + list.map(function (o) {
      return '<option value="' + esc(o.key) + '"' + (o.key === selected ? " selected" : "") + '>' + esc(o.label) + '</option>';
    }).join("");
  }

  function preview() {
    var s = document.getElementById("posSituation");
    var t = document.getElementById("posTon");
    var lbl = koraPositionnementLabel(s ? s.value : "", t ? t.value : "");
    var box = document.getElementById("posPreview");
    if (box) box.textContent = lbl ? "Ton positionnement : " + lbl : "Choisis une situation et un ton.";
  }

  function render() {
    card.innerHTML =
      '<h1>Mon positionnement</h1>' +
      '<p class="intro">Ces deux réponses servent à personnaliser le contenu que Kora te propose ' +
        'chaque jour pour publier sur les réseaux. Tu pourras les changer plus tard dans les Paramètres.</p>' +
      '<div class="field"><label class="field__label" for="posSituation">Ta situation en ce moment</label>' +
        '<select class="input" id="posSituation">' + options(KORA_SITUATIONS, state.situation) + '</select></div>' +
      '<div class="field"><label class="field__label" for="posTon">Le ton qui te ressemble</label>' +
        '<select class="input" id="posTon">' + options(KORA_TONS, state.ton) + '</select></div>' +
      '<div class="pos-preview" id="posPreview"></div>' +
      '<div class="save-row" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">' +
        '<button type="button" class="btn btn--primary" id="posSave">Enregistrer</button>' +
        (state.premierPassage ? "" : '<a class="btn btn--secondary" href="parametres.html">Retour aux paramètres</a>') +
        '<span class="pos-state" id="posState"></span>' +
      '</div>';

    document.getElementById("posSituation").addEventListener("change", preview);
    document.getElementById("posTon").addEventListener("change", preview);
    document.getElementById("posSave").addEventListener("click", save);
    preview();
  }

  function save() {
    if (state.saving) return;
    var situation = document.getElementById("posSituation").value;
    var ton = document.getElementById("posTon").value;
    var st = document.getElementById("posState");
    if (!situation || !ton) { st.textContent = "Choisis une situation et un ton."; st.className = "pos-state bad"; return; }

    state.saving = true;
    var btn = document.getElementById("posSave");
    btn.disabled = true;
    st.textContent = "Enregistrement…"; st.className = "pos-state";

    Kora.positionnement.set(situation, ton).then(function (r) {
      state.saving = false; btn.disabled = false;
      if (r && r.error) { st.textContent = "Échec : " + r.error; st.className = "pos-state bad"; return; }
      window.location.replace(state.premierPassage ? "contenu.html" : "parametres.html");
    }).catch(function (e) {
      state.saving = false; btn.disabled = false;
      st.textContent = "Échec : " + (e && e.message ? e.message : e); st.className = "pos-state bad";
    });
  }

  Kora.ready
    .then(function () { return Kora.auth.guard(); })
    .then(function (ok) {
      if (!ok) return;
      return Kora.positionnement.get().then(function (p) {
        state.situation = p.situation;
        state.ton = p.ton;
        state.premierPassage = !(p.situation && p.ton);
        render();
      });
    })
    .catch(function (e) {
      var detail = (e && (e.message || e.msg)) || String(e);
      card.innerHTML = '<p style="color:#B93232">Chargement impossible.<br>Détail : ' + esc(detail) + '</p>';
    });
})();
