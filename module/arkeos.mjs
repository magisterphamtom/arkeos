// ================================================================
// ARKÉOS — EW-System | Foundry VTT v13/v14
// Système de jeu original par Extraordinary Worlds Studio
// ================================================================

import {
  PJDataModel, PNJDataModel,
  SpecialiteDataModel, ArmeDataModel, AptitudeDataModel,
  TraitDataModel, EquipementDataModel, PouvoirDataModel
} from "./datamodels.mjs";
import { initialiserWiki, afficherWikiSiPremiereLancement } from "./wiki.mjs";
import { ouvrirCreationPersonnage } from "./creation.mjs";

const { ActorSheetV2 }              = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

// ================================================================
// CONSTANTES
// ================================================================
const CHAMP_LABELS = {
  connaissance: "Connaissance",
  combat:       "Combat",
  savoir:       "Savoir",
  social:       "Social",
};

// Table de Résolution : TR = min(19, max(1, score + 10 - ND))
function calculerTR(score, nd) {
  return Math.min(19, Math.max(1, score + 10 - nd));
}

// ================================================================
// HELPERS HANDLEBARS
// ================================================================
Handlebars.registerHelper("times", function (n, options) {
  let out = "";
  const data = Handlebars.createFrame(options.data || {});
  for (let i = 0; i < n; i++) {
    data["index"] = i;
    out += options.fn(this, { data });
  }
  return out;
});

// Opérateurs de comparaison (Foundry v13 les enregistre, mais au cas où)
if (!Handlebars.helpers.eq)  Handlebars.registerHelper("eq",  (a, b) => a === b);
if (!Handlebars.helpers.lt)  Handlebars.registerHelper("lt",  (a, b) => a < b);
if (!Handlebars.helpers.gt)  Handlebars.registerHelper("gt",  (a, b) => a > b);
if (!Handlebars.helpers.lte) Handlebars.registerHelper("lte", (a, b) => a <= b);
if (!Handlebars.helpers.gte) Handlebars.registerHelper("gte", (a, b) => a >= b);

// ================================================================
// INIT
// ================================================================
Hooks.once("init", function () {
  console.log("Arkéos | Initialisation EW-System…");

  CONFIG.Actor.dataModels.pj  = PJDataModel;
  CONFIG.Actor.dataModels.pnj = PNJDataModel;
  CONFIG.Item.dataModels.specialite = SpecialiteDataModel;
  CONFIG.Item.dataModels.arme       = ArmeDataModel;
  CONFIG.Item.dataModels.aptitude   = AptitudeDataModel;
  CONFIG.Item.dataModels.trait      = TraitDataModel;
  CONFIG.Item.dataModels.equipement = EquipementDataModel;
  CONFIG.Item.dataModels.pouvoir    = PouvoirDataModel;

  CONFIG.Actor.documentClass = ArkeosActeur;

  game.arkeos = { ArkeosActeur, ArkeosFeuillePJ, ArkeosFeuillePNJ, calculerTR };

  const ActorsCollection = foundry.documents.collections.Actors;
  const ActorSheetV1     = foundry.appv1.sheets.ActorSheet;
  ActorsCollection.unregisterSheet("core", ActorSheetV1);
  ActorsCollection.registerSheet("arkeos", ArkeosFeuillePJ, {
    types: ["pj"], makeDefault: true, label: "Feuille de Personnage"
  });
  ActorsCollection.registerSheet("arkeos", ArkeosFeuillePNJ, {
    types: ["pnj"], makeDefault: true, label: "Fiche PNJ"
  });

  const ItemsCollection = foundry.documents.collections.Items;
  const ItemSheetV1     = foundry.appv1.sheets.ItemSheet;
  ItemsCollection.unregisterSheet("core", ItemSheetV1);
  ItemsCollection.registerSheet("arkeos", ArkeosFeuilleItem, {
    types: ["specialite","arme","aptitude","trait","equipement","pouvoir"],
    makeDefault: true, label: "Feuille Objet"
  });

  chargerTemplates();
  console.log("Arkéos | EW-System initialisé !");
});

Hooks.once("ready", async function () {
  await initialiserWiki();
  await afficherWikiSiPremiereLancement();
});

