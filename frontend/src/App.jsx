import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MainUserPage from './pages/MainUserPage';
import AdminDashboard from './pages/AdminDashboard';
import { useState } from 'react';

function App() {
  const { user, loading, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false); // ✅ nuevo estado

  if (loading) return <p style={{ padding: '2rem' }}>Cargando...</p>;

  // ✅ Si está logueado
  if (user) {
    return (
      <div>
        <button onClick={logout} style={{ position: 'absolute', top: 10, right: 10 }}>Cerrar sesión</button>
        {user.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <MainUserPage />
        )}
      </div>
    );
  }

  // ✅ Si no está logueado
  return showRegister ? (
    <Register goBack={() => setShowRegister(false)} />
  ) : (
    <Login onRegisterClick={() => setShowRegister(true)} />
  );
}

export default App;
