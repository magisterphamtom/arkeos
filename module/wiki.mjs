// ================================================================
// ARKÉOS — Wiki intégré (contenu issu du livre EW-Universe #1)
// ================================================================

const NOM_JOURNAL = "📖 Wiki — Arkéos EW-System";

export async function initialiserWiki() {
  const existant = game.journal.find(j => j.name === NOM_JOURNAL);
  if (existant) await existant.delete();
  console.log("Arkéos | Création du Wiki…");

  const pages = [
    { name: "0. ✨ Présentation", text: { content: `
<div style="text-align:center; background: linear-gradient(180deg,#0e0a06,#2a1408); padding: 30px 20px; border-radius: 8px; margin-bottom: 20px;">
  <img src="systems/arkeos/assets/couvertures/ombre_conquistador.jpg"
       style="max-width:340px; border: 3px solid #c8860a; border-radius: 4px; box-shadow: 0 0 30px rgba(200,134,10,0.5);" />
  <div style="margin-top: 20px; font-size: 1.4em; font-weight: bold; color: #e8b438; letter-spacing: 4px; text-transform: uppercase; font-family: Georgia, serif;">
    Arkéos
  </div>
  <div style="color: #c8a060; font-size: 1em; font-style: italic; margin-top: 4px;">
    EW-Universe #1 — L'Ombre du Conquistador
  </div>
  <div style="color: #8b6430; font-size: 0.9em; margin-top: 6px;">
    Extraordinary Worlds Studio — 2004
  </div>
</div>

<div style="background:#f9f5e8; border:1px solid rgba(200,134,10,0.3); border-radius:6px; padding:20px; font-family:Georgia,serif;">
  <p style="font-size:1.05em; line-height:1.7; color:#2a1408;">
    <strong>Dans l'univers très « pulp » des années trente</strong>, incarnez un personnage au tempérament bien trempé.
    Aventurez-vous sur les traces de civilisations disparues. Percez les mystères oubliés, les secrets millénaires
    qui ont influencé l'évolution du monde tel qu'il est devenu dans les années 30.
  </p>
  <p style="font-size:1em; line-height:1.7; color:#4a3010;">
    <em>L'Ombre du Conquistador</em> est l'amorce d'une campagne en 7 scénarii qui permettra aux personnages
    de découvrir la face cachée de l'histoire de l'Humanité.
  </p>

  <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:20px;">
    <div style="background:white; border:1px solid #ddd; border-top:3px solid #c8860a; border-radius:4px; padding:14px;">
      <div style="font-weight:bold; color:#8b6430; margin-bottom:8px; font-size:1em;">🎲 EW-System</div>
      <ul style="margin:0; padding-left:18px; line-height:1.8; color:#4a3010; font-size:0.95em;">
        <li>Résolution D20 + Table de Résolution</li>
        <li>4 Caractéristiques (PHY, MEN, PER, PRÉ)</li>
        <li>4 Champs + Spécialités</li>
        <li>Dégâts létaux &amp; superficiels</li>
        <li>Points d'Éclat</li>
      </ul>
    </div>
    <div style="background:white; border:1px solid #ddd; border-top:3px solid #8b1a00; border-radius:4px; padding:14px;">
      <div style="font-weight:bold; color:#8b1a00; margin-bottom:8px; font-size:1em;">🎭 8 Archétypes</div>
      <ul style="margin:0; padding-left:18px; line-height:1.8; color:#4a3010; font-size:0.95em;">
        <li>⛏️ Archéologue</li>
        <li>🧭 Baroudeur</li>
        <li>🎯 Chasseur de Fauves</li>
        <li>🎩 Dandy &amp; 🔍 Investigateur</li>
        <li>📰 Journaliste, 🩺 Médecin, 🎖️ Vétéran</li>
      </ul>
    </div>
    <div style="background:white; border:1px solid #ddd; border-top:3px solid #1a3a6a; border-radius:4px; padding:14px;">
      <div style="font-weight:bold; color:#1a3a6a; margin-bottom:8px; font-size:1em;">📚 Compendiums</div>
      <ul style="margin:0; padding-left:18px; line-height:1.8; color:#4a3010; font-size:0.95em;">
        <li>55 Spécialités complètes</li>
        <li>18 Armes des années 1930</li>
        <li>16 Aptitudes d'archétype</li>
        <li>8 Archétypes prêts-à-jouer</li>
      </ul>
    </div>
    <div style="background:white; border:1px solid #ddd; border-top:3px solid #1a5a1a; border-radius:4px; padding:14px;">
      <div style="font-weight:bold; color:#1a5a1a; margin-bottom:8px; font-size:1em;">⚡ Démarrage rapide</div>
      <ol style="margin:0; padding-left:18px; line-height:1.8; color:#4a3010; font-size:0.95em;">
        <li>Cliquez <strong>🎲 Créer un Personnage</strong></li>
        <li>Choisissez votre archétype</li>
        <li>Glissez des spécialités depuis le compendium</li>
        <li>Lancez l'aventure !</li>
      </ol>
    </div>
  </div>

  <div style="margin-top:20px; padding:12px; background:rgba(200,134,10,0.08); border:1px solid rgba(200,134,10,0.3); border-radius:4px; text-align:center;">
    <span style="color:#8b6430; font-size:0.9em;">
      📖 Utilisez les pages ci-dessous pour explorer toutes les règles du système EW.
    </span>
  </div>
</div>
` }},

// ===================================================================
{ name: "1. Prise en main", text: { content: `
<h1>🎲 Arkéos sur Foundry VTT</h1>
<p><strong>Arkéos</strong> est un jeu de rôle d'aventure pulp se déroulant dans les <strong>années 1930</strong>, publié par Extraordinary Worlds Studio. Les joueurs y incarnent des aventuriers courageux qui parcourent le monde à la recherche de trésors enfouis et de civilisations perdues, tout en s'opposant à la sinistre organisation nazie des <em>GrabRäubers</em>.</p>
<p>Ce système Foundry est une adaptation fidèle de l'<strong>EW-System</strong> — le moteur de jeu d'Arkéos.</p>

<h2>⚡ Interface rapide</h2>
<ul>
<li><strong>📖 Wiki Arkéos</strong> — Ce document (bouton dans le panneau Acteurs)</li>
<li><strong>🎲 Créer un Personnage</strong> — Assistant guidé (bouton dans le panneau Acteurs)</li>
<li><strong>Fiche PJ</strong> — 4 onglets : Personnage, Combat, Avancé, Notes</li>
<li><strong>Compendiums</strong> — Spécialités, Armes, Aptitudes, Archétypes prêts à l'emploi</li>
</ul>

<h2>🎯 Résolution en 10 secondes</h2>
<p>Le joueur lance <strong>1D20</strong>. Si le résultat est inférieur ou égal à la valeur lue dans la Table de Résolution (TR), c'est une réussite.</p>
<p><strong>TR = min(19, max(1, Score du PJ + 10 − Niveau de Difficulté))</strong></p>
<ul>
<li>D20 = 1 → Réussite Critique</li>
<li>D20 = 20 → Échec Critique</li>
<li>Score + 10 > ND → probabilité de succès élevée</li>
</ul>

<h2>📋 Feuille de personnage</h2>
<ul>
<li><strong>4 Caractéristiques</strong> : Physique, Mental, Perception, Présence (3–10, 28 pts)</li>
<li><strong>4 Champs</strong> : Connaissance, Combat, Savoir, Social (calculés automatiquement)</li>
<li><strong>Spécialités</strong> : bonus (+2 à +6) dans des domaines précis, glissez-déposez depuis le compendium</li>
<li><strong>Touches</strong> : PV, Défense, Impact, Initiative, Éducation, Énergie Vitale, Volonté</li>
</ul>
` }},

// ===================================================================
{ name: "2. Caractéristiques", text: { content: `
<h1>💪 Les Caractéristiques</h1>
<p>Les personnages humains ont des Caractéristiques comprises entre <strong>3 et 10</strong>. À la création, vous disposez de <strong>28 Points de Génération</strong> à répartir.</p>

<table>
<thead><tr><th>Valeur</th><th>Signification</th></tr></thead>
<tbody>
<tr><td>3</td><td>À la limite de l'infirmité</td></tr>
<tr><td>4</td><td>Pas doué</td></tr>
<tr><td>5</td><td>Dans la moyenne</td></tr>
<tr><td>6</td><td>Léger avantage</td></tr>
<tr><td>7</td><td>Se détache du lot</td></tr>
<tr><td>8</td><td>Domine la plupart</td></tr>
<tr><td>9</td><td>Surpasse presque tout le monde</td></tr>
<tr><td>10</td><td>Champion toutes catégories</td></tr>
<tr><td>11+</td><td>Surnaturel !</td></tr>
</tbody>
</table>

<h2>⚡ Physique (PHY)</h2>
<p>Force brute, agilité, endurance, dextérité, réflexes et santé. Détermine les blessures que peut encaisser le personnage et les dégâts à mains nues. <em>Portée max en mètres = PHY × 2</em>.</p>

<h2>🧠 Mental (MEN)</h2>
<p>Capacités de raisonnement, volonté, facultés d'apprentissage. Influence directement la pratique des sciences occultes.</p>

<h2>👁️ Perception (PER)</h2>
<p>Les cinq sens et l'intuition. Utilisée pour trouver des objets cachés ou ressentir les dangers.</p>

<h2>🎭 Présence (PRÉ)</h2>
<p>Charisme, prestance, ouverture sociale. À hauts niveaux, le personnage est automatiquement le centre de l'attention.</p>
` }},

// ===================================================================
{ name: "3. Champs & Spécialités", text: { content: `
<h1>📚 Champs & Spécialités</h1>

<h2>Les 4 Champs</h2>
<p>Les Champs sont calculés automatiquement à partir des Caractéristiques. Ils représentent le niveau général de compétence dans un domaine.</p>

<table>
<thead><tr><th>Champ</th><th>Formule</th><th>Domaine</th></tr></thead>
<tbody>
<tr><td><strong>Connaissance</strong></td><td>(MEN+PRÉ)/2</td><td>Intellect, culture, sciences, langues</td></tr>
<tr><td><strong>Combat</strong></td><td>(PHY+PER)/2</td><td>Combat armé et à mains nues</td></tr>
<tr><td><strong>Savoir</strong></td><td>(PHY+MEN)/2</td><td>Compétences pratiques et physiques</td></tr>
<tr><td><strong>Social</strong></td><td>(PRÉ+PER)/2</td><td>Interactions sociales, séduction, influence</td></tr>
</tbody>
</table>

<h2>Les Spécialités</h2>
<p>Les Spécialités sont des bonus (+1 à +6) qui s'ajoutent au score du Champ correspondant.</p>

<table>
<thead><tr><th>Niveau</th><th>Bonus</th><th>Description</th></tr></thead>
<tbody>
<tr><td>Néophyte</td><td>+0</td><td>Aucune formation particulière</td></tr>
<tr><td>Entraîné</td><td>+1</td><td>Formation de base</td></tr>
<tr><td>Professionnel</td><td>+2</td><td>Niveau standard (défaut de création)</td></tr>
<tr><td>Éminent</td><td>+3</td><td>Reconnu dans son domaine</td></tr>
<tr><td>Expert</td><td>+4</td><td>Parmi les meilleurs</td></tr>
<tr><td>Sommité</td><td>+5</td><td>Référence nationale</td></tr>
<tr><td>Extraordinaire</td><td>+6</td><td>Légende vivante</td></tr>
</tbody>
</table>

<p>La <strong>Double Spécialité</strong> permet de creuser un sous-domaine précis, donnant +2 supplémentaire par rapport à la spécialité de base (soit un total de +4 pour une Double Spécialité au niveau professionnel).</p>

<h2>Liste des Spécialités par Champ</h2>
<h3>Combat</h3>
<p>Armes automatiques, Armes de mêlée, Armes d'épaule, Armes de jet, Armes de poing, Armes lourdes, Armes à distance, Armes spéciales, Arts martiaux, Bagarre, Esquive.</p>
<h3>Connaissance</h3>
<p>Archéologie, Arts, Commerce, Cryptographie, Divination, Histoire/géographie, Langue étrangère, Langue natale, Lois, Médecine, Navigation, Occultisme, Sciences exactes, Sciences humaines, Stratégie/tactique.</p>
<h3>Savoir (Habileté)</h3>
<p>Acrobatie, Artisanat, Athlétisme, Chasse, Conduite, Contrefaçon, Crochetage, Démolition, Discrétion, Dressage, Équitation, Passe-passe, Pilotage, Premiers soins, Recherche, Sports, Survie, Système D.</p>
<h3>Social</h3>
<p>Baratin, Comédie, Débat, Déguisement, Intimidation, Jeu, Milieu, Perspicacité, Politesse, Renseignement, Séduction.</p>
` }},

// ===================================================================
{ name: "4. Valeurs Dérivées", text: { content: `
<h1>🔢 Valeurs Dérivées</h1>
<p>Toutes ces valeurs sont <strong>calculées automatiquement</strong> par Foundry à partir de vos Caractéristiques.</p>

<table>
<thead><tr><th>Valeur</th><th>Formule</th><th>Utilisation</th></tr></thead>
<tbody>
<tr><td><strong>Points de Vie (PV)</strong></td><td>PHY × 3</td><td>Résistance aux blessures létales</td></tr>
<tr><td><strong>Seuil −2</strong></td><td>PV ÷ 2</td><td>En dessous = −2 à toute action physique</td></tr>
<tr><td><strong>Seuil −4</strong></td><td>PV ÷ 4</td><td>En dessous = −4 à toute action physique</td></tr>
<tr><td><strong>Défense</strong></td><td>PHY ÷ 4 (arrondi sup.)</td><td>Réduit les dégâts superficiels</td></tr>
<tr><td><strong>Impact</strong></td><td>PHY ÷ 4 (arrondi sup.)</td><td>Bonus aux dégâts de mêlée et jet</td></tr>
<tr><td><strong>Initiative</strong></td><td>Score de Combat</td><td>Base + D10 en début de round</td></tr>
<tr><td><strong>Éducation</strong></td><td>Score de Connaissance</td><td>Connaissances générales superficielles</td></tr>
<tr><td><strong>Énergie Vitale (EV)</strong></td><td>(MEN × 2) + PHY</td><td>Réservoir pour pouvoirs et magie</td></tr>
<tr><td><strong>Volonté</strong></td><td>= MEN</td><td>Résistance à la magie et pouvoirs</td></tr>
</tbody>
</table>

<h2>🩹 Les Blessures</h2>
<p>Il existe deux types de dégâts :</p>
<ul>
<li><strong>Dégâts létaux</strong> : blessures graves — Facteur de dégâts de l'arme (+ Impact si mêlée)</li>
<li><strong>Dégâts superficiels</strong> : contusions — D10 − Défense − Protections (min 0)</li>
</ul>
<p>Quand les PV atteignent le <strong>Seuil −2</strong>, le personnage subit −2 à toutes ses actions physiques. Au <strong>Seuil −4</strong>, c'est −4. À 0 PV, le personnage est <strong>inconscient</strong> (1 PV reste). S'il reçoit encore des dégâts létaux, il meurt — sauf dépense de 3 Points d'Éclat.</p>
` }},

// ===================================================================
{ name: "5. Résolution des Actions", text: { content: `
<h1>🎲 Résolution des Actions — L'EW-System</h1>

<h2>La Table de Résolution (TR)</h2>
<p>Toute action s'effectue en deux étapes :</p>
<ol>
<li>Le MJ fixe un <strong>Niveau de Difficulté (ND)</strong></li>
<li>Le joueur lance <strong>1D20</strong> et compare au résultat de la TR</li>
</ol>

<p><strong>Formule : TR = min(19, max(1, Score + 10 − ND))</strong></p>
<p>Le joueur <strong>réussit</strong> si D20 ≤ TR. Il <strong>échoue</strong> si D20 > TR.</p>

<h2>Niveaux de Difficulté typiques</h2>
<table>
<thead><tr><th>ND</th><th>Difficulté</th><th>Exemple</th></tr></thead>
<tbody>
<tr><td>4</td><td>Trivial</td><td>Ouvrir une porte simple</td></tr>
<tr><td>6</td><td>Facile</td><td>Conduire sur une route dégagée</td></tr>
<tr><td>8</td><td>Moyen</td><td>Crocheter une serrure standard</td></tr>
<tr><td>10</td><td>Difficile</td><td>Négocier avec un ennemi</td></tr>
<tr><td>12</td><td>Très difficile</td><td>Opérer en pleine brousse</td></tr>
<tr><td>14</td><td>Extrême</td><td>Pirater une radio militaire</td></tr>
<tr><td>16+</td><td>Héroïque</td><td>Défier les lois de la physique</td></tr>
</tbody>
</table>

<h2>Réussites et Échecs Critiques</h2>
<ul>
<li><strong>D20 = 1</strong> → Réussite Critique : accomplir la tâche avec un bénéfice supplémentaire, ou gagner un bonus d'Initiative</li>
<li><strong>D20 = 20</strong> → Échec Critique : l'adversaire marque une réussite critique à votre place</li>
</ul>

<h2>Comment lancer sur Foundry</h2>
<p>Cliquez sur le bouton <strong>🎲</strong> à côté du Champ ou de la Spécialité. Un dialogue s'ouvre :</p>
<ul>
<li>Entrez le ND fixé par le MJ</li>
<li>Ajoutez bonus de circonstances ou malus</li>
<li>La TR est calculée automatiquement et affichée</li>
<li>Lancez le D20 — le résultat apparaît dans le chat</li>
</ul>
` }},

// ===================================================================
{ name: "6. Le Combat", text: { content: `
<h1>⚔️ Le Combat</h1>

<h2>Déroulement d'un Round (3 secondes)</h2>
<ol>
<li><strong>Initiative</strong> : chacun lance son score d'Initiative + D10 (⚡ bouton sur la fiche)</li>
<li><strong>Déclaration</strong> : par ordre d'initiative décroissant, chacun annonce attaque ou défense</li>
<li><strong>Résolution</strong> : confrontation des niveaux de spécialité sur la TR</li>
</ol>

<h2>Attaque & Défense</h2>
<p>Pour attaquer, confrontez votre <strong>Combat + Spécialité d'arme</strong> au <strong>Combat + Esquive (ou spécialité)</strong> de la cible.</p>
<p>En mêlée, les deux adversaires peuvent attaquer et se défendre une fois par round sans malus. Chaque action supplémentaire entraîne −4 cumulatif.</p>

<h2>Calcul des Dégâts</h2>
<table>
<thead><tr><th>Type</th><th>Formule</th></tr></thead>
<tbody>
<tr><td><strong>Dégâts létaux</strong> (mêlée/jet)</td><td>Facteur de l'arme + Impact</td></tr>
<tr><td><strong>Dégâts létaux</strong> (arme à feu)</td><td>Facteur de l'arme</td></tr>
<tr><td><strong>Dégâts superficiels</strong></td><td>D10 − Défense − Protections (min 0)</td></tr>
</tbody>
</table>

<h2>Statistiques des Armes</h2>
<ul>
<li><strong>Dég.</strong> — Facteur de dégâts de l'arme</li>
<li><strong>T/R</strong> — Temps de rechargement (rounds)</li>
<li><strong>C/R</strong> — Coups par round</li>
<li><strong>Mag.</strong> — Capacité du magasin</li>
<li><strong>P.E.</strong> — Portée efficace (en mètres)</li>
<li><strong>P.M.</strong> — Portée maximale (en mètres)</li>
</ul>

<h2>Tactiques spéciales</h2>
<ul>
<li><strong>Défense totale</strong> : +2 en défense tout le round, aucune attaque</li>
<li><strong>Attaque totale</strong> : +2 en attaque tout le round, aucune défense</li>
<li><strong>Action rapide</strong> : +2 en Initiative, −2 à tout le reste</li>
<li><strong>Retenir son coup</strong> : −2 en combat, dégâts uniquement superficiels</li>
<li><strong>Déplacement</strong> : jusqu'à PHY × 3 mètres (toute la durée du round)</li>
</ul>
` }},

// ===================================================================
{ name: "7. Les 8 Archétypes", text: { content: `
<h1>🎭 Les 8 Archétypes de Base</h1>
<p>L'Archétype détermine les coûts d'acquisition des Spécialités et les Aptitudes uniques du personnage. Il est fourni comme guide, non comme contrainte absolue.</p>

<table>
<thead><tr><th>Archétype</th><th>Con.</th><th>Com.</th><th>Sav.</th><th>Soc.</th><th>Spé de départ</th><th>Revenus</th></tr></thead>
<tbody>
<tr><td>⛏️ <strong>Archéologue</strong></td><td>1</td><td>3</td><td>2</td><td>2</td><td>Archéologie</td><td>220 $/mois</td></tr>
<tr><td>🧭 <strong>Baroudeur</strong></td><td>3</td><td>2</td><td>1</td><td>2</td><td>Survie</td><td>20–320 $</td></tr>
<tr><td>🎯 <strong>Chasseur de Fauves</strong></td><td>2</td><td>2</td><td>1</td><td>3</td><td>Chasse</td><td>320 $/mois</td></tr>
<tr><td>🎩 <strong>Dandy</strong></td><td>2</td><td>2</td><td>3</td><td>1</td><td>Baratin</td><td>Variable</td></tr>
<tr><td>🔍 <strong>Investigateur</strong></td><td>3</td><td>2</td><td>2</td><td>1</td><td>Renseignement</td><td>320 $/mois</td></tr>
<tr><td>📰 <strong>Journaliste</strong></td><td>2</td><td>3</td><td>2</td><td>1</td><td>Perspicacité</td><td>320 $/mois</td></tr>
<tr><td>🩺 <strong>Médecin</strong></td><td>2</td><td>3</td><td>1</td><td>2</td><td>Médecine</td><td>400 $/mois</td></tr>
<tr><td>🎖️ <strong>Vétéran</strong></td><td>3</td><td>1</td><td>2</td><td>2</td><td>Arme au choix</td><td>320 $/mois</td></tr>
</tbody>
</table>

<h2>Aptitudes uniques</h2>
<p>Chaque archétype possède 2 Aptitudes caractéristiques (coût 1 ou 4 pts de Génération) :</p>
<table>
<thead><tr><th>Archétype</th><th>Aptitude (1pt)</th><th>Aptitude (4pts)</th></tr></thead>
<tbody>
<tr><td>Archéologue</td><td>Recherches (+2 Archéologie)</td><td>Célébrité (service par scénario)</td></tr>
<tr><td>Baroudeur</td><td>Débrouillardise (+2 Survie)</td><td>Chance Insolente (1 réussite auto/scénar)</td></tr>
<tr><td>Chasseur</td><td>Instinct (+2 Chasse)</td><td>Coup de Grâce (dégâts max, ignore Défense)</td></tr>
<tr><td>Dandy</td><td>Éloquence (+2 Baratin)</td><td>Ressources (obtenir objet nécessaire)</td></tr>
<tr><td>Investigateur</td><td>Sens de l'Observation (+2 Renseignement)</td><td>Indice Primordial (question oui/non au MJ)</td></tr>
<tr><td>Journaliste</td><td>Lire entre les lignes (+2 Perspicacité)</td><td>Gros Titre (scoop/information inédite)</td></tr>
<tr><td>Médecin</td><td>Praticien (+2 Médecine)</td><td>Miracle (ramener mort récent à 1 PV)</td></tr>
<tr><td>Vétéran</td><td>Sens du Combat (+2 Initiative)</td><td>Survivant (restaurer PV au maximum)</td></tr>
</tbody>
</table>
` }},

// ===================================================================
{ name: "8. Traits & Aptitudes", text: { content: `
<h1>🔖 Traits, Aptitudes & Pouvoirs</h1>

<h2>Traits (Avantages & Restrictions)</h2>
<p>Les Traits ajoutent une touche personnalisée au personnage. Ils valent entre 1 et 3 Points de Génération. Un Avantage doit être acheté, une Restriction en procure.</p>

<h3>Avantages</h3>
<ul>
<li><strong>Force mentale</strong> (variable) — Bonus à la Volonté</li>
<li><strong>Hypermnésie</strong> (variable) — Mémoire exceptionnelle, bonus aux jets de mémoire</li>
<li><strong>Nyctalope*</strong> (1 pt) — Voit aussi bien la nuit qu'en plein jour</li>
<li><strong>Rapidité</strong> (variable) — Bonus d'Initiative</li>
<li><strong>Résistance à la douleur</strong> (3 pts) — Seuils divisés par 2</li>
<li><strong>Robuste</strong> (2 pts) — +1 à la Défense</li>
<li><strong>Ambidextre*</strong> (3 pts) — Pas de malus avec la main non courante</li>
</ul>

<h3>Restrictions</h3>
<ul>
<li><strong>Allergie</strong> (variable) — Malus en présence de la substance</li>
<li><strong>Code de l'honneur</strong> (variable) — Conduite stricte à respecter</li>
<li><strong>Obsession</strong> (variable) — Priorité absolue sur un objectif</li>
<li><strong>Phobie</strong> (variable) — Malus en présence de l'objet de peur</li>
<li><strong>Vertige</strong> (variable) — Malus au-dessus de 5 mètres</li>
</ul>

<h2>Pouvoirs</h2>
<p>Les Pouvoirs sont des capacités surnaturelles, très rares. Ils se développent en 4 niveaux : Instinctif (0), Contenu (+1), Contrôlé (+2), Maîtrisé (+3). Chaque niveau coûte des pts de Génération et donne des points d'EV.</p>
<ul>
<li><strong>Psioniques</strong> (Présence) : Vision d'esprit, Main fantasmagorique, Mesmérisme</li>
<li><strong>Physiologiques</strong> (Physique) : Agilité féline, Force herculéenne, Flux vital</li>
<li><strong>Extrasensoriels</strong> (Perception) : Médium, Sens accrus, Sens du danger</li>
<li><strong>Génie</strong> (spécial) : une Spécialité hors du commun</li>
<li><strong>Magic</strong> (Mental) : Hermétique ou sacrée — rare et puissante</li>
</ul>
` }},

// ===================================================================
{ name: "9. Création de Personnage", text: { content: `
<h1>✍️ Créer son Personnage</h1>

<h2>Points de Génération disponibles</h2>
<ul>
<li><strong>28 PG</strong> pour les Caractéristiques (3 à 10 chacune)</li>
<li><strong>36 PG</strong> pour Traits, Pouvoirs, Spécialités et Aptitudes</li>
<li><strong>8 PG</strong> pour les Spécialités de loisir (niveau +1 max)</li>
</ul>

<h2>Les 7 étapes (assistant Foundry en 6 étapes)</h2>
<ol>
<li><strong>Dans les grandes lignes</strong> — nom, apparence, histoire, caractère</li>
<li><strong>Caractéristiques</strong> — 28 PG entre PHY, MEN, PER, PRÉ</li>
<li><strong>Champs & Spécialités</strong> — calculés automatiquement + acheter les Spécialités</li>
<li><strong>Touches supplémentaires</strong> — PV, Initiative, Impact, EV, Volonté, Défense, Éducation (automatique)</li>
<li><strong>Traits</strong> — Avantages et Restrictions</li>
<li><strong>Pouvoirs</strong> — si souhaité</li>
<li><strong>Archétype</strong> — Spécialités de départ + Aptitudes + Équipement</li>
<li><strong>Touche finale</strong> — Réputation (1), Points d'Éclat (3), Argent</li>
</ol>

<h2>🎲 Utiliser l'assistant Foundry</h2>
<p>Cliquez sur <strong>🎲 Créer un Personnage</strong> dans le panneau Acteurs. L'assistant vous guide en 6 étapes avec les 8 archétypes prédéfinis, les listes complètes de spécialités et aptitudes.</p>

<h2>Points d'Éclat (3 au départ)</h2>
<p>Les Points d'Éclat permettent :</p>
<ul>
<li><strong>Réussir automatiquement</strong> une confrontation (1 point)</li>
<li><strong>Coup de pouce</strong> du destin — indice, coïncidence utile (1 point)</li>
<li><strong>Échapper à la mort</strong> in extremis (3 points)</li>
</ul>
` }},

// ===================================================================
{ name: "10. Fondation VTT — Astuces", text: { content: `
<h1>🖥️ Astuces Foundry VTT</h1>

<h2>Lancer un jet</h2>
<p>Cliquez sur le <strong>🎲</strong> à côté du Champ ou de la Spécialité. Entrez le ND du MJ dans le dialogue, le résultat apparaît en chat avec la TR calculée et le D20.</p>

<h2>Combat</h2>
<ol>
<li>Cliquez <strong>⚡ Initiative</strong> pour lancer votre Initiative (score + D10)</li>
<li>Cliquez <strong>⚔️</strong> sur l'arme dans l'onglet Combat pour attaquer</li>
<li>Le dialogue calcule automatiquement TR, dégâts létaux et superficiels</li>
</ol>

<h2>Blessures</h2>
<p>Cliquez sur les cases dans les barres de dégâts létaux/superficiels pour les marquer. Le malus de blessure (−2 ou −4) est automatiquement appliqué aux jets.</p>

<h2>Compendiums</h2>
<ul>
<li><strong>📚 Spécialités</strong> — toutes les 43 spécialités du livre, glissez-déposez sur la fiche</li>
<li><strong>⚔️ Armes</strong> — armes typiques des années 1930 avec leurs stats complètes</li>
<li><strong>⭐ Aptitudes</strong> — les 16 aptitudes d'archétype</li>
<li><strong>🎭 Archétypes</strong> — 8 personnages prêts-à-jouer depuis le livre de base</li>
</ul>

<h2>Ajouter une Spécialité</h2>
<p>Ouvrez le compendium <strong>📚 Spécialités</strong>, glissez une spécialité sur la zone correspondante dans la fiche. Éditez le bonus dans la fiche item.</p>
` }},
  ];

  await JournalEntry.create({
    name: NOM_JOURNAL,
    pages,
    ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER },
  });

  console.log("Arkéos | Wiki créé !");
  ui.notifications.info("📖 Wiki Arkéos EW-System créé ! Consultez les Journaux.");
}

export async function afficherWikiSiPremiereLancement() {
  // Ouvre le wiki à chaque lancement du game system
  setTimeout(() => {
    const j = game.journal.find(j => j.name === NOM_JOURNAL);
    if (j) j.sheet.render(true);
  }, 1800);
}