// ================================================================
// BOUTONS BARRE LATÉRALE DROITE — en bas, robuste v13
// ================================================================
Hooks.on("renderActorDirectory", (app, html) => {
  // Évite les doublons si le hook se déclenche plusieurs fois
  if (html.querySelector("#arkeos-sidebar-btns")) return;

  // Crée un conteneur dédié tout en bas
  const container = document.createElement("div");
  container.id = "arkeos-sidebar-btns";
  container.style.cssText = [
    "padding: 6px 8px 10px",
    "border-top: 1px solid rgba(200,134,10,0.35)",
    "background: linear-gradient(180deg, #0e0a06, #1a1008)",
    "display: flex",
    "flex-direction: column",
    "gap: 5px",
  ].join(";");

  const btnWiki = document.createElement("button");
  btnWiki.innerHTML = "📖 Wiki Arkéos — EW-System";
  btnWiki.style.cssText = [
    "width:100%", "padding:7px 10px",
    "background:#2a0a00", "color:#e8c060",
    "border:1px solid #c8860a", "border-radius:4px",
    "cursor:pointer", "font-size:1em", "font-weight:bold",
    "letter-spacing:0.5px",
  ].join(";");
  btnWiki.addEventListener("click", () => {
    const j = game.journal.find(j => j.name === "📖 Wiki — Arkéos EW-System");
    if (j) j.sheet.render(true);
    else ui.notifications.warn("Wiki introuvable — rechargez la page (F5).");
  });

  const btnCreation = document.createElement("button");
  btnCreation.innerHTML = "🎲 Créer un Personnage";
  btnCreation.style.cssText = [
    "width:100%", "padding:7px 10px",
    "background:#0a1a2a", "color:#80c0e8",
    "border:1px solid #3060a0", "border-radius:4px",
    "cursor:pointer", "font-size:1em", "font-weight:bold",
    "letter-spacing:0.5px",
  ].join(";");
  btnCreation.addEventListener("click", () => ouvrirCreationPersonnage());

  container.appendChild(btnWiki);
  container.appendChild(btnCreation);

  // Cherche le bon point d'insertion dans la barre latérale v13
  // Priorité : footer existant → sidebar section → la html directement
  const sidebar  = html.closest("#sidebar")
                ?? html.closest(".app")
                ?? html.parentElement;

  const footer   = html.querySelector(".directory-footer")
                ?? html.querySelector("footer")
                ?? html.querySelector(".directory-list")?.parentElement;

  if (footer) {
    footer.after(container);
  } else if (sidebar) {
    sidebar.appendChild(container);
  } else {
    html.appendChild(container);
  }
});

// ================================================================
// CLASSE ACTEUR
// ================================================================
class ArkeosActeur extends Actor {
  prepareData() { super.prepareData(); }
}

