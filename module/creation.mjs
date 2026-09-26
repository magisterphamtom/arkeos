// ================================================================
// ARKÉOS — Assistant de Création de Personnage (6 étapes)
// ================================================================

const ARCHETYPES = {
  archeologue: {
    nom: "Archéologue", icone: "⛏️",
    coûts: { connaissance: 1, combat: 3, savoir: 2, social: 2 },
    speDepart: "Archéologie", champ: "connaissance",
    revenus: 220,
    liquidites: 1100,
    equipement: "Matériel de fouille, une arme, un chapeau, des livres, un bureau",
    typiquesNoms: ["Histoire géographie", "Langue étrangère", "Sciences humaines", "Athlétisme", "Recherche", "Survie", "Débat", "Milieu Université", "Politesse", "Renseignement", "Armes de poing"],
    aptitudes: [
      { nom: "Recherches", cout: 1, effet: "Bonus +2 en Archéologie" },
      { nom: "Célébrité", cout: 4, effet: "1×/scénario : service d'un admirateur" },
    ],
    description: "Passionné par l'Histoire, rat de bibliothèque autant qu'explorateur de terrain.",
  },
  baroudeur: {
    nom: "Baroudeur", icone: "🧭",
    coûts: { connaissance: 3, combat: 2, savoir: 1, social: 2 },
    speDepart: "Survie", champ: "savoir",
    revenus: 170,
    liquidites: 850,
    equipement: "Un sac de voyage rempli, une arme, une bonne paire de chaussures de marche",
    typiquesNoms: ["Langue étrangère", "Athlétisme", "Chasse", "Conduite", "Discrétion", "Premiers soins", "Système D", "Jeu", "Armes de poing", "Bagarre"],
    aptitudes: [
      { nom: "Débrouillardise", cout: 1, effet: "Bonus +2 en Survie" },
      { nom: "Chance Insolente", cout: 4, effet: "1×/scénario : un jet raté devient une réussite" },
    ],
    description: "Chercheur d'or, révolutionnaire ou simple voyageur — il se sort de tout.",
  },
  chasseur: {
    nom: "Chasseur de Fauves", icone: "🎯",
    coûts: { connaissance: 2, combat: 2, savoir: 1, social: 3 },
    speDepart: "Chasse", champ: "savoir",
    revenus: 320,
    liquidites: 1600,
    equipement: "Deux armes à feu avec munitions, des trophées, un Bowie",
    typiquesNoms: ["Athlétisme", "Chasse", "Discrétion", "Dressage", "Équitation", "Premiers soins", "Survie", "Armes d'épaule", "Armes à distance", "Bagarre"],
    aptitudes: [
      { nom: "Instinct", cout: 1, effet: "Bonus +2 en Chasse" },
      { nom: "Coup de Grâce", cout: 4, effet: "1×/scénario : dégâts max, ignore la Défense" },
    ],
    description: "Prédateur ultime, il arpente jungles et savanes à la recherche du frisson.",
  },
  dandy: {
    nom: "Dandy", icone: "🎩",
    coûts: { connaissance: 2, combat: 2, savoir: 3, social: 1 },
    speDepart: "Baratin", champ: "social",
    revenus: 0,
    liquidites: 0,
    equipement: "Au choix du joueur (accord du MJ)",
    typiquesNoms: ["Langue étrangère", "Conduite", "Pilotage", "Intimidation", "Jeu", "Milieu", "Perspicacité", "Politesse", "Séduction", "Arts martiaux"],
    aptitudes: [
      { nom: "Éloquence", cout: 1, effet: "Bonus +2 en Baratin" },
      { nom: "Ressources", cout: 4, effet: "1×/scénario : obtenir l'objet dont on a besoin" },
    ],
    description: "Ennui existentiel et cuillère en argent — il a tout, sauf les frissons de l'aventure.",
  },
  investigateur: {
    nom: "Investigateur", icone: "🔍",
    coûts: { connaissance: 3, combat: 2, savoir: 2, social: 1 },
    speDepart: "Renseignement", champ: "social",
    revenus: 320,
    liquidites: 1600,
    equipement: "Une arme et un chargeur, menottes, bureau privé, ardoise de bar habituel",
    typiquesNoms: ["Lois", "Conduite", "Crochetage", "Discrétion", "Recherche", "Intimidation", "Milieu", "Renseignement", "Armes de poing", "Bagarre"],
    aptitudes: [
      { nom: "Sens de l'Observation", cout: 1, effet: "Bonus +2 en Renseignement" },
      { nom: "Indice Primordial", cout: 4, effet: "1×/scénario : question au MJ → réponse oui/non" },
    ],
    description: "Filatures nocturnes, faux alibis, comptes en banque — il démêle l'impossible.",
  },
  journaliste: {
    nom: "Journaliste", icone: "📰",
    coûts: { connaissance: 2, combat: 3, savoir: 2, social: 1 },
    speDepart: "Perspicacité", champ: "social",
    revenus: 320,
    liquidites: 1600,
    equipement: "Carte de presse, stylo, carnet, appareil photo, machine à écrire",
    typiquesNoms: ["Histoire géographie", "Conduite", "Discrétion", "Recherche", "Baratin", "Comédie", "Intimidation", "Milieu", "Perspicacité", "Renseignement"],
    aptitudes: [
      { nom: "Lire entre les lignes", cout: 1, effet: "Bonus +2 en Perspicacité" },
      { nom: "Gros Titre", cout: 4, effet: "1×/scénario : obtenir un scoop ou indice inédit" },
    ],
    description: "Nez dans les dossiers, toujours à l'affût du scoop qui changera l'Histoire.",
  },
  medecin: {
    nom: "Médecin", icone: "🩺",
    coûts: { connaissance: 2, combat: 3, savoir: 1, social: 2 },
    speDepart: "Médecine", champ: "connaissance",
    revenus: 400,
    liquidites: 2000,
    equipement: "Trousse médicale, jeu de clubs de golf, cabinet médical",
    typiquesNoms: ["Arts", "Sciences exactes", "Sciences humaines", "Athlétisme", "Conduite", "Premiers soins", "Sports", "Débat", "Jeu", "Milieu Université"],
    aptitudes: [
      { nom: "Praticien", cout: 1, effet: "Bonus +2 en Médecine" },
      { nom: "Miracle", cout: 4, effet: "1×/scénario : ramener un mort récent à 1 PV" },
    ],
    description: "La vie et la mort lui passent entre les mains — il soigne sans frontières.",
  },
  veteran: {
    nom: "Vétéran", icone: "🎖️",
    coûts: { connaissance: 3, combat: 1, savoir: 2, social: 2 },
    speDepart: "Une arme à votre choix", champ: "combat",
    revenus: 320,
    liquidites: 1600,
    equipement: "Une arme par Spécialité d'arme acquise, munitions, souvenirs de guerre",
    typiquesNoms: ["Stratégie/tactique", "Athlétisme", "Démolition", "Discrétion", "Premiers soins", "Survie", "Milieu", "3 Spécialités de combat"],
    aptitudes: [
      { nom: "Sens du Combat", cout: 1, effet: "Bonus +2 à l'Initiative" },
      { nom: "Survivant", cout: 4, effet: "1×/scénario : restaurer les PV au maximum" },
    ],
    description: "La guerre forge les caractères — il a survécu à l'impossible et en garde les cicatrices.",
  },
};

