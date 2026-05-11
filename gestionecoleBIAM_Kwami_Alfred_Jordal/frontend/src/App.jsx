import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import EcolesPage from './components/ecoles/EcolesPage.jsx';
import FilieresPage from './components/filieres/FilieresPage.jsx';
import SpecialitesPage from './components/specialites/SpecialitesPage.jsx';
import NiveauxPage from './components/niveaux/NiveauxPage.jsx';
import CyclesPage from './components/cycles/CyclesPage.jsx';
import ParcoursPage from './components/parcours/ParcoursPage.jsx';
import PaysPage from './components/pays/PaysPage.jsx';
import CivilitesPage from './components/civilites/CivilitesPage.jsx';
import DecisionsPage from './components/decisions/DecisionsPage.jsx';
import AnneesAcademiquesPage from './components/annees-academiques/AnneesAcademiquesPage.jsx';
import EcolesFiliersPage from './components/ecoles-filieres/EcolesFiliersPage.jsx';
import InscriptionsPage from './components/inscriptions/InscriptionsPage.jsx';
import StudentFormPage from './components/etudiants/StudentFormPage.jsx';
import StudentListPage from './components/etudiants/StudentListPage.jsx';
import Login from './pages/Login.jsx';

function ProtectedRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/ressources/ecoles" replace />} />
        <Route path="ressources/ecoles" element={<EcolesPage />} />
        <Route path="ressources/filieres" element={<FilieresPage />} />
        <Route path="ressources/specialites" element={<SpecialitesPage />} />
        <Route path="ressources/niveaux" element={<NiveauxPage />} />
        <Route path="ressources/cycles" element={<CyclesPage />} />
        <Route path="ressources/parcours" element={<ParcoursPage />} />
        <Route path="ressources/pays" element={<PaysPage />} />
        <Route path="ressources/civilites" element={<CivilitesPage />} />
        <Route path="ressources/decisions" element={<DecisionsPage />} />
        <Route path="ressources/annees-academiques" element={<AnneesAcademiquesPage />} />
        <Route path="ressources/ecoles-filieres" element={<EcolesFiliersPage />} />
        <Route path="ressources/inscriptions" element={<InscriptionsPage />} />
        <Route path="etudiants/ajouter" element={<StudentFormPage />} />
        <Route path="etudiants/liste" element={<StudentListPage />} />
      </Route>
    </Routes>
  );
}
