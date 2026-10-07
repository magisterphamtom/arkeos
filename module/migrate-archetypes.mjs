// ================================================================
// ARKÉOS — Migration : Peupler le compendium Archétypes
// Lancer UNE SEULE FOIS depuis la console Foundry (GM uniquement)
// Commande : import("/systems/arkeos/module/migrate-archetypes.mjs").then(m => m.run())
// ================================================================

const ARCHETYPE_DATA = [
  {
    key: "archeologue",
    nom: "Archéologue",
    icone: "systems/arkeos/assets/icons/arch-archeologue.svg",
    champ: "connaissance",
    speDepart: "Archéologie",
    coûts: { connaissance: 1, combat: 3, savoir: 2, social: 2 },
    revenus: 220, liquidites: 1100,
    equipement: "Matériel de fouille, une arme, un chapeau, des livres, un bureau",
    description: "Passionné par l'Histoire, rat de bibliothèque autant qu'explorateur de terrain.",
    aptitudes: [
      { nom: "Recherches", cout: 1, effet: "Bonus +2 en Archéologie" },
      { nom: "Célébrité", cout: 4, effet: "1×/scénario : service d'un admirateur" },
    ],
  },
  {
    key: "baroudeur",
    nom: "Baroudeur",
    icone: "systems/arkeos/assets/icons/arch-baroudeur.svg",
    champ: "savoir",
    speDepart: "Survie",
    coûts: { connaissance: 3, combat: 2, savoir: 1, social: 2 },
    revenus: 170, liquidites: 850,
    equipement: "Un sac de voyage rempli, une arme, une bonne paire de chaussures de marche",
    description: "Chercheur d'or, révolutionnaire ou simple voyageur — il se sort de tout.",
    aptitudes: [
      { nom: "Débrouillardise", cout: 1, effet: "Bonus +2 en Survie" },
      { nom: "Chance Insolente", cout: 4, effet: "1×/scénario : un jet raté devient une réussite" },
    ],
  },
  {
    key: "chasseur",
    nom: "Chasseur de Fauves",
    icone: "systems/arkeos/assets/icons/arch-chasseur.svg",
    champ: "savoir",
    speDepart: "Chasse",
    coûts: { connaissance: 2, combat: 2, savoir: 1, social: 3 },
    revenus: 320, liquidites: 1600,
    equipement: "Deux armes à feu avec munitions, des trophées, un Bowie",
    description: "Prédateur ultime, il arpente jungles et savanes à la recherche du frisson.",
    aptitudes: [
      { nom: "Instinct", cout: 1, effet: "Bonus +2 en Chasse" },
      { nom: "Coup de Grâce", cout: 4, effet: "1×/scénario : dégâts max, ignore la Défense" },
    ],
  },
  {
    key: "dandy",
    nom: "Dandy",
    icone: "systems/arkeos/assets/icons/arch-dandy.svg",
    champ: "social",
    speDepart: "Baratin",
    coûts: { connaissance: 2, combat: 2, savoir: 3, social: 1 },
    revenus: 0, liquidites: 0,
    equipement: "Au choix du joueur (accord du MJ)",
    description: "Ennui existentiel et cuillère en argent — il a tout, sauf les frissons de l'aventure.",
    aptitudes: [
      { nom: "Éloquence", cout: 1, effet: "Bonus +2 en Baratin" },
      { nom: "Ressources", cout: 4, effet: "1×/scénario : obtenir l'objet dont on a besoin" },
    ],
  },
  {
    key: "investigateur",
    nom: "Investigateur",
    icone: "systems/arkeos/assets/icons/arch-investigateur.svg",
    champ: "social",
    speDepart: "Renseignement",
    coûts: { connaissance: 3, combat: 2, savoir: 2, social: 1 },
    revenus: 320, liquidites: 1600,
    equipement: "Une arme et un chargeur, menottes, bureau privé, ardoise de bar habituel",
    description: "Filatures nocturnes, faux alibis, comptes en banque — il démêle l'impossible.",
    aptitudes: [
      { nom: "Sens de l'Observation", cout: 1, effet: "Bonus +2 en Renseignement" },
      { nom: "Indice Primordial", cout: 4, effet: "1×/scénario : question au MJ → réponse oui/non" },
    ],
  },
  {
    key: "journaliste",
    nom: "Journaliste",
    icone: "systems/arkeos/assets/icons/arch-journaliste.svg",
    champ: "social",
    speDepart: "Perspicacité",
    coûts: { connaissance: 2, combat: 3, savoir: 2, social: 1 },
    revenus: 320, liquidites: 1600,
    equipement: "Carte de presse, stylo, carnet, appareil photo, machine à écrire",
    description: "Nez dans les dossiers, toujours à l'affût du scoop qui changera l'Histoire.",
    aptitudes: [
      { nom: "Lire entre les lignes", cout: 1, effet: "Bonus +2 en Perspicacité" },
      { nom: "Gros Titre", cout: 4, effet: "1×/scénario : obtenir un scoop ou indice inédit" },
    ],
  },
  {
    key: "medecin",
    nom: "Médecin",
    icone: "systems/arkeos/assets/icons/arch-medecin.svg",
    champ: "connaissance",
    speDepart: "Médecine",
    coûts: { connaissance: 2, combat: 3, savoir: 1, social: 2 },
    revenus: 400, liquidites: 2000,
    equipement: "Trousse médicale, jeu de clubs de golf, cabinet médical",
    description: "La vie et la mort lui passent entre les mains — il soigne sans frontières.",
    aptitudes: [
      { nom: "Praticien", cout: 1, effet: "Bonus +2 en Médecine" },
      { nom: "Miracle", cout: 4, effet: "1×/scénario : ramener un mort récent à 1 PV" },
    ],
  },
  {
    key: "veteran",
    nom: "Vétéran",
    icone: "systems/arkeos/assets/icons/arch-veteran.svg",
    champ: "combat",
    speDepart: "Une arme à votre choix",
    coûts: { connaissance: 3, combat: 1, savoir: 2, social: 2 },
    revenus: 320, liquidites: 1600,
    equipement: "Une arme par Spécialité d'arme acquise, munitions, souvenirs de guerre",
    description: "La guerre forge les caractères — il a survécu à l'impossible et en garde les cicatrices.",
    aptitudes: [
      { nom: "Sens du Combat", cout: 1, effet: "Bonus +2 à l'Initiative" },
      { nom: "Survivant", cout: 4, effet: "1×/scénario : restaurer les PV au maximum" },
    ],
  },
];

