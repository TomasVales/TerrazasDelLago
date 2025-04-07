import { useEffect, useState } from 'react';

const BACKEND_URL = 'http://localhost:3000';

function MainUserPage() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    // Obtener productos
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/products`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || 'Error al obtener productos');

                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error al obtener productos:', err);
                setError(err.message);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>Bienvenido a Terrazas del Lago 🏡</h1>
            <p style={{ textAlign: 'center' }}>
                Gracias por registrarte. Pronto vas a poder hacer pedidos desde esta misma página.
            </p>

            <section style={{ marginTop: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Productos disponibles</h2>

                {error && (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '2rem'
                }}>
                    {products.map(product => (
                        <div
                            key={product.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                padding: '1rem',
                                background: '#f9f9f9'
                            }}
                        >
                            {product.image && (
                                <img
                                    src={`${BACKEND_URL}${product.image}`}
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: '160px',
                                        objectFit: 'cover',
                                        borderRadius: '5px',
                                        marginBottom: '1rem'
                                    }}
                                />
                            )}
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h3>
                            <p style={{ margin: '0.5rem 0' }}>{product.description}</p>
                            <p style={{ fontWeight: 'bold' }}>Precio: ${parseFloat(product.price).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default MainUserPage;
