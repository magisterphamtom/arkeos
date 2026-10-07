// ================================================================
// ARKÉOS — EW-System DataModels (v13/v14 compatibles)
// ================================================================

const { TypeDataModel } = foundry.abstract;
const fields = foundry.data.fields;

// ----------------------------------------------------------------
// PJ — Personnage Joueur
// ----------------------------------------------------------------
export class PJDataModel extends TypeDataModel {
  static defineSchema() {
    return {
      // --- ÉTAT CIVIL ---
      etatCivil: new fields.SchemaField({
        prenom:        new fields.StringField({ initial: "" }),
        nom:           new fields.StringField({ initial: "" }),
        surnom:        new fields.StringField({ initial: "" }),
        dateNaissance: new fields.StringField({ initial: "" }),
        culture:       new fields.StringField({ initial: "" }),
        nationalite:   new fields.StringField({ initial: "" }),
        yeux:          new fields.StringField({ initial: "" }),
        cheveux:       new fields.StringField({ initial: "" }),
        taille:        new fields.StringField({ initial: "" }),
        poids:         new fields.StringField({ initial: "" }),
        age:           new fields.StringField({ initial: "" }),
        sexe:          new fields.StringField({ initial: "" }),
      }),

      // --- ARCHÉTYPE ---
      archetype: new fields.StringField({ initial: "" }),

      // --- CARACTÉRISTIQUES (3-10, 28 pts de Génération) ---
      carac: new fields.SchemaField({
        physique:   new fields.NumberField({ initial: 5, min: 1, max: 15, integer: true }),
        mental:     new fields.NumberField({ initial: 5, min: 1, max: 15, integer: true }),
        perception: new fields.NumberField({ initial: 5, min: 1, max: 15, integer: true }),
        presence:   new fields.NumberField({ initial: 5, min: 1, max: 15, integer: true }),
      }),

      // --- COÛTS D'ACQUISITION DES CHAMPS (définis par archétype) ---
      coutChamps: new fields.SchemaField({
        connaissance: new fields.NumberField({ initial: 2, min: 1, max: 3, integer: true }),
        combat:       new fields.NumberField({ initial: 2, min: 1, max: 3, integer: true }),
        savoir:       new fields.NumberField({ initial: 2, min: 1, max: 3, integer: true }),
        social:       new fields.NumberField({ initial: 2, min: 1, max: 3, integer: true }),
      }),

      // --- POINTS DE VIE & BLESSURES ---
      pvActuels:         new fields.NumberField({ initial: 15, min: 0, integer: true }),
      degLetauxActuels:  new fields.NumberField({ initial: 0, min: 0, integer: true }),
      degSuperfActuels:  new fields.NumberField({ initial: 0, min: 0, integer: true }),

      // --- PROTECTIONS ---
      protections: new fields.ArrayField(
        new fields.SchemaField({
          nom:        new fields.StringField({ initial: "" }),
          valeur:     new fields.NumberField({ initial: 1, min: 0, integer: true }),
        }),
        { initial: [] }
      ),

      // --- ÉNERGIE VITALE ---
      evActuelle: new fields.NumberField({ initial: 0, min: 0, integer: true }),

      // --- POINTS D'ÉCLAT ---
      pointsEclatMax:     new fields.NumberField({ initial: 3, min: 0, integer: true }),
      pointsEclatActuels: new fields.NumberField({ initial: 3, min: 0, integer: true }),

      // --- RÉPUTATION & EXPÉRIENCE ---
      reputation:  new fields.NumberField({ initial: 1, min: 0, integer: true }),
      experience:  new fields.NumberField({ initial: 0, min: 0, integer: true }),

      // --- ARGENT ---
      argent: new fields.SchemaField({
        revenus:    new fields.NumberField({ initial: 0, min: 0 }),
        liquidites: new fields.NumberField({ initial: 0, min: 0 }),
      }),

      // --- NOTES ---
      biographie: new fields.HTMLField({ initial: "" }),
      notes:      new fields.HTMLField({ initial: "" }),
      equipement: new fields.HTMLField({ initial: "" }),
      magie:      new fields.HTMLField({ initial: "" }),
    };
  }

