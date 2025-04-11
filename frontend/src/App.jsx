import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import './App.css';

import MenuNav from './assets/MenuNav';
import Cartel from './assets/Cartel';
import Cards from './assets/Cards';
import Comida from './assets/Comida';
import Transferencia from './pages/Transferencia'; // ✅ Importamos la vista

import { useState } from 'react';

function App() {
  const { user, loading, logout } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [mostrarTransferencia, setMostrarTransferencia] = useState(false); // ✅ Estado para la pantalla de transferencia

  const addToCart = (product) => {
    const exists = cartItems.find(item => item.id === product.id);
    if (exists) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, cantidad: 1 }]);
    }
  };

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
    if (user.role === 'admin') return <AdminDashboard />;

    if (mostrarTransferencia) {
      return <Transferencia onVolver={() => setMostrarTransferencia(false)} />;
    }

    return (
      <div>
        <LogoutButton />
        <MenuNav
          cartItems={cartItems}
          setCartItems={setCartItems}
          setMostrarTransferencia={setMostrarTransferencia} // ✅ Pasamos la función
        />
        <Cartel />
        <Cards />
        <Comida addToCart={addToCart} />
      </div>
    );
  }

  return <Auth />;
}

export default App;
