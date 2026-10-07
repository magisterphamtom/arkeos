// ================================================================
// ARKÉOS — Migration : Peupler le compendium Archétypes (type Item)
// Coller ce bloc entier dans la console Foundry (GM uniquement)
// ================================================================
(async () => {
  if (!game.user.isGM) { ui.notifications.warn("GM uniquement."); return; }

  const ARCHETYPE_DATA = [
    {
      key: "archeologue", nom: "Archéologue",
      icone: "systems/arkeos/assets/icons/arch-archeologue.svg",
      champ: "connaissance", speDepart: "Archéologie",
      coûts: { connaissance: 1, combat: 3, savoir: 2, social: 2 },
      revenus: 220, liquidites: 1100,
      equipement: "Matériel de fouille, une arme, un chapeau, des livres, un bureau",
      description: "Passionné par l'Histoire, rat de bibliothèque autant qu'explorateur de terrain.",
      aptitudes: [
        { nom: "Recherches", cout: 1, effet: "Bonus +2 en Archéologie" },
        { nom: "Célébrité",  cout: 4, effet: "1×/scénario : service d'un admirateur" },
      ],
    },
    {
      key: "baroudeur", nom: "Baroudeur",
      icone: "systems/arkeos/assets/icons/arch-baroudeur.svg",
      champ: "savoir", speDepart: "Survie",
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
      key: "chasseur", nom: "Chasseur de Fauves",
      icone: "systems/arkeos/assets/icons/arch-chasseur.svg",
      champ: "savoir", speDepart: "Chasse",
      coûts: { connaissance: 2, combat: 2, savoir: 1, social: 3 },
      revenus: 320, liquidites: 1600,
      equipement: "Deux armes à feu avec munitions, des trophées, un Bowie",
      description: "Prédateur ultime, il arpente jungles et savanes à la recherche du frisson.",
      aptitudes: [
        { nom: "Instinct",    cout: 1, effet: "Bonus +2 en Chasse" },
        { nom: "Coup de Grâce", cout: 4, effet: "1×/scénario : dégâts max, ignore la Défense" },
      ],
    },
    {
      key: "dandy", nom: "Dandy",
      icone: "systems/arkeos/assets/icons/arch-dandy.svg",
      champ: "social", speDepart: "Baratin",
      coûts: { connaissance: 2, combat: 2, savoir: 3, social: 1 },
      revenus: 0, liquidites: 0,
      equipement: "Au choix du joueur (accord du MJ)",
      description: "Ennui existentiel et cuillère en argent — il a tout, sauf les frissons de l'aventure.",
      aptitudes: [
        { nom: "Éloquence",  cout: 1, effet: "Bonus +2 en Baratin" },
        { nom: "Ressources", cout: 4, effet: "1×/scénario : obtenir l'objet dont on a besoin" },
      ],
    },
    {
      key: "investigateur", nom: "Investigateur",
      icone: "systems/arkeos/assets/icons/arch-investigateur.svg",
      champ: "social", speDepart: "Renseignement",
      coûts: { connaissance: 3, combat: 2, savoir: 2, social: 1 },
      revenus: 320, liquidites: 1600,
      equipement: "Une arme et un chargeur, menottes, bureau privé, ardoise de bar habituel",
      description: "Filatures nocturnes, faux alibis, comptes en banque — il démêle l'impossible.",
      aptitudes: [
        { nom: "Sens de l'Observation", cout: 1, effet: "Bonus +2 en Renseignement" },
        { nom: "Indice Primordial",      cout: 4, effet: "1×/scénario : question au MJ → réponse oui/non" },
      ],
    },
    {
      key: "journaliste", nom: "Journaliste",
      icone: "systems/arkeos/assets/icons/arch-journaliste.svg",
      champ: "social", speDepart: "Perspicacité",
      coûts: { connaissance: 2, combat: 3, savoir: 2, social: 1 },
      revenus: 320, liquidites: 1600,
      equipement: "Carte de presse, stylo, carnet, appareil photo, machine à écrire",
      description: "Nez dans les dossiers, toujours à l'affût du scoop qui changera l'Histoire.",
      aptitudes: [
        { nom: "Lire entre les lignes", cout: 1, effet: "Bonus +2 en Perspicacité" },
        { nom: "Gros Titre",            cout: 4, effet: "1×/scénario : obtenir un scoop ou indice inédit" },
      ],
    },
    {
      key: "medecin", nom: "Médecin",
      icone: "systems/arkeos/assets/icons/arch-medecin.svg",
      champ: "connaissance", speDepart: "Médecine",
      coûts: { connaissance: 2, combat: 3, savoir: 1, social: 2 },
      revenus: 400, liquidites: 2000,
      equipement: "Trousse médicale, jeu de clubs de golf, cabinet médical",
      description: "La vie et la mort lui passent entre les mains — il soigne sans frontières.",
      aptitudes: [
        { nom: "Praticien", cout: 1, effet: "Bonus +2 en Médecine" },
        { nom: "Miracle",   cout: 4, effet: "1×/scénario : ramener un mort récent à 1 PV" },
      ],
    },
    {
      key: "veteran", nom: "Vétéran",
      icone: "systems/arkeos/assets/icons/arch-veteran.svg",
      champ: "combat", speDepart: "Une arme à votre choix",
      coûts: { connaissance: 3, combat: 1, savoir: 2, social: 2 },
      revenus: 320, liquidites: 1600,
      equipement: "Une arme par Spécialité d'arme acquise, munitions, souvenirs de guerre",
      description: "La guerre forge les caractères — il a survécu à l'impossible et en garde les cicatrices.",
      aptitudes: [
        { nom: "Sens du Combat", cout: 1, effet: "Bonus +2 à l'Initiative" },
        { nom: "Survivant",      cout: 4, effet: "1×/scénario : restaurer les PV au maximum" },
      ],
    },
  ];

  function buildDescription(a) {
    const CL = { connaissance:"Connaissance", combat:"Combat", savoir:"Savoir", social:"Social" };
    const KL  = { 1:"★ Économique", 2:"★★ Standard", 3:"★★★ Coûteux" };
    const lignesCouts = Object.entries(a.coûts)
      .map(([c,v]) => `<li><strong>${CL[c]}</strong> : ${KL[v]}</li>`).join("");
    const lignesApt = a.aptitudes
      .map(ap => `<li><strong>${ap.nom}</strong> (coût ${ap.cout}) — ${ap.effet}</li>`).join("");
    return `<p><em>${a.description}</em></p>
<h3>Spécialité de départ</h3><p>${a.speDepart}</p>
<h3>Champ dominant</h3><p>${CL[a.champ]}</p>
<h3>Coûts d'acquisition des champs</h3><ul>${lignesCouts}</ul>
<h3>Aptitudes uniques</h3><ul>${lignesApt}</ul>
<h3>Équipement de départ</h3><p>${a.equipement}</p>
<h3>Ressources</h3><p>Revenus : ${a.revenus > 0 ? a.revenus + " Fc/mois" : "Variable (selon le MJ)"} — Liquidités : ${a.liquidites > 0 ? a.liquidites + " Fc" : "Variable"}</p>`;
  }

  const pack = game.packs.get("arkeos.archetypes");
  if (!pack) { ui.notifications.error("Compendium 'arkeos.archetypes' introuvable."); return; }

  // Vider le compendium (supprimer toute entrée existante de type Actor ou archetype)
  await pack.getIndex();
  const toDelete = pack.index.map(e => e._id);
  if (toDelete.length > 0) {
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title: "Vider le compendium" },
      content: `<p>Supprimer les <b>${toDelete.length}</b> entrée(s) existantes et les remplacer par les Items archétypes ?</p>`,
    });
    if (!ok) return;
    for (const id of toDelete) {
      const doc = await pack.getDocument(id);
      if (doc) await doc.delete();
    }
  }

  let créés = 0;
  for (const a of ARCHETYPE_DATA) {
    const itemData = {
      name: a.nom,
      type: "archetype",
      img:  a.icone,
      system: {
        champ:      a.champ,
        speDepart:  a.speDepart,
        coutChamps: a.coûts,
        revenus:    a.revenus,
        liquidites: a.liquidites,
        equipement: a.equipement,
        aptitudes:  a.aptitudes,
        description: buildDescription(a),
      },
    };
    await Item.create(itemData, { pack: "arkeos.archetypes" });
    console.log(`Arkéos | ✅ Archétype Item créé : ${a.nom}`);
    créés++;
  }

  ui.notifications.info(`✅ Migration terminée — ${créés} archétypes Items créés dans le compendium.`);
})();
