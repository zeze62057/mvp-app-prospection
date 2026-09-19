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

  var STEPS = [
    { title: "Premier contact.", text: "" },
    { title: "Formation guidée.", text: "Vous recevez les modules de la semaine 1 sur WhatsApp. Votre parrain vous accompagne à chaque étape, à votre rythme." },
    { title: "Premiers pas avec votre équipe.", text: "Vous contactez vos premières personnes en suivant les messages fournis, et vous débriefez chaque échange avec votre parrain." }
  ];

  function paintAgent(name) {
    agent = name;
    ["agentName", "agentName2", "agentName3", "agentName4", "agentName5", "agentName6", "agentName7"].forEach(function (id) {
      var n = document.getElementById(id);
      if (n) n.textContent = name;
    });

    STEPS[0].text = "Vous laissez votre nom et votre numéro WhatsApp. " + name + " vous appelle sous 24 h pour répondre à vos questions et confirmer votre place.";
    var stEl = document.getElementById("steps");
    if (stEl) {
      stEl.innerHTML = STEPS.map(function (s, i) {
        return '<div class="step">' +
          '<div class="step__n' + (i === 2 ? " step__n--accent" : "") + '">' + (i + 1) + '</div>' +
          '<div><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div></div>';
      }).join("");
    }
  }

  paintAgent(agent);

  /* ---- Contenu personnalisable de la page publique (par agent) ----
     Chaque agent modifie le sien dans Paramètres > Ma page publique.
     Valeur absente = on garde le texte par défaut déjà dans le HTML. */
  function setLandingText(id, txt) {
    var el = document.getElementById(id);
    if (el && txt) el.textContent = txt;
  }
  function applyLanding(L) {
    if (!L) return;
    setLandingText("landingBadge", L.badge);
    setLandingText("landingTitre", L.titre);
    if (L.sousTitre) setLandingText("landingLead", koraLandingSousTitre(L.sousTitre, agent));
    setLandingText("toFormBtn", L.cta);
    setLandingText("landingPreuve", L.preuve);
    if (L.photoUrl) {
      var m = document.getElementById("heroMedia");
      if (m) {
        m.classList.remove("imgslot");
        m.innerHTML = '<img src="' + esc(L.photoUrl) + '" alt="Photo de ' + esc(agent) +
          '" style="width:100%;height:100%;object-fit:cover;display:block">';
      }
    }
  }

  /* Nom + contenu personnalisé, résolus ensemble. La vidéo n'est branchée
     qu'après, pour donner la priorité au lien vidéo de l'agent sur config.js. */
  var configVideoUrl = ((window.KORA_CONFIG && window.KORA_CONFIG.videoUrl) || "").trim();
  ["videoBtn", "videoBtn2"].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.hidden = true;                 // caché tant qu'on ne connaît pas la bonne URL
  });

  Promise.all([
    Kora.publicAgentName(agentSlug).then(function (n) { return n; }, function () { return null; }),
    (Kora.publicLanding ? Kora.publicLanding(agentSlug) : Promise.resolve(null))
      .then(function (l) { return l; }, function () { return null; })
  ]).then(function (r) {
    var nm = r[0], L = r[1];
    if (nm && nm !== agent) paintAgent(nm);
    else if (L && L.nom && L.nom !== agent) paintAgent(L.nom);
    applyLanding(L);
    setupVideo((L && L.videoUrl) || configVideoUrl);
  });

  /* Défilement vers le formulaire */
  document.getElementById("toFormBtn").addEventListener("click", function () {
    var anchor = document.getElementById("formAnchor");
    var top = anchor.getBoundingClientRect().top + window.pageYOffset - 32;
    window.scrollTo({ top: top, behavior: "smooth" });
    var f = document.getElementById("lf-name");
    if (f) setTimeout(function () { f.focus(); }, 400);
  });

  /* Vidéo de présentation : modale YouTube / Vimeo / fichier mp4-webm-ogg.
     rawUrl = lien vidéo de l'agent, sinon config.js -> videoUrl.
     Boutons masqués si l'URL est vide ou non reconnue. */
  function setupVideo(rawUrl) {
    var url = (rawUrl || "").trim();
    var btns = [document.getElementById("videoBtn"), document.getElementById("videoBtn2")].filter(Boolean);
    var modal = document.getElementById("videoModal");
    var frame = document.getElementById("videoModalFrame");

    var embed = url ? videoEmbed(url) : null;
    if (!embed || !modal || !frame) {
      btns.forEach(function (b) { b.hidden = true; });
      return;
    }
    btns.forEach(function (b) { b.hidden = false; });

    function openVideo() {
      frame.innerHTML = (embed.type === "video")
        ? '<video src="' + esc(embed.src) + '" controls autoplay playsinline></video>'
        : '<iframe src="' + esc(embed.src) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }
    function closeVideo() {
      modal.hidden = true;
      frame.innerHTML = "";                 // coupe la lecture et le son
      document.body.style.overflow = "";
    }

    btns.forEach(function (b) { b.addEventListener("click", openVideo); });
    modal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closeVideo();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeVideo();
    });
  }

  /* Transforme un lien YouTube / Vimeo / fichier vidéo en source intégrable. */
  function videoEmbed(raw) {
    var u = String(raw).trim();
    var yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    if (yt) return { type: "iframe", src: "https://www.youtube.com/embed/" + yt[1] };
    var vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vm) return { type: "iframe", src: "https://player.vimeo.com/video/" + vm[1] };
    if (/^https?:\/\/.+\.(mp4|webm|ogg)(\?.*)?$/i.test(u)) return { type: "video", src: u };
    if (/^https?:\/\/.+/i.test(u)) return { type: "iframe", src: u };   // autre lecteur embarquable
    return null;
  }

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
