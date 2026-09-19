/* Kora — écran de connexion. */

(function () {
  "use strict";

  var form = document.getElementById("loginForm");
  var err = document.getElementById("err");
  var btn = document.getElementById("submitBtn");

  if (Kora.mode === "demo") {
    document.getElementById("demoNote").hidden = false;
    form.hidden = true;
    return;
  }

  /* Déjà connecté : filer au tableau de bord. */
  Kora.ready.then(function () {
    return Kora.auth.user();
  }).then(function (u) {
    if (u) window.location.replace("app.html");
  });

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    err.hidden = true;
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value;
    if (!email || !password) {
      err.textContent = "Renseignez votre email et votre mot de passe.";
      err.hidden = false;
      return;
    }
    btn.disabled = true;
    btn.textContent = "Connexion…";
    function fail(msg) {
      err.textContent = msg;
      err.hidden = false;
      btn.disabled = false;
      btn.textContent = "Se connecter";
    }
    Kora.auth.signIn(email, password).then(function (res) {
      if (res.error) { fail(res.error); return; }
      window.location.replace("app.html");
    }).catch(function () {
      fail("Connexion impossible. Vérifiez votre réseau et la configuration Supabase.");
    });
  });
})();