const TOUTES_SPECIALITES = {
  combat:       ["Armes automatiques","Armes de mêlée","Armes d'épaule","Armes de jet","Armes de poing","Armes lourdes","Armes à distance","Armes spéciales","Arts martiaux","Bagarre","Esquive"],
  connaissance: ["Archéologie","Arts","Commerce","Cryptographie","Divination","Histoire géographie","Langue étrangère","Langue natale","Lois","Médecine","Navigation","Occultisme","Sciences exactes","Sciences humaines","Stratégie/tactique"],
  savoir:       ["Acrobatie","Artisanat","Athlétisme","Chasse","Conduite","Contrefaçon","Crochetage","Démolition","Discrétion","Dressage","Équitation","Passe-passe","Pilotage","Premiers soins","Recherche","Sports","Survie","Système D"],
  social:       ["Baratin","Comédie","Débat","Déguisement","Intimidation","Jeu","Milieu","Perspicacité","Politesse","Renseignement","Séduction"],
};

const CHAMPS_LABELS = { connaissance: "Connaissance", combat: "Combat", savoir: "Savoir", social: "Social" };

// ================================================================
export async function ouvrirCreationPersonnage() {
  const etat = {
    etape:     1,
    prenom:    "", nom: "", surnom: "", culture: "", nationalite: "",
    archetype: null,
    carac:     { physique: 6, mental: 6, perception: 6, presence: 6 },
    pgsCarac:  28,
    specialites: [],
    pgsSpecialites: 36,
  };

  const calcChamps = (c) => ({
    connaissance: Math.floor((c.mental    + c.presence)   / 2),
    combat:       Math.floor((c.physique  + c.perception)  / 2),
    savoir:       Math.floor((c.physique  + c.mental)      / 2),
    social:       Math.floor((c.presence  + c.perception)  / 2),
  });

  const calcDerivees = (c) => {
    const pvMax = c.physique * 3;
    return {
      pvMax,
      seuilMoins2: Math.floor(pvMax / 2),
      seuilMoins4: Math.floor(pvMax / 4),
      defense:     Math.ceil(c.physique   / 4),
      impact:      Math.ceil(c.physique   / 4),
      evMax:       (c.mental * 2) + c.physique,
      volonte:     c.mental,
      education:   calcChamps(c).connaissance,
      initiative:  calcChamps(c).combat,
    };
  };

  // ---------------------------------------------------------------
  const contenuEtape = () => {
    const arch = etat.archetype ? ARCHETYPES[etat.archetype] : null;
    const champs = calcChamps(etat.carac);
    const derives = calcDerivees(etat.carac);
    const totalCarac = Object.values(etat.carac).reduce((a, b) => a + b, 0);
    const pgsRestants = 28 - totalCarac;

    switch (etat.etape) {

      case 1: return `
        <div class="creation-etape">
          <h2>1/6 — Identité</h2>
          <p class="aide">Qui est votre personnage ? Ces informations seront placées dans l'état civil de la fiche.</p>
          <div class="form-row-creation"><label>Prénom</label>
            <input type="text" id="cr-prenom" value="${etat.prenom}" placeholder="Elena…" /></div>
          <div class="form-row-creation"><label>Nom</label>
            <input type="text" id="cr-nom" value="${etat.nom}" placeholder="Caspian…" /></div>
          <div class="form-row-creation"><label>Surnom</label>
            <input type="text" id="cr-surnom" value="${etat.surnom}" placeholder="Kaz…" /></div>
          <div class="form-row-creation"><label>Culture</label>
            <input type="text" id="cr-culture" value="${etat.culture}" placeholder="Américaine…" /></div>
          <div class="form-row-creation"><label>Nationalité</label>
            <input type="text" id="cr-nationalite" value="${etat.nationalite}" placeholder="États-Unis…" /></div>
        </div>`;

      case 2: return `
        <div class="creation-etape">
          <h2>2/6 — Caractéristiques</h2>
          <p class="aide">Répartissez <strong>${pgsRestants} Points de Génération restants</strong> sur 28 au total (valeur : 3–10 par Caractéristique).</p>
          <div class="carac-creation">
            ${["physique","mental","perception","presence"].map(c => `
              <div class="carac-ligne">
                <label class="carac-l">${c.charAt(0).toUpperCase() + c.slice(1)}</label>
                <button type="button" class="carac-btn" data-carac="${c}" data-delta="-1">−</button>
                <span class="carac-v" id="cv-${c}">${etat.carac[c]}</span>
                <button type="button" class="carac-btn" data-carac="${c}" data-delta="1">+</button>
                <span class="carac-desc">${descCarac(etat.carac[c])}</span>
              </div>`).join("")}
          </div>
          <div class="pg-restants ${pgsRestants < 0 ? 'pg-negatif' : ''}">PG restants : <strong>${pgsRestants}</strong> / 28</div>
          <div class="derives-creation">
            <div class="d-item">PV max : <b>${derives.pvMax}</b></div>
            <div class="d-item">Défense : <b>${derives.defense}</b></div>
            <div class="d-item">Impact : <b>${derives.impact}</b></div>
            <div class="d-item">EV max : <b>${derives.evMax}</b></div>
            <div class="d-item">Volonté : <b>${derives.volonte}</b></div>
          </div>
        </div>`;

      case 3: return `
        <div class="creation-etape">
          <h2>3/6 — Archétype</h2>
          <p class="aide">Choisissez votre profession — elle détermine les coûts de Spécialités et vos Aptitudes uniques.</p>
          <div class="archetypes-grille">
            ${Object.entries(ARCHETYPES).map(([id, a]) => `
              <div class="arch-carte ${etat.archetype === id ? 'arch-selectionne' : ''}" data-arch="${id}">
                <div class="arch-icone">${a.icone}</div>
                <div class="arch-nom">${a.nom}</div>
                <div class="arch-cout">Con:${a.coûts.connaissance} Com:${a.coûts.combat} Sav:${a.coûts.savoir} Soc:${a.coûts.social}</div>
                <div class="arch-spe">Spé de départ : ${a.speDepart}</div>
              </div>`).join("")}
          </div>
          ${arch ? `
            <div class="arch-detail">
              <strong>${arch.icone} ${arch.nom}</strong> — ${arch.description}<br>
              <em>Revenus : ${arch.revenus > 0 ? arch.revenus + ' $/mois' : 'Variable'}</em><br>
              <em>Équipement de départ : ${arch.equipement}</em><br>
              <strong>Aptitudes :</strong> ${arch.aptitudes.map(a => `${a.nom} (${a.cout}pt) — ${a.effet}`).join(" | ")}
            </div>` : ""}
        </div>`;

      case 4: {
        if (!arch) return `<div class="creation-etape"><p>⚠️ Choisissez d'abord un archétype (étape 3).</p></div>`;
        const speCount = etat.specialites.length;
        const pgsDep = etat.specialites.reduce((sum, s) => sum + s.cout, 0);
        const pgsR = 36 - pgsDep;
        return `
          <div class="creation-etape">
            <h2>4/6 — Spécialités</h2>
            <p class="aide"><strong>${pgsR} PG restants</strong> sur 36 pour Spécialités, Aptitudes, Traits, Pouvoirs.</p>
            <p class="aide">Coût par champ : Con ${arch.coûts.connaissance}pt | Com ${arch.coûts.combat}pt | Sav ${arch.coûts.savoir}pt | Soc ${arch.coûts.social}pt</p>
            <div class="spe-colonnes">
              ${["connaissance","combat","savoir","social"].map(champ => `
                <div class="spe-colonne">
                  <div class="spe-col-titre" style="color:${couleurChamp(champ)}">${CHAMPS_LABELS[champ]} (${champs[champ]})</div>
                  <div class="spe-col-score">${arch.coûts[champ]} PG/spé</div>
                  <div class="spe-items">
                    ${TOUTES_SPECIALITES[champ].map(nom => {
                      const spe = etat.specialites.find(s => s.nom === nom && s.champ === champ);
                      const bonus = spe ? spe.bonus : 0;
                      const isTypique = arch.typiquesNoms.includes(nom) || nom === arch.speDepart;
                      return `
                        <div class="spe-item ${bonus > 0 ? 'spe-acquise' : ''} ${isTypique ? 'spe-typique' : ''}">
                          <span class="spe-nom">${nom}${isTypique ? ' ⭐' : ''}</span>
                          <span class="spe-controles">
                            <button type="button" class="spe-btn" data-spe="${nom}" data-champ="${champ}" data-delta="-1">−</button>
                            <span class="spe-bonus-val">${bonus > 0 ? '+' + bonus : '0'}</span>
                            <button type="button" class="spe-btn" data-spe="${nom}" data-champ="${champ}" data-delta="1">+</button>
                          </span>
                        </div>`;
                    }).join("")}
                  </div>
                </div>`).join("")}
            </div>
          </div>`;
      }

      case 5: return `
        <div class="creation-etape">
          <h2>5/6 — Récapitulatif</h2>
          ${arch ? `<div class="recap-section">
            <h3>${arch.icone} ${arch.nom}</h3>
            <p><strong>${etat.prenom} ${etat.nom}</strong> ${etat.surnom ? `"${etat.surnom}"` : ""} — ${etat.culture}, ${etat.nationalite}</p>
          </div>` : ""}
          <div class="recap-section">
            <h3>Caractéristiques</h3>
            <div class="recap-carac">
              ${Object.entries(etat.carac).map(([c, v]) => `<div class="rc"><span>${c.substring(0,3).toUpperCase()}</span><b>${v}</b></div>`).join("")}
            </div>
            <div class="recap-champs">
              ${Object.entries(calcChamps(etat.carac)).map(([c, v]) => `<div class="rc"><span>${CHAMPS_LABELS[c].substring(0,3)}</span><b>${v}</b></div>`).join("")}
            </div>
          </div>
          <div class="recap-section">
            <h3>Valeurs dérivées</h3>
            <div class="recap-derives">
              <span>PV max : <b>${derives.pvMax}</b></span>
              <span>Seuil −2 : <b>${derives.seuilMoins2}</b></span>
              <span>Seuil −4 : <b>${derives.seuilMoins4}</b></span>
              <span>Défense : <b>${derives.defense}</b></span>
              <span>Impact : <b>${derives.impact}</b></span>
              <span>EV max : <b>${derives.evMax}</b></span>
              <span>Volonté : <b>${derives.volonte}</b></span>
              <span>Initiative : <b>${derives.initiative}</b></span>
              <span>Éducation : <b>${derives.education}</b></span>
            </div>
          </div>
          ${etat.specialites.length > 0 ? `
            <div class="recap-section">
              <h3>Spécialités</h3>
              ${etat.specialites.map(s => `<span class="recap-spe">${s.nom} (${CHAMPS_LABELS[s.champ].substring(0,3)}) +${s.bonus}</span>`).join("")}
            </div>` : ""}
          <div class="recap-section">
            <p>Points d'Éclat : <b>3</b> | Réputation : <b>1</b> | Revenus : <b>${arch ? arch.revenus : "?"} $</b></p>
          </div>
        </div>`;

      default: return "<p>Étape inconnue</p>";
    }
  };

  // ---------------------------------------------------------------
  const CSS_CREATION = ""; // CSS dans arkeos.css

  // ---------------------------------------------------------------
  const naviguer = async (dialog, delta) => {
    // Sauvegarder l'étape courante
    const el = dialog.element;
    if (etat.etape === 1) {
      etat.prenom    = el.querySelector("#cr-prenom")?.value ?? etat.prenom;
      etat.nom       = el.querySelector("#cr-nom")?.value ?? etat.nom;
      etat.surnom    = el.querySelector("#cr-surnom")?.value ?? etat.surnom;
      etat.culture   = el.querySelector("#cr-culture")?.value ?? etat.culture;
      etat.nationalite = el.querySelector("#cr-nationalite")?.value ?? etat.nationalite;
    }
    etat.etape = Math.max(1, Math.min(5, etat.etape + delta));
    dialog.data.content = CSS_CREATION + contenuEtape();
    dialog.data.title   = `🎭 Création de Personnage — Étape ${etat.etape}/5`;
    dialog.render(true);
    await new Promise(r => setTimeout(r, 80));
    attacherListeners(dialog);
  };

  const attacherListeners = (dialog) => {
    const el = dialog.element;
    if (!el) return;

    // Archétypes
    el.querySelectorAll(".arch-carte").forEach(carte => {
      carte.addEventListener("click", () => {
        etat.archetype = carte.dataset.arch;
        el.querySelectorAll(".arch-carte").forEach(c => c.classList.remove("arch-selectionne"));
        carte.classList.add("arch-selectionne");
        const arch = ARCHETYPES[etat.archetype];
        let det = el.querySelector(".arch-detail");
        if (!det) {
          det = document.createElement("div");
          det.className = "arch-detail";
          el.querySelector(".archetypes-grille")?.after(det);
        }
        det.innerHTML = `<strong>${arch.icone} ${arch.nom}</strong> — ${arch.description}<br>
          <em>Revenus : ${arch.revenus > 0 ? arch.revenus + ' $/mois' : 'Variable'}</em><br>
          <em>Équipement : ${arch.equipement}</em><br>
          <strong>Aptitudes :</strong> ${arch.aptitudes.map(a => `${a.nom} (${a.cout}pt) — ${a.effet}`).join(" | ")}`;
      });
    });

    // Caractéristiques
    el.querySelectorAll(".carac-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const carac = btn.dataset.carac;
        const delta = Number(btn.dataset.delta);
        const total = Object.values(etat.carac).reduce((a, b) => a + b, 0);
        const nouvel = etat.carac[carac] + delta;
        if (nouvel < 3 || nouvel > 10) return;
        if (delta > 0 && total >= 28) return;
        etat.carac[carac] = nouvel;
        // Mettre à jour l'affichage sans re-render
        el.querySelector(`#cv-${carac}`).textContent = nouvel;
        const derives = calcDerivees(etat.carac);
        const totalN = Object.values(etat.carac).reduce((a, b) => a + b, 0);
        const pgR = 28 - totalN;
        const pgEl = el.querySelector(".pg-restants strong");
        if (pgEl) pgEl.textContent = pgR;
        el.querySelector(".pg-restants")?.classList.toggle("pg-negatif", pgR < 0);
        // Dérivées
        const items = el.querySelectorAll(".d-item");
        if (items.length >= 5) {
          items[0].textContent = `PV max : ${derives.pvMax}`;
          items[1].textContent = `Défense : ${derives.defense}`;
          items[2].textContent = `Impact : ${derives.impact}`;
          items[3].textContent = `EV max : ${derives.evMax}`;
          items[4].textContent = `Volonté : ${derives.volonte}`;
        }
      });
    });

    // Spécialités
    el.querySelectorAll(".spe-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const nom   = btn.dataset.spe;
        const champ = btn.dataset.champ;
        const delta = Number(btn.dataset.delta);
        const arch  = ARCHETYPES[etat.archetype];
        if (!arch) return;
        const coutChamp = arch.coûts[champ];
        let spe = etat.specialites.find(s => s.nom === nom && s.champ === champ);
        const pgsDep = etat.specialites.reduce((sum, s) => sum + s.cout, 0);

        if (delta > 0) {
          const cout = spe ? coutChamp : coutChamp;  // même coût pour augmentation
          if (pgsDep + cout > 36) return;
          if (!spe) {
            spe = { nom, champ, bonus: 2, cout: coutChamp };
            etat.specialites.push(spe);
          } else {
            if (spe.bonus >= 3) return;
            spe.bonus = Math.min(3, spe.bonus + 1);
            spe.cout += coutChamp;
          }
        } else {
          if (!spe || spe.bonus <= 0) return;
          spe.cout -= coutChamp;
          spe.bonus -= 1;
          if (spe.bonus <= 0) etat.specialites = etat.specialites.filter(s => !(s.nom === nom && s.champ === champ));
        }

        // Mise à jour affichage partiel
        const bonusEl = btn.parentElement.querySelector(".spe-bonus-val");
        if (bonusEl) {
          const s = etat.specialites.find(s => s.nom === nom && s.champ === champ);
          bonusEl.textContent = s ? `+${s.bonus}` : "0";
          btn.closest(".spe-item")?.classList.toggle("spe-acquise", !!s && s.bonus > 0);
        }
        const pgsDep2 = etat.specialites.reduce((sum, s) => sum + s.cout, 0);
        const pgsR = el.querySelector(".pg-restants");
        if (pgsR) pgsR.innerHTML = `PG restants : <strong>${36 - pgsDep2}</strong> / 36`;
      });
    });
  };

  // ---------------------------------------------------------------
  // Création du dialogue V2
  const DialogV2 = foundry.applications.api.DialogV2;

  // Wrapper objet pour stocker la référence après création
  let dialogInstance = null;

  const lancerDialogue = async () => {
    dialogInstance = new DialogV2({
      window: { title: `🎭 Création de Personnage — Étape ${etat.etape}/5` },
      classes: ["arkeos", "creation-dialog"],
      position: { width: 680, height: "auto" },
      content: CSS_CREATION + contenuEtape(),
      modal: false,
      render: (event, d) => attacherListeners(d),
      buttons: [
        {
          action: "precedent",
          label: "◀ Précédent",
          callback: async (event, button, d) => {
            await naviguerV2(d, -1);
            return false;
          },
        },
        {
          action: "suivant",
          label: "Suivant ▶",
          default: true,
          callback: async (event, button, d) => {
            await naviguerV2(d, 1);
            return false;
          },
        },
        {
          action: "creer",
          label: "✅ Créer le Personnage",
          callback: async (event, button, d) => {
            await creerActeur(etat);
            return true;
          },
        },
      ],
    });
    dialogInstance.render(true);
  };

  // naviguerV2 remplace naviguer(dialog, delta)
  const naviguerV2 = async (d, delta) => {
    const el = d.element;
    if (etat.etape === 1) {
      etat.prenom      = el.querySelector("#cr-prenom")?.value ?? etat.prenom;
      etat.nom         = el.querySelector("#cr-nom")?.value ?? etat.nom;
      etat.surnom      = el.querySelector("#cr-surnom")?.value ?? etat.surnom;
      etat.culture     = el.querySelector("#cr-culture")?.value ?? etat.culture;
      etat.nationalite = el.querySelector("#cr-nationalite")?.value ?? etat.nationalite;
    }
    etat.etape = Math.max(1, Math.min(5, etat.etape + delta));
    await d.close();
    await lancerDialogue();
  };

  await lancerDialogue();
}

