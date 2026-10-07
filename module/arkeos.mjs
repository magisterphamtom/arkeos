// ================================================================
// ARKÉOS — EW-System | Foundry VTT v13/v14
// Système de jeu original par Extraordinary Worlds Studio
// ================================================================

import {
  PJDataModel, PNJDataModel,
  SpecialiteDataModel, ArmeDataModel, AptitudeDataModel,
  TraitDataModel, EquipementDataModel, PouvoirDataModel,
  ArchetypeDataModel
} from "./datamodels.mjs";
import { ArkeosWiki } from "./wiki.mjs";
import { ouvrirCreationPersonnage } from "./creation.mjs";

const { ActorSheetV2, ItemSheetV2 }  = foundry.applications.sheets;
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
  CONFIG.Item.dataModels.archetype  = ArchetypeDataModel;

  CONFIG.Actor.documentClass = ArkeosActeur;

  // Barres de token : chemins relatifs à actor.system (sans préfixe "system.")
  CONFIG.Actor.trackableAttributes = {
    pj: {
      bar:   ["pv", "ev"],
      value: ["initiative", "defense", "champs.combat"],
    },
    pnj: {
      bar:   ["pv", "ev"],
      value: ["initiative", "defense"],
    },
  };

  game.arkeos = { ArkeosActeur, ArkeosFeuillePJ, ArkeosFeuillePNJ, calculerTR };

  const ActorsCollection = foundry.documents.collections.Actors;
  // v13: unregister AppV1 default sheet; v14: appv1 is removed, skip gracefully
  if (foundry.appv1?.sheets?.ActorSheet) {
    ActorsCollection.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  }
  ActorsCollection.registerSheet("arkeos", ArkeosFeuillePJ, {
    types: ["pj"], makeDefault: true, label: "Feuille de Personnage"
  });
  ActorsCollection.registerSheet("arkeos", ArkeosFeuillePNJ, {
    types: ["pnj"], makeDefault: true, label: "Fiche PNJ"
  });

  const ItemsCollection = foundry.documents.collections.Items;
  ItemsCollection.registerSheet("arkeos", ArkeosFeuilleItem, {
    types: ["specialite","arme","aptitude","trait","equipement","pouvoir","archetype"],
    makeDefault: true, label: "Feuille Objet"
  });

  chargerTemplates();
  console.log("Arkéos | EW-System initialisé !");
});

Hooks.once("ready", async function () {
  // Expose ArkeosWiki globalement pour les macros
  game.arkeos.ArkeosWiki = ArkeosWiki;

  // Ouverture automatique du wiki au chargement — MJ seulement
  if (game.user.isGM) {
    ArkeosWiki.open();
  }
});

// ================================================================
// CHAT — Marquer les messages Arkéos pour le CSS
// Ajoute la class "arkeos-message" sur le li.chat-message parent
// quand son contenu inclut une carte .arkeos-chat.
// Cela permet de cibler précisément le conteneur Foundry en CSS
// sans dépendre des sélecteurs :has() ou de l'ID du chat log.
// ================================================================
Hooks.on("renderChatMessage", (message, html) => {
  if (html.querySelector?.(".arkeos-chat")) {
    html.classList?.add("arkeos-message");
  }
});

// ================================================================
// BOUTON BARRE LATÉRALE ACTEURS — Création de personnage
// (Le bouton Wiki est géré dans wiki.mjs → renderJournalDirectory)
// ================================================================
Hooks.on("renderActorDirectory", (app, html) => {
  // Évite les doublons si le hook se déclenche plusieurs fois
  if (html.querySelector("#arkeos-sidebar-btns")) return;

  const container = document.createElement("div");
  container.id = "arkeos-sidebar-btns";
  container.style.cssText = [
    "padding: 6px 8px 10px",
    "border-top: 1px solid rgba(48,96,160,0.35)",
    "background: linear-gradient(180deg, #060a0e, #081018)",
    "display: flex",
    "flex-direction: column",
    "gap: 5px",
  ].join(";");

  const btnCreation = document.createElement("button");
  btnCreation.innerHTML = "🎲 Créer un Personnage";
  btnCreation.style.cssText = [
    "width:100%", "padding:7px 10px",
    "background:linear-gradient(135deg,#0a1a2a,#061018)",
    "color:#80c0e8",
    "border:1px solid #3060a0", "border-radius:4px",
    "cursor:pointer", "font-size:0.9em", "font-weight:bold",
    "letter-spacing:0.5px",
  ].join(";");
  btnCreation.addEventListener("click", () => ouvrirCreationPersonnage());

  container.appendChild(btnCreation);

  const sidebar = html.closest("#sidebar") ?? html.closest(".app") ?? html.parentElement;
  const footer  = html.querySelector(".directory-footer")
               ?? html.querySelector("footer")
               ?? html.querySelector(".directory-list")?.parentElement;

  if (footer)       footer.after(container);
  else if (sidebar) sidebar.appendChild(container);
  else              html.appendChild(container);
});

