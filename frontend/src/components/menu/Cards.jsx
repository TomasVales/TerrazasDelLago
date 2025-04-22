import React, { useEffect, useState } from 'react';
import { Slide, toast } from 'react-toastify';

const BACKEND_URL = 'http://localhost:3000';

const Cards = ({ cartItems, setCartItems }) => {
    const [featured, setFeatured] = useState([]);

    const notify = () => {
        toast.success("Producto Realizado", {
            transition: Slide,
        });
    };

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/products/featured`);
                const data = await res.json();
                setFeatured(data.slice(0, 3));
            } catch (err) {
                console.error('Error al obtener productos destacados:', err);
            }
        };
        fetchFeatured();
    }, []);

    const handleAddToCart = (product) => {
        const existing = cartItems.find(item => item.id === product.id);
        if (existing) {
            setCartItems(prev =>
                prev.map(item =>
                    item.id === product.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
        } else {
            setCartItems(prev => [
                ...prev,
                {
                    id: product.id,
                    nombre: product.name,
                    precio: product.price,
                    imagen: `${BACKEND_URL}${product.image}`,
                    cantidad: 1
                }
            ]);
        }
        notify();
    };

    return (
        <div className='max-w-screen mx-auto px-6 py-2 font-montserrat'>
            <div className="text-center">
                <h1 className="relative inline-block text-emerald-700 font-bold text-4xl my-1 py-6 after:content-[''] after:block after:h-[4px] after:bg-emerald-700 after:w-3/4 after:mx-auto after:mt-2">
                    Destacado
                </h1>
            </div>

            <div className='grid md:grid-cols-3 gap-6'>
                {featured.map((product) => (
                    <div key={product.id} className='rounded-xl relative'>
                        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white pl-4'>
                            <p className='relative inline-block font-medium text-2xl px-2 pt-4 after:content-[""] after:block after:h-[3px] after:bg-emerald-700 after:w-3/4 after:absolute after:-bottom-1 after:left-0'>
                                {product.name}
                            </p>
                            <p className='px-2 py-2 font-medium'>
                                ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </p>
                            <button
                                className='border-1 p-4 py-2 rounded-[16px] border-none bg-gray-200 text-black mx-2 absolute bottom-4 hover:scale-105 duration-300 cursor-pointer'
                                onClick={() => handleAddToCart(product)}
                            >
                                Ordenar
                            </button>
                        </div>
                        <img
                            className='max-h-[180px] md:max-h-[200px] w-full object-cover rounded-xl'
                            src={`${BACKEND_URL}${product.image}`}
                            alt={product.name}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cards;
