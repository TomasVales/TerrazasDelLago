import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

const Search = ({ addToCart, nav }) => {  // Añadido nav aquí
    const [searchQuery, setSearchQuery] = useState('');
    const [productos, setProductos] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const BASE_URL = 'http://localhost:3000';

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${BASE_URL}/api/products`);
                if (!response.ok) throw new Error('Error al cargar productos');
                const data = await response.json();
                setProductos(data);
            } catch (err) {
                setError(err.message);
                console.error('Fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setShowResults(value.length > 0);
    };

    const handleAddToCart = (producto) => {
        addToCart({
            ...producto,
            precio: parseFloat(producto.price),
            imagen: producto.image.startsWith('http')
                ? producto.image
                : `${BASE_URL}${producto.image}`
        });
        setSearchQuery('');
        setShowResults(false);
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    const filteredProducts = productos.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`relative w-full max-w-md mx-auto ${nav ? 'z-0' : 'z-50'}`}>
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <AiOutlineSearch className="text-gray-500 mr-2" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full bg-transparent focus:outline-none placeholder-gray-400"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.length > 0 && setShowResults(true)}
                    disabled={isLoading || nav} // deshabilitar al abrir menú
                />
            </div>

            {isLoading && searchQuery.length > 0 && !nav && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg p-4 text-center text-gray-500">
                    Cargando productos...
                </div>
            )}

            {error && !nav && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg p-4 text-center text-red-500">
                    Error: {error}
                </div>
            )}

            {showResults && !isLoading && !error && !nav && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(producto => (
                            <div
                                key={producto.id}
                                className="p-3 border-b hover:bg-gray-50 flex items-center gap-3"
                            >
                                <div className="flex-shrink-0">
                                    <img
                                        src={
                                            producto.image.startsWith('http')
                                                ? producto.image
                                                : `${BASE_URL}${producto.image}`
                                        }
                                        alt={producto.name}
                                        className="w-12 h-12 object-cover rounded-md"
                                        onError={(e) => {
                                            e.target.src = `${BASE_URL}/placeholder-image.jpg`;
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{producto.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{producto.description}</p>
                                    <p className="text-emerald-600 font-semibold">
                                        ${parseFloat(producto.price).toLocaleString('es-AR')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(producto)}
                                    className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full text-sm transition-colors whitespace-nowrap"
                                >
                                    Agregar
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No se encontraron productos
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