// ================================================================
// CLASSE ACTEUR
// ================================================================
class ArkeosActeur extends Actor {
  prepareData() { super.prepareData(); }

  // ---------------------------------------------------------------
  // CRÉATION — barres de token par défaut (PV barre 1, EV barre 2)
  // ---------------------------------------------------------------
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    // Ne pas écraser si déjà configuré
    if (data.prototypeToken?.bar1?.attribute) return;
    this.updateSource({
      "prototypeToken.bar1": { attribute: "pv" },
      "prototypeToken.bar2": { attribute: "ev" },
      "prototypeToken.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
    });
  }

  // ---------------------------------------------------------------
  // BARRES DE TOKEN — system.pv et system.ev sont des objets
  // { value, min, max } reconnus nativement par Foundry comme barres.
  // Quand la barre est modifiée sur le token (clic), on répercute
  // sur les champs stockés pvActuels / evActuelle.
  // ---------------------------------------------------------------
  getBarAttribute(barName, options = {}) {
    const data = super.getBarAttribute(barName, options);
    return data;
  }

  async modifyTokenAttribute(attribute, value, isDelta, isBar) {
    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    if (attribute === "pv") {
      const pvActuels = isDelta
        ? clamp((this.system.pvActuels ?? 0) + value, 0, this.system.pvMax ?? 999)
        : clamp(value, 0, this.system.pvMax ?? 999);
      await this.update({ "system.pvActuels": pvActuels });
      return this;
    }
    if (attribute === "ev") {
      const evActuelle = isDelta
        ? clamp((this.system.evActuelle ?? 0) + value, 0, this.system.evMax ?? 999)
        : clamp(value, 0, this.system.evMax ?? 999);
      await this.update({ "system.evActuelle": evActuelle });
      return this;
    }
    return super.modifyTokenAttribute(attribute, value, isDelta, isBar);
  }

  // ---------------------------------------------------------------
  // APPLIQUER LES DÉGÂTS sur cet acteur
  // letaux    : dégâts létaux à accumuler (augmentent degLetauxActuels)
  // superf    : dégâts superficiels à soustraire des PV
  // Retourne un objet { letaux, superf, pvAvant, pvApres, etat }
  // ---------------------------------------------------------------
  async appliquerDegats(letaux, superf) {
    const sys = this.system;
    const pvAvant = sys.pvActuels ?? sys.pvMax ?? 0;
    const pvApres = Math.max(0, pvAvant - superf);
    const degLActuels = (sys.degLetauxActuels ?? 0) + letaux;

    await this.update({
      "system.pvActuels":        pvApres,
      "system.degLetauxActuels": degLActuels,
    });

    // Recalcul de l'état de blessure pour le retour
    const pvMax = sys.pvMax ?? 1;
    let etat = "Normal";
    if (pvApres <= Math.floor(pvMax / 4)) etat = "Gravement Blessé ⚠️";
    else if (pvApres <= Math.floor(pvMax / 2)) etat = "Blessé";

    return { letaux, superf, pvAvant, pvApres, etat };
  }

  // ---------------------------------------------------------------
  // INITIATIVE — intégrée au tracker de combat Foundry
  // Appelée par le bouton ⚡ du token HUD et par le Combat Tracker
  // ---------------------------------------------------------------
  async rollInitiative(options = {}) {
    const sys  = this.system;
    const init = sys.initiative ?? sys.champs?.combat ?? 5;
    const roll = new Roll("1d10");
    await roll.evaluate();
    const total = roll.total + init;

    // Mettre à jour le combattant dans le tracker si en combat
    const cbt = game.combat?.combatants.find(c => c.actorId === this.id);
    if (cbt) await game.combat.setInitiative(cbt.id, total);

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `
        <div class="arkeos-chat">
          <div class="chat-titre">⚡ Initiative — ${this.name}</div>
          <div class="chat-corps">Score <b>${init}</b> + D10 <b>${roll.total}</b> = <b>${total}</b></div>
          <div class="chat-resultat">
            <div class="result-verdict result-neutre">Initiative : <b>${total}</b></div>
          </div>
        </div>
      `,
      rolls: [roll],
    });
    return this;
  }
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

  get title() {
    return `${this.actor.name} — Fiche de Personnage`;
  }

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
    ctx.archetypeItem = this.actor.items.find(i => i.type === "archetype") ?? null;

    // Tableaux pre-construits pour les barres (evite {{#times}} non natif Foundry)
    const degL  = this.actor.system.degLetauxActuels ?? 0;
    const degS  = this.actor.system.degSuperfActuels ?? 0;
    const evAct = this.actor.system.evActuelle ?? 0;
    ctx.barreLetaux = Array.from({ length: 31 }, (_, i) => ({ val: i, actif: i <= degL && i > 0 }));
    ctx.barreSuperf = Array.from({ length: 31 }, (_, i) => ({ val: i, actif: i <= degS && i > 0 }));
    ctx.barreEV     = Array.from({ length: 66 }, (_, i) => ({ val: i, actif: i <= evAct && i > 0 }));

    // Barre PV animée
    const pvAct = this.actor.system.pvActuels ?? 0;
    const pvMax = this.actor.system.pvMax ?? 1;
    ctx.pvPct   = Math.round(Math.max(0, Math.min(100, (pvAct / Math.max(1, pvMax)) * 100)));
    ctx.pvColor = ctx.pvPct > 60 ? "#4a9a40" : ctx.pvPct > 30 ? "#c07a10" : "#b02020";

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

    // === ÉCLAT STEPPER +/− ===
    html.querySelectorAll(".eclat-stepper-btn").forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        const action  = ev.currentTarget.dataset.action; // plus|moins
        const current = this.actor.system.pointsEclatActuels ?? 0;
        const max     = this.actor.system.pointsEclatMax ?? 0;
        const next    = action === "plus"
          ? Math.min(max, current + 1)
          : Math.max(0, current - 1);
        this.actor.update({ "system.pointsEclatActuels": next });
      });
    });

    // === QUANTITÉ ÉQUIPEMENT +/− ===
    html.querySelectorAll(".btn-qte").forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        const itemId = ev.currentTarget.dataset.itemId;
        const action = ev.currentTarget.dataset.action; // plus|moins
        const item   = this.actor.items.get(itemId);
        if (!item) return;
        const current = item.system.quantite ?? 1;
        const next    = action === "plus"
          ? current + 1
          : Math.max(0, current - 1);
        item.update({ "system.quantite": next });
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

    // === Archétype — clic pour popup + bouton retirer ===
    const archCard = html.querySelector(".archetype-card");
    if (archCard) {
      archCard.addEventListener("click", async ev => {
        if (ev.target.closest(".arch-remove-btn")) return; // géré séparément
        ev.preventDefault();
        const itemId = archCard.dataset.itemId;
        const item   = this.actor.items.get(itemId);
        if (!item) return;
        const sys = item.system;
        const CHAMP_LABELS_LOCAL = { connaissance:"Connaissance", combat:"Combat", savoir:"Savoir", social:"Social" };
        const COUT_LABELS        = { 1:"★ Économique", 2:"★★ Standard", 3:"★★★ Coûteux" };
        const lignesCouts = Object.entries(sys.coutChamps ?? {})
          .map(([c,v]) => `<li><strong>${CHAMP_LABELS_LOCAL[c]??c}</strong> : ${COUT_LABELS[v]??v}</li>`).join("");
        const lignesApt = (sys.aptitudes ?? [])
          .map(ap => `<li><strong>${ap.nom}</strong> (coût ${ap.cout}) — ${ap.effet}</li>`).join("");
        await foundry.applications.api.DialogV2.prompt({
          window: { title: `🎭 ${item.name}`, width: 520 },
          content: `
            <div class="arkeos-arch-dialog">
              <div class="arch-dialog-header">
                <img src="${item.img}" class="arch-dialog-icone" alt="${item.name}" />
                <div class="arch-dialog-titre-bloc">
                  <h2 class="arch-dialog-titre">${item.name}</h2>
                  <p class="arch-dialog-sous-titre">Champ dominant : <strong>${CHAMP_LABELS_LOCAL[sys.champ]??sys.champ}</strong> &nbsp;·&nbsp; Spé de départ : <em>${sys.speDepart}</em></p>
                </div>
              </div>
              <div class="arch-dialog-corps">
                ${sys.description || "<p><em>Aucune description.</em></p>"}
              </div>
            </div>`,
          ok: { label: "Fermer", icon: "fa-times" },
        });
      });

      html.querySelector(".arch-remove-btn")?.addEventListener("click", async ev => {
        ev.preventDefault(); ev.stopPropagation();
        const itemId = archCard.dataset.itemId;
        const item   = this.actor.items.get(itemId);
        if (!item) return;
        const ok = await foundry.applications.api.DialogV2.confirm({
          window: { title: "Retirer l'archétype" },
          content: `<p>Retirer <b>${item.name}</b> du personnage ? Les coûts de champs ne seront pas restaurés automatiquement.</p>`,
        });
        if (ok) await item.delete();
      });
    }

    // === Description d'item (clic sur l'icône) ===
    html.querySelectorAll(".item-icone-desc").forEach(btn => {
      btn.addEventListener("click", async ev => {
        ev.preventDefault();
        const item = this.actor.items.get(ev.currentTarget.dataset.itemId);
        if (!item) return;
        const desc = item.system.description || item.system.effet || "<p><em>Aucune description disponible.</em></p>";
        await foundry.applications.api.DialogV2.prompt({
          window: { title: `📖 ${item.name}` },
          content: `
            <div class="arkeos-desc-dialog">
              <div class="desc-header">
                <img src="${item.img}" class="desc-icone" />
                <h2 class="desc-titre">${item.name}</h2>
              </div>
              <div class="desc-corps">${desc}</div>
            </div>
          `,
          ok: { label: "Fermer", icon: "fa-times" },
        });
      });
    });
  }

  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    const html = this.element;

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

      // === CAS SPÉCIAL : Archétype (un seul autorisé) ===
      if (type === "archetype") {
        const existing = this.actor.items.find(i => i.type === "archetype");
        if (existing) {
          const ok = await foundry.applications.api.DialogV2.confirm({
            window: { title: "Changer d'archétype" },
            content: `<p>Remplacer <b>${existing.name}</b> par <b>${item.name}</b> ?</p>`,
          });
          if (!ok) return;
          await existing.delete();
        }
        // Créer l'archétype sur l'acteur
        const [created] = await this.actor.createEmbeddedDocuments("Item", [item.toObject()]);
        // Appliquer les coûts de champs au PJ
        if (created?.system?.coutChamps) {
          await this.actor.update({ "system.coutChamps": created.system.coutChamps });
        }
        ui.notifications.info(`🎭 Archétype ${item.name} appliqué !`);
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

    const classeVerdict = critSucces ? "result-succes" : critEchec ? "result-echec" : succes ? "result-succes" : "result-echec";
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `
        <div class="arkeos-chat">
          <div class="chat-titre">🎲 ${nomAction}</div>
          <div class="chat-corps">
            Score <b>${scoreFinal}</b>${bonus > 0 ? ` (${nomSpe} +${bonus})` : ""}${sys.malusBlessure < 0 ? ` (Blessure ${sys.malusBlessure})` : ""}${bonusSit > 0 ? ` (+${bonusSit})` : ""}${malus > 0 ? ` (−${malus})` : ""}
            — ND <b>${nd}</b> — TR <b>${tr}</b>/20
          </div>
          <div class="chat-resultat">
            <div class="result-de">
              <div class="de-bulle">${resultat}</div>
              <div class="de-tr">TR ≤ ${tr}</div>
            </div>
            <div class="result-verdict ${classeVerdict}">${texteRes}</div>
          </div>
        </div>
      `,
      rolls: [roll],
    });
  }

  // ---------------------------------------------------------------
  // INITIATIVE — délègue à ArkeosActeur.rollInitiative (combat tracker)
  // ---------------------------------------------------------------
  async _lancerInitiative() {
    await this.actor.rollInitiative();
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

    const rollAtk = new Roll("1d20");
    await rollAtk.evaluate();
    const d20Atk = rollAtk.total;
    const touche = d20Atk <= tr;
    const critSucces = d20Atk === 1;
    const critEchec  = d20Atk === 20;

    let contenuDegats = "";
    let rollDeg = null;
    if (touche && !critEchec) {
      // Calcul des dégâts
      const impact   = sys.impact ?? 1;
      const factDeg  = a.degats ?? 0;
      rollDeg = new Roll("1d10");
      await rollDeg.evaluate();
      const d10Val   = rollDeg.total;

      const letaux   = isContact ? factDeg + (critSucces ? factDeg : 0) : factDeg;  // critique = max dégâts
      const protection = sys.protectionTotale ?? 0;
      const defense    = sys.defense ?? 1;
      const superficiels = Math.max(0, d10Val - defense - protection);

      // Si critique, option dégâts max ou ignorer protection
      const critInfo = critSucces
        ? `<div class="chat-degats-crit">💥 Réussite critique : dégâts max <em>ou</em> ignore armure (au choix)</div>`
        : "";

      contenuDegats = `
        <div class="chat-degats">
          <div class="chat-degats-titre">🩸 Dégâts</div>
          <div class="chat-degats-grille">
            <span class="dg-label">Létaux</span>
            <span class="dg-val"><b>${letaux}</b></span>
            <span class="dg-detail">${isContact ? `Impact ${impact} + mod. arme ${factDeg >= 0 ? "+" : ""}${factDeg}` : `Mod. arme ${factDeg >= 0 ? "+" : ""}${factDeg}`}</span>
            <span class="dg-label">D10 blessure</span>
            <span class="dg-val"><b>${d10Val}</b></span>
            <span class="dg-detail">Défense −${defense} / Protection −${protection}</span>
            <span class="dg-label">Superficiels</span>
            <span class="dg-val dg-superf"><b>${superficiels}</b></span>
            <span class="dg-detail">${d10Val} − ${defense} − ${protection}</span>
          </div>
          ${critInfo}
        </div>
      `;

      // Auto-appliquer sur la cible ciblée
      const cibleToken = game.user.targets.first();
      const cibleActeur = cibleToken?.actor;
      if (cibleActeur) {
        const res = await cibleActeur.appliquerDegats(letaux, superficiels);
        contenuDegats += `
          <div class="chat-cible">
            🎯 <b>${cibleActeur.name}</b> — PV ${res.pvAvant} → <b>${res.pvApres}</b>
            <span class="cible-etat">${res.etat}</span>
          </div>`;
      }
    }

    const couleur = critEchec ? "#8b0000" : touche ? "#2d6a2d" : "#8b0000";
    const texte   = critEchec ? "💀 Échec Critique !" : critSucces ? "🌟 Réussite Critique !" : touche ? "✅ Touché !" : "❌ Manqué";

    const classeVerdictAtk = critEchec ? "result-echec" : touche ? "result-succes" : "result-echec";
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),

      content: `
        <div class="arkeos-chat">
          <div class="chat-titre">⚔️ Attaque — ${arme.name}</div>
          <div class="chat-corps">
            Combat <b>${scoreFinal}</b>${speNom ? ` (${speNom} +${speBonus})` : ""}${malusBlessure < 0 ? ` (Blessure ${malusBlessure})` : ""}
            — ND <b>${nd}</b> — TR <b>${tr}</b>/20
          </div>
          <div class="chat-resultat">
            <div class="result-de">
              <div class="de-bulle">${d20Atk}</div>
              <div class="de-tr">TR ≤ ${tr}</div>
            </div>
            <div class="result-verdict ${classeVerdictAtk}">${texte}</div>
          </div>
          ${contenuDegats}
        </div>
      `,
      rolls: rollDeg ? [rollAtk, rollDeg] : [rollAtk],
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
          <div class="chat-resultat">
            <div class="result-verdict result-neutre">Points restants : <b>${pts - cout}</b></div>
          </div>
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

  _enrichPNJCtx(ctx) {
    ctx.actor  = this.actor;
    ctx.system = this.actor.system;
    ctx.armes  = this.actor.items.filter(i => i.type === "arme");
    ctx.specialites = this.actor.items.filter(i => i.type === "specialite");
    // Barre PV
    const pvAct = this.actor.system.pvActuels ?? 0;
    const pvMax = this.actor.system.pvMax ?? 1;
    ctx.pvPct   = Math.round(Math.max(0, Math.min(100, (pvAct / Math.max(1, pvMax)) * 100)));
    ctx.pvColor = ctx.pvPct > 60 ? "#4a9a40" : ctx.pvPct > 30 ? "#c07a10" : "#b02020";
    // Barre EV
    const evAct2 = this.actor.system.evActuelle ?? 0;
    const evMax2 = this.actor.system.evMax ?? 1;
    ctx.evPct   = Math.round(Math.max(0, Math.min(100, (evAct2 / Math.max(1, evMax2)) * 100)));
    ctx.evColor = ctx.evPct > 60 ? "#2a7acc" : ctx.evPct > 30 ? "#8844cc" : "#4a1888";
    return ctx;
  }

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    return this._enrichPNJCtx(ctx);
  }

  async _preparePartContext(partId, context) {
    const ctx = await super._preparePartContext(partId, context);
    return this._enrichPNJCtx(ctx);
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

    html.querySelectorAll(".btn-initiative").forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        this._initiativePNJ();
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

  async _initiativePNJ() {
    await this.actor.rollInitiative();
  }

  async _jetPNJ(champId) {
    const sys    = this.actor.system;
    const score  = sys.champs?.[champId] ?? 5;
    const nomChamp = CHAMP_LABELS[champId] ?? champId;
    const DialogV2 = foundry.applications.api.DialogV2;

    // Dialogue de saisie du ND
    const result = await DialogV2.wait({
      window: { title: `${nomChamp} — ${this.actor.name}` },
      content: `
        <div class="arkeos-dialogue">
          <div class="dial-titre">🎲 ${nomChamp} (PNJ)</div>
          <div class="dial-info">Score : <b>${score}</b></div>
          <div class="dial-ligne">
            <label>ND (Niveau de Difficulté)</label>
            <input type="number" id="nd" value="10" min="1" max="30" style="width:70px;" />
          </div>
          <div class="dial-ligne">
            <label>Bonus de situation</label>
            <input type="number" id="bonus-sit" value="0" min="-10" max="10" style="width:70px;" />
          </div>
          <div class="dial-tr">TR : <b id="tr-val">${calculerTR(score, 10)}</b>/20</div>
        </div>
      `,
      render: (event, dialog) => {
        const el = dialog.element;
        const maj = () => {
          const nd  = Number(el.querySelector("#nd")?.value) || 10;
          const bon = Number(el.querySelector("#bonus-sit")?.value) || 0;
          const trEl = el.querySelector("#tr-val");
          if (trEl) trEl.textContent = calculerTR(score + bon, nd);
        };
        el.querySelector("#nd")?.addEventListener("input", maj);
        el.querySelector("#bonus-sit")?.addEventListener("input", maj);
        maj();
      },
      buttons: [
        {
          action: "lancer", label: "🎲 Lancer", default: true,
          callback: (event, button, dialog) => {
            const el = dialog.element;
            return {
              lancer: true,
              nd:    Number(el.querySelector("#nd")?.value) || 10,
              bonus: Number(el.querySelector("#bonus-sit")?.value) || 0,
            };
          },
        },
        { action: "annuler", label: "Annuler", callback: () => ({ lancer: false }) },
      ],
    }).catch(() => ({ lancer: false }));

    if (!result?.lancer) return;

    const nd     = result.nd;
    const bonus  = result.bonus;
    const scoreFinal = score + bonus;
    const tr     = calculerTR(scoreFinal, nd);
    const rollPnj = new Roll("1d20");
    await rollPnj.evaluate();
    const d20Pnj = rollPnj.total;
    const critSucces = d20Pnj === 1;
    const critEchec  = d20Pnj === 20;
    const succes = d20Pnj <= tr;

    const texte = critSucces ? "🌟 Réussite Critique !"
      : critEchec ? "💀 Échec Critique !"
      : succes ? "✅ Réussite" : "❌ Échec";
    const classe = (succes && !critEchec) ? "result-succes" : "result-echec";

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `
        <div class="arkeos-chat pnj">
          <div class="chat-titre">🎲 ${nomChamp} — ${this.actor.name}</div>
          <div class="chat-corps">Score <b>${scoreFinal}</b>${bonus !== 0 ? ` (sit. ${bonus > 0 ? "+" : ""}${bonus})` : ""} — ND <b>${nd}</b> — TR <b>${tr}</b>/20</div>
          <div class="chat-resultat">
            <div class="result-de">
              <div class="de-bulle">${d20Pnj}</div>
              <div class="de-tr">TR ≤ ${tr}</div>
            </div>
            <div class="result-verdict ${classe}">${texte}</div>
          </div>
        </div>
      `,
      rolls: [rollPnj],
    });
  }

  async _attaquePNJ(itemId) {
    const arme = this.actor.items.get(itemId);
    if (!arme) return;
    const sys = this.actor.system;
    const score = sys.champs?.combat ?? 5;
    const rollPnjAtk = new Roll("1d20");
    await rollPnjAtk.evaluate();
    const d20PnjAtk = rollPnjAtk.total;
    const tr = calculerTR(score, 10);
    const touche = d20PnjAtk <= tr;

    let degStr = "";
    let rollPnjDeg = null;
    if (touche) {
      rollPnjDeg = new Roll("1d10");
      await rollPnjDeg.evaluate();
      const d10PnjDmg = rollPnjDeg.total;
      const letaux      = arme.system.degats ?? 0;
      const superficiels = Math.max(0, d10PnjDmg - (sys.defense ?? 1));
      degStr = `<div class="chat-degats">Létaux <b>${letaux}</b> — Superf. <b>${superficiels}</b></div>`;

      // Auto-appliquer sur la cible ciblée
      const cibleToken = game.user.targets.first();
      const cibleActeur = cibleToken?.actor;
      if (cibleActeur) {
        const res = await cibleActeur.appliquerDegats(letaux, superficiels);
        degStr += `
          <div class="chat-cible">
            🎯 <b>${cibleActeur.name}</b> — PV ${res.pvAvant} → <b>${res.pvApres}</b>
            <span class="cible-etat">${res.etat}</span>
          </div>`;
      }
    }

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),

      content: `
        <div class="arkeos-chat pnj">
          <div class="chat-titre">⚔️ ${arme.name} (PNJ)</div>
          <div class="chat-corps">Combat <b>${score}</b> — TR <b>${tr}</b>/20</div>
          <div class="chat-resultat">
            <div class="result-de">
              <div class="de-bulle">${d20PnjAtk}</div>
              <div class="de-tr">TR ≤ ${tr}</div>
            </div>
            <div class="result-verdict ${touche ? "result-succes" : "result-echec"}">${touche ? "✅ Touché" : "❌ Raté"}</div>
          </div>
          ${degStr}
        </div>
      `,
      rolls: rollPnjDeg ? [rollPnjAtk, rollPnjDeg] : [rollPnjAtk],
    });
  }
}

// ================================================================
// FEUILLE ITEM
// ================================================================
class ArkeosFeuilleItem extends HandlebarsApplicationMixin(ItemSheetV2) {
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
    "systems/arkeos/templates/wiki/wiki.hbs",
  ]);
}
