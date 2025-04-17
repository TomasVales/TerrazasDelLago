import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import SidebarAdmin, { SidebarItem, SidebarItemLogout } from '../components/Admin/SiderbarAdmin';
import LayoutAdmin from '../components/Admin/LayoutAdmin';
import ProdAdmin from '../components/Admin/ProdAdmin';
import OrderAdmin from '../components/Admin/OrderAdmin';
import UserAdmin from '../components/Admin/UserAdmin';
import HeaderAdmin from '../components/Admin/HeaderAdmin';
import UserProfile from '../components/Admin/UserProfile';
import { FaSignOutAlt } from "react-icons/fa";


import { ShoppingCart, LayoutDashboard, Package, Users, User } from "lucide-react";

function AdminDashboard() {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeItem, setActiveItem] = useState('Home');
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        type: '',
        imageFile: null,
        imagePreview: null
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('products');
    const fileInputRef = useRef(null);
    const BACKEND_URL = 'http://localhost:3000';

    useEffect(() => {
        if (activeTab === 'orders') fetchOrders();
        else fetchProducts();
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/products`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            const previewUrl = URL.createObjectURL(file);
            setNewProduct(prev => ({ ...prev, imageFile: file, imagePreview: previewUrl }));
            setError(null);
        } else {
            setError('Solo se permiten imágenes (JPEG, PNG, WEBP)');
        }
    };

    const clearImage = () => {
        if (newProduct.imagePreview) URL.revokeObjectURL(newProduct.imagePreview);
        setNewProduct(prev => ({ ...prev, imageFile: null, imagePreview: null }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = editingProduct
            ? `${BACKEND_URL}/api/products/${editingProduct.id}`
            : `${BACKEND_URL}/api/products`;
        const method = editingProduct ? 'PUT' : 'POST';
        const formData = new FormData();

        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('type', newProduct.type);
        formData.append('description', newProduct.description);
        if (newProduct.imageFile) formData.append('image', newProduct.imageFile);

        try {
            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${user?.token}` },
                body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            fetchProducts();
            cancelEdit();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este producto?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            if (!res.ok) throw new Error('Error al eliminar producto');
            fetchProducts();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        clearImage();
        setEditingProduct(null);
        setNewProduct({ name: '', price: '', description: '', type: '', imageFile: null, imagePreview: null });
    };

    const loadProductToEdit = (product) => {
        setEditingProduct(product);
        setNewProduct({
            ...product,
            imageFile: null,
            imagePreview: product.image ? `${BACKEND_URL}${product.image}?ts=${Date.now()}` : null
        });
    };


    const LogoutButton = () => (
        <button
        onClick={logout}
        className=''
      >
        Logout
      </button>
    );

    return (
        <div className='flex h-screen overflow-hidden'>               
                <SidebarAdmin setActiveItem={setActiveItem}>
                    <SidebarItem icon={<LayoutDashboard size={20} />} text="Home"
                        active={activeItem === 'Home'}
                        onClick={() => setActiveItem('Home')} />
                    <SidebarItem icon={<Package size={20} />} text="Productos"
                        active={activeItem === 'Productos'}
                        onClick={() => setActiveItem('Productos')} />
                    <SidebarItem icon={<ShoppingCart size={20} />} text="Pedidos"
                        active={activeItem === 'Pedidos'}
                        onClick={() => setActiveItem('Pedidos')} />
                    <SidebarItem icon={<Users size={20} />} text="Usuarios"
                        active={activeItem === 'Usuarios'}
                        onClick={() => setActiveItem('Usuarios')} />
                    <SidebarItem icon={<User size={20} />} text="Perfil"
                        active={activeItem === 'Perfil'}
                        onClick={() => setActiveItem('Perfil')} />
                        <hr className='my-2 border-gray-400'/>
                    <SidebarItemLogout  icon={<FaSignOutAlt size={20} className='text-red-500' />} text="Desloguear"
                        onClick={() => logout()} />
                </SidebarAdmin>
            <div className='flex flex-col flex-1 overflow-auto '>
            <HeaderAdmin />
            <div className='flex-1 bg-gray-50 p-4 sy:px-2'>                
                {activeItem === 'Home' && <LayoutAdmin />}
                {activeItem === 'Productos' && <ProdAdmin />}
                {activeItem === 'Pedidos' && <OrderAdmin />}
                {activeItem === 'Usuarios' && <UserAdmin />}
                {activeItem === 'Perfil' && <UserProfile />}
            </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