  // --- Calculs automatiques ---
  prepareDerivedData() {
    const c = this.carac;

    // Champs (arrondi à l'inférieur)
    this.champs = {
      connaissance: Math.floor((c.mental + c.presence) / 2),
      combat:       Math.floor((c.physique + c.perception) / 2),
      savoir:       Math.floor((c.physique + c.mental) / 2),
      social:       Math.floor((c.presence + c.perception) / 2),
    };

    // Valeurs dérivées
    this.pvMax      = c.physique * 3;
    this.seuilMoins2 = Math.floor(this.pvMax / 2);
    this.seuilMoins4 = Math.floor(this.pvMax / 4);
    this.defense    = Math.ceil(c.physique / 4);
    this.impact     = Math.ceil(c.physique / 4);
    this.initiative = this.champs.combat;
    this.education  = this.champs.connaissance;
    this.evMax      = (c.mental * 2) + c.physique;
    this.volonte    = c.mental;

    // Protection totale
    this.protectionTotale = (this.protections || []).reduce((sum, p) => sum + (p.valeur || 0), 0);

    // Malus de blessure
    const pvAct = this.pvActuels ?? this.pvMax;
    if (pvAct <= this.seuilMoins4) {
      this.malusBlessure = -4;
      this.etatBlessure  = "Gravement Blessé";
    } else if (pvAct <= this.seuilMoins2) {
      this.malusBlessure = -2;
      this.etatBlessure  = "Blessé";
    } else {
      this.malusBlessure = 0;
      this.etatBlessure  = "Normal";
    }

    // Objets barre natifs Foundry — token bars
    this.pv = { value: this.pvActuels ?? 0, min: 0, max: this.pvMax };
    this.ev = { value: this.evActuelle ?? 0, min: 0, max: this.evMax };
  }
}

// ----------------------------------------------------------------
// PNJ
// ----------------------------------------------------------------
export class PNJDataModel extends TypeDataModel {
  static defineSchema() {
    return {
      archetype:   new fields.StringField({ initial: "" }),
      description: new fields.StringField({ initial: "" }),
      notes:       new fields.HTMLField({ initial: "" }),

      carac: new fields.SchemaField({
        physique:   new fields.NumberField({ initial: 5, min: 1, max: 20, integer: true }),
        mental:     new fields.NumberField({ initial: 5, min: 1, max: 20, integer: true }),
        perception: new fields.NumberField({ initial: 5, min: 1, max: 20, integer: true }),
        presence:   new fields.NumberField({ initial: 5, min: 1, max: 20, integer: true }),
      }),

      pvActuels:  new fields.NumberField({ initial: 15, min: 0, integer: true }),
      evActuelle: new fields.NumberField({ initial: 10, min: 0, integer: true }),
      reputation: new fields.NumberField({ initial: 1, min: 0, integer: true }),
    };
  }

  prepareDerivedData() {
    const c = this.carac;
    this.champs = {
      connaissance: Math.floor((c.mental + c.presence) / 2),
      combat:       Math.floor((c.physique + c.perception) / 2),
      savoir:       Math.floor((c.physique + c.mental) / 2),
      social:       Math.floor((c.presence + c.perception) / 2),
    };
    this.pvMax       = c.physique * 3;
    this.seuilMoins2 = Math.floor(this.pvMax / 2);
    this.seuilMoins4 = Math.floor(this.pvMax / 4);
    this.defense     = Math.ceil(c.physique / 4);
    this.impact      = Math.ceil(c.physique / 4);
    this.initiative  = this.champs.combat;
    this.evMax       = (c.mental * 2) + c.physique;
    this.volonte     = c.mental;

    // Objets barre natifs Foundry — token bars
    this.pv = { value: this.pvActuels ?? 0, min: 0, max: this.pvMax };
    this.ev = { value: this.evActuelle ?? 0, min: 0, max: this.evMax };
  }
}

// ----------------------------------------------------------------
// SPÉCIALITÉ (Item)
// ----------------------------------------------------------------
export class SpecialiteDataModel extends TypeDataModel {
  static defineSchema() {
    return {
      champ:           new fields.StringField({ initial: "connaissance" }), // connaissance|combat|savoir|social
      bonus:           new fields.NumberField({ initial: 2, min: 0, max: 6, integer: true }),
      doubleSpecNom:   new fields.StringField({ initial: "" }),
      doubleSpecBonus: new fields.NumberField({ initial: 0, min: 0, max: 4, integer: true }),
      description:     new fields.HTMLField({ initial: "" }),
    };
  }
}

// ----------------------------------------------------------------
// ARME (Item)
// ----------------------------------------------------------------
export class ArmeDataModel extends TypeDataModel {
  static defineSchema() {
    return {
      categorie:    new fields.StringField({ initial: "poing" }), // poing|melee|epaule|automatique|lourde|jet|speciale
      degats:       new fields.NumberField({ initial: 0, integer: true }),    // facteur de dégâts
      tempsRech:    new fields.StringField({ initial: "1" }),  // T/R tours de rechargement
      coupsRound:   new fields.StringField({ initial: "1" }),  // C/R coups par round
      magasin:      new fields.NumberField({ initial: 6, min: 0, integer: true }),
      porteeEff:    new fields.NumberField({ initial: 15, min: 0, integer: true }),  // P.E. en mètres
      porteeMax:    new fields.NumberField({ initial: 50, min: 0, integer: true }),  // P.M. en mètres
      special:      new fields.StringField({ initial: "" }),
      description:  new fields.HTMLField({ initial: "" }),
    };
  }
}

