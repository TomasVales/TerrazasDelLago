import React from 'react'

const Comida = () => {
  return (
    <div className='max-w-[1640px] m-auto px-4 py-7'>
        <h1 className='text-[#208850] font-bold text-4xl text-center'>Menu de Opciones</h1>

        {/*filtro de row */}
        <div className='flex flex-col lg:flex-row justify-between pt-10'>

            {/*Filtro type*/}
            <div className='max-w-[590px]'>
              <p className='font-bold text-gray-700'>Filtro Comidas</p>
              <div className='flex justify-between flex-wrap'>
                <button className='m-1 cursor-pointer border-[#208850] border text-[#208850] py-2 px-3 rounded-[14px] hover:bg-[#208850] hover:text-white' >Burguers</button>
                <button className='m-1 cursor-pointer border-[#208850] border text-[#208850] py-2 px-3 rounded-[14px] hover:bg-[#208850] hover:text-white' >Carnes</button>
                <button className='m-1 cursor-pointer border-[#208850] border text-[#208850] py-2 px-3 rounded-[14px] hover:bg-[#208850] hover:text-white' >Pastas</button>
                <button className='m-1 cursor-pointer border-[#208850] border text-[#208850] py-2 px-3 rounded-[14px] hover:bg-[#208850] hover:text-white' >Minutas</button>
                <button className='m-1 cursor-pointer border-[#208850] border text-[#208850] py-2 px-3 rounded-[14px] hover:bg-[#208850] hover:text-white' >Vinos</button>
                <button className='m-1 cursor-pointer border-[#208850] border text-[#208850] py-2 px-3 rounded-[14px] hover:bg-[#208850] hover:text-white' >Bebidas</button>
              </div>
            </div>

            {/*filtro precio*/}
            <div>
              <p className='font-bold text-gray-700' >Filtro Precio</p>
              <div className='flex justify-between max-w-[270px] w-full'>
                <button className='m-1 cursor-pointer border-[#208850] border text-[#208850] py-2 px-3 rounded-[14px] hover:bg-[#208850] hover:text-white' >$</button>
                <button className='m-1 cursor-pointer border-[#208850] border text-[#208850] py-2 px-3 rounded-[14px] hover:bg-[#208850] hover:text-white' >$$</button>
                <button className='m-1 cursor-pointer border-[#208850] border text-[#208850] py-2 px-3 rounded-[14px] hover:bg-[#208850] hover:text-white' >$$$</button>
                <button className='m-1 cursor-pointer border-[#208850] border text-[#208850] py-2 px-3 rounded-[14px] hover:bg-[#208850] hover:text-white' >$$$$</button>
              </div>
            </div>
        </div>
    
    {/* COMIDAS */}
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 pt-5'>
      <div className='shadow-lg hover:scale-105 duration-300 rounded-lg'>
        <img
        className='w-full h-[200px] object-cover rounded-t-lg'
        src="./public/burguer1.png" alt="" 
        />
        <div className='flex xx:flex-row xs:flex-col justify-between px-3 py-4'>
          <p className='font-bold'>Cheese Burguer</p>
          <p>
            <span className='bg-[#208850] text-white p-1 rounded-full'>$ 12.000</span>
          </p>
        </div>
      </div>
      <div className='shadow-lg hover:scale-105 duration-300 rounded-lg'>
        <img
        className='w-full h-[200px] object-cover rounded-t-lg'
        src="./public/burguer2.png" alt="" 
        />
        <div className='flex xx:flex-row xs:flex-col justify-between px-3 py-4'>
          <p className='font-bold'>Classic Burguer</p>
          <p>
            <span className='bg-[#208850] text-white p-1 rounded-full'>$ 11.000</span>
          </p>
        </div>
      </div>
      <div className='shadow-lg hover:scale-105 duration-300 rounded-lg'>
        <img
        className='w-full h-[200px] object-cover rounded-t-lg'
        src="./public/carne1.png" alt="" 
        />
        <div className='flex xx:flex-row xs:flex-col justify-between px-3 py-4'>
          <p className='font-bold'>Lomo a las tres pimientas</p>
          <p>
            <span className='bg-[#208850] text-white p-1 rounded-full'>$ 20.700</span>
          </p>
        </div>
      </div>
      <div className='shadow-lg hover:scale-105 duration-300 rounded-lg'>
        <img
        className='w-full h-[200px] object-cover rounded-t-lg'
        src="./public/chorizo.png" alt="" 
        />
        <div className='flex xx:flex-row xs:flex-col justify-between px-3 py-4 gap-3'>
          <p className='font-semibold'>Bife de chorizo marinado</p>
          <p>
            <span className='bg-[#208850] text-white p-1 rounded-full'>$ 32.200</span>
          </p>
        </div>
      </div>
      <div className='shadow-lg hover:scale-105 duration-300 rounded-lg'>
        <img
        className='w-full h-[200px] object-cover rounded-t-lg'
        src="./public/pasta1.png" alt="" 
        />
        <div className='flex xx:flex-row xs:flex-col justify-between px-3 py-4'>
          <p className='font-bold'>Ravioles de ricota y jamon</p>
          <p>
            <span className='bg-[#208850] text-white p-1 rounded-full'>$ 22.000</span>
          </p>
        </div>
      </div>
      <div className='shadow-lg hover:scale-105 duration-300 rounded-lg'>
        <img
        className='w-full h-[200px] object-cover rounded-t-lg'
        src="./public/pasta2.png" alt="" 
        />
        <div className='flex xx:flex-row xs:flex-col justify-between px-3 py-4'>
          <p className='font-bold'>Malfattis</p>
          <p>
            <span className='bg-[#208850] text-white p-1 rounded-full'>$ 13.600</span>
          </p>
        </div>
      </div>
      <div className='shadow-lg hover:scale-105 duration-300 rounded-lg'>
        <img
        className='w-full h-[200px] object-cover rounded-t-lg'
        src="./public/vino1.png" alt="" 
        />
        <div className='flex xx:flex-row xs:flex-col justify-between px-3 py-4'>
          <p className='font-bold'>D.V. Catena - Malbec</p>
          <p>
            <span className='bg-[#208850] text-white p-1 rounded-full'>$ 36.800</span>
          </p>
        </div>
      </div>
      <div className='shadow-lg hover:scale-105 duration-300 rounded-lg'>
        <img
        className='w-full h-[200px] object-cover rounded-t-lg'
        src="./public/vino2.png" alt="" 
        />
        <div className='flex xx:flex-row xs:flex-col justify-between px-3 py-4'>
          <p className='font-bold'>Rutini - Cabernet</p>
          <p>
            <span className='bg-[#208850] text-white p-1 rounded-full'>$ 27.900</span>
          </p>
        </div>
      </div>
      <div className='shadow-lg hover:scale-105 duration-300 rounded-lg'>
        <img
        className='w-full h-[200px] object-cover rounded-t-lg'
        src="./public/birra1.png" alt="" 
        />
        <div className='flex xx:flex-row xs:flex-col justify-between px-3 py-4'>
          <p className='font-bold'>Patagonia 24.7 - 710cc</p>
          <p>
            <span className='bg-[#208850] text-white p-1 rounded-full'>$ 10.300</span>
          </p>
        </div>
      </div>
    </div>
    

    </div>
  )
}

export default Comida