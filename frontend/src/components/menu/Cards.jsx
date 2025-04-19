import React from 'react'

const Cards = () => {
    return (
        <div className='max-w-screen mx-auto px-6 py-2 font-montserrat'>
            <div className="text-center">
                <h1 className="relative inline-block text-emerald-700 font-bold text-4xl my-1 py-6 after:content-[''] after:block after:h-[4px] after:bg-emerald-700 after:w-3/4 after:mx-auto after:mt-2">
                    Destacado
                </h1>
            </div>

            <div className='grid md:grid-cols-3 gap-6'>
                {/* CARTA 1 */}
                <div className='rounded-xl relative'>
                    <div className='absolute w-full h-full bg-black/50 rounded-xl text-white pl-4'>
                        <p className='relative inline-block font-medium text-2xl px-2 pt-4 after:content-[""] after:block after:h-[3px] after:bg-emerald-700 after:w-3/4 after:absolute after:-bottom-1 after:left-0'>
                            Camarones al ajillo
                        </p>
                        <p className='px-2 py-2 font-medium'>$ 11.500,00</p>
                        <button className='border-1 p-4 py-2 rounded-[16px] border-none bg-gray-200 text-black mx-2 absolute bottom-4
                        hover:scale-105 duration-300 cursor-pointer'>Ordenar</button>
                    </div>
                    <img
                        className='max-h-[180px] md:max-h-[200px] w-full object-cover rounded-xl'
                        src="./public/ajillo.png" alt="/" />
                </div>

                {/* CARTA 2 */}
                <div className='rounded-xl relative'>
                    <div className='absolute w-full h-full bg-black/50 rounded-xl text-white pl-4'>
                        <p className='relative inline-block font-medium text-2xl px-2 pt-4 after:content-[""] after:block after:h-[3px] after:bg-emerald-700 after:w-3/4 after:absolute after:-bottom-1 after:left-0'>Ojo de bife</p>
                        <p className='px-2 py-2 font-medium'>$ 20.700,00</p>
                        <button className='border-1 p-4 py-2 rounded-[16px] border-none bg-gray-200 text-black mx-2 absolute bottom-4
                        hover:scale-105 duration-300 cursor-pointer'>Ordenar</button>
                    </div>
                    <img
                        className='max-h-[180px] md:max-h-[200px] w-full object-cover rounded-xl'
                        src="./public/ojobife.png" alt="/" />
                </div>

                {/* CARTA 3 */}
                <div className='rounded-xl relative'>
                    <div className='absolute w-full h-full bg-black/50 rounded-xl text-white pl-4'>
                        <p className='relative inline-block font-medium text-2xl px-2 pt-4 after:content-[""] after:block after:h-[3px] after:bg-emerald-700 after:w-3/4 after:absolute after:-bottom-1 after:left-0'>Provolone con mollejas</p>
                        <p className='px-2 py-2 font-medium'>$ 15.000,00</p>
                        <button className='border-1 p-4 py-2 rounded-[16px] border-none bg-gray-200 text-black mx-2 absolute bottom-4
                        hover:scale-105 duration-300 cursor-pointer'>Ordenar</button>
                    </div>
                    <img
                        className='max-h-[180px] md:max-h-[200px] w-full object-cover rounded-xl'
                        src="./public/provoleta.png" alt="/" />
                </div>
            </div>
        </div>
    )
}

export default Cards
