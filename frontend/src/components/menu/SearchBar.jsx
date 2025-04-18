import React, { useState, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

const BASE_URL = 'http://localhost:3000';

const SearchBar = ({ setCartItems, cartItems }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/products`);
                const data = await res.json();
                setAllProducts(data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = allProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [searchTerm, allProducts]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prev, { ...product, cantidad: 1 }];
        });
    };

    return (
        <div className='relative bg-gray-300 rounded-full flex items-center px-2 w-full max-w-[600px] mx-2'>
            <AiOutlineSearch size={25} />
            <input
                className='bg-transparent p-2 focus:outline-none w-full'
                type="text"
                placeholder='Buscar platos'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {results.length > 0 && (
                <div className='absolute top-[110%] mt-2 w-full bg-white shadow-lg rounded-lg z-50 max-h-72 overflow-y-auto'>

                    {results.map(product => (
                        <div
                            key={product.id}
                            className='flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer'
                        >
                            <img
                                src={product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`}
                                alt={product.name}
                                className='w-10 h-10 object-cover rounded-md'
                            />
                            <div className='flex-1 mx-2'>
                                <p className='font-semibold'>{product.name}</p>
                                <p className='text-sm text-gray-500'>${product.price.toLocaleString('es-AR')}</p>
                            </div>
                            <button
                                className='bg-emerald-600 text-white px-2 py-1 rounded-md text-sm hover:bg-emerald-700'
                                onClick={() => addToCart({
                                    id: product.id,
                                    nombre: product.name,
                                    precio: product.price,
                                    imagen: product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`
                                })}
                            >
                                Añadir
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
