import React, { useEffect, useState } from 'react';
import { Slide, toast } from 'react-toastify';

const tiposDisponibles = ['Burguers', 'Carnes', 'Pastas', 'Minutas', 'Vinos', 'Bebidas'];

const Comida = ({ addToCart }) => {
  const [productos, setProductos] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState('');

  const notify = () => {
    toast.success("Pedido Realizado", {
      transition: Slide,
    });
  };

  useEffect(() => {
    const fetchProductos = async () => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/products`;
      console.log('🌍 Fetching productos desde:', url);
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('✅ Productos recibidos:', data);
        setProductos(data);
      } catch (error) {
        console.error('❌ Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const productosFiltrados = selectedTipo
    ? productos.filter((producto) => producto.type === selectedTipo)
    : productos;

  return (
    <div className='max-w-screen m-auto px-4 pb-10 font-montserrat'>
      <div className='text-center'>
        <h1 className="relative inline-block text-emerald-700 font-bold text-4xl my-1 py-6 after:content-[''] after:block after:h-[4px] after:bg-emerald-700 after:w-3/4 after:mx-auto after:mt-2">
          Menú de Opciones
        </h1>
      </div>

      {/* Filtros */}
      <div className='flex flex-col lg:flex-row justify-between pt-2'>
        <div className='w-full lg:w-auto'>
          <p className='pl-1 text-3xl font-bold text-gray-700'>Filtro Comidas</p>
          <div className='flex flex-wrap gap-2 lg:justify-between pt-2'>
            <button
              onClick={() => setSelectedTipo('')}
              className={`m-1 border py-2 px-3 rounded-[14px] cursor-pointer ${selectedTipo === '' ? 'bg-emerald-700 text-white' : 'border-[#208850] text-emerald-700 hover:bg-emerald-700 hover:text-white'
                }`}
            >
              Todos
            </button>
            {tiposDisponibles.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setSelectedTipo(tipo)}
                className={`m-1 border py-2 px-3 rounded-[14px] cursor-pointer ${selectedTipo === tipo ? 'bg-emerald-700 text-white' : 'border-[#208850] text-[#208850] hover:bg-emerald-700 hover:text-white'
                  }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Productos dinámicos */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-5'>
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className='shadow-lg hover:scale-105 duration-300 rounded-lg'>
            <img
              className='w-full h-[200px] object-cover rounded-t-lg'
              src={`${import.meta.env.VITE_BACKEND_URL}${producto.image}`}
              alt={producto.name}
            />
            <div className='flex flex-col justify-between px-3 py-4 gap-2'>
              <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-center md:text-start'>
                <p className='font-bold'>{producto.name}</p>
                <span className='bg-gradient-to-r from-emerald-700 to-green-600 text-white font-medium p-1 rounded-full'>
                  ${parseFloat(producto.price).toLocaleString('es-AR')}
                </span>
              </div>
              <button
                onClick={() => {
                  addToCart({
                    id: producto.id,
                    nombre: producto.name,
                    precio: parseFloat(producto.price),
                    imagen: `${import.meta.env.VITE_BACKEND_URL}${producto.image}`
                  });
                  notify();
                }}
                className='bg-emerald-700 text-white py-2 px-3 rounded-lg hover:bg-emerald-800 transition-all cursor-pointer'
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comida;
