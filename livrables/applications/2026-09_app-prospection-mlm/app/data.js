/* Kora — données de démonstration et helpers partagés.
   Tout est en mémoire : les ajouts et changements de statut sont perdus au rechargement.
   Le branchement Supabase (schéma dans ../schema-base-de-donnees.md) remplacera ce fichier. */

var KORA_AGENT = "BONJOUR";

/* Les 7 statuts du pipeline, dans l'ordre. Couleurs reprises de la planche de composants du canvas. */
var KORA_STATUSES = [
  { key: "nouveau",        label: "Nouveau",        bg: "#F1F5F9", fg: "#475569", dot: "#64748B" },
  { key: "contacte",       label: "Contacté",       bg: "#E7F0FD", fg: "#1558B0", dot: "#1D6FD8" },
  { key: "dans_le_tunnel", label: "Dans le tunnel", bg: "#EFEAFE", fg: "#5334C7", dot: "#6B4BE0" },
  { key: "interesse",      label: "Intéressé",      bg: "#FDF3E0", fg: "#8F5A05", dot: "#B0700A" },
  { key: "en_negociation", label: "En négociation", bg: "#FDECE1", fg: "#B23F06", dot: "#E8590C" },
  { key: "close_gagne",    label: "Closé gagné",    bg: "#E4F5EC", fg: "#0B6640", dot: "#0F7A4A" },
  { key: "close_perdu",    label: "Closé perdu",    bg: "#F1F3F6", fg: "#4B5563", dot: "#98A2B3" }
];

function koraStatus(key) {
  for (var i = 0; i < KORA_STATUSES.length; i++) {
    if (KORA_STATUSES[i].key === key) return KORA_STATUSES[i];
  }
  return KORA_STATUSES[0];
}
function koraStatusIndex(key) {
  for (var i = 0; i < KORA_STATUSES.length; i++) {
    if (KORA_STATUSES[i].key === key) return i;
  }
  return 0;
}

/* Types d'interaction proposés dans le formulaire de suivi. */
var KORA_INTERACTION_TYPES = [
  { key: "appel",   label: "Appel" },
  { key: "message", label: "Message" },
  { key: "rdv",     label: "Rendez-vous" },
  { key: "relance", label: "Relance" },
  { key: "note",    label: "Note" }
];

/* Petite bibliothèque d'icônes inline (trait, 24x24), reprises du canvas. */
var KORA_ICONS = {
  phone:    '<path d="M21 15v4a2 2 0 0 1-2.2 2 19 19 0 0 1-8.3-3 18.6 18.6 0 0 1-5.7-5.7 19 19 0 0 1-3-8.4A2 2 0 0 1 4.8 2h4a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L10 9.8a15 15 0 0 0 5.7 5.7l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7A2 2 0 0 1 21 15Z"></path>',
  mail:     '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"></rect><path d="m3 6 9 6.5L21 6"></path>',
  whatsapp: '<path d="M21 11.5a8.4 8.4 0 0 1-12.2 7.5L3 21l2-5.8A8.4 8.4 0 1 1 21 11.5Z"></path>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"></rect><path d="M8 3v4M16 3v4M3 11h18"></path>',
  refresh:  '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4"></path>',
  note:     '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"></path><path d="M14 3v5h5M9 13h6M9 17h4"></path>',
  swap:     '<path d="M4 17h11M15 13l4 4-4 4"></path><path d="M20 7H9M9 3 5 7l4 4"></path>',
  globe:    '<circle cx="12" cy="12" r="9"></circle><path d="M2 12h20M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"></path>',
  user:     '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9.5" cy="7" r="3.5"></circle>',
  userplus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M19 8v6M22 11h-6"></path>',
  plus:     '<path d="M12 5v14M5 12h14"></path>',
  chevR:    '<path d="m9 6 6 6-6 6"></path>',
  chevD:    '<path d="m6 9 6 6 6-6"></path>',
  chevL:    '<path d="m14 6-6 6 6 6"></path>',
  search:   '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>',
  bell:     '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"></path><path d="M13.7 21a2 2 0 0 1-3.4 0"></path>',
  check:    '<path d="m5 13 4.5 4.5L19 7"></path>',
  list:     '<path d="M4 6h16M4 12h16M4 18h10"></path>',
  play:     '<circle cx="12" cy="12" r="9"></circle><path d="M10 8.5l6 3.5-6 3.5Z"></path>'
};

