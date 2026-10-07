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
    speOnglet: "connaissance",   // onglet actif à l'étape 4
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
          <h2>1/5 — Identité</h2>
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
          <h2>2/5 — Caractéristiques</h2>
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
          <h2>3/5 — Archétype</h2>
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
        const pgsDep = etat.specialites.reduce((sum, s) => sum + s.cout, 0);
        const pgsR = 36 - pgsDep;
        return `
          <div class="creation-etape">
            <h2>4/5 — Spécialités</h2>
            <div id="spe-pg-restants" class="spe-pg-bloc ${pgsR < 0 ? 'pg-negatif' : ''}">
              <strong>${pgsR} PG restants</strong> sur 36
              <span class="spe-pg-detail">· Spécialités · Aptitudes · Traits · Pouvoirs</span>
            </div>

            <div class="spe-onglets">
              ${["connaissance","combat","savoir","social"].map(champ => {
                const nb = etat.specialites.filter(s => s.champ === champ).length;
                return `
                  <button type="button"
                    class="spe-onglet-btn ${etat.speOnglet === champ ? 'actif' : ''}"
                    data-onglet="${champ}"
                    style="--champ-color:${couleurChamp(champ)}">
                    <span class="spe-ong-label">${CHAMPS_LABELS[champ]}</span>
                    <span class="spe-ong-info">Val ${champs[champ]} · ${arch.coûts[champ]}pt/spé${nb > 0 ? ` · <b>${nb}</b> choisie${nb > 1 ? 's' : ''}` : ''}</span>
                  </button>`;
              }).join("")}
            </div>

            ${["connaissance","combat","savoir","social"].map(champ => `
              <div class="spe-panel ${etat.speOnglet === champ ? 'spe-panel-actif' : ''}" data-panel="${champ}">
                <div class="spe-items-panel">
                  ${TOUTES_SPECIALITES[champ].map(nom => {
                    const spe = etat.specialites.find(s => s.nom === nom && s.champ === champ);
                    const bonus = spe ? spe.bonus : 0;
                    const isTypique = arch.typiquesNoms.includes(nom) || nom === arch.speDepart;
                    const isDepart = nom === arch.speDepart;
                    return `
                      <div class="spe-item ${bonus > 0 ? 'spe-acquise' : ''} ${isTypique ? 'spe-typique' : ''}">
                        <span class="spe-nom">
                          ${nom}
                          ${isDepart ? '<span class="spe-badge-depart">départ</span>' : isTypique ? '<span class="spe-badge-typ">typique</span>' : ''}
                        </span>
                        <span class="spe-controles">
                          <button type="button" class="spe-btn" data-spe="${nom}" data-champ="${champ}" data-delta="-1">−</button>
                          <span class="spe-bonus-val">${bonus > 0 ? '+' + bonus : '0'}</span>
                          <button type="button" class="spe-btn" data-spe="${nom}" data-champ="${champ}" data-delta="1">+</button>
                        </span>
                      </div>`;
                  }).join("")}
                </div>
              </div>`).join("")}
          </div>`;
      }

      case 5: {
        const nomComplet = [etat.prenom, etat.nom].filter(Boolean).join(" ") || "Sans nom";
        const pgsDep = etat.specialites.reduce((sum, s) => sum + s.cout, 0);
        const pgsR5 = 36 - pgsDep;
        // Spécialités groupées par champ
        const speParChamp = {};
        for (const champ of ["connaissance","combat","savoir","social"]) {
          const liste = etat.specialites.filter(s => s.champ === champ);
          if (arch?.speDepart && arch.champ === champ) {
            // ajouter la spé de départ si pas déjà dans la liste
            const dejaPresent = liste.find(s => s.nom === arch.speDepart);
            speParChamp[champ] = dejaPresent ? liste : [{ nom: arch.speDepart, bonus: 2, depart: true }, ...liste];
          } else {
            speParChamp[champ] = liste;
          }
        }
        const totalSpe = Object.values(speParChamp).reduce((a, b) => a + b.length, 0);
        return `
        <div class="creation-etape recap-etape">
          <h2>5/5 — Récapitulatif</h2>

          <!-- EN-TÊTE PERSO -->
          <div class="recap-hero">
            <div class="recap-hero-icone">${arch ? arch.icone : "🎭"}</div>
            <div class="recap-hero-info">
              <div class="recap-hero-nom">${nomComplet}${etat.surnom ? ` <span class="recap-surnom">"${etat.surnom}"</span>` : ""}</div>
              <div class="recap-hero-arch">${arch ? arch.nom : "Archétype non choisi"}</div>
              <div class="recap-hero-origine">${[etat.culture, etat.nationalite].filter(Boolean).join(" · ") || ""}</div>
            </div>
            <div class="recap-hero-pg ${pgsR5 < 0 ? 'pg-negatif' : pgsR5 === 0 ? 'pg-zero' : ''}">
              <span class="recap-pg-val">${pgsR5}</span>
              <span class="recap-pg-lab">PG restants</span>
            </div>
          </div>

          <!-- CARACTÉRISTIQUES + CHAMPS -->
          <div class="recap-deux-col">
            <div class="recap-section recap-section-slim">
              <h3>Caractéristiques</h3>
              <div class="recap-carac">
                ${[["physique","PHY"],["mental","MEN"],["perception","PER"],["presence","PRE"]].map(([c,l]) => `
                  <div class="rc rc-carac">
                    <span class="rc-label">${l}</span>
                    <b class="rc-val">${etat.carac[c]}</b>
                    <span class="rc-desc">${descCarac(etat.carac[c])}</span>
                  </div>`).join("")}
              </div>
            </div>
            <div class="recap-section recap-section-slim">
              <h3>Champs</h3>
              <div class="recap-champs">
                ${[["connaissance","Con","#1a3a6a"],["combat","Com","#8b1a00"],["savoir","Sav","#1a5a1a"],["social","Soc","#8b6430"]].map(([c,l,col]) => `
                  <div class="rc rc-champ" style="border-left: 3px solid ${col}">
                    <span class="rc-label" style="color:${col}">${l}</span>
                    <b class="rc-val">${champs[c]}</b>
                    <span class="rc-cout">×${arch ? arch.coûts[c] : 2}pt</span>
                  </div>`).join("")}
              </div>
            </div>
          </div>

          <!-- DÉRIVÉES -->
          <div class="recap-section recap-section-slim">
            <h3>Valeurs dérivées</h3>
            <div class="recap-derives">
              <span><label>PV</label><b>${derives.pvMax}</b></span>
              <span><label>Seuil −2</label><b>${derives.seuilMoins2}</b></span>
              <span><label>Seuil −4</label><b>${derives.seuilMoins4}</b></span>
              <span><label>Défense</label><b>${derives.defense}</b></span>
              <span><label>Impact</label><b>${derives.impact}</b></span>
              <span><label>EV max</label><b>${derives.evMax}</b></span>
              <span><label>Initiative</label><b>${derives.initiative}</b></span>
              <span><label>Volonté</label><b>${derives.volonte}</b></span>
              <span><label>Éducation</label><b>${derives.education}</b></span>
            </div>
          </div>

          <!-- SPÉCIALITÉS -->
          ${totalSpe > 0 ? `
          <div class="recap-section recap-section-slim">
            <h3>Spécialités <span class="recap-h3-sub">(${pgsDep} PG dépensés)</span></h3>
            <div class="recap-spe-grille">
              ${["connaissance","combat","savoir","social"].map(champ => {
                const liste = speParChamp[champ];
                if (!liste.length) return "";
                const col = { connaissance:"#1a3a6a", combat:"#8b1a00", savoir:"#1a5a1a", social:"#8b6430" }[champ];
                return `<div class="recap-spe-col">
                  <div class="recap-spe-champ" style="color:${col};border-bottom:2px solid ${col}">${CHAMPS_LABELS[champ]}</div>
                  ${liste.map(s => `
                    <div class="recap-spe-item ${s.depart ? 'recap-spe-depart' : ''}">
                      <span>${s.nom}</span>
                      <b>+${s.bonus}</b>
                    </div>`).join("")}
                </div>`;
              }).join("")}
            </div>
          </div>` : ""}

          <!-- APTITUDES -->
          ${arch ? `
          <div class="recap-section recap-section-slim">
            <h3>Aptitudes</h3>
            <div class="recap-aptitudes">
              ${arch.aptitudes.map(a => `
                <div class="recap-apt-item">
                  <span class="recap-apt-nom">${a.nom}</span>
                  <span class="recap-apt-cout">${a.cout}pt</span>
                  <span class="recap-apt-effet">${a.effet}</span>
                </div>`).join("")}
            </div>
          </div>` : ""}

          <!-- FINANCES -->
          ${arch ? `
          <div class="recap-section recap-section-slim recap-finances">
            <div class="recap-fin-item"><label>Points d'Éclat</label><b>3</b></div>
            <div class="recap-fin-item"><label>Réputation</label><b>1</b></div>
            <div class="recap-fin-sep"></div>
            <div class="recap-fin-item"><label>Revenus</label><b>${arch.revenus > 0 ? arch.revenus + " $" : "Variable"}</b></div>
            <div class="recap-fin-item"><label>Liquidités</label><b>${arch.liquidites > 0 ? arch.liquidites + " $" : "—"}</b></div>
          </div>` : ""}
        </div>`; }

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

    // Onglets de spécialités
    el.querySelectorAll(".spe-onglet-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const onglet = btn.dataset.onglet;
        etat.speOnglet = onglet;
        el.querySelectorAll(".spe-onglet-btn").forEach(b => b.classList.remove("actif"));
        btn.classList.add("actif");
        el.querySelectorAll(".spe-panel").forEach(p => p.classList.remove("spe-panel-actif"));
        el.querySelector(`.spe-panel[data-panel="${onglet}"]`)?.classList.add("spe-panel-actif");
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
          if (pgsDep + coutChamp > 36) return;
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

        // Mise à jour compteur PG (étape 4 — id spe-pg-restants)
        const pgsDep2 = etat.specialites.reduce((sum, s) => sum + s.cout, 0);
        const pgsRestants = 36 - pgsDep2;
        const pgCounterEl = el.querySelector("#spe-pg-restants");
        if (pgCounterEl) {
          pgCounterEl.innerHTML = `<strong>${pgsRestants} PG restants</strong> sur 36 <span class="spe-pg-detail">· Spécialités · Aptitudes · Traits · Pouvoirs</span>`;
          pgCounterEl.classList.toggle("pg-negatif", pgsRestants < 0);
        }

        // Mise à jour du badge "choisies" dans l'onglet
        const nbChamp = etat.specialites.filter(s => s.champ === champ).length;
        const ongletBtn = el.querySelector(`.spe-onglet-btn[data-onglet="${champ}"] .spe-ong-info`);
        if (ongletBtn) {
          const arch2 = ARCHETYPES[etat.archetype];
          ongletBtn.innerHTML = `Val ${calcChamps(etat.carac)[champ]} · ${arch2.coûts[champ]}pt/spé${nbChamp > 0 ? ` · <b>${nbChamp}</b> choisie${nbChamp > 1 ? 's' : ''}` : ''}`;
        }
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
    await dialogInstance.render(true);
    // Attacher les listeners après le render (la callback render:(event,d)
    // reçoit l'instance comme `event` en v13, pas comme `d`)
    await new Promise(r => setTimeout(r, 80));
    attacherListeners(dialogInstance);
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
