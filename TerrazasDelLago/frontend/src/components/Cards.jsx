import React from 'react'

const Cards = () => {
    return (
        <div className='max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-3 gap-6'>
            {/* CARTAS COMIDA */}
            <div className='rounded-xl relative'>
                {/* OVERLAY */}
                <div className='absolute w-full h-full bg-black/50 rounded-xl text-white pl-4 font-montserrat'>
                    <p className='font-medium text-2xl px-2 pt-4'>Camarones al ajillo</p>
                    <hr className='w-62' />
                    <p className='px-2 py-2 font-medium'>$ 11.500,00</p>
                    <button className='border-1 p-4 py-2 rounded-[16px] border-none bg-gray-200 text-black mx-2 absolute bottom-4
                    hover:scale-105 duration-300 cursor-pointer'>Ordenar</button>
                </div>
                <img 
                className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl'
                src="./public/ajillo.png" alt="/" />
            </div>
            <div className='rounded-xl relative'>
                {/* OVERLAY2 */}
                <div className='absolute w-full h-full bg-black/50 rounded-xl text-white pl-4 font-montserrat'>
                    <p className='font-medium text-2xl px-2 pt-4'>Ojo de bife</p>
                    <hr className='w-38' />
                    <p className='px-2 py-2 font-medium'>$ 20.700,00</p>
                    <button className='border-1 p-4 py-2 rounded-[16px] border-none bg-gray-200 text-black mx-2 absolute bottom-4
                    hover:scale-105 duration-300 cursor-pointer'>Ordenar</button>
                </div>
                <img 
                className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl'
                src="./public/ojobife.png" alt="/" />
            </div>
            <div className='rounded-xl relative'>
                {/* OVERLAY3 */}
                <div className='absolute w-full h-full bg-black/50 rounded-xl text-white pl-4 font-montserrat'>
                    <p className='font-medium text-2xl px-2 pt-4'>Provolone con mollejas</p>
                    <hr className='w-76' />
                    <p className='px-2 py-2 font-medium'>$ 15.000,00</p>
                    <button className='border-1 p-4 py-2 rounded-[16px] border-none bg-gray-200 text-black mx-2 absolute bottom-4
                    hover:scale-105 duration-300 cursor-pointer'>Ordenar</button>
                </div>
                <img 
                className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl'
                src="./public/provoleta.png" alt="/" />
            </div>
        </div>
    )
}

export default Cards