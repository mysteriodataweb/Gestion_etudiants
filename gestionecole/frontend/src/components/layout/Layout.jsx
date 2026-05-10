import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const resourceLinks = [
  ['Ecoles', '/ressources/ecoles'],
  ['Filieres', '/ressources/filieres'],
  ['Specialites', '/ressources/specialites'],
  ['Niveaux', '/ressources/niveaux'],
  ['Cycles', '/ressources/cycles'],
  ['Parcours', '/ressources/parcours'],
  ['Pays', '/ressources/pays'],
  ['Civilites', '/ressources/civilites'],
  ['Decisions', '/ressources/decisions'],
  ['Annee Academique', '/ressources/annees-academiques'],
  ['Ecoles-Filieres', '/ressources/ecoles-filieres'],
  ['Inscriptions', '/ressources/inscriptions'],
];

const studentLinks = [
  ['Ajouter un etudiant', '/etudiants/ajouter'],
  ['Lister les etudiants', '/etudiants/liste'],
];

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderLink = ([label, to]) => (
    <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
      {label}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Institut 2iE</p>
          <h1 className="mt-1 text-xl font-bold text-slate-950">Gestion des etudiants</h1>
        </div>
        <nav className="space-y-7">
          <div>
            <p className="nav-title">Ressources</p>
            <div className="mt-2 space-y-1">{resourceLinks.map(renderLink)}</div>
          </div>
          <div>
            <p className="nav-title">Gestion des etudiants</p>
            <div className="mt-2 space-y-1">{studentLinks.map(renderLink)}</div>
          </div>
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">Console 2iE</p>
              <p className="text-xs text-slate-500">{user.email || 'Utilisateur connecte'}</p>
            </div>
            <button className="btn-secondary" onClick={logout}>Deconnexion</button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {[...resourceLinks, ...studentLinks].map(renderLink)}
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