// ================================================================
// FEUILLE PJ
// ================================================================
class ArkeosFeuillePJ extends HandlebarsApplicationMixin(ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["arkeos", "sheet", "actor", "pj"],
    position: { width: 750, height: 900 },
    window: { resizable: true },
  };

  static PARTS = {
    header:     { template: "systems/arkeos/templates/actor/pj-header.html" },
    principal:  { template: "systems/arkeos/templates/actor/pj-tab-principal.html" },
    combat:     { template: "systems/arkeos/templates/actor/pj-tab-combat.html" },
    avance:     { template: "systems/arkeos/templates/actor/pj-tab-avance.html" },
    notes:      { template: "systems/arkeos/templates/actor/pj-tab-notes.html" },
  };

  _tabActif = "principal";

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    return this._enrichCtx(ctx);
  }

  async _preparePartContext(partId, context) {
    const ctx = await super._preparePartContext(partId, context);
    return this._enrichCtx(ctx);
  }

  _enrichCtx(ctx) {
    ctx.actor    = this.actor;
    ctx.system   = this.actor.system;
    ctx.tabActif = this._tabActif;
    ctx.CHAMP_LABELS = CHAMP_LABELS;

    // Grouper les items par type
    ctx.specialites = {
      connaissance: this.actor.items.filter(i => i.type === "specialite" && i.system.champ === "connaissance"),
      combat:       this.actor.items.filter(i => i.type === "specialite" && i.system.champ === "combat"),
      savoir:       this.actor.items.filter(i => i.type === "specialite" && i.system.champ === "savoir"),
      social:       this.actor.items.filter(i => i.type === "specialite" && i.system.champ === "social"),
    };
    ctx.armes        = this.actor.items.filter(i => i.type === "arme");
    ctx.aptitudes    = this.actor.items.filter(i => i.type === "aptitude");
    ctx.traits       = this.actor.items.filter(i => i.type === "trait");
    ctx.equipements  = this.actor.items.filter(i => i.type === "equipement");
    ctx.pouvoirs     = this.actor.items.filter(i => i.type === "pouvoir");

    // Tableaux pre-construits pour les barres (evite {{#times}} non natif Foundry)
    const degL  = this.actor.system.degLetauxActuels ?? 0;
    const degS  = this.actor.system.degSuperfActuels ?? 0;
    const evAct = this.actor.system.evActuelle ?? 0;
    ctx.barreLetaux = Array.from({ length: 31 }, (_, i) => ({ val: i, actif: i <= degL && i > 0 }));
    ctx.barreSuperf = Array.from({ length: 31 }, (_, i) => ({ val: i, actif: i <= degS && i > 0 }));
    ctx.barreEV     = Array.from({ length: 66 }, (_, i) => ({ val: i, actif: i <= evAct && i > 0 }));

    return ctx;
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const html = this.element;

    // Sauvegarde automatique
    html.querySelectorAll("input:not([data-action]), textarea:not([data-action]), select").forEach(el => {
      el.addEventListener("change", ev => {
        const name = ev.currentTarget.name;
        if (!name) return;
        const value = ev.currentTarget.type === "number"   ? Number(ev.currentTarget.value)
          : ev.currentTarget.type === "checkbox" ? ev.currentTarget.checked
          : ev.currentTarget.value;
        this.actor.update({ [name]: value });
      });
    });

    // Portrait
    html.querySelectorAll("img[data-edit]").forEach(img => {
      img.addEventListener("click", ev => {
        ev.preventDefault();
        const attr = ev.currentTarget.dataset.edit;
        new (foundry.applications.apps.FilePicker.implementation)({
          type: "image",
          current: foundry.utils.getProperty(this.actor, attr),
          callback: path => this.actor.update({ [attr]: path }),
        }).browse();
      });
    });

    // Onglets
    this._gererOnglets(html);

    // === CONFRONTATION ===
    html.querySelectorAll(".btn-confrontation").forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault(); ev.stopPropagation();
        const champ    = ev.currentTarget.dataset.champ;
        const speId    = ev.currentTarget.dataset.speId ?? null;
        this._ouvrirConfrontation(champ, speId);
      });
    });

    // === INITIATIVE ===
    html.querySelectorAll(".btn-initiative").forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        this._lancerInitiative();
      });
    });

    // === ATTAQUE avec arme ===
    html.querySelectorAll(".btn-attaque").forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        const itemId = ev.currentTarget.dataset.itemId;
        this._attaquer(itemId);
      });
    });

    // === POINTS D'ÉCLAT ===
    html.querySelectorAll(".btn-eclat-depenser").forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        const type = ev.currentTarget.dataset.type; // action|chance|mort
        this._depenseEclat(type);
      });
    });

    // === SOINS ===
    html.querySelectorAll(".btn-soins").forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        const type = ev.currentTarget.dataset.type; // letaux|superf|full
        this._appliquerSoins(type);
      });
    });

    // === Barres de dégâts cliquables ===
    this._gererBarresDegats(html);

    // === Items ===
    html.querySelectorAll(".btn-ouvrir-item").forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        this.actor.items.get(ev.currentTarget.dataset.itemId)?.sheet.render(true);
      });
    });
    html.querySelectorAll(".btn-supprimer-item").forEach(btn => {
      btn.addEventListener("click", async ev => {
        ev.preventDefault();
        const item = this.actor.items.get(ev.currentTarget.dataset.itemId);
        if (!item) return;
        const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "Supprimer" }, content: `<p>Supprimer <b>${item.name}</b> ?</p>` });
        if (ok) await item.delete();
      });
    });
  }

  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    const html = this.element;
    // Drag & drop
    ["specialite","arme","aptitude","trait","equipement","pouvoir"].forEach(type => {
      const zone = html.querySelector(`.drop-zone[data-type="${type}"]`);
      if (!zone) return;
    });

    html.addEventListener("dragover", ev => {
      const zone = ev.target.closest(".drop-zone[data-type]");
      if (zone) { ev.preventDefault(); zone.classList.add("drag-over"); }
    });
    html.addEventListener("dragleave", ev => {
      const zone = ev.target.closest(".drop-zone[data-type]");
      if (zone && !zone.contains(ev.relatedTarget)) zone.classList.remove("drag-over");
    });
    html.addEventListener("drop", async ev => {
      const zone = ev.target.closest(".drop-zone[data-type]");
      if (!zone) return;
      ev.preventDefault(); ev.stopImmediatePropagation();
      zone.classList.remove("drag-over");
      let data;
      try { data = JSON.parse(ev.dataTransfer.getData("text/plain")); } catch { return; }
      if (data.type !== "Item") return;
      const item = data.uuid ? await fromUuid(data.uuid) : game.items.get(data.id);
      if (!item) return;
      const type = zone.dataset.type;
      if (item.type !== type && type !== "any") {
        ui.notifications.warn(`Type incorrect : attendu "${type}", reçu "${item.type}".`);
        return;
      }
      await this.actor.createEmbeddedDocuments("Item", [item.toObject()]);
      ui.notifications.info(`✅ ${item.name} ajouté !`);
    });
  }

  // ---------------------------------------------------------------
  _gererOnglets(html) {
    html.querySelectorAll(".tab[data-tab]").forEach(tab => {
      tab.style.display = tab.dataset.tab === this._tabActif ? "block" : "none";
      tab.classList.toggle("active", tab.dataset.tab === this._tabActif);
    });
    html.querySelectorAll(".sheet-tabs .item").forEach(item => {
      item.classList.toggle("active", item.dataset.tab === this._tabActif);
      item.addEventListener("click", ev => {
        ev.preventDefault();
        const tabId = ev.currentTarget.dataset.tab;
        this._tabActif = tabId;
        html.querySelectorAll(".sheet-tabs .item").forEach(i => i.classList.toggle("active", i.dataset.tab === tabId));
        html.querySelectorAll(".tab[data-tab]").forEach(t => {
          t.style.display = t.dataset.tab === tabId ? "block" : "none";
          t.classList.toggle("active", t.dataset.tab === tabId);
        });
      });
    });
  }

  // ---------------------------------------------------------------
  _gererBarresDegats(html) {
    // Les classes actives sont rendu via le contexte (barreLetaux/barreSuperf/barreEV)
    // On attache uniquement les listeners de clic

    html.querySelectorAll(".barre-letaux .case-degat").forEach(c => {
      c.addEventListener("click", ev => {
        ev.preventDefault(); ev.stopPropagation();
        const val = Number(ev.currentTarget.dataset.val);
        const cur = this.actor.system.degLetauxActuels ?? 0;
        this.actor.update({ "system.degLetauxActuels": val === cur ? val - 1 : val });
      });
    });

    html.querySelectorAll(".barre-superf .case-degat").forEach(c => {
      c.addEventListener("click", ev => {
        ev.preventDefault(); ev.stopPropagation();
        const val = Number(ev.currentTarget.dataset.val);
        const cur = this.actor.system.degSuperfActuels ?? 0;
        this.actor.update({ "system.degSuperfActuels": val === cur ? val - 1 : val });
      });
    });

    html.querySelectorAll(".barre-ev .case-ev").forEach(c => {
      c.addEventListener("click", ev => {
        ev.preventDefault(); ev.stopPropagation();
        const val = Number(ev.currentTarget.dataset.val);
        const cur = this.actor.system.evActuelle ?? 0;
        this.actor.update({ "system.evActuelle": val === cur ? val - 1 : val });
      });
    });
  }

  // ---------------------------------------------------------------
  // CONFRONTATION
  // ---------------------------------------------------------------
  async _ouvrirConfrontation(champId, speItemId) {
    const sys   = this.actor.system;
    const score = sys.champs?.[champId] ?? 0;
    let bonus = 0, nomSpe = "", nomAction = CHAMP_LABELS[champId] ?? champId;

    if (speItemId) {
      const spe = this.actor.items.get(speItemId);
      if (spe) {
        bonus    = spe.system.bonus ?? 0;
        nomSpe   = spe.name;
        nomAction = `${CHAMP_LABELS[champId]} — ${nomSpe}`;
      }
    }

    const scoreTotal = score + bonus + (sys.malusBlessure ?? 0);

    const choix = await ouvrirDialogueConfrontation(nomAction, score, bonus, sys.malusBlessure ?? 0);
    if (!choix.lancer) return;

    const nd         = choix.nd;
    const bonusSit   = choix.bonusSituation ?? 0;
    const malus      = choix.malus ?? 0;
    const scoreFinal = scoreTotal + bonusSit - malus;
    const tr         = calculerTR(scoreFinal, nd);

    const roll = new Roll("1d20");
    await roll.evaluate();
    const resultat = roll.total;

    const succes        = resultat <= tr;
    const critSucces    = resultat === 1;
    const critEchec     = resultat === 20;

    const couleur = critEchec ? "#8b0000" : critSucces ? "#1a5a1a" : succes ? "#2d6a2d" : "#8b0000";
    const texteRes = critSucces
      ? "🌟 <b>Réussite Critique !</b> (1 naturel)"
      : critEchec
      ? "💀 <b>Échec Critique !</b> (20 naturel)"
      : succes
      ? "✅ <b>Réussite</b>"
      : "❌ <b>Échec</b>";

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rolls:   [roll],
      content: `
        <div class="arkeos-chat">
          <div class="chat-titre">🎲 ${nomAction}</div>
          <div class="chat-corps">
            Score : <b>${score}</b>${bonus > 0 ? ` + ${nomSpe} <b>+${bonus}</b>` : ""}
            ${sys.malusBlessure < 0 ? ` + Blessure <b>${sys.malusBlessure}</b>` : ""}
            ${bonusSit > 0 ? ` + Circonstances <b>+${bonusSit}</b>` : ""}
            ${malus > 0    ? ` − Malus <b>-${malus}</b>` : ""}
            = <b>${scoreFinal}</b><br>
            ND : <b>${nd}</b> → TR : <b>${tr}</b>/20<br>
            Dé : <b>${resultat}</b>
          </div>
          <div class="chat-resultat" style="color:${couleur};">${texteRes}</div>
        </div>
      `,
    });
  }

  // ---------------------------------------------------------------
  // INITIATIVE
  // ---------------------------------------------------------------
  async _lancerInitiative() {
    const sys  = this.actor.system;
    const init = sys.initiative ?? sys.champs?.combat ?? 5;
    const roll = new Roll("1d10");
    await roll.evaluate();
    const total = init + roll.total;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rolls: [roll],
      content: `
        <div class="arkeos-chat">
          <div class="chat-titre">⚡ Initiative</div>
          <div class="chat-corps">Initiative (<b>${init}</b>) + D10 (<b>${roll.total}</b>) = <b>${total}</b></div>
          <div class="chat-resultat" style="color:#3060a0;">Initiative de combat : <b>${total}</b></div>
        </div>
      `,
    });
  }

  // ---------------------------------------------------------------
  // ATTAQUE avec une arme
  // ---------------------------------------------------------------
  async _attaquer(itemId) {
    const arme = this.actor.items.get(itemId);
    if (!arme) return;

    const sys    = this.actor.system;
    const a      = arme.system;
    const isContact = ["melee","speciale","jet"].includes(a.categorie);

    // Score d'attaque = Combat + Spécialité de l'arme (si elle existe)
    const scoreBase = sys.champs?.combat ?? 5;
    const malusBlessure = sys.malusBlessure ?? 0;

    // Chercher si le PJ a une spécialité correspondante
    let speBonus = 0, speNom = "";
    const speArme = this.actor.items.find(i =>
      i.type === "specialite" &&
      i.system.champ === "combat" &&
      (i.name.toLowerCase().includes(arme.name.toLowerCase().split(" ")[0]) ||
       i.name.toLowerCase().includes(a.categorie.toLowerCase()))
    );
    if (speArme) { speBonus = speArme.system.bonus ?? 0; speNom = speArme.name; }

    const choix = await ouvrirDialogueAttaque(arme.name, scoreBase, speBonus, malusBlessure);
    if (!choix.lancer) return;

    const scoreFinal = scoreBase + speBonus + malusBlessure + (choix.bonusSit ?? 0) - (choix.malus ?? 0);
    const nd         = choix.nd;
    const tr         = calculerTR(scoreFinal, nd);

    const roll = new Roll("1d20");
    await roll.evaluate();
    const touche = roll.total <= tr;
    const critSucces = roll.total === 1;
    const critEchec  = roll.total === 20;

    let contenuDegats = "";
    if (touche && !critEchec) {
      // Calcul des dégâts
      const impact   = sys.impact ?? 1;
      const factDeg  = a.degats ?? 0;
      const rollD10  = new Roll("1d10");
      await rollD10.evaluate();
      const d10Val   = rollD10.total;

      const letaux   = isContact ? factDeg + (critSucces ? factDeg : 0) : factDeg;  // critique = max dégâts
      const protection = sys.protectionTotale ?? 0;
      const defense    = sys.defense ?? 1;
      const superficiels = Math.max(0, d10Val - defense - protection);

      // Si critique, option dégâts max ou ignorer protection
      const critInfo = critSucces ? "<br>💥 Réussite critique : dégâts max OU ignore armure (au choix)" : "";

      contenuDegats = `
        <div class="chat-degats">
          🩸 Dégâts létaux : <b>${letaux}</b> (facteur ${factDeg}${isContact ? ` + Impact ${impact}` : ""})${critInfo}<br>
          💥 D10 superficiels : <b>${d10Val}</b> − Défense (${defense}) − Protections (${protection}) = <b>${superficiels}</b>
        </div>
      `;
    }

    const couleur = critEchec ? "#8b0000" : touche ? "#2d6a2d" : "#8b0000";
    const texte   = critEchec ? "💀 Échec Critique !" : critSucces ? "🌟 Réussite Critique !" : touche ? "✅ Touché !" : "❌ Manqué";

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rolls: [roll],
      content: `
        <div class="arkeos-chat">
          <div class="chat-titre">⚔️ Attaque — ${arme.name}</div>
          <div class="chat-corps">
            Combat : <b>${scoreBase}</b>${speNom ? ` + ${speNom} <b>+${speBonus}</b>` : ""}
            ${malusBlessure < 0 ? ` + Blessure <b>${malusBlessure}</b>` : ""}
            = <b>${scoreFinal}</b> | ND <b>${nd}</b> → TR <b>${tr}</b>/20<br>
            Dé : <b>${roll.total}</b>
          </div>
          <div class="chat-resultat" style="color:${couleur};">${texte}</div>
          ${contenuDegats}
        </div>
      `,
    });
  }

  // ---------------------------------------------------------------
  // POINTS D'ÉCLAT
  // ---------------------------------------------------------------
  async _depenseEclat(type) {
    const sys = this.actor.system;
    const pts = sys.pointsEclatActuels ?? 0;
    const cout = type === "mort" ? 3 : 1;

    if (pts < cout) {
      ui.notifications.warn(`Pas assez de Points d'Éclat (${pts} disponible, ${cout} requis).`);
      return;
    }

    const labels = {
      action: "Réussir automatiquement une confrontation",
      chance: "Coup de pouce du destin (indice, coïncidence…)",
      mort:   "Échapper à la mort in extremis (3 Points)",
    };

    await this.actor.update({ "system.pointsEclatActuels": pts - cout });

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `
        <div class="arkeos-chat">
          <div class="chat-titre">✨ Point d'Éclat dépensé (−${cout})</div>
          <div class="chat-corps">${labels[type]}</div>
          <div class="chat-resultat" style="color:#c8860a;">Points restants : <b>${pts - cout}</b></div>
        </div>
      `,
    });
  }

  // ---------------------------------------------------------------
  // SOINS
  // ---------------------------------------------------------------
  async _appliquerSoins(type) {
    const sys = this.actor.system;
    const updates = {};

    if (type === "letaux" || type === "full") {
      updates["system.degLetauxActuels"] = 0;
    }
    if (type === "superf" || type === "full") {
      updates["system.degSuperfActuels"] = 0;
      updates["system.pvActuels"] = sys.pvMax ?? 15;
    }
    if (type === "full") {
      updates["system.evActuelle"] = sys.evMax ?? 10;
      updates["system.pointsEclatActuels"] = sys.pointsEclatMax ?? 3;
    }

    await this.actor.update(updates);
    ui.notifications.info(`🏥 Soins appliqués (${type}).`);
  }
}