// ----------------------------------------------------------------
async function creerActeur(etat) {
  if (!etat.archetype) { ui.notifications.warn("Choisissez un archétype (étape 3) avant de créer."); return; }
  const arch = ARCHETYPES[etat.archetype];
  const calcChamps = (c) => ({
    connaissance: Math.floor((c.mental + c.presence) / 2),
    combat:       Math.floor((c.physique + c.perception) / 2),
    savoir:       Math.floor((c.physique + c.mental) / 2),
    social:       Math.floor((c.presence + c.perception) / 2),
  });
  const c    = etat.carac;
  const pvMax = c.physique * 3;

  const acteurData = {
    name:  `${etat.prenom} ${etat.nom}`.trim() || "Nouveau Personnage",
    type: "pj",
    img:  `systems/arkeos/assets/portraits/portrait_0${Math.ceil(Math.random() * 9)}.jpg`,
    system: {
      etatCivil: {
        prenom: etat.prenom, nom: etat.nom, surnom: etat.surnom,
        culture: etat.culture, nationalite: etat.nationalite,
      },
      archetype: arch.nom,
      carac: { ...etat.carac },
      coutChamps: { ...arch.coûts },
      pvActuels:          pvMax,
      degLetauxActuels:   0,
      degSuperfActuels:   0,
      evActuelle:         (c.mental * 2) + c.physique,
      pointsEclatMax:     3,
      pointsEclatActuels: 3,
      reputation:  1,
      experience:  0,
      argent: {
        revenus:    arch.revenus,
        liquidites: arch.liquidites,
      },
      biographie: `<p><em>${etat.prenom} ${etat.nom} "${etat.surnom}" — ${arch.description}</em></p>`,
    },
  };

  const acteur = await Actor.create(acteurData);

  // Spécialités
  const itemsACreer = [];

  // Spécialité de départ (si champ combat, c'est libre)
  if (arch.speDepart !== "Une arme à votre choix") {
    itemsACreer.push({
      name: arch.speDepart, type: "specialite",
      system: { champ: arch.champ, bonus: 2, doubleSpecNom: "", doubleSpecBonus: 0 },
    });
  }

  // Spécialités choisies
  etat.specialites.forEach(s => {
    if (!itemsACreer.find(i => i.name === s.nom)) {
      itemsACreer.push({
        name: s.nom, type: "specialite",
        system: { champ: s.champ, bonus: s.bonus, doubleSpecNom: "", doubleSpecBonus: 0 },
      });
    }
  });

  // Aptitudes de l'archétype
  arch.aptitudes.forEach(a => {
    itemsACreer.push({
      name: a.nom, type: "aptitude",
      system: { archetype: arch.nom, cout: a.cout, effet: a.effet },
    });
  });

  if (itemsACreer.length > 0) {
    await acteur.createEmbeddedDocuments("Item", itemsACreer);
  }

  acteur.sheet.render(true);
  ui.notifications.info(`✅ Personnage ${acteur.name} créé avec succès !`);
}

// ----------------------------------------------------------------
function descCarac(val) {
  const descs = { 3:"Infirmité", 4:"Pas doué", 5:"Moyen", 6:"Avantagé", 7:"Se détache", 8:"Domine", 9:"Surpasse", 10:"Champion" };
  return descs[val] ?? (val > 10 ? "Surnaturel !" : "");
}

function couleurChamp(champ) {
  return { connaissance: "#1a3a6a", combat: "#8b1a00", savoir: "#1a5a1a", social: "#8b6430" }[champ] ?? "#333";
}
