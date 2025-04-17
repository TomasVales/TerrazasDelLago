import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu, AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
import { BsFillCartFill } from 'react-icons/bs';
import { TbLocation, TbTruckDelivery } from 'react-icons/tb';
import { FaSignOutAlt, FaWhatsapp } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useAuth } from '../context/AuthContext';

const Menu = ({ cartItems, setCartItems, setMostrarTransferencia, logout }) => {
    const [nav, setNav] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user } = useAuth();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [address, setAddress] = useState('');

    const increase = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
            )
        );
    };

    const decrease = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id && item.cantidad > 1
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const handleConfirmarOrden = async () => {
        const token = user?.token;

        if (!token) {
            alert("No estás logueado. Por favor, iniciá sesión.");
            return;
        }

        if (!paymentMethod || !deliveryMethod) {
            alert("Por favor seleccioná una forma de pago y un método de entrega.");
            return;
        }

        if (paymentMethod === 'transferencia') {
            setMostrarTransferencia(true);
            return;
        }

        if (deliveryMethod === 'envio' && !address.trim()) {
            alert("Por favor ingresá la dirección de entrega.");
            return;
        }

        const direccionFinal = deliveryMethod === 'envio' ? address : 'Retiro en el local';

        try {
            const response = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        productId: item.id,
                        quantity: item.cantidad
                    })),
                    address: direccionFinal,
                    paymentMethod,
                    deliveryMethod,
                    notes: `Pedido generado desde frontend (${paymentMethod} - ${deliveryMethod})`
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert("Orden creada con éxito �");
            setCartItems([]);
            setAddress('');
            setPaymentMethod('');
            setDeliveryMethod('');
            setIsCartOpen(false);
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo completar la orden.");
        }
    };

    return (
        <div className='max-w-screen flex justify-between items-center p-4 overflow-x-hidden'>
            {/* Lado izquierdo */}
            <div className='flex items-center'>
                <div onClick={() => setNav(!nav)} className='cursor-pointer pt-1'>
                    <AiOutlineMenu color='[#208850]' size={30} />
                </div>
                <h1 className='text-xl sm:text-2xl md:text-3xl px-2 sm:px-5'>
                    <span className='text-emerald-600 font-bold font-lato'>Terrazas del Lago</span>
                </h1>
            </div>

            {/* Barra de búsqueda */}
            <div className='bg-gray-300 rounded-full flex items-center px-2 w-full max-w-[600px] mx-2'>
                <AiOutlineSearch size={25} />
                <input className='bg-transparent p-2 focus:outline-none w-full' type="text" placeholder='Buscar platos' />
            </div>

            {/* Botón carrito */}
            <button
                className='bg-emerald-700 rounded-full text-white flex items-center px-3 py-2 hover:scale-105 duration-300 cursor-pointer'
                onClick={() => setIsCartOpen(true)}
            >
                <BsFillCartFill size={20} className='lg:mr-2 justify-center' /> 
                <span className='hidden md:inline'>Carrito</span>
            </button>

            {/* Carrito */}
            {isCartOpen && (
                <>
                    <div
                        className='bg-black/80 fixed w-full h-screen z-10 top-0 right-0'
                        onClick={() => setIsCartOpen(false)}
                    ></div>

                    <div className='
                    md:w-[630px] w-[95vw]
                    fixed p-4 rounded-lg top-4 bottom-4 left-1/2 -translate-x-1/2 
                    bg-white z-10 duration-300 overflow-y-auto custom-scroll'>
                        <div className='flex justify-between items-center p-4 border-b border-gray-600 '>
                            <h2 className='text-2xl text-emerald-600 font-bold'>Carrito</h2>
                            <button
                                className='text-gray-500 hover:text-black text-xl cursor-pointer'
                                onClick={() => setIsCartOpen(false)}><AiOutlineClose />
                            </button>
                        </div>

                        {/* Productos dinámicos */}
                        <div className='flex flex-col'>
                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">El carrito está vacío.</p>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className='flex items-center gap-4 w-full border-b mx-3 py-2'>
                                        <img className="w-[60px] h-[60px] object-cover rounded-sm" src={item.imagen} alt={item.nombre} />
                                        <p className='font-medium text-sm sm:text-base'>{item.nombre}</p>

                                        <div className='rounded-[10px] ml-auto mr-[20px] flex items-center gap-2'>
                                            <button
                                                onClick={() => decrease(item.id)}
                                                className='w-[25px] rounded-[10px] border border-gray-500 cursor-pointer hover:bg-[#208850] bg-black/14 hover:scale-95 duration-100'
                                            >
                                                <span className='font-semibold text-black'>-</span>
                                            </button>

                                            <input
                                                readOnly
                                                value={item.cantidad}
                                                className='max-w-[40px] focus:outline-none text-center bg-white text-black border border-gray-400 rounded-sm'
                                                type="text"
                                            />

                                            <button
                                                onClick={() => increase(item.id)}
                                                className='w-[25px] bg-black/14 rounded-[10px] border border-gray-500 cursor-pointer hover:bg-[#208850] hover:scale-105 duration-100'
                                            >
                                                <span className='font-semibold text-black'>+</span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className='mr-[9px] cursor-pointer hover:scale-105 duration-300'
                                        >
                                            <GoTrash className="text-[20px]" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Resumen */}
                        <div className='bg-gray-300 my-[20px] p-[20px] rounded-2xl'>
                            <p className='font-semibold text-[22px] mb-4'>Resumen del Pedido</p>

                            {cartItems.map((item) => (
                                <div key={item.id} className='flex justify-between items-center mb-2 text-sm'>
                                    <p className='text-gray-800'>{item.nombre} <span className='text-gray-600'>(x{item.cantidad})</span></p>
                                    <p className='font-medium text-gray-900'>
                                        ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                                    </p>
                                </div>
                            ))}

                            <hr className='my-4 border-gray-500' />

                            <div className='flex justify-between font-semibold text-lg'>
                                <p>Total</p>
                                <p>${total.toLocaleString('es-AR')}</p>
                            </div>
                        </div>

                        {/* Opciones de pago y entrega */}
                        <div className="my-6 space-y-4 bg-gray-100 p-4 rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-700">Forma de pago</h3>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="payment" value="efectivo"
                                        checked={paymentMethod === 'efectivo'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="accent-[#208850]"
                                    />
                                    Efectivo
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="payment" value="transferencia"
                                        checked={paymentMethod === 'transferencia'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="accent-[#208850]"
                                    />
                                    Transferencia
                                </label>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-700 mt-4">Método de entrega</h3>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="delivery" value="retiro"
                                        checked={deliveryMethod === 'retiro'}
                                        onChange={(e) => setDeliveryMethod(e.target.value)}
                                        className="accent-[#208850]"
                                    />
                                    Retiro en el local
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="delivery" value="envio"
                                        checked={deliveryMethod === 'envio'}
                                        onChange={(e) => setDeliveryMethod(e.target.value)}
                                        className="accent-[#208850]"
                                    />
                                    Envío a domicilio
                                </label>
                            </div>

                            {deliveryMethod === 'envio' && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Av. Siempreviva 742"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#208850]"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {/* Botones */}
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <button
                                onClick={handleConfirmarOrden}
                                className='py-2 px-5 cursor-pointer rounded-[10px] text-emerald-600 bg-white hover:bg-[#208850] hover:text-white border flex-1'
                            >
                                Completar Orden
                            </button>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className='py-2 px-5 cursor-pointer border text-gray-400 border-gray-400 rounded-[10px] hover:bg-gray-700/45 hover:text-white flex-1'>
                                Volver al menú
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Menú lateral */}
            {nav && <div className='bg-black/80 fixed w-full h-screen z-10 top-0 left-0'></div>}
            <div className={nav 
            ? 'fixed top-0 left-0 w-[300px] h-full bg-white z-10 duration-300 font-montserrat' 
            : 'fixed top-0 left-[-100%] w-[300px] h-full bg-white z-10 duration-300 font-montserrat'
            }>
                <AiOutlineClose onClick={() => setNav(!nav)} size={30} className='absolute right-4 top-4 cursor-pointer' />
                <h2 className='text-2xl p-4'><span className='text-emerald-700 font-bold'>Terrazas Del Lago</span></h2>
                <nav>
                    <ul className='flex flex-col p-4 text-gray-800'>
                        <li
                            className='text-xl py-4 flex gap-1 cursor-pointer hover:text-emerald-600 transition-all'
                            onClick={() => {
                                setNav(false);
                                setIsCartOpen(true);
                            }}
                        >
                            <AiOutlineShoppingCart size={23} className='mr-4' />
                            Carrito
                        </li>
                        <li className='text-xl py-4 flex gap-1'><TbTruckDelivery size={25} className='mr-4' />Ordenes</li>
                        <li className='text-xl py-4 flex gap-1'><TbLocation size={25} className='mr-4' />Direcciones</li>
                        <li className='text-xl py-4 flex gap-1 cursor-pointer hover:text-emerald-600 transition-all'>
                            <a
                                href="https://wa.me/5491151393916"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='flex items-center'
                            >
                                <FaWhatsapp size={25} className='mr-4' /> WhatsApp
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className='absolute bottom-4 left-0 right-0 px-4'>
                    <button
                        onClick={() => {
                            logout();
                            setNav(false);
                        }}
                        className='w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer'
                    >
                        <FaSignOutAlt size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Menu;