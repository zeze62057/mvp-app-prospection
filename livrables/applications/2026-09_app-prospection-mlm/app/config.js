/* Kora — configuration.
   Rempli depuis le .env global du workspace.
   supabaseAnonKey = cle "publishable" (sb_publishable_...), publique par conception,
   destinee au navigateur. NE JAMAIS mettre ici la cle secrete (sb_secret_...). */

window.KORA_CONFIG = {
  supabaseUrl: "https://swsjyeltuabrqwjaisew.supabase.co",
  supabaseAnonKey: "sb_publishable_-X3S6ptHG2l-P8wQ845CBQ_-vPSXEG9",
  defaultAgentSlug: "bonjour"
};