// ----------------------------------------------------------------
// APTITUDE (Item — talent spécifique à un archétype)
// ----------------------------------------------------------------
export class AptitudeDataModel extends TypeDataModel {
  static defineSchema() {
    return {
      cout:        new fields.NumberField({ initial: 1, min: 0, integer: true }),
      effet:       new fields.StringField({ initial: "" }),
      description: new fields.HTMLField({ initial: "" }),
      archetype:   new fields.StringField({ initial: "" }),
    };
  }
}

// ----------------------------------------------------------------
// TRAIT (Item — Avantage ou Restriction)
// ----------------------------------------------------------------
export class TraitDataModel extends TypeDataModel {
  static defineSchema() {
    return {
      type:        new fields.StringField({ initial: "avantage" }), // avantage|restriction|les_deux
      valeur:      new fields.NumberField({ initial: 2, integer: true }),  // positif=avantage, négatif=restriction
      cout:        new fields.NumberField({ initial: 2, min: 0, integer: true }),
      effet:       new fields.StringField({ initial: "" }),
      description: new fields.HTMLField({ initial: "" }),
    };
  }
}

// ----------------------------------------------------------------
// ÉQUIPEMENT (Item)
// ----------------------------------------------------------------
export class EquipementDataModel extends TypeDataModel {
  static defineSchema() {
    return {
      prix:        new fields.NumberField({ initial: 0, min: 0 }),
      poids:       new fields.StringField({ initial: "léger" }),
      quantite:    new fields.NumberField({ initial: 1, min: 0, integer: true }),
      description: new fields.HTMLField({ initial: "" }),
    };
  }
}

// ----------------------------------------------------------------
// POUVOIR (Item)
// ----------------------------------------------------------------
export class PouvoirDataModel extends TypeDataModel {
  static defineSchema() {
    return {
      famille:    new fields.StringField({ initial: "psionique" }), // psionique|physiologique|extrasensoriel|genie|magic
      caracteristique: new fields.StringField({ initial: "presence" }),
      niveau:     new fields.NumberField({ initial: 0, min: 0, max: 3, integer: true }), // 0=instinctif, 1=contenu, 2=contrôlé, 3=maîtrisé
      gainEV:     new fields.NumberField({ initial: 0, min: 0, integer: true }),
      cout:       new fields.NumberField({ initial: 4, min: 0, integer: true }),
      description: new fields.HTMLField({ initial: "" }),
    };
  }
}

// ----------------------------------------------------------------
// ARCHÉTYPE (Item — classe de personnage, un seul par PJ)
// ----------------------------------------------------------------
export class ArchetypeDataModel extends TypeDataModel {
  static defineSchema() {
    return {
      // Champ dominant (connaissance|combat|savoir|social)
      champ:       new fields.StringField({ initial: "connaissance" }),
      // Spécialité offerte gratuitement à la création
      speDepart:   new fields.StringField({ initial: "" }),
      // Coût en points pour acquérir chaque champ (1=économique, 2=standard, 3=coûteux)
      coutChamps:  new fields.SchemaField({
        connaissance: new fields.NumberField({ initial: 2, min: 1, max: 3, integer: true }),
        combat:       new fields.NumberField({ initial: 2, min: 1, max: 3, integer: true }),
        savoir:       new fields.NumberField({ initial: 2, min: 1, max: 3, integer: true }),
        social:       new fields.NumberField({ initial: 2, min: 1, max: 3, integer: true }),
      }),
      // Finances de départ
      revenus:     new fields.NumberField({ initial: 0, min: 0, integer: true }),
      liquidites:  new fields.NumberField({ initial: 0, min: 0, integer: true }),
      // Équipement de départ (texte libre)
      equipement:  new fields.StringField({ initial: "" }),
      // Aptitudes uniques (tableau)
      aptitudes:   new fields.ArrayField(
        new fields.SchemaField({
          nom:   new fields.StringField({ initial: "" }),
          cout:  new fields.NumberField({ initial: 1, min: 0, integer: true }),
          effet: new fields.StringField({ initial: "" }),
        })
      ),
      // Description narrative / biographie type
      description: new fields.HTMLField({ initial: "" }),
    };
  }
}
