import { useEffect, useMemo, useState } from 'react';
import api from '../../api/api.js';
import { lookupConfig } from '../../data/resourceConfig.js';
import ResourceForm from './ResourceForm.jsx';
import Spinner from './Spinner.jsx';
import Toast from './Toast.jsx';

export default function ResourcePage({ config }) {
  const emptyForm = useMemo(() => Object.fromEntries(config.fields.map((field) => [field.name, field.type === 'checkbox' ? false : ''])), [config.fields]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lookups, setLookups] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColumn, setFilterColumn] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [main, ...lookupResponses] = await Promise.all([
        api.get(config.endpoint),
        ...config.fields.filter((field) => field.source).map((field) => api.get(lookupConfig[field.source].endpoint)),
      ]);
      setItems(main.data);
      const nextLookups = {};
      config.fields.filter((field) => field.source).forEach((field, index) => {
        nextLookups[field.source] = {
          items: lookupResponses[index].data,
          labelField: lookupConfig[field.source].labelField,
        };
      });
      setLookups(nextLookups);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Impossible de charger les donnees.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    
    return items.filter((item) => {
      if (filterColumn) {
        return String(item[filterColumn] || '').toLowerCase().includes(searchTerm.toLowerCase());
      }
      // Search across all columns if no specific column selected
      return config.columns.some((column) => 
        String(item[column] || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [items, searchTerm, filterColumn, config.columns]);

  useEffect(() => {
    loadData();
  }, [config.endpoint]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm(Object.fromEntries(config.fields.map((field) => [field.name, item[field.name] ?? (field.type === 'checkbox' ? false : '')])));
    setModalOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (editing) {
        await api.put(`${config.endpoint}/${editing.id}`, form);
        setMessage('Modification enregistree.');
      } else {
        await api.post(config.endpoint, form);
        setMessage('Element ajoute.');
      }
      setModalOpen(false);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Enregistrement impossible.');
    }
  };

  const remove = async (item) => {
    if (!confirm(`Supprimer "${item.nom || item.libelle || item.code}" ?`)) return;
    try {
      await api.delete(`${config.endpoint}/${item.id}`);
      setMessage('Element supprime.');
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Suppression impossible.');
    }
  };

  return (
    <section className="space-y-5">
      <Toast message={message} />
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">{config.title}</h1>
          <p className="text-sm text-slate-500">Gestion des donnees de reference de l'institut 2iE.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>Ajouter</button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <select
          value={filterColumn}
          onChange={(e) => setFilterColumn(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Toutes les colonnes</option>
          {config.columns.map((column) => (
            <option key={column} value={column}>{column.replaceAll('_', ' ')}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {loading ? <Spinner /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {config.columns.map((column) => <th key={column}>{column.replaceAll('_', ' ')}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  {config.columns.map((column) => <td key={column}>{String(item[column] ?? '')}</td>)}
                  <td className="space-x-2 whitespace-nowrap">
                    <button className="btn-small" onClick={() => openEdit(item)}>Modifier</button>
                    <button className="btn-danger" onClick={() => remove(item)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {!filteredItems.length && (
                <tr><td colSpan={config.columns.length + 1} className="py-8 text-center text-slate-500">{searchTerm ? 'Aucun resultat.' : 'Aucune donnee.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">{editing ? 'Modifier' : 'Ajouter'} - {config.title}</h2>
            <ResourceForm
              fields={config.fields}
              form={form}
              lookups={lookups}
              onChange={(name, value) => setForm((current) => ({ ...current, [name]: value }))}
              onSubmit={submit}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
