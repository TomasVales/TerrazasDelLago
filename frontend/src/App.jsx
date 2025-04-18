import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import Menu from './pages/Menu';
import Transferencia from './pages/Transferencia';
import Cartel from './components/Menu/Cartel';
import Cards from './components/Menu/Cards';
import Comida from './components/Menu/Comida';
import FooterMenu from './components/Menu/FooterMenu';
import { ToastContainer } from 'react-toastify';

import { useEffect, useState } from 'react';

function App() {
  const { user, loading, logout } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [mostrarTransferencia, setMostrarTransferencia] = useState(false);
  const navigate = useNavigate();

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

  // 🧭 Redirigir si user es admin y está en "/"
  useEffect(() => {
    if (!loading && user?.role === 'admin' && location.pathname === '/') {
      navigate('/admin');
    }
  }, [user, loading]);

  if (loading) return <p style={{ padding: '2rem' }}>Cargando...</p>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            mostrarTransferencia ? (
              <Transferencia onVolver={() => setMostrarTransferencia(false)} />
            ) : (
              <div>
                <Menu cartItems={cartItems} setCartItems={setCartItems} setMostrarTransferencia={setMostrarTransferencia} logout={logout} />
                <Cartel />
                <Cards />
                <ToastContainer limit={3} autoClose={2000} />
                <Comida addToCart={addToCart} />
                <FooterMenu />
              </div>
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/login"
        element={!user ? <Auth /> : <Navigate to={user.role === 'admin' ? "/admin" : "/"} />}
      />

      <Route
        path="/admin"
        element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
