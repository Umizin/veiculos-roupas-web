import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { RotaAdmin, RotaProtegida } from './components/RotaProtegida';
import { LoginPage } from './pages/LoginPage';
import { RegistrarPage } from './pages/RegistrarPage';
import { DashboardPage } from './pages/DashboardPage';
import { CarrosPage } from './pages/CarrosPage';
import { MotosPage } from './pages/MotosPage';
import { MarcasPage } from './pages/MarcasPage';
import { UsuariosPage } from './pages/UsuariosPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrar" element={<RegistrarPage />} />

          <Route element={<RotaProtegida />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/carros" element={<CarrosPage />} />
              <Route path="/motos" element={<MotosPage />} />
              <Route path="/marcas" element={<MarcasPage />} />
              <Route element={<RotaAdmin />}>
                <Route path="/usuarios" element={<UsuariosPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
