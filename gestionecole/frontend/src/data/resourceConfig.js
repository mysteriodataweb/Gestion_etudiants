export const lookupConfig = {
  ecoles: { endpoint: '/ecoles', labelField: 'libelle' },
  filieres: { endpoint: '/filieres', labelField: 'libelle' },
  specialites: { endpoint: '/specialites', labelField: 'libelle' },
  niveaux: { endpoint: '/niveaux', labelField: 'libelle' },
  cycles: { endpoint: '/cycles', labelField: 'libelle' },
  pays: { endpoint: '/pays', labelField: 'libelle' },
  civilites: { endpoint: '/civilites', labelField: 'libelle' },
  annees: { endpoint: '/annees-academiques', labelField: 'libelle' },
  decisions: { endpoint: '/decisions', labelField: 'libelle' },
  parcours: { endpoint: '/parcours', labelField: 'libelle' },
  etudiants: { endpoint: '/etudiants', labelField: ['prenoms', 'nom'] },
};

export const resourceConfigs = {
  ecoles: {
    title: 'Écoles',
    endpoint: '/ecoles',
    columns: ['libelle', 'telephone', 'email'],
    fields: [
      { name: 'libelle', label: 'Libellé', required: true },
      { name: 'adresse', label: 'Adresse' },
      { name: 'telephone', label: 'Téléphone' },
      { name: 'email', label: 'Email' },
    ],
  },
  filieres: {
    title: 'Filières',
    endpoint: '/filieres',
    columns: ['libelle', 'description'],
    fields: [
      { name: 'libelle', label: 'Libellé', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  specialites: {
    title: 'Spécialités',
    endpoint: '/specialites',
    columns: ['libelle', 'filiere_libelle', 'description'],
    fields: [
      { name: 'libelle', label: 'Libellé', required: true },
      { name: 'filieres_id', label: 'Filière', type: 'select', source: 'filieres', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  niveaux: {
    title: 'Niveaux',
    endpoint: '/niveaux',
    columns: ['libelle', 'ordre', 'cycle_libelle'],
    fields: [
      { name: 'libelle', label: 'Libellé', required: true },
      { name: 'ordre', label: 'Ordre', type: 'number', required: true },
      { name: 'cycles_id', label: 'Cycle', type: 'select', source: 'cycles', required: true },
    ],
  },
  cycles: {
    title: 'Cycles',
    endpoint: '/cycles',
    columns: ['libelle', 'duree_annees'],
    fields: [
      { name: 'libelle', label: 'Libellé', required: true },
      { name: 'duree_annees', label: 'Durée (ans)', type: 'number', required: true },
    ],
  },
  parcours: {
    title: 'Parcours',
    endpoint: '/parcours',
    columns: ['libelle', 'specialite_libelle', 'niveau_libelle', 'credits_requis'],
    fields: [
      { name: 'libelle', label: 'Libellé', required: true },
      { name: 'specialites_id', label: 'Spécialité', type: 'select', source: 'specialites', required: true },
      { name: 'niveaux_id', label: 'Niveau', type: 'select', source: 'niveaux', required: true },
      { name: 'credits_requis', label: 'Crédits requis', type: 'number' },
    ],
  },
  pays: {
    title: 'Pays',
    endpoint: '/pays',
    columns: ['libelle', 'code'],
    fields: [
      { name: 'libelle', label: 'Libellé', required: true },
      { name: 'code', label: 'Code', required: true },
    ],
  },
  civilites: {
    title: 'Civilités',
    endpoint: '/civilites',
    columns: ['libelle', 'abreviation'],
    fields: [
      { name: 'libelle', label: 'Libellé', required: true },
      { name: 'abreviation', label: 'Abréviation' },
    ],
  },
  decisions: {
    title: 'Décisions',
    endpoint: '/decisions',
    columns: ['libelle', 'description'],
    fields: [
      { name: 'libelle', label: 'Libellé', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  anneesAcademiques: {
    title: 'Années Académiques',
    endpoint: '/annees-academiques',
    columns: ['libelle', 'date_debut', 'date_fin', 'est_active'],
    fields: [
      { name: 'libelle', label: 'Libellé', required: true },
      { name: 'date_debut', label: 'Date début', type: 'date', required: true },
      { name: 'date_fin', label: 'Date fin', type: 'date', required: true },
      { name: 'est_active', label: 'Active', type: 'checkbox' },
    ],
  },
  etudiants: {
    title: 'Étudiants',
    endpoint: '/etudiants',
    columns: ['nom', 'prenoms', 'pays_libelle', 'civilite_libelle', 'email'],
    fields: [
      { name: 'nom', label: 'Nom', required: true },
      { name: 'prenoms', label: 'Prénoms', required: true },
      { name: 'date_naissance', label: 'Date de naissance', type: 'date' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'telephone', label: 'Téléphone' },
      { name: 'pays_id', label: 'Pays', type: 'select', source: 'pays', required: true },
      { name: 'civilites_id', label: 'Civilité', type: 'select', source: 'civilites', required: true },
    ],
  },
  inscriptions: {
    title: 'Inscriptions',
    endpoint: '/inscriptions',
    columns: ['etudiant_nom', 'parcours_libelle', 'annee_libelle', 'decision_libelle', 'montant_paye', 'statut_paiement'],
    fields: [
      { name: 'etudiants_id', label: 'Étudiant', type: 'select', source: 'etudiants', required: true },
      { name: 'parcours_id', label: 'Parcours', type: 'select', source: 'parcours', required: true },
      { name: 'annee_academique_id', label: 'Année académique', type: 'select', source: 'annees', required: true },
      { name: 'decisions_id', label: 'Décision', type: 'select', source: 'decisions', required: true },
      { name: 'date_inscription', label: 'Date inscription', type: 'date', required: true },
      { name: 'montant_paye', label: 'Montant payé', type: 'number', step: '0.01' },
      { name: 'statut_paiement', label: 'Statut paiement' },
    ],
  },
  'ecoles-filieres': {
    title: 'Écoles - Filières',
    endpoint: '/ecoles-filieres',
    columns: ['ecole_libelle', 'filiere_libelle', 'statut', 'date_ouverture'],
    fields: [
      { name: 'ecoles_id', label: 'École', type: 'select', source: 'ecoles', required: true },
      { name: 'filieres_id', label: 'Filière', type: 'select', source: 'filieres', required: true },
      { name: 'statut', label: 'Statut' },
      { name: 'date_ouverture', label: 'Date ouverture', type: 'date' },
    ],
  },
};