// ================================================================
// FEUILLE PNJ
// ================================================================
class ArkeosFeuillePNJ extends HandlebarsApplicationMixin(ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["arkeos", "sheet", "actor", "pnj"],
    position: { width: 520, height: 620 },
    window: { resizable: true },
  };

  static PARTS = {
    pnj: { template: "systems/arkeos/templates/actor/pnj.html" },
  };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    ctx.actor  = this.actor;
    ctx.system = this.actor.system;
    ctx.armes  = this.actor.items.filter(i => i.type === "arme");
    ctx.specialites = this.actor.items.filter(i => i.type === "specialite");
    return ctx;
  }

  async _preparePartContext(partId, context) {
    const ctx = await super._preparePartContext(partId, context);
    ctx.actor  = this.actor;
    ctx.system = this.actor.system;
    ctx.armes  = this.actor.items.filter(i => i.type === "arme");
    ctx.specialites = this.actor.items.filter(i => i.type === "specialite");
    return ctx;
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const html = this.element;

    html.querySelectorAll("input, textarea, select").forEach(el => {
      el.addEventListener("change", ev => {
        const name = ev.currentTarget.name;
        if (!name) return;
        const value = ev.currentTarget.type === "number" ? Number(ev.currentTarget.value) : ev.currentTarget.value;
        this.actor.update({ [name]: value });
      });
    });

    html.querySelectorAll("img[data-edit]").forEach(img => {
      img.addEventListener("click", ev => {
        ev.preventDefault();
        const attr = ev.currentTarget.dataset.edit;
        new (foundry.applications.apps.FilePicker.implementation)({ type: "image", current: foundry.utils.getProperty(this.actor, attr), callback: p => this.actor.update({ [attr]: p }) }).browse();
      });
    });

    html.querySelectorAll(".btn-confrontation").forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        this._jetPNJ(ev.currentTarget.dataset.champ);
      });
    });

    html.querySelectorAll(".btn-attaque").forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        const itemId = ev.currentTarget.dataset.itemId;
        this._attaquePNJ(itemId);
      });
    });
  }

  async _jetPNJ(champId) {
    const sys    = this.actor.system;
    const score  = sys.champs?.[champId] ?? 5;
    const roll   = new Roll("1d20");
    await roll.evaluate();
    const nd = 10;
    const tr = calculerTR(score, nd);
    const succes = roll.total <= tr;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rolls: [roll],
      content: `
        <div class="arkeos-chat pnj">
          <div class="chat-titre">🎲 ${CHAMP_LABELS[champId]} (PNJ)</div>
          <div class="chat-corps">Score : <b>${score}</b> | ND : <b>${nd}</b> → TR : <b>${tr}</b>/20 | Dé : <b>${roll.total}</b></div>
          <div class="chat-resultat" style="color:${succes ? "#2d6a2d" : "#8b0000"};">${succes ? "✅ Réussite" : "❌ Échec"}</div>
        </div>
      `,
    });
  }

  async _attaquePNJ(itemId) {
    const arme = this.actor.items.get(itemId);
    if (!arme) return;
    const sys = this.actor.system;
    const score = sys.champs?.combat ?? 5;
    const roll = new Roll("1d20");
    await roll.evaluate();
    const tr = calculerTR(score, 10);
    const touche = roll.total <= tr;

    let degStr = "";
    if (touche) {
      const rollD10 = new Roll("1d10");
      await rollD10.evaluate();
      const letaux      = arme.system.degats ?? 0;
      const superficiels = Math.max(0, rollD10.total - (sys.defense ?? 1));
      degStr = `<div class="chat-degats">Létaux : <b>${letaux}</b> | Superficiels : <b>${superficiels}</b></div>`;
    }

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rolls: [roll],
      content: `
        <div class="arkeos-chat pnj">
          <div class="chat-titre">⚔️ ${arme.name} (PNJ)</div>
          <div class="chat-corps">Combat <b>${score}</b> | TR <b>${tr}</b>/20 | Dé <b>${roll.total}</b></div>
          <div class="chat-resultat" style="color:${touche ? "#2d6a2d" : "#8b0000"};">${touche ? "✅ Touché" : "❌ Raté"}</div>
          ${degStr}
        </div>
      `,
    });
  }
}

