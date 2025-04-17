import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import './App.css';

import Menu from './pages/Menu';
import Cartel from './components/Cartel';
import Cards from './components/Cards';
import Comida from './components/Comida';
import { ToastContainer } from 'react-toastify'
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
      className='fixed top-4 right-4 z-[9999] px-4 py-2 bg-red-600 hover:bg-red-700 text-white border-none rounded-[5px] cursor-pointer'
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
        <Menu
          cartItems={cartItems}
          setCartItems={setCartItems}
          setMostrarTransferencia={setMostrarTransferencia}
          logout={logout}
        />
        <Cartel />
        <Cards />
        <ToastContainer 
        limit={3}
        autoClose={2000}    
        />  
        <Comida addToCart={addToCart} />
      </div>
    );
  }

  return <Auth />;
}

export default App;
