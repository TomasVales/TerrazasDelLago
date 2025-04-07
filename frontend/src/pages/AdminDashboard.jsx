import { useEffect, useState, useRef } from 'react';

function AdminDashboard() {
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

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQzOTA5OTE2LCJleHAiOjE3NDM5OTYzMTZ9.jW1CV-JdL-znSCQS94f8M2woS4UTn0H-2w3vtwXmOrA';

    // 📦 Traer pedidos
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener pedidos');
            setOrders(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 📦 Traer productos
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/products', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Error al obtener productos');

            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                throw new Error('La respuesta de productos no es una lista válida.');
            }
        } catch (err) {
            console.error('Error al obtener productos:', err);
            setProducts([]);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders();
        } else {
            fetchProducts();
        }
    }, [activeTab]);

    // Manejar cambio de imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Solo se permiten imágenes (JPEG, PNG, WEBP)');
                return;
            }

            // Crear URL temporal para la vista previa
            const previewUrl = URL.createObjectURL(file);
            setNewProduct({
                ...newProduct,
                imageFile: file,
                imagePreview: previewUrl
            });
            setError(null);
        }
    };

    // Limpiar imagen seleccionada
    const clearImage = () => {
        if (newProduct.imagePreview) {
            URL.revokeObjectURL(newProduct.imagePreview);
        }
        setNewProduct({
            ...newProduct,
            imageFile: null,
            imagePreview: null
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // ➕ Crear o editar producto
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const url = editingProduct
            ? `http://localhost:3000/api/products/${editingProduct.id}`
            : `http://localhost:3000/api/products`;
        const method = editingProduct ? 'PUT' : 'POST';

        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('type', newProduct.type);
        formData.append('description', newProduct.description);

        if (newProduct.imageFile) {
            formData.append('image', newProduct.imageFile);
        }

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al guardar producto');

            // Limpiar el formulario
            clearImage();
            setNewProduct({
                name: '',
                price: '',
                description: '',
                type: '',
                imageFile: null,
                imagePreview: null
            });
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🗑 Eliminar producto
    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Error al eliminar producto');
            fetchProducts();
        } catch (err) {
            console.error('Error al eliminar producto:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cancelar edición
    const cancelEdit = () => {
        clearImage();
        setEditingProduct(null);
        setNewProduct({
            name: '',
            price: '',
            description: '',
            type: '',
            imageFile: null,
            imagePreview: null
        });
    };

    // Cargar datos del producto a editar
    const loadProductToEdit = (product) => {
        setEditingProduct(product);
        setNewProduct({
            ...product,
            imageFile: null,
            imagePreview: product.image || null
        });
    };

    return (
        <div style={{
            padding: '2rem',
            fontFamily: 'sans-serif',
            background: '#121212',
            color: '#eee',
            minHeight: '100vh'
        }}>
            <h1 style={{
                fontSize: '2.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <span>Admin Dashboard</span>
                {loading && <span style={{ fontSize: '1rem' }}>Cargando...</span>}
            </h1>

            {error && (
                <div style={{
                    background: '#ff4444',
                    color: 'white',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '5px'
                }}>
                    {error}
                </div>
            )}

            {/* Navegación por pestañas */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                borderBottom: '1px solid #333',
                paddingBottom: '0.5rem'
            }}>
                <button
                    onClick={() => setActiveTab('products')}
                    style={{
                        background: activeTab === 'products' ? '#4fc3f7' : 'transparent',
                        color: activeTab === 'products' ? '#121212' : '#eee',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Productos
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        background: activeTab === 'orders' ? '#81c784' : 'transparent',
                        color: activeTab === 'orders' ? '#121212' : '#eee',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Pedidos
                </button>
            </div>

            {activeTab === 'orders' ? (
                <>
                    <h2 style={{ color: '#81c784', marginBottom: '1.5rem' }}>Gestión de Pedidos</h2>

                    {orders.length === 0 ? (
                        <p>No hay pedidos registrados</p>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gap: '1rem',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                        }}>
                            {orders.map((order) => (
                                <div key={order.id} style={{
                                    background: '#1e1e1e',
                                    padding: '1.5rem',
                                    borderRadius: '10px',
                                    border: '1px solid #333'
                                }}>
                                    <h3 style={{
                                        color: '#81c784',
                                        marginTop: 0,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span>Pedido #{order.id}</span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            background: order.status === 'completed' ? '#81c784' :
                                                order.status === 'cancelled' ? '#ff4444' : '#ffb74d',
                                            color: '#121212',
                                            padding: '0.3rem 0.6rem',
                                            borderRadius: '20px'
                                        }}>
                                            {order.status === 'completed' ? 'Completado' :
                                                order.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                                        </span>
                                    </h3>
                                    <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                    <p><strong>Cliente:</strong> {order.User?.name || order.User?.email || 'Anónimo'}</p>
                                    <p><strong>Total:</strong> ${order.total?.toFixed(2) || '0.00'}</p>
                                    <p><strong>Dirección:</strong> {order.address || 'No especificada'}</p>

                                    <div style={{ marginTop: '1rem' }}>
                                        <h4 style={{ marginBottom: '0.5rem' }}>Productos:</h4>
                                        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                            {order.OrderItems?.map((item, i) => (
                                                <li key={i} style={{ marginBottom: '0.3rem' }}>
                                                    {item.Product?.name || 'Producto'} - {item.quantity} x ${item.price?.toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <h2 style={{ color: '#4fc3f7', marginBottom: '1.5rem' }}>Gestión de Productos</h2>

                    {/* Formulario de productos */}
                    <div style={{
                        background: '#1e1e1e',
                        padding: '1.5rem',
                        borderRadius: '10px',
                        marginBottom: '2rem',
                        border: '1px solid #333'
                    }}>
                        <h3 style={{ marginTop: 0, color: editingProduct ? '#ffb74d' : '#4fc3f7' }}>
                            {editingProduct ? `Editando: ${editingProduct.name}` : 'Agregar nuevo producto'}
                        </h3>

                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div style={{
                                display: 'grid',
                                gap: '1.5rem',
                                gridTemplateColumns: '1fr 1fr',
                                marginBottom: '1.5rem'
                            }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: '#aaa'
                                    }}>Nombre *</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre del producto"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: '#2a2a2a',
                                            border: '1px solid #333',
                                            color: '#eee',
                                            borderRadius: '5px'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: '#aaa'
                                    }}>Precio *</label>
                                    <input
                                        type="number"
                                        placeholder="Precio"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        required
                                        step="0.01"
                                        min="0"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: '#2a2a2a',
                                            border: '1px solid #333',
                                            color: '#eee',
                                            borderRadius: '5px'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gap: '1.5rem',
                                gridTemplateColumns: '1fr 1fr',
                                marginBottom: '1.5rem'
                            }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: '#aaa'
                                    }}>Tipo *</label>
                                    <select
                                        value={newProduct.type}
                                        onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: '#2a2a2a',
                                            border: '1px solid #333',
                                            color: '#eee',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        <option value="comida">Comida</option>
                                        <option value="bebida">Bebida</option>
                                        <option value="postre">Postre</option>
                                        <option value="snack">Snack</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: '#aaa'
                                    }}>Imagen {!editingProduct && '(Opcional)'}</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            background: '#2a2a2a',
                                            border: '1px solid #333',
                                            color: '#eee',
                                            borderRadius: '5px'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: '#aaa'
                                }}>Descripción</label>
                                <textarea
                                    placeholder="Descripción del producto"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#2a2a2a',
                                        border: '1px solid #333',
                                        color: '#eee',
                                        borderRadius: '5px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            {/* Vista previa de la imagen */}
                            {newProduct.imagePreview ? (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: '#aaa'
                                    }}>Vista previa:</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img
                                            src={newProduct.imagePreview}
                                            alt="Vista previa"
                                            style={{
                                                maxWidth: '200px',
                                                maxHeight: '200px',
                                                borderRadius: '5px',
                                                border: '1px solid #444'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={clearImage}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'transparent',
                                                color: '#ff4444',
                                                border: '1px solid #ff4444',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Cambiar imagen
                                        </button>
                                    </div>
                                </div>
                            ) : editingProduct?.image ? (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: '#aaa'
                                    }}>Imagen actual:</label>
                                    <img
                                        src={editingProduct.image}
                                        alt="Imagen actual"
                                        style={{
                                            maxWidth: '200px',
                                            maxHeight: '200px',
                                            borderRadius: '5px',
                                            border: '1px solid #444'
                                        }}
                                    />
                                </div>
                            ) : (
                                <div style={{
                                    marginBottom: '1.5rem',
                                    padding: '1rem',
                                    background: '#2a2a2a',
                                    borderRadius: '5px',
                                    border: '1px dashed #444'
                                }}>
                                    <p style={{ color: '#aaa', margin: 0 }}>No se ha seleccionado ninguna imagen</p>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: '#4fc3f7',
                                        color: '#121212',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
                                </button>

                                {editingProduct && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            background: 'transparent',
                                            color: '#ff4444',
                                            border: '1px solid #ff4444',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Lista de productos */}
                    <h3 style={{ marginBottom: '1rem' }}>Lista de Productos ({products.length})</h3>

                    {products.length === 0 ? (
                        <p>No hay productos registrados</p>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gap: '1.5rem',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
                        }}>
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    style={{
                                        background: '#1e1e1e',
                                        padding: '1.5rem',
                                        borderRadius: '10px',
                                        border: '1px solid #333',
                                        transition: 'transform 0.2s',
                                        ':hover': {
                                            transform: 'translateY(-5px)'
                                        }
                                    }}
                                >
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{
                                                width: '100%',
                                                height: '180px',
                                                objectFit: 'cover',
                                                borderRadius: '5px',
                                                marginBottom: '1rem',
                                                border: '1px solid #444'
                                            }}
                                        />
                                    )}

                                    <h4 style={{
                                        color: '#4fc3f7',
                                        marginTop: 0,
                                        marginBottom: '0.5rem'
                                    }}>
                                        {product.name}
                                    </h4>

                                    <p style={{ margin: '0.5rem 0' }}>
                                        <strong style={{ color: '#aaa' }}>Precio:</strong> ${parseFloat(product.price).toFixed(2)}
                                    </p>

                                    <p style={{ margin: '0.5rem 0' }}>
                                        <strong style={{ color: '#aaa' }}>Tipo:</strong> {product.type || 'Sin tipo'}
                                    </p>

                                    {product.description && (
                                        <p style={{
                                            margin: '0.5rem 0',
                                            color: '#ccc',
                                            fontSize: '0.9rem'
                                        }}>
                                            {product.description}
                                        </p>
                                    )}

                                    <div style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        marginTop: '1rem'
                                    }}>
                                        <button
                                            onClick={() => loadProductToEdit(product)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#ffb74d',
                                                color: '#121212',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AdminDashboard;