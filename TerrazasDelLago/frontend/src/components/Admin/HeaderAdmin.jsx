import React from 'react'
import { Search } from 'lucide-react'

const HeaderAdmin = () => {
    return (
        <>
            <header className='sticky top-0 flex w-full bg-white border-gray-200 z-[20] py-2 lg:border-b'>
                <div className='flex flex-col items-center justify-between grow lg:flex-row lg:px-6'>
                    <div className='hidden lg:block'>
                        <div className='relative'>
                            <span className='absolute -translate-y-1/2 pointer-events-none left-4 top-1/2'>
                                <Search size={18}></Search>
                            </span>
                            <input type="text" placeholder='Busqueda simplificada'
                                className='
                                input-busqueda
                                h-10 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12
                                pr-14 text-sm text-gray-800 shadow-2xs placeholder:text-gray-400 
                                focus:border-brand-300 focus:outline-hidden focus:ring-brand-500/10
                                xl:w-[430px]'
                            />

                        </div>
                    </div>
                    <div></div>
                </div>
            </header>
        </>
    )
}

export default HeaderAdmin