// ================================================================
// FEUILLE ITEM
// ================================================================
class ArkeosFeuilleItem extends HandlebarsApplicationMixin(
  foundry.appv1?.sheets?.ItemSheet
    ? foundry.appv1.sheets.ItemSheet
    : (foundry.applications.sheets?.ItemSheetV2 ?? ActorSheetV2)
) {
  static DEFAULT_OPTIONS = {
    classes: ["arkeos", "sheet", "item"],
    position: { width: 480, height: 440 },
    window: { resizable: true },
  };
  static PARTS = {
    item: { template: "systems/arkeos/templates/item/feuille-item.html" },
  };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    ctx.item   = this.item ?? this.document;
    ctx.system = ctx.item?.system;
    ctx.CHAMP_LABELS = CHAMP_LABELS;
    return ctx;
  }

  async _preparePartContext(partId, context) {
    const ctx = await super._preparePartContext(partId, context);
    ctx.item   = this.item ?? this.document;
    ctx.system = ctx.item?.system;
    ctx.CHAMP_LABELS = CHAMP_LABELS;
    return ctx;
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const html = this.element;
    html.querySelectorAll("input, textarea, select").forEach(el => {
      el.addEventListener("change", ev => {
        const name = ev.currentTarget.name;
        const value = ev.currentTarget.type === "number" ? Number(ev.currentTarget.value)
          : ev.currentTarget.type === "checkbox" ? ev.currentTarget.checked
          : ev.currentTarget.value;
        const item = this.item ?? this.document;
        if (name && item) item.update({ [name]: value });
      });
    });
  }
}

