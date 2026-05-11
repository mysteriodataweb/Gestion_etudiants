import { useEffect, useMemo, useState } from 'react';
import api from '../../api/api.js';
import ResourceForm from '../common/ResourceForm.jsx';
import Spinner from '../common/Spinner.jsx';
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

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [lookups, setLookups] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [studentsRes, paysRes, civilitesRes] = await Promise.all([
        api.get('/etudiants'),
        api.get('/pays'),
        api.get('/civilites'),
      ]);
      setStudents(studentsRes.data);
      setLookups({
        pays: { items: paysRes.data, labelField: 'libelle' },
        civilites: { items: civilitesRes.data, labelField: 'libelle' },
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredStudents = useMemo(() => {
    const term = query.toLowerCase();
    return students.filter((student) => `${student.nom} ${student.prenoms} ${student.email}`.toLowerCase().includes(term));
  }, [query, students]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/etudiants/${editing.id}`, form);
      setMessage('Etudiant modifie.');
      setEditing(null);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Modification impossible.');
    }
  };

  const remove = async (student) => {
    if (!confirm(`Supprimer ${student.prenoms} ${student.nom} ?`)) return;
    try {
      await api.delete(`/etudiants/${student.id}`);
      setMessage('Etudiant supprime.');
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Suppression impossible.');
    }
  };

  return (
    <section className="space-y-5">
      <Toast message={message} />
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Liste des etudiants</h1>
          <p className="text-sm text-slate-500">Recherche par nom, prenoms ou email.</p>
        </div>
        <input className="input max-w-sm" placeholder="Rechercher..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      {error && <div className="alert-error">{error}</div>}
      {loading ? <Spinner /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prenoms</th>
                <th>Pays</th>
                <th>Civilite</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.nom}</td>
                  <td>{student.prenoms}</td>
                  <td>{student.pays_libelle}</td>
                  <td>{student.civilite_libelle}</td>
                  <td>{student.email}</td>
                  <td className="space-x-2 whitespace-nowrap">
                    <button className="btn-small" onClick={() => { setEditing(student); setForm(fields.reduce((acc, field) => ({ ...acc, [field.name]: student[field.name] ?? '' }), {})); }}>Modifier</button>
                    <button className="btn-danger" onClick={() => remove(student)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {!filteredStudents.length && (
                <tr><td colSpan="6" className="py-8 text-center text-slate-500">Aucun etudiant trouve.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">Modifier l'etudiant</h2>
            <ResourceForm
              fields={fields}
              form={form}
              lookups={lookups}
              onChange={(name, value) => setForm((current) => ({ ...current, [name]: value }))}
              onSubmit={submit}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
