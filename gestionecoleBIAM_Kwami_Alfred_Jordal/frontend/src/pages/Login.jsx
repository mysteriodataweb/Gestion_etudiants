import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@2ie.edu', mot_de_passe: 'admin123' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Institut 2iE</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Connexion</h1>
        </div>
        {error && <div className="alert-error mb-4">{error}</div>}
        <form className="space-y-4" onSubmit={submit}>
          <label>
            <span className="label">Email</span>
            <input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label>
            <span className="label">Mot de passe</span>
            <input className="input" type="password" value={form.mot_de_passe} onChange={(event) => setForm({ ...form, mot_de_passe: event.target.value })} required />
          </label>
          <button className="btn-primary w-full justify-center" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
        </form>
      </section>
    </main>
  );
}