function koraIcon(name, opts) {
  opts = opts || {};
  var size = opts.size || 16;
  var stroke = opts.stroke || "currentColor";
  var w = opts.width || 1.9;
  var body = KORA_ICONS[name] || "";
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" ' +
    'stroke="' + stroke + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    body + '</svg>';
}

/* Icône associée à un type d'événement de timeline. */
function koraEventIcon(ev) {
  if (ev.kind === "status") return "swap";
  if (ev.kind === "created") return "globe";
  var map = { appel: "phone", message: "whatsapp", rdv: "calendar", relance: "refresh", note: "note" };
  return map[ev.type] || "note";
}
function koraTypeLabel(key) {
  for (var i = 0; i < KORA_INTERACTION_TYPES.length; i++) {
    if (KORA_INTERACTION_TYPES[i].key === key) return KORA_INTERACTION_TYPES[i].label;
  }
  return "Note";
}

/* Portefeuille de démonstration de BONJOUR. Noms et contenus repris du canvas. */
var KORA_PROSPECTS = [
  {
    id: "fatoumata-diallo",
    name: "Fatoumata Diallo", initials: "FD", avatar: "accent",
    phone: "+224 622 45 18 90", email: "f.diallo@gmail.com",
    statut: "en_negociation", lastContact: "il y a 2 jours",
    source: "formulaire_public", createdAt: "22 août 2026", createdVia: "formulaire public de BONJOUR",
    history: [
      { kind: "status", to: "en_negociation", when: "Hier à 18:42", by: "BONJOUR" },
      { kind: "interaction", type: "rdv", text: "Rendez-vous fixé samedi 15h, au bureau de Kaloum.", when: "Il y a 2 jours, 11:05", by: "BONJOUR" },
      { kind: "interaction", type: "message", text: "Message WhatsApp envoyé avec la vidéo de présentation.", when: "Il y a 4 jours, 09:20", by: "BONJOUR" },
      { kind: "status", to: "interesse", when: "Il y a 5 jours, 16:12", by: "BONJOUR" },
      { kind: "interaction", type: "appel", text: "Appel passé, pas de réponse.", when: "Il y a 1 semaine, 14:38", by: "BONJOUR" },
      { kind: "interaction", type: "note", text: "Cherche un revenu complémentaire, disponible le week-end. Préfère WhatsApp.", when: "Il y a 1 semaine, 14:41", by: "BONJOUR" },
      { kind: "created", to: "nouveau", when: "22 août 2026, 20:03", by: "formulaire public de BONJOUR" }
    ]
  },
  {
    id: "ibrahima-barry",
    name: "Ibrahima Barry", initials: "IB", avatar: "neutral",
    phone: "+224 655 02 77 41", email: "",
    statut: "interesse", lastContact: "il y a 4 jours",
    source: "manuel", createdAt: "18 août 2026", createdVia: "ajout manuel par BONJOUR",
    history: [
      { kind: "status", to: "interesse", when: "Il y a 4 jours, 10:15", by: "BONJOUR" },
      { kind: "interaction", type: "message", text: "A répondu au message, veut en savoir plus sur les produits.", when: "Il y a 4 jours, 10:12", by: "BONJOUR" },
      { kind: "interaction", type: "appel", text: "Premier échange, intéressé par un revenu d'appoint.", when: "Il y a 1 semaine, 17:20", by: "BONJOUR" },
      { kind: "status", to: "contacte", when: "Il y a 1 semaine, 17:22", by: "BONJOUR" },
      { kind: "created", to: "nouveau", when: "18 août 2026, 09:00", by: "ajout manuel par BONJOUR" }
    ]
  },
  {
    id: "aissatou-camara",
    name: "Aïssatou Camara", initials: "AC", avatar: "neutral",
    phone: "", email: "aissatou.camara@gmail.com",
    statut: "dans_le_tunnel", lastContact: "il y a 1 semaine",
    source: "formulaire_public", createdAt: "15 août 2026", createdVia: "formulaire public de BONJOUR",
    history: [
      { kind: "status", to: "dans_le_tunnel", when: "Il y a 1 semaine, 12:40", by: "BONJOUR" },
      { kind: "interaction", type: "rdv", text: "Réunion d'information en ligne planifiée.", when: "Il y a 1 semaine, 12:35", by: "BONJOUR" },
      { kind: "interaction", type: "message", text: "Vidéo de présentation envoyée par email.", when: "Il y a 10 jours, 08:05", by: "BONJOUR" },
      { kind: "created", to: "nouveau", when: "15 août 2026, 21:12", by: "formulaire public de BONJOUR" }
    ]
  },
  {
    id: "mamadou-sylla",
    name: "Mamadou Sylla", initials: "MS", avatar: "neutral",
    phone: "+224 628 31 09 55", email: "",
    statut: "contacte", lastContact: "il y a 3 jours",
    source: "manuel", createdAt: "20 août 2026", createdVia: "ajout manuel par BONJOUR",
    history: [
      { kind: "status", to: "contacte", when: "Il y a 3 jours, 19:02", by: "BONJOUR" },
      { kind: "interaction", type: "appel", text: "Message vocal laissé, en attente de rappel.", when: "Il y a 3 jours, 19:00", by: "BONJOUR" },
      { kind: "created", to: "nouveau", when: "20 août 2026, 14:30", by: "ajout manuel par BONJOUR" }
    ]
  },
  {
    id: "kadiatou-bah",
    name: "Kadiatou Bah", initials: "KB", avatar: "neutral", isNew: true,
    phone: "+224 664 77 12 30", email: "",
    statut: "nouveau", lastContact: "il y a 5 heures",
    source: "formulaire_public", createdAt: "7 sept. 2026", createdVia: "formulaire public de BONJOUR",
    history: [
      { kind: "created", to: "nouveau", when: "Aujourd'hui, 04:30", by: "formulaire public de BONJOUR" }
    ]
  },
  {
    id: "sekou-conde",
    name: "Sékou Condé", initials: "SC", avatar: "green",
    phone: "+224 621 09 44 12", email: "",
    statut: "close_gagne", lastContact: "il y a 2 semaines",
    source: "manuel", createdAt: "5 août 2026", createdVia: "ajout manuel par BONJOUR",
    history: [
      { kind: "status", to: "close_gagne", when: "Il y a 2 semaines, 15:30", by: "BONJOUR" },
      { kind: "interaction", type: "rdv", text: "Signature du contrat de distribution, kit de démarrage remis.", when: "Il y a 2 semaines, 15:00", by: "BONJOUR" },
      { kind: "status", to: "en_negociation", when: "Il y a 3 semaines, 11:00", by: "BONJOUR" },
      { kind: "created", to: "nouveau", when: "5 août 2026, 10:00", by: "ajout manuel par BONJOUR" }
    ]
  },
  {
    id: "mariama-toure",
    name: "Mariama Touré", initials: "MT", avatar: "muted",
    phone: "+224 610 88 23 07", email: "",
    statut: "close_perdu", lastContact: "il y a 3 semaines",
    source: "formulaire_public", createdAt: "1 août 2026", createdVia: "formulaire public de BONJOUR",
    history: [
      { kind: "status", to: "close_perdu", when: "Il y a 3 semaines, 09:20", by: "BONJOUR" },
      { kind: "interaction", type: "note", text: "Pas disponible cette année, recontacter en janvier.", when: "Il y a 3 semaines, 09:18", by: "BONJOUR" },
      { kind: "interaction", type: "appel", text: "Échange court, hésite à cause du temps à consacrer.", when: "Il y a 4 semaines, 16:45", by: "BONJOUR" },
      { kind: "created", to: "nouveau", when: "1 août 2026, 19:40", by: "formulaire public de BONJOUR" }
    ]
  }
];

function koraFindProspect(id) {
  for (var i = 0; i < KORA_PROSPECTS.length; i++) {
    if (KORA_PROSPECTS[i].id === id) return KORA_PROSPECTS[i];
  }
  return null;
}

function koraSlug(name) {
  return name.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function koraInitials(name) {
  var parts = name.trim().split(/\s+/);
  var a = parts[0] ? parts[0][0] : "";
  var b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}
function koraFirstName(name) {
  return name.trim().split(/\s+/)[0];
}

/* Échappement HTML, partagé par les écrans. */
function koraEsc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* "aissatou-camara" -> "Aissatou Camara" (repli quand le vrai nom n'est pas connu). */
function koraTitleFromSlug(slug) {
  return String(slug || "").split(/[-_\s]+/).filter(Boolean).map(function (w) {
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(" ");
}
