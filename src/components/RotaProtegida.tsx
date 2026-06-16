import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { estaLogado } from '../services/auth';

export function RotaProtegida() {
  if (!estaLogado()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export function RotaAdmin() {
  const { ehAdmin } = useAuth();
  if (!ehAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
