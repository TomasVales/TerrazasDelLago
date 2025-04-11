import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
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

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>

            <div className="mb-4 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2 mr-2 ${activeTab === 'products' ? 'bg-blue-400 text-gray-900' : 'bg-gray-800 text-white'} rounded-t`}
                >Productos</button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 ${activeTab === 'orders' ? 'bg-green-400 text-gray-900' : 'bg-gray-800 text-white'} rounded-t`}
                >Pedidos</button>
            </div>

            {error && (
                <div className="bg-red-600 text-white p-4 rounded mb-4">{error}</div>
            )}

            {activeTab === 'products' ? (
                <div className="space-y-6">
                    <div className="bg-gray-800 p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Nombre" required className="bg-gray-700 p-2 rounded" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                            <input type="number" placeholder="Precio" required className="bg-gray-700 p-2 rounded" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                            <select required className="bg-gray-700 p-2 rounded" value={newProduct.type} onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}>
                                <option value="Carnes">Carnes</option>
                                <option value="Pastas">Pastas</option>
                                <option value="Minutas">Minutas</option>
                                <option value="Vinos">Vinos</option>
                                <option value="Bebidas">Bebidas</option>
                                <option value="Burguers">Burguers</option>
                            </select>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="bg-gray-700 p-2 rounded" />
                            <textarea placeholder="Descripción" rows={3} className="bg-gray-700 p-2 rounded col-span-full" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}></textarea>
                            <div className="flex gap-4 mt-2 col-span-full">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-semibold">
                                    {editingProduct ? 'Actualizar' : 'Agregar'}
                                </button>
                                {editingProduct && <button type="button" onClick={cancelEdit} className="text-red-500 font-semibold">Cancelar</button>}
                            </div>
                        </form>
                    </div>

                    <div className="bg-gray-800 p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Lista de productos</h2>
                        <div className="overflow-auto">
                            <table className="table-auto w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="p-2">#</th>
                                        <th className="p-2">Imagen</th>
                                        <th className="p-2">Nombre</th>
                                        <th className="p-2">Descripción</th>
                                        <th className="p-2">Precio</th>
                                        <th className="p-2">Tipo</th>
                                        <th className="p-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={product.id} className="border-t border-gray-700">
                                            <td className="p-2 text-gray-400">#{index + 1}</td>
                                            <td className="p-2">
                                                <img src={`${BACKEND_URL}${product.image}`} alt={product.name} className="w-12 h-12 object-cover rounded" onError={(e) => e.target.src = '/placeholder.jpg'} />
                                            </td>
                                            <td className="p-2">{product.name}</td>
                                            <td className="p-2 text-sm text-gray-400">{product.description?.slice(0, 50)}...</td>
                                            <td className="p-2 text-blue-400">${parseFloat(product.price).toFixed(2)}</td>
                                            <td className="p-2 text-sm">{product.type}</td>
                                            <td className="p-2">
                                                <div className="flex gap-2">
                                                    <button onClick={() => loadProductToEdit(product)} className="bg-yellow-400 text-black px-3 py-1 rounded">Editar</button>
                                                    <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {orders.map(order => (
                        <div key={order.id} className="bg-gray-800 p-4 rounded shadow">
                            <h3 className="text-green-400 font-semibold mb-2">Pedido #{order.id}</h3>
                            <p><span className="text-gray-400">Cliente:</span> {order.User?.name || 'Anónimo'}</p>
                            <p><span className="text-gray-400">Total:</span> ${order.total}</p>
                            <p><span className="text-gray-400">Estado:</span> {order.status}</p>
                            <p><span className="text-gray-400">Fecha:</span> {new Date(order.createdAt).toLocaleString()}</p>
                            <p className="mt-2 text-sm text-gray-400">{order.address}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
