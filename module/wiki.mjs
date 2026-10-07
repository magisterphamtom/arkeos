// ================================================================
// ARKÉOS — Wiki (ApplicationV2)
// Architecture inspirée de Tranchons & Traquons
// Fenêtre singleton, sans stockage en base de données
// ================================================================

const { ApplicationV2 }              = foundry.applications.api;
const { HandlebarsApplicationMixin } = foundry.applications.api;

// ================================================================
// SECTIONS DE NAVIGATION
// ================================================================
const SECTIONS = [
  { id: "accueil",     icon: "🏠", label: "Accueil" },
  { id: "personnage",  icon: "🎭", label: "Le Personnage" },
  { id: "resolution",  icon: "⚙️", label: "Résolution" },
  { id: "combat",      icon: "⚔️", label: "Combat" },
  { id: "competences", icon: "🔧", label: "Compétences" },
  { id: "pouvoirs",    icon: "✨", label: "Pouvoirs" },
  { id: "equipement",  icon: "🎒", label: "Équipement" },
  { id: "maitrise",    icon: "🎪", label: "Conseils MJ" },
  { id: "univers",     icon: "🌍", label: "L'Univers" },
  { id: "creation",    icon: "🎲", label: "Création PJ" },
];

// ================================================================
// CLASSE PRINCIPALE
// ================================================================
export class ArkeosWiki extends HandlebarsApplicationMixin(ApplicationV2) {

  // ------- Options par défaut -------
  static DEFAULT_OPTIONS = {
    id: "arkeos-wiki",
    classes: ["arkeos", "arkeos-wiki"],
    position: { width: 960, height: 760 },
    window: {
      resizable: true,
      title: "📖 Wiki Arkéos — EW-System",
    },
    actions: {
      navClick: ArkeosWiki.#onNavClick,
    },
  };

  // ------- Template Handlebars -------
  static PARTS = {
    main: {
      template: "systems/arkeos/templates/wiki/wiki.hbs",
    },
  };

  // ------- Sections de navigation -------
  static SECTIONS = SECTIONS;

  // ------- Singleton -------
  static _instance = null;

  /** Ouvrir ou afficher le wiki (singleton) */
  static open() {
    if (!ArkeosWiki._instance || ArkeosWiki._instance._state <= 0) {
      ArkeosWiki._instance = new ArkeosWiki();
    }
    ArkeosWiki._instance.render({ force: true });
  }

  // ------- État interne -------
  _section = "accueil";

  // ------- Contexte Handlebars -------
  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    ctx.section  = this._section;
    ctx.sections = ArkeosWiki.SECTIONS;
    return ctx;
  }

  // ------- Navigation -------
  static async #onNavClick(event, target) {
    this._section = target.dataset.section;
    await this.render();
  }
}

// ================================================================
// HOOK — Bouton dans la barre latérale Journal
// (conforme à l'architecture T&T)
// ================================================================
Hooks.on("renderJournalDirectory", (_app, html) => {
  // Évite les doublons
  if (html.querySelector("#arkeos-wiki-btn")) return;

  const btn = document.createElement("button");
  btn.id = "arkeos-wiki-btn";
  btn.type = "button";
  btn.innerHTML = `<i class="fas fa-book-open"></i> Wiki Arkéos — Règles`;
  btn.style.cssText = [
    "width:calc(100% - 16px)",
    "margin:6px 8px 4px",
    "padding:7px 10px",
    "background:linear-gradient(135deg,#2a0a00,#1a0800)",
    "color:#e8c060",
    "border:1px solid #c8860a",
    "border-radius:4px",
    "cursor:pointer",
    "font-size:0.9em",
    "font-weight:bold",
    "letter-spacing:0.5px",
    "display:block",
  ].join(";");

  btn.addEventListener("mouseenter", () => {
    btn.style.background = "linear-gradient(135deg,#3a1500,#2a1000)";
    btn.style.color = "#ffd080";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.background = "linear-gradient(135deg,#2a0a00,#1a0800)";
    btn.style.color = "#e8c060";
  });
  btn.addEventListener("click", ev => {
    ev.preventDefault();
    ArkeosWiki.open();
  });

  // Insertion sous le header du panneau journal
  const header = html.querySelector(".directory-header")
               ?? html.querySelector("header")
               ?? html.querySelector(".directory-list");

  if (header) {
    header.after(btn);
  } else {
    html.prepend(btn);
  }
});
