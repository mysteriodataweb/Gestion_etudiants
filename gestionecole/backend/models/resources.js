export const resources = {
  ecoles: {
    table: 'ecoles',
    fields: ['libelle', 'adresse', 'telephone', 'email'],
  },
  civilites: {
    table: 'civilites',
    fields: ['libelle', 'abreviation'],
  },
  cycles: {
    table: 'cycles',
    fields: ['libelle', 'duree_annees'],
  },
  niveaux: {
    table: 'niveaux',
    fields: ['libelle', 'ordre', 'cycles_id'],
    joins: 'LEFT JOIN cycles ON niveaux.cycles_id = cycles.id',
    select: 'niveaux.*, cycles.libelle AS cycle_libelle',
  },
  pays: {
    table: 'pays',
    fields: ['libelle', 'code'],
  },
  specialites: {
    table: 'specialites',
    fields: ['libelle', 'filieres_id', 'description'],
    joins: 'LEFT JOIN filieres ON specialites.filieres_id = filieres.id',
    select: 'specialites.*, filieres.libelle AS filiere_libelle',
  },
  filieres: {
    table: 'filieres',
    fields: ['libelle', 'description'],
  },
  parcours: {
    table: 'parcours',
    fields: ['libelle', 'specialites_id', 'niveaux_id', 'credits_requis'],
    joins: 'LEFT JOIN specialites ON parcours.specialites_id = specialites.id LEFT JOIN niveaux ON parcours.niveaux_id = niveaux.id LEFT JOIN cycles ON niveaux.cycles_id = cycles.id',
    select: 'parcours.*, specialites.libelle AS specialite_libelle, niveaux.libelle AS niveau_libelle, cycles.libelle AS cycle_libelle',
  },
  'annees-academiques': {
    table: 'annee_academique',
    fields: ['libelle', 'date_debut', 'date_fin', 'est_active'],
  },
  decisions: {
    table: 'decisions',
    fields: ['libelle', 'description'],
  },
  etudiants: {
    table: 'etudiants',
    fields: ['nom', 'prenoms', 'pays_id', 'civilites_id', 'date_naissance', 'email', 'telephone'],
    joins: 'LEFT JOIN pays ON etudiants.pays_id = pays.id LEFT JOIN civilites ON etudiants.civilites_id = civilites.id',
    select: 'etudiants.*, pays.libelle AS pays_libelle, civilites.libelle AS civilite_libelle',
  },
  inscriptions: {
    table: 'inscriptions',
    fields: ['etudiants_id', 'parcours_id', 'annee_academique_id', 'decisions_id', 'date_inscription', 'montant_paye', 'statut_paiement'],
    joins: 'LEFT JOIN etudiants ON inscriptions.etudiants_id = etudiants.id LEFT JOIN parcours ON inscriptions.parcours_id = parcours.id LEFT JOIN annee_academique ON inscriptions.annee_academique_id = annee_academique.id LEFT JOIN decisions ON inscriptions.decisions_id = decisions.id',
    select: 'inscriptions.*, CONCAT(etudiants.prenoms, " ", etudiants.nom) AS etudiant_nom, parcours.libelle AS parcours_libelle, annee_academique.libelle AS annee_libelle, decisions.libelle AS decision_libelle',
  },
  'ecoles-filieres': {
    table: 'ecoles_filieres',
    fields: ['ecoles_id', 'filieres_id', 'statut', 'date_ouverture'],
    joins: 'LEFT JOIN ecoles ON ecoles_filieres.ecoles_id = ecoles.id LEFT JOIN filieres ON ecoles_filieres.filieres_id = filieres.id',
    select: 'ecoles_filieres.*, ecoles.libelle AS ecole_libelle, filieres.libelle AS filiere_libelle',
    orderBy: 'ecoles_filieres.date_ouverture DESC',
    primaryKey: ['ecoles_id', 'filieres_id'],
  },
};
