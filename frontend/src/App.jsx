import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import { useState } from 'react';

import './App.css'

import MenuNav from './assets/MenuNav';
import Cartel from './assets/Cartel';
import Cards from './assets/Cards';
import Comida from './assets/Comida';

function App() {
  const { user, loading, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) return <p style={{ padding: '2rem' }}>Cargando...</p>;

  const LogoutButton = () => (
    <button
      onClick={logout}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        padding: '0.5rem 1rem',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Logout
    </button>
  );

  if (user) {
    return user.role === 'admin' ? (
      <AdminDashboard />
    ) : (
      <div>
        <LogoutButton />
        <MenuNav />
        <Cartel />
        <Cards />
        <Comida />
      </div>
    );
  }

  return showRegister ? (
    <Register goBack={() => setShowRegister(false)} />
  ) : (
    <Login onRegisterClick={() => setShowRegister(true)} />
  );
}

export default App;
