import { useEffect, useState } from 'react';
import api from '../../api/api.js';
import ResourceForm from '../common/ResourceForm.jsx';
import Toast from '../common/Toast.jsx';

const fields = [
  { name: 'nom', label: 'Nom', required: true },
  { name: 'prenoms', label: 'Prenoms', required: true },
  { name: 'date_naissance', label: 'Date de naissance', type: 'date' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'telephone', label: 'Telephone' },
  { name: 'pays_id', label: 'Pays', type: 'select', source: 'pays', required: true },
  { name: 'civilites_id', label: 'Civilite', type: 'select', source: 'civilites', required: true },
];

const emptyForm = Object.fromEntries(fields.map((field) => [field.name, '']));

export default function StudentFormPage() {
  const [form, setForm] = useState(emptyForm);
  const [lookups, setLookups] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [paysRes, civilitesRes] = await Promise.all([
          api.get('/pays'),
          api.get('/civilites'),
        ]);
        setLookups({
          pays: { items: paysRes.data, labelField: 'libelle' },
          civilites: { items: civilitesRes.data, labelField: 'libelle' },
        });
      } catch (err) {
        setError('Erreur lors du chargement des données.');
      }
    };
    loadLookups();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/etudiants', form);
      setForm(emptyForm);
      setMessage('Étudiant ajouté avec succès.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Création impossible.');
    }
  };

  return (
    <section className="space-y-5">
      <Toast message={message} />
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Ajouter un étudiant</h1>
        <p className="text-sm text-slate-500">Enregistrement administratif d'un nouvel étudiant.</p>
      </div>
      {error && <div className="alert-error">{error}</div>}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <ResourceForm
          fields={fields}
          form={form}
          lookups={lookups}
          onChange={(name, value) => setForm((current) => ({ ...current, [name]: value }))}
          onSubmit={submit}
          submitLabel="Créer l'étudiant"
        />
      </div>
    </section>
  );
}
