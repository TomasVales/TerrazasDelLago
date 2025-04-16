import React from 'react'

const Hero = () => {
  return (
    <div className='max-w[1640px] mx-auto px-4 sm:px-4 lg:px-8 md:px-8 '>
        <div className='max-h-[500px] relative'>
            {/*OVERLAY*/}
            <div className='absolute w-full h-full text-gray-200 max-h-[500px] bg-black/80 flex flex-col justify-center font-montserrat xx:pl-15'>
                <h1 className='px-4 py-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold'>
                    Tu <span className='text-emerald-600'>Antojo</span></h1>
                <h1 className='px-4 py-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold'>
                    <span className='text-emerald-600'>Nuestro </span>Menú</h1>
            </div>
            <img className='w-full max-h-[500px] object-cover' src="https://images.pexels.com/photos/7783364/pexels-photo-7783364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="/" />
        </div>
    </div>
  )
}

export default Hero