// ================================================================
// DIALOGUES
// ================================================================
async function ouvrirDialogueConfrontation(nomAction, scoreBase, bonusSpe, malusBlessure) {
  const scoreTot = scoreBase + bonusSpe + malusBlessure;
  const DialogV2 = foundry.applications.api.DialogV2;

  const contenu = `
    <div class="arkeos-dialogue">
      <div class="dial-titre">🎲 ${nomAction}</div>
      <div class="dial-info">
        Score : <b>${scoreBase}</b>${bonusSpe > 0 ? ` + Spé <b>+${bonusSpe}</b>` : ""}
        ${malusBlessure < 0 ? ` + Blessure <b>${malusBlessure}</b>` : ""}
        = <b>${scoreTot}</b>
      </div>
      <div class="dial-ligne">
        <label>ND (Niveau de Difficulté)</label>
        <input type="number" id="nd" value="10" min="1" max="30" style="width:70px;" />
      </div>
      <div class="dial-ligne">
        <label>Bonus de circonstances</label>
        <input type="number" id="bonus-sit" value="0" min="-10" max="10" style="width:70px;" />
      </div>
      <div class="dial-ligne">
        <label>Malus supplémentaire</label>
        <input type="number" id="malus" value="0" min="0" max="10" style="width:70px;" />
      </div>
      <div class="dial-tr" id="dial-tr">
        TR : <b id="tr-val">${calculerTR(scoreTot, 10)}</b>/20 (besoin ≤ ce chiffre)
      </div>
    </div>
  `;

  const result = await DialogV2.wait({
    window: { title: `Confrontation — ${nomAction}` },
    content: contenu,
    render: (event, dialog) => {
      const el = dialog.element;
      const maj = () => {
        const nd    = Number(el.querySelector("#nd")?.value) || 10;
        const bonus = Number(el.querySelector("#bonus-sit")?.value) || 0;
        const malus = Number(el.querySelector("#malus")?.value) || 0;
        const tr = calculerTR(scoreTot + bonus - malus, nd);
        const trEl = el.querySelector("#tr-val");
        if (trEl) trEl.textContent = tr;
      };
      el.querySelector("#nd")?.addEventListener("input", maj);
      el.querySelector("#bonus-sit")?.addEventListener("input", maj);
      el.querySelector("#malus")?.addEventListener("input", maj);
      maj();
    },
    buttons: [
      {
        action: "lancer",
        label: "🎲 Lancer le D20",
        default: true,
        callback: (event, button, dialog) => {
          const el = dialog.element;
          return {
            lancer: true,
            nd:            Number(el.querySelector("#nd")?.value) || 10,
            bonusSituation: Number(el.querySelector("#bonus-sit")?.value) || 0,
            malus:          Number(el.querySelector("#malus")?.value) || 0,
          };
        },
      },
      { action: "annuler", label: "Annuler", callback: () => ({ lancer: false }) },
    ],
  }).catch(() => ({ lancer: false }));

  return result ?? { lancer: false };
}