/**
 * Génère le HTML de description pour un archétype dans le compendium
 */
function buildDescription(a) {
  const champLabel = { connaissance: "Connaissance", combat: "Combat", savoir: "Savoir", social: "Social" };
  const coutLabel  = { 1: "★ Économique", 2: "★★ Standard", 3: "★★★ Coûteux" };

  const lignesCouts = Object.entries(a.coûts)
    .map(([c, v]) => `<li><strong>${champLabel[c]}</strong> : ${coutLabel[v]}</li>`)
    .join("");

  const lignesApt = a.aptitudes
    .map(ap => `<li><strong>${ap.nom}</strong> (coût ${ap.cout}) — ${ap.effet}</li>`)
    .join("");

  return `<p><em>${a.description}</em></p>
<h3>Spécialité de départ</h3>
<p>${a.speDepart}</p>
<h3>Champ dominant</h3>
<p>${champLabel[a.champ]}</p>
<h3>Coûts d'acquisition des champs</h3>
<ul>${lignesCouts}</ul>
<h3>Aptitudes uniques</h3>
<ul>${lignesApt}</ul>
<h3>Équipement de départ</h3>
<p>${a.equipement}</p>
<h3>Ressources</h3>
<p>Revenus : ${a.revenus > 0 ? a.revenus + " Fc/mois" : "Variable (selon le MJ)"} — Liquidités de départ : ${a.liquidites > 0 ? a.liquidites + " Fc" : "Variable"}</p>`;
}

export async function run() {
  if (!game.user.isGM) {
    ui.notifications.warn("Cette migration doit être lancée par le MJ.");
    return;
  }

  const pack = game.packs.get("arkeos.archetypes");
  if (!pack) {
    ui.notifications.error("Compendium 'arkeos.archetypes' introuvable.");
    return;
  }

  // Récupérer les docs existants pour éviter les doublons
  await pack.getIndex();
  const existants = new Set(pack.index.map(e => e.name.toLowerCase()));

  let créés = 0;
  let ignorés = 0;

  for (const a of ARCHETYPE_DATA) {
    if (existants.has(a.nom.toLowerCase())) {
      console.log(`Arkéos | Archétype déjà présent : ${a.nom}`);
      ignorés++;
      continue;
    }

    const actorData = {
      name: a.nom,
      type: "pj",
      img: a.icone,
      system: {
        // Caractéristiques de base (6 partout = neutre)
        carac: { physique: 6, mental: 6, perception: 6, presence: 6 },
        // PV de départ (physique × 3 = 18)
        pvActuels: 18,
        // Coûts d'acquisition des champs
        coutChamps: a.coûts,
        // Archétype
        archetype: a.key,
        // Finances
        argent: { revenus: a.revenus, liquidites: a.liquidites },
        // Équipement de départ
        equipement: `<p>${a.equipement}</p>`,
        // Biographie type
        biographie: buildDescription(a),
      },
      items: [],
      flags: {},
      folder: null,
    };

    await Actor.create(actorData, { pack: "arkeos.archetypes" });
    console.log(`Arkéos | ✅ Archétype créé : ${a.nom}`);
    créés++;
  }

  const msg = `Migration terminée — ${créés} archétype(s) créé(s), ${ignorés} ignoré(s) (déjà présent).`;
  ui.notifications.info(msg);
  console.log(`Arkéos | ${msg}`);
}
