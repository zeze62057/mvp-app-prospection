/* Kora — page publique de capture (Section C du canvas).
   Validation légère du formulaire puis état de confirmation.
   En mode live, la soumission passe par le RPC soumettre_prospect_public. */

(function () {
  "use strict";

  var esc = koraEsc;

  /* Slug de l'agent porté par l'URL (?agent=), sinon valeur par défaut de config.js.
     Sert au rattachement du prospect côté application (une landing par agent). */
  var m = /[?&]agent=([^&]+)/.exec(window.location.search);
  var agentSlug = m ? decodeURIComponent(m[1]) : ((window.KORA_CONFIG && window.KORA_CONFIG.defaultAgentSlug) || "bonjour");

  /* Nom affiché : meilleure estimation immédiate (nom connu si c'est l'agent par défaut,
     sinon slug converti). Affiné ensuite par Kora.publicAgentName (RPC en mode live). */
  var defSlug = (window.KORA_CONFIG && window.KORA_CONFIG.defaultAgentSlug) || "bonjour";
  var agent = (!m || agentSlug === defSlug) ? (KORA_AGENT || "BONJOUR") : koraTitleFromSlug(agentSlug);

  document.getElementById("playIcon").innerHTML = koraIcon("play", { size: 17, stroke: "#0B1220", width: 1.9 });
  document.getElementById("thanksCheck").innerHTML = koraIcon("check", { size: 30, stroke: "#fff", width: 2.4 });

  var BENEFITS = [
    { icon: "M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", title: "Un revenu à votre rythme", text: "Quelques heures par semaine suffisent pour démarrer, sans quitter votre activité actuelle." },
    { icon: "M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13M4 19h16M9 9h6M9 13h4", title: "Formation offerte, en français", text: "Des modules courts sur WhatsApp : quoi dire, à qui, et comment suivre vos contacts." },
    { icon: "M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 7a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM21 21v-2a4 4 0 0 0-3-3.9", title: "Un parrain qui répond", text: "" },
    { icon: "M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6ZM9 12l2 2 4-4", title: "Sans frais cachés", text: "Vous savez dès le premier appel ce que ça demande et ce que ça rapporte." }
  ];
  var STEPS = [
    { title: "Vous laissez votre numéro", text: "Trente secondes, sans engagement." },
    { title: "On vous appelle sous 24 h", text: "" },
    { title: "Vous démarrez accompagné", text: "Formation, outils et suivi hebdomadaire dès la première semaine." }
  ];

  function paintAgent(name) {
    agent = name;
    ["agentName", "agentName2", "agentName3", "agentName4"].forEach(function (id) {
      var n = document.getElementById(id);
      if (n) n.textContent = name;
    });

    BENEFITS[2].text = name + " vous suit personnellement pendant vos 90 premiers jours.";
    document.getElementById("benefits").innerHTML = BENEFITS.map(function (b) {
      return '<div class="benefit">' +
        '<div class="benefit__ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9470A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="' + b.icon + '"></path></svg></div>' +
        '<h3>' + esc(b.title) + '</h3><p>' + esc(b.text) + '</p></div>';
    }).join("");

    STEPS[1].text = name + " répond à vos questions et vous envoie la vidéo de présentation.";
    document.getElementById("steps").innerHTML = STEPS.map(function (s, i) {
      return '<div class="step">' +
        '<div class="step__n' + (i === 2 ? " step__n--accent" : "") + '">' + (i + 1) + '</div>' +
        '<div><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div></div>';
    }).join("");
  }

  paintAgent(agent);
  Kora.publicAgentName(agentSlug).then(function (nm) {
    if (nm && nm !== agent) paintAgent(nm);
  }).catch(function () {});

  /* Défilement vers le formulaire */
  document.getElementById("toFormBtn").addEventListener("click", function () {
    var anchor = document.getElementById("formAnchor");
    var top = anchor.getBoundingClientRect().top + window.pageYOffset - 32;
    window.scrollTo({ top: top, behavior: "smooth" });
    var f = document.getElementById("lf-name");
    if (f) setTimeout(function () { f.focus(); }, 400);
  });
  document.getElementById("videoBtn").addEventListener("click", function () {
    window.alert("Vidéo de présentation : à brancher (lien YouTube ou fichier).");
  });

  /* Soumission */
  var form = document.getElementById("leadForm");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var name = document.getElementById("lf-name").value.trim();
    var phone = document.getElementById("lf-phone").value.trim();
    var email = document.getElementById("lf-email").value.trim();

    var digits = phone.replace(/[^0-9]/g, "");
    var phoneField = document.getElementById("lf-phone-field");
    var phoneError = document.getElementById("lf-phone-error");
    var ok = true;

    if (!name) { document.getElementById("lf-name").focus(); ok = false; }
    if (!phone || digits.length < 9) {
      phoneField.classList.add("is-error");
      phoneError.hidden = false;
      ok = false;
    } else {
      phoneField.classList.remove("is-error");
      phoneError.hidden = true;
    }
    if (!ok) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    function reset() {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Être recontacté"; }
    }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Envoi…"; }

    Kora.publicLead.submit({ agentSlug: agentSlug, name: name, phone: phone, email: email })
      .then(function (res) {
        if (res && res.error) {
          phoneError.textContent = res.error;
          phoneError.hidden = false;
          reset();
          return;
        }
        var first = name.split(/\s+/)[0];
        document.getElementById("thanksTitle").textContent = "Merci " + first + " !";
        document.getElementById("thanksText").textContent =
          "Votre demande est bien arrivée chez " + agent + ". Vous serez recontacté sous 24 h sur WhatsApp" +
          (phone ? " au " + phone : "") + ".";
        form.hidden = true;
        document.getElementById("thanks").hidden = false;
        document.getElementById("formAnchor").scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch(function () {
        phoneError.textContent = "Envoi impossible pour le moment. Réessayez dans un instant.";
        phoneError.hidden = false;
        reset();
      });
  });
})();
