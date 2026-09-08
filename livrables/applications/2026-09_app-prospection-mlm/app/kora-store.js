/* Kora — couche d'accès aux données.
   Une seule API (window.Kora), deux implémentations :
     - MODE DÉMO  : données en mémoire (KORA_PROSPECTS de data.js), aucune auth.
     - MODE LIVE  : Supabase (auth email/mot de passe + Postgres + RLS).
   Le mode est choisi au chargement selon window.KORA_CONFIG. */

(function () {
  "use strict";

  var cfg = window.KORA_CONFIG || {};
  var hasLib = typeof window.supabase !== "undefined" && window.supabase && window.supabase.createClient;
  var live = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && hasLib);

  if (cfg.supabaseUrl && cfg.supabaseAnonKey && !hasLib) {
    console.warn("[Kora] Config Supabase présente mais la librairie supabase-js n'est pas chargée. Retour au mode démo.");
  }

  var sb = live ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;

  /* -------- Helpers de format -------- */
  function koraAgo(input) {
    if (!input) return "";
    var t = (typeof input === "number") ? input : Date.parse(input);
    if (isNaN(t)) return String(input);
    var s = Math.floor((Date.now() - t) / 1000);
    if (s < 60) return "à l'instant";
    var m = Math.floor(s / 60); if (m < 60) return "il y a " + m + " minute" + (m > 1 ? "s" : "");
    var h = Math.floor(m / 60); if (h < 24) return "il y a " + h + " heure" + (h > 1 ? "s" : "");
    var d = Math.floor(h / 24); if (d < 7) return "il y a " + d + " jour" + (d > 1 ? "s" : "");
    var w = Math.floor(d / 7); if (w < 5) return "il y a " + w + " semaine" + (w > 1 ? "s" : "");
    var mo = Math.floor(d / 30); if (mo < 12) return "il y a " + mo + " mois";
    var y = Math.floor(d / 365); return "il y a " + y + " an" + (y > 1 ? "s" : "");
  }
  function koraDate(input) {
    var t = (typeof input === "number") ? input : Date.parse(input);
    if (isNaN(t)) return String(input);
    try { return new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); }
    catch (e) { return new Date(t).toISOString().slice(0, 10); }
  }
  function avatarFor(statut) {
    if (statut === "close_gagne") return "green";
    if (statut === "close_perdu") return "muted";
    if (statut === "nouveau") return "accent";
    return "neutral";
  }
  function uniq(arr) {
    var out = [], seen = {};
    arr.forEach(function (x) { if (x && !seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }

  window.koraAgo = koraAgo;
  window.koraDate = koraDate;

  /* -------- Veille sociale : message de premier contact -------- */

  /* Texte par defaut, aussi pose comme default de agents.message_modele en base. */
  var KORA_MESSAGE_DEFAUT =
    "Salut ! Merci pour ton intérêt 😊 Je vois que tu es passé(e) par ici. " +
    "Si tu veux en savoir plus sur ce que je propose, clique ici : [lien] — " +
    "je réponds à toutes tes questions !";

  /* Lien du tunnel public d'un agent, insere a la place du jeton [lien]. */
  function koraTunnelLink(slug) {
    slug = slug || cfg.defaultAgentSlug || "bonjour";
    var base = (cfg.publicBaseUrl || "").replace(/\/+$/, "");
    if (!base) {
      // Deduit depuis la page courante : .../app/parametres.html -> .../app
      base = window.location.href.split(/[?#]/)[0].replace(/\/[^\/]*$/, "");
    }
    return base + "/index.html?agent=" + encodeURIComponent(slug);
  }

  /* Remplace toutes les occurrences de [lien] par l'URL reelle du tunnel. */
  function koraFillMessage(modele, slug) {
    return String(modele == null ? "" : modele).split("[lien]").join(koraTunnelLink(slug));
  }

  window.KORA_MESSAGE_DEFAUT = KORA_MESSAGE_DEFAUT;
  window.koraTunnelLink = koraTunnelLink;
  window.koraFillMessage = koraFillMessage;

  function trimOrNull(s) { s = (s == null ? "" : String(s)).trim(); return s || null; }

  /* ============================================================
     MODE DÉMO
     ============================================================ */
  function memoryStore() {
    var demoSlug = cfg.defaultAgentSlug || "bonjour";
    var demoSettings = { messageModele: KORA_MESSAGE_DEFAUT };
    var demoSocial = {
      facebook: { connected: false, pageName: null, connectedAt: null, lastScan: null },
      tiktok: { connected: false, displayName: null, connectedAt: null }
    };
    var _now = Date.now();
    var demoNotifs = [
      { id: "demo-n1", source: "facebook", type: "commentaire",
        prospectNom: "Aminata Sow", prospectRef: null, prospectProfilUrl: null,
        publicationTitre: "3 erreurs qui bloquent ton premier revenu en ligne",
        publicationUrl: "https://www.facebook.com/", commentaireTexte: "Ça m'intéresse, on commence comment ?",
        externalId: "demo-c-1", messageEnvoye: false, lu: false, prospectId: null,
        createdAt: new Date(_now - 40 * 60000).toISOString() },
      { id: "demo-n2", source: "facebook", type: "like",
        prospectNom: "Ousmane Barry", prospectRef: null, prospectProfilUrl: null,
        publicationTitre: "3 erreurs qui bloquent ton premier revenu en ligne",
        publicationUrl: "https://www.facebook.com/", commentaireTexte: null,
        externalId: "demo-l-1", messageEnvoye: false, lu: false, prospectId: null,
        createdAt: new Date(_now - 3 * 3600000).toISOString() },
      { id: "demo-n3", source: "manuel", type: "commentaire",
        prospectNom: "Mariam Cissé", prospectRef: null, prospectProfilUrl: null,
        publicationTitre: "Story du 6 septembre", publicationUrl: "",
        commentaireTexte: "Envoie-moi les infos stp", externalId: null,
        messageEnvoye: true, lu: true, prospectId: null,
        createdAt: new Date(_now - 27 * 3600000).toISOString() }
    ];
    function demoFind(id) {
      for (var i = 0; i < demoNotifs.length; i++) if (demoNotifs[i].id === id) return demoNotifs[i];
      return null;
    }

    return {
      mode: "demo",
      ready: Promise.resolve(),

      auth: {
        user: function () { return Promise.resolve({ id: "demo", name: KORA_AGENT }); },
        signIn: function () { return Promise.resolve({ error: null }); },
        signOut: function () { return Promise.resolve(); },
        guard: function () { return Promise.resolve(true); }
      },

      prospects: {
        list: function () { return Promise.resolve(KORA_PROSPECTS.slice()); },
        get: function (id) { return Promise.resolve(koraFindProspect(id)); },
        create: function (o) {
          var clean = (o.name || "").trim();
          var p = {
            id: koraSlug(clean) + "-" + Date.now().toString(36),
            name: clean, initials: koraInitials(clean), avatar: "neutral", isNew: true,
            phone: (o.phone || "").trim(), email: (o.email || "").trim(),
            statut: "nouveau", lastContact: "à l'instant",
            source: "manuel", createdAt: "aujourd'hui", createdVia: "ajout manuel par " + KORA_AGENT,
            history: [{ kind: "created", to: "nouveau", when: "à l'instant", by: "ajout manuel par " + KORA_AGENT }]
          };
          KORA_PROSPECTS.unshift(p);
          return Promise.resolve(p);
        },
        setStatus: function (id, key) {
          var p = koraFindProspect(id);
          if (p && p.statut !== key) {
            p.history.unshift({ kind: "status", to: key, when: "à l'instant", by: KORA_AGENT });
            p.statut = key; p.lastContact = "à l'instant";
          }
          return Promise.resolve();
        },
        addInteraction: function (id, o) {
          var p = koraFindProspect(id);
          if (p) {
            p.history.unshift({ kind: "interaction", type: o.type, text: o.text, when: "à l'instant", by: KORA_AGENT });
            p.lastContact = "à l'instant";
          }
          return Promise.resolve();
        }
      },

      publicLead: {
        submit: function (o) {
          try {
            console.log("[Kora démo] prospect simulé :", {
              nom: o.name, telephone: o.phone || null, email: o.email || null,
              statut: "nouveau", mode_creation: "formulaire_public", agent: o.agentSlug
            });
          } catch (e) {}
          return Promise.resolve({ error: null });
        }
      },

      publicAgentName: function (slug) {
        var def = (cfg.defaultAgentSlug || "bonjour");
        if (!slug || slug === def) return Promise.resolve(KORA_AGENT);
        return Promise.resolve(koraTitleFromSlug(slug));
      },

      /* -------- Veille sociale (démo, en mémoire) -------- */

      settings: {
        get: function () {
          return Promise.resolve({
            messageModele: demoSettings.messageModele,
            messageDefaut: KORA_MESSAGE_DEFAUT,
            slug: demoSlug,
            lienTunnel: koraTunnelLink(demoSlug)
          });
        },
        setMessageModele: function (texte) {
          demoSettings.messageModele = (texte == null ? "" : String(texte));
          return Promise.resolve({ error: null });
        }
      },

      social: {
        status: function () { return Promise.resolve(JSON.parse(JSON.stringify(demoSocial))); },
        connectUrl: function (reseau) {
          if (reseau === "tiktok") {
            return Promise.resolve({ url: null,
              raison: "TikTok ne fournit aucune API pour lire les likes ou commentaires de tes publications. Détection impossible (voir VEILLE-SOCIALE.md)." });
          }
          return Promise.resolve({ url: null,
            raison: "Mode démo : la connexion OAuth réelle exige l'app en ligne et une app Meta validée. Utilise « Simuler la connexion » pour tester l'écran." });
        },
        simulateConnect: function (reseau) {
          if (reseau === "facebook") {
            demoSocial.facebook = { connected: true, pageName: "Page démo de " + KORA_AGENT,
              connectedAt: new Date().toISOString(), lastScan: new Date().toISOString() };
          } else if (reseau === "tiktok") {
            demoSocial.tiktok = { connected: true, displayName: "@" + String(KORA_AGENT).toLowerCase().replace(/\s+/g, ""),
              connectedAt: new Date().toISOString() };
          }
          return Promise.resolve();
        },
        disconnect: function (reseau) {
          if (reseau === "facebook") demoSocial.facebook = { connected: false, pageName: null, connectedAt: null, lastScan: null };
          if (reseau === "tiktok") demoSocial.tiktok = { connected: false, displayName: null, connectedAt: null };
          return Promise.resolve();
        }
      },

      notifications: {
        list: function () {
          return Promise.resolve(demoNotifs.slice().sort(function (a, b) {
            return Date.parse(b.createdAt) - Date.parse(a.createdAt);
          }));
        },
        unreadCount: function () {
          return Promise.resolve(demoNotifs.filter(function (n) { return !n.lu; }).length);
        },
        addManual: function (o) {
          o = o || {};
          var n = {
            id: "demo-n" + Date.now().toString(36),
            source: "manuel",
            type: o.type === "like" ? "like" : "commentaire",
            prospectNom: trimOrNull(o.prospectNom),
            prospectRef: null,
            prospectProfilUrl: trimOrNull(o.prospectProfilUrl),
            publicationTitre: trimOrNull(o.publicationTitre),
            publicationUrl: trimOrNull(o.publicationUrl),
            commentaireTexte: trimOrNull(o.commentaireTexte),
            externalId: null, messageEnvoye: false, lu: false, prospectId: null,
            createdAt: new Date().toISOString()
          };
          demoNotifs.unshift(n);
          return Promise.resolve(n);
        },
        markRead: function (id) { var n = demoFind(id); if (n) n.lu = true; return Promise.resolve(); },
        markSent: function (id) { var n = demoFind(id); if (n) { n.messageEnvoye = true; n.lu = true; } return Promise.resolve(); },
        linkProspect: function (id, prospectId) {
          var n = demoFind(id); if (n) { n.prospectId = prospectId; n.lu = true; } return Promise.resolve();
        }
      }
    };
  }

  /* ============================================================
     MODE LIVE (Supabase)
     ============================================================ */
  function supabaseStore() {
    var names = {};              // cache agent_id -> nom_complet
    var mePromise = null;        // cache de l'utilisateur courant (évite les getUser répétés)
    var meProfile = null;        // { id, name, slug, messageModele } du profil agent courant

    function nameOf(id) { return names[id] || "un agent"; }

    function currentUser() {
      if (!mePromise) {
        mePromise = sb.auth.getUser().then(function (res) {
          var u = res.data && res.data.user;
          if (!u) return null;                       // pas de session : l'appelant renverra vers auth.html
          return sb.from("agents").select("nom_complet,slug,message_modele").eq("id", u.id).maybeSingle().then(function (r) {
            var d = r.data || {};
            var nm = d.nom_complet || u.email || "Agent";
            names[u.id] = nm;
            meProfile = { id: u.id, name: nm,
              slug: d.slug || (cfg.defaultAgentSlug || "bonjour"),
              messageModele: d.message_modele || KORA_MESSAGE_DEFAUT };
            return meProfile;
          }, function () {
            meProfile = { id: u.id, name: u.email || "Agent",
              slug: cfg.defaultAgentSlug || "bonjour", messageModele: KORA_MESSAGE_DEFAUT };
            return meProfile;   // profil illisible : on garde quand même la session
          });
        }, function () {
          // getUser a rejeté : jeton corrompu, réseau coupé, ou page ouverte en file://.
          // La session est inutilisable : on la purge et on repart sur l'écran de connexion.
          try { sb.auth.signOut(); } catch (e) {}
          return null;
        }).catch(function () {
          // Filet de sécurité : ne JAMAIS laisser cette promesse en rejet,
          // sinon les pages affichent "Vérifiez config.js" alors que la config est bonne.
          mePromise = null;
          return null;
        });
      }
      return mePromise;
    }

    function ensureNames(ids) {
      var missing = uniq(ids).filter(function (i) { return !(i in names); });
      if (!missing.length) return Promise.resolve();
      return sb.from("agents").select("id,nom_complet").in("id", missing).then(function (res) {
        (res.data || []).forEach(function (a) { names[a.id] = a.nom_complet; });
        missing.forEach(function (i) { if (!(i in names)) names[i] = "un agent"; });
      });
    }

    function shape(row, history) {
      return {
        id: row.id,
        name: row.nom,
        initials: koraInitials(row.nom),
        avatar: avatarFor(row.statut),
        phone: row.telephone || "",
        email: row.email || "",
        statut: row.statut,
        lastContact: koraAgo(row.updated_at),
        source: row.mode_creation,
        createdAt: koraDate(row.created_at),
        createdVia: (row.mode_creation === "formulaire_public" ? "formulaire public de " : "ajout manuel par ") + nameOf(row.agent_id),
        isNew: row.statut === "nouveau" && (Date.now() - Date.parse(row.created_at) < 2 * 24 * 3600 * 1000),
        history: history || []
      };
    }

    var api = {
      mode: "live",

      auth: {
        user: function () { return currentUser(); },
        signIn: function (email, password) {
          return sb.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
            if (!res.error) mePromise = null;   // forcer le rechargement du profil
            return { error: res.error ? (res.error.message || "Connexion refusée") : null };
          });
        },
        signOut: function () { mePromise = null; return sb.auth.signOut(); },
        guard: function () {
          return api.auth.user().then(function (u) {
            if (!u) { window.location.replace("auth.html"); return false; }
            return true;
          });
        }
      },

      prospects: {
        list: function () {
          return sb.from("prospects").select("*").order("updated_at", { ascending: false }).then(function (res) {
            if (res.error) return Promise.reject(res.error);
            var rows = res.data || [];
            return ensureNames(rows.map(function (r) { return r.agent_id; })).then(function () {
              return rows.map(function (r) { return shape(r, []); });
            });
          });
        },
        get: function (id) {
          return sb.from("prospects").select("*").eq("id", id).maybeSingle().then(function (pr) {
            if (pr.error) return Promise.reject(pr.error);
            if (!pr.data) return null;      // vraiment introuvable / hors périmètre RLS
            var row = pr.data;
            return Promise.all([
              sb.from("interactions").select("*").eq("prospect_id", id).order("created_at", { ascending: false }),
              sb.from("changements_statut").select("*").eq("prospect_id", id).order("created_at", { ascending: false })
            ]).then(function (r) {
              var ints = (r[0] && r[0].data) || [];
              var chgs = (r[1] && r[1].data) || [];
              var ids = [row.agent_id]
                .concat(ints.map(function (x) { return x.agent_id; }))
                .concat(chgs.map(function (x) { return x.agent_id; }));
              return ensureNames(ids).then(function () {
                var createdVia = (row.mode_creation === "formulaire_public" ? "formulaire public de " : "ajout manuel par ") + nameOf(row.agent_id);
                var ev = [];
                ints.forEach(function (x) {
                  ev.push({ _ts: Date.parse(x.created_at), kind: "interaction", type: x.type || "note", text: x.contenu || "", when: koraAgo(x.created_at), by: nameOf(x.agent_id) });
                });
                chgs.forEach(function (x) {
                  if (x.ancien_statut == null) {
                    ev.push({ _ts: Date.parse(x.created_at), kind: "created", to: x.nouveau_statut, when: koraDate(x.created_at), by: createdVia });
                  } else {
                    ev.push({ _ts: Date.parse(x.created_at), kind: "status", to: x.nouveau_statut, when: koraAgo(x.created_at), by: nameOf(x.agent_id) });
                  }
                });
                ev.sort(function (a, b) { return b._ts - a._ts; });
                return shape(row, ev);
              });
            });
          });
        },
        create: function (o) {
          return api.auth.user().then(function (u) {
            if (!u) return Promise.reject(new Error("non authentifié"));
            return sb.from("prospects").insert({
              agent_id: u.id,
              nom: (o.name || "").trim(),
              telephone: (o.phone || "").trim() || null,
              email: (o.email || "").trim() || null,
              statut: "nouveau",
              mode_creation: "manuel"
            }).select("*").maybeSingle().then(function (res) {
              if (res.error) return Promise.reject(res.error);
              return shape(res.data, []);
            });
          });
        },
        setStatus: function (id, key) {
          return sb.from("prospects").update({ statut: key }).eq("id", id).then(function (res) {
            if (res.error) return Promise.reject(res.error);
          });
        },
        addInteraction: function (id, o) {
          return api.auth.user().then(function (u) {
            return sb.from("interactions").insert({
              prospect_id: id, agent_id: u.id, type: o.type, contenu: o.text
            }).then(function (res) {
              if (res.error) return Promise.reject(res.error);
            });
          });
        }
      },

      publicLead: {
        submit: function (o) {
          return sb.rpc("soumettre_prospect_public", {
            agent_slug: o.agentSlug || cfg.defaultAgentSlug || "bonjour",
            p_nom: o.name,
            p_telephone: o.phone || null,
            p_email: o.email || null
          }).then(function (res) {
            if (res.error) {
              var map = {
                nom_requis: "Nom manquant.",
                contact_requis: "Renseignez un téléphone ou un email.",
                agent_introuvable: "Cette page n'est plus active.",
                trop_de_demandes: "Trop de demandes depuis cette connexion. Réessayez dans une heure."
              };
              var msg = map[res.error.message] || "Envoi impossible pour le moment.";
              return { error: msg };
            }
            return { error: null };
          }, function () {
            return { error: "Envoi impossible pour le moment. Vérifiez votre connexion." };
          });
        }
      },

      publicAgentName: function (slug) {
        return sb.rpc("agent_public_nom", { agent_slug: slug }).then(function (res) {
          if (res.error || !res.data) return koraTitleFromSlug(slug);
          return res.data;
        }, function () { return koraTitleFromSlug(slug); });
      },

      /* ==========================================================
         VEILLE SOCIALE (module Facebook)
         ========================================================== */

      settings: {
        get: function () {
          return api.auth.user().then(function (u) {
            var slug = (u && u.slug) || cfg.defaultAgentSlug || "bonjour";
            return {
              messageModele: (u && u.messageModele) || KORA_MESSAGE_DEFAUT,
              messageDefaut: KORA_MESSAGE_DEFAUT,
              slug: slug,
              lienTunnel: koraTunnelLink(slug)
            };
          });
        },
        setMessageModele: function (texte) {
          return api.auth.user().then(function (u) {
            if (!u) return Promise.reject(new Error("non authentifié"));
            var val = (texte == null ? "" : String(texte));
            return sb.from("agents").update({ message_modele: val }).eq("id", u.id).then(function (res) {
              if (res.error) return Promise.reject(res.error);
              if (meProfile) meProfile.messageModele = val;
              return { error: null };
            });
          });
        }
      },

      social: {
        status: function () {
          return sb.rpc("mon_statut_social").then(function (res) {
            if (res.error) return Promise.reject(res.error);
            var r = (res.data && res.data[0]) || {};
            return {
              facebook: { connected: !!r.fb_connecte, pageName: r.fb_page_nom || null,
                connectedAt: r.fb_connecte_le || null, lastScan: r.fb_dernier_scan || null },
              tiktok: { connected: !!r.tiktok_connecte, displayName: r.tiktok_nom || null,
                connectedAt: r.tiktok_connecte_le || null }
            };
          });
        },
        connectUrl: function (reseau) {
          if (reseau === "tiktok") {
            return Promise.resolve({ url: null,
              raison: "TikTok ne fournit aucune API pour lire les likes ou commentaires de tes publications. Détection impossible (voir VEILLE-SOCIALE.md)." });
          }
          if (!cfg.facebookAppId) {
            return Promise.resolve({ url: null,
              raison: "facebookAppId absent de config.js. L'app Meta doit être créée et validée d'abord (voir VEILLE-SOCIALE.md)." });
          }
          return sb.functions.invoke("fb-oauth-start", { body: { reseau: "facebook" } }).then(function (res) {
            if (res.error) {
              return { url: null, raison: "Fonction fb-oauth-start indisponible. Elle doit être déployée sur Supabase (voir VEILLE-SOCIALE.md)." };
            }
            return { url: (res.data && res.data.url) || null,
              raison: (res.data && res.data.raison) || null };
          }, function () {
            return { url: null, raison: "Fonction fb-oauth-start injoignable (non déployée)." };
          });
        },
        disconnect: function (reseau) {
          return sb.rpc("deconnecter_compte_social", { p_reseau: reseau }).then(function (res) {
            if (res.error) return Promise.reject(res.error);
          });
        }
      },

      notifications: {
        list: function () {
          return sb.from("notifications").select("*").order("created_at", { ascending: false }).then(function (res) {
            if (res.error) return Promise.reject(res.error);
            return (res.data || []).map(shapeNotif);
          });
        },
        unreadCount: function () {
          return sb.from("notifications").select("id", { count: "exact", head: true }).eq("lu", false).then(function (res) {
            if (res.error) return 0;
            return res.count || 0;
          }, function () { return 0; });
        },
        addManual: function (o) {
          o = o || {};
          return api.auth.user().then(function (u) {
            if (!u) return Promise.reject(new Error("non authentifié"));
            return sb.from("notifications").insert({
              agent_id: u.id,
              source: "manuel",
              type: o.type === "like" ? "like" : "commentaire",
              prospect_nom: trimOrNull(o.prospectNom),
              prospect_profil_url: trimOrNull(o.prospectProfilUrl),
              publication_titre: trimOrNull(o.publicationTitre),
              publication_url: trimOrNull(o.publicationUrl),
              commentaire_texte: trimOrNull(o.commentaireTexte)
            }).select("*").maybeSingle().then(function (res) {
              if (res.error) return Promise.reject(res.error);
              return shapeNotif(res.data);
            });
          });
        },
        markRead: function (id) {
          return sb.from("notifications").update({ lu: true }).eq("id", id).then(function (res) {
            if (res.error) return Promise.reject(res.error);
          });
        },
        markSent: function (id) {
          return sb.from("notifications").update({ message_envoye: true, lu: true }).eq("id", id).then(function (res) {
            if (res.error) return Promise.reject(res.error);
          });
        },
        linkProspect: function (id, prospectId) {
          return sb.from("notifications").update({ prospect_id: prospectId, lu: true }).eq("id", id).then(function (res) {
            if (res.error) return Promise.reject(res.error);
          });
        }
      },

      ready: null
    };

    function shapeNotif(row) {
      row = row || {};
      return {
        id: row.id,
        source: row.source,
        type: row.type,
        prospectNom: row.prospect_nom || null,
        prospectRef: row.prospect_ref || null,
        prospectProfilUrl: row.prospect_profil_url || null,
        publicationTitre: row.publication_titre || null,
        publicationUrl: row.publication_url || null,
        commentaireTexte: row.commentaire_texte || null,
        externalId: row.external_id || null,
        messageEnvoye: !!row.message_envoye,
        lu: !!row.lu,
        prospectId: row.prospect_id || null,
        createdAt: row.created_at
      };
    }

    api.ready = api.auth.user().then(function (u) {
      if (u) { KORA_AGENT = u.name; }
    }).catch(function () {});

    return api;
  }

  window.Kora = live ? supabaseStore() : memoryStore();
  window.Kora.isLive = live;
})();
