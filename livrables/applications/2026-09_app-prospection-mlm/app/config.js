/* Kora — configuration.
   Rempli depuis le .env global du workspace.
   supabaseAnonKey = cle "publishable" (sb_publishable_...), publique par conception,
   destinee au navigateur. NE JAMAIS mettre ici la cle secrete (sb_secret_...). */

window.KORA_CONFIG = {
  supabaseUrl: "https://swsjyeltuabrqwjaisew.supabase.co",
  supabaseAnonKey: "sb_publishable_-X3S6ptHG2l-P8wQ845CBQ_-vPSXEG9",
  defaultAgentSlug: "bonjour",

  /* ----------------------------------------------------------------
     BASE PUBLIQUE de l'app, sans slash final.
     Sert a construire le lien du tunnel de chaque agent, insere a la
     place du jeton [lien] dans le message de premier contact.
     Ex. "https://kora.gn" -> lien = https://kora.gn/index.html?agent=<slug>
     Laisse vide ("") pour deduire l'URL depuis la page courante
     (fonctionne en http://, pas en file://).
     ---------------------------------------------------------------- */
  publicBaseUrl: "",

  /* ----------------------------------------------------------------
     VEILLE RESEAUX SOCIAUX (module Facebook).
     Renseigne l'App ID de ton application Meta pour activer le bouton
     "Connecter Facebook". Laisse vide pour garder le bouton desactive.
     Procedure complete : ../VEILLE-SOCIALE.md
     ---------------------------------------------------------------- */
  facebookAppId: "",
  /* Fonction Edge qui recoit le retour OAuth de Facebook.
     Par defaut : <supabaseUrl>/functions/v1/fb-oauth-callback */
  facebookOauthCallback: "",

  /* ----------------------------------------------------------------
     VIDEO DE PRESENTATION de la landing publique (index.html)

     Colle ici le lien de ta video, enregistre, recharge la page.
     Formats reconnus automatiquement :
       - YouTube : https://youtu.be/ABC123
                   https://www.youtube.com/watch?v=ABC123
       - Vimeo   : https://vimeo.com/123456789
       - Fichier : https://.../presentation.mp4  (aussi .webm, .ogg)

     Laisse la chaine vide ("") pour masquer les boutons "Voir la video".
     ---------------------------------------------------------------- */
  videoUrl: ""
};