async function ouvrirDialogueAttaque(nomArme, scoreBase, speBonus, malusBlessure) {
  const scoreTot = scoreBase + speBonus + malusBlessure;
  const DialogV2 = foundry.applications.api.DialogV2;

  const contenu = `
    <div class="arkeos-dialogue">
      <div class="dial-titre">⚔️ Attaque — ${nomArme}</div>
      <div class="dial-info">Combat : <b>${scoreBase}</b>${speBonus > 0 ? ` + Spé <b>+${speBonus}</b>` : ""}${malusBlessure < 0 ? ` + Blessure <b>${malusBlessure}</b>` : ""} = <b>${scoreTot}</b></div>
      <div class="dial-ligne"><label>Défense adverse (ND)</label>
        <input type="number" id="nd" value="10" min="1" max="30" style="width:70px;" /></div>
      <div class="dial-ligne"><label>Bonus de situation</label>
        <input type="number" id="bonus-sit" value="0" min="-10" max="10" style="width:70px;" /></div>
      <div class="dial-ligne"><label>Malus</label>
        <input type="number" id="malus" value="0" min="0" max="10" style="width:70px;" /></div>
      <div class="dial-tr">TR : <b id="tr-val">${calculerTR(scoreTot, 10)}</b>/20</div>
    </div>
  `;

  const result = await DialogV2.wait({
    window: { title: `Attaque — ${nomArme}` },
    content: contenu,
    render: (event, dialog) => {
      const el = dialog.element;
      const maj = () => {
        const nd = Number(el.querySelector("#nd")?.value) || 10;
        const b  = Number(el.querySelector("#bonus-sit")?.value) || 0;
        const m  = Number(el.querySelector("#malus")?.value) || 0;
        const trEl = el.querySelector("#tr-val");
        if (trEl) trEl.textContent = calculerTR(scoreTot + b - m, nd);
      };
      el.querySelector("#nd")?.addEventListener("input", maj);
      el.querySelector("#bonus-sit")?.addEventListener("input", maj);
      el.querySelector("#malus")?.addEventListener("input", maj);
      maj();
    },
    buttons: [
      {
        action: "lancer",
        label: "⚔️ Attaquer",
        default: true,
        callback: (event, button, dialog) => {
          const el = dialog.element;
          return {
            lancer: true,
            nd:       Number(el.querySelector("#nd")?.value) || 10,
            bonusSit: Number(el.querySelector("#bonus-sit")?.value) || 0,
            malus:    Number(el.querySelector("#malus")?.value) || 0,
          };
        },
      },
      { action: "annuler", label: "Annuler", callback: () => ({ lancer: false }) },
    ],
  }).catch(() => ({ lancer: false }));

  return result ?? { lancer: false };
}

// ================================================================
// TEMPLATES
// ================================================================
async function chargerTemplates() {
  return foundry.applications.handlebars.loadTemplates([
    "systems/arkeos/templates/actor/pj-header.html",
    "systems/arkeos/templates/actor/pj-tab-principal.html",
    "systems/arkeos/templates/actor/pj-tab-combat.html",
    "systems/arkeos/templates/actor/pj-tab-avance.html",
    "systems/arkeos/templates/actor/pj-tab-notes.html",
    "systems/arkeos/templates/actor/pnj.html",
    "systems/arkeos/templates/item/feuille-item.html",
  ]);
}
