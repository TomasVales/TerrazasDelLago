import React, { useEffect, useState } from 'react';

const tiposDisponibles = ['Burguers', 'Carnes', 'Pastas', 'Minutas', 'Vinos', 'Bebidas'];

const Comida = () => {
  const [productos, setProductos] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState(''); // Estado del filtro

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  // 🔍 Aplicar filtro si hay uno seleccionado
  const productosFiltrados = selectedTipo
    ? productos.filter((producto) => producto.type === selectedTipo)
    : productos;

  return (
    <div className='max-w-[1640px] m-auto px-4 py-7'>
      <h1 className='text-[#208850] font-bold text-4xl text-center'>Menu de Opciones</h1>

      {/* Filtros */}
      <div className='flex flex-col lg:flex-row justify-between pt-10'>

        {/* Filtro tipo */}
        <div className='max-w-[590px]'>
          <p className='font-bold text-gray-700'>Filtro Comidas</p>
          <div className='flex justify-between flex-wrap'>
            <button
              onClick={() => setSelectedTipo('')}
              className={`m-1 border py-2 px-3 rounded-[14px] ${selectedTipo === '' ? 'bg-[#208850] text-white' : 'border-[#208850] text-[#208850] hover:bg-[#208850] hover:text-white'
                }`}
            >
              Todos
            </button>
            {tiposDisponibles.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setSelectedTipo(tipo)}
                className={`m-1 border py-2 px-3 rounded-[14px] ${selectedTipo === tipo ? 'bg-[#208850] text-white' : 'border-[#208850] text-[#208850] hover:bg-[#208850] hover:text-white'
                  }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro precio (sin funcionalidad aún) */}
        <div>
          <p className='font-bold text-gray-700'>Filtro Precio</p>
          <div className='flex justify-between max-w-[270px] w-full'>
            {['$', '$$', '$$$', '$$$$'].map((price, i) => (
              <button
                key={i}
                className='m-1 cursor-pointer border-[#208850] border text-[#208850] py-2 px-3 rounded-[14px] hover:bg-[#208850] hover:text-white'
              >
                {price}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Productos dinámicos */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 pt-5'>
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className='shadow-lg hover:scale-105 duration-300 rounded-lg'>
            <img
              className='w-full h-[200px] object-cover rounded-t-lg'
              src={`http://localhost:3000${producto.image}`}
              alt={producto.name}
            />
            <div className='flex xx:flex-row xs:flex-col justify-between px-3 py-4'>
              <p className='font-bold'>{producto.name}</p>
              <p>
                <span className='bg-[#208850] text-white p-1 rounded-full'>
                  ${parseFloat(producto.price).toLocaleString('es-AR')}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comida;
