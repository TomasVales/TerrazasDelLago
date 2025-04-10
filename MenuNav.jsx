import React, {useState} from 'react'
import { AiOutlineClose, AiOutlineMenu, AiOutlineSearch, AiOutlineShoppingCart} from 'react-icons/ai';
import {BsFillCartFill} from 'react-icons/bs';
import {TbLocation, TbTruckDelivery} from 'react-icons/tb';
import { FaWhatsapp} from "react-icons/fa";
import { GoTrash } from "react-icons/go";





const MenuNav = () => {
const [nav, setNav] = useState(false)
const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className='max-w-[1640px] mx-auto flex justify-between 
    items-center p-4'>
        
        {/*Lado derecho del nav*/}
        <div className='flex items-center'>
        <div  onClick={()=> setNav(!nav)}  className='cursor-pointer'>
            <AiOutlineMenu color='[#208850]' size={30}/>
        </div>
        <h1 className=' xs:text-[0px] ss:text-2xl sm:text-3xl lg:text-4xl px-5'>
            <span className='text-[#208850] font-bold'> Terrazas Del Lago</span> 
        </h1>
        </div>
        
        {/*Barra de busqueda de verga*/}           
        <div className='bg-gray-200 rounded-full flex items-center px-2
       sm:w-[400px] lg:w-[600px]'>
            <AiOutlineSearch size={25}/>
            <input className='bg-transparent p-2 focus:outline-none w-full'
             type="text" placeholder='Buscar platos'
            />
        </div>
        

        {/*CARRITO DE LOCOS*/}
        {isCartOpen && (
             <>
        {/* Fondo oscuro */}
            <div
                className='bg-black/80 fixed w-full h-screen z-10 top-0 right-0'
                onClick={() => setIsCartOpen(false)}>
            </div>

        {/* Carrito box */}
        <div className='
        md:w-[630px] sm:w-[600px] s:w-[540px] m:w-[470px] mi:w-[430px] si:w-[400px] ss:w-[360px] xs:w-[300px]
        fixed p-[15px] rounded-[10px] top-8 bottom-8 left-1/2 -translate-x-1/2 
      bg-white z-10 duration-300 overflow-y-auto custom-scroll'>
            <div className='flex justify-between items-center p-4 border-b-1 border-gray-600 '>
                <h2 className='text-2xl'>
                    <span className='text-[#208850] font-bold'>Carrito</span>
                </h2>
                <button
                    className='text-gray-500 hover:text-black text-xl cursor-pointer'
                    onClick={() => setIsCartOpen(false)}> ✕
                </button>
            </div>

                {/*productos*/}
                <div className='flex flex-col'>
                    <div className='flex items-center gap-4 max-w-[640px] max-h-[78px] border-b-1 border-gray-500 mx-3'>
                        <img className="mi:w-[80px] si:w-[50px] ss:w-[30px] max-h-[58px] object-cover mx-1 my-2 rounded-sm shadow-lg" src="ajillo.png" alt="" />
                        <p className='font-pt font-medium ss:text-[16px] xs:text-[12px]' >Pollo al Ajillo</p>
                        <div className='rounded-[10px] ml-auto mr-[20px]'>
                            <button className='

                               mi:w-[25px] xs:w-[15px]  bg-black/14 rounded-[10px] border-grey-500 border-1 cursor-pointer
                             hover:bg-[#208850] hover:scale-105 duration-100' >
                                <span className='font-semibold'>+</span>
                            </button>
                            <input className='max-w-[40px] focus:outline-none text-center'  type="text" />
                            <button className='mi:w-[25px] xs:w-[15px] rounded-[10px] border-grey-500 border-1 cursor-pointer hover:bg-[#208850]
                             bg-black/14 hover:scale-95 duration-100'>
                                <span className='font-semibold'>-</span>
                            </button>
                        </div>
                        <button className='mr-[9px] cursor-pointer hover:scale-105 duration-300'><GoTrash className="mi:text-[20px] ss:text-[15px] "/></button>
                    </div>
                </div>
                {/*Pago*/}
                <div className='bg-gray-300 my-[20px] p-[20px] rounded-2xl'>
                    <p className='font-semibold text-[22px]'>Resumen del Pedido</p>
                    {/*resumen tabla*/}
                    <div className='mt-[15px]'>
                        <div>
                            <div className='flex justify-between py-1'> 
                                <p className='text-gray-950/70'>Precio original</p>
                                <p><span className='font-semibold'>$11.000,00</span></p>
                            </div>
                            <div className='flex justify-between py-1'>
                                <p className='text-gray-950/70'>Descuento</p>
                                <p><span className='font-semibold text-green-600'>-$500,00</span></p>
                            </div>
                            <div className='flex justify-between py-1'>
                                <p className='text-gray-950/70'>Envio</p>
                                <p><span className='font-semibold'>$1200,00</span></p>
                            </div>
                        </div>
                        {/*total*/}
                        <div className='flex justify-between mt-[16px] pt-[8px] border-t-2 border-gray-600'>
                            <p><span className='font-semibold text-[19px] '>Total</span></p>
                            <p><span className='font-semibold text-[19px] '>$12.200,00</span></p>
                        </div>
                    </div>
                </div>
                {/*completar compra btn*/}
                <div className='flex gap-6'>
                    <button className='py-2 px-5 cursor-pointer rounded-[10px] text-[#208850] bg-white hover:bg-[#208850] hover:text-white border '>Completar Orden</button>
                    <button className='py-2 px-5 cursor-pointer border-1 text-gray-400 border-gray-400 rounded-[10px] hover:bg-gray-700/45 hover:text-white'>Volver al menu</button>
                </div>

        </div>
        </>
        )}

        {/*boton de carrito*/}            
                <button className='bg-[#208850] rounded-full text-white hidden 
                    md:flex items-center pr-4 pl-4 py-2 
                    hover:scale-105 duration-300 cursor-pointer'
                    onClick={() => setIsCartOpen(true)}
                    >
                    < BsFillCartFill size={20} className='mr-2'/> Carrito
                </button>



{/*Menu de telefono*/}
    {nav ? <div className='bg-black/80 fixed w-full h-screen 
            z-10 top-0 left-0'></div>: ''}   
{/*Menu side*/}
    <div className=
        {
        nav ? 
        'fixed top-0 left-0 w-[300px] h-screen bg-white z-10 duration-300' : 
        'fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-300'
        }>          
            
        <AiOutlineClose 
        onClick={()=> setNav(!nav)}
        size={30} 
        className='absolute right-4 top-4 cursor-pointer'
        />
    
    <h2 className='text-2xl p-4'>
        <span className='text-[#208850] font-bold'>Terrazas Del Lago</span>
    </h2>
    <nav>
        <ul className='flex flex-col p-4 text-gray-800'>
            <li className='text-xl py-4 flex gap-1'><AiOutlineShoppingCart       
            size={23} className='mr-4'/>Carrito</li>
            <li className='text-xl py-4 flex gap-1'><TbTruckDelivery 
            size={25} className='mr-4'/>Ordenes</li>
            <li className='text-xl py-4 flex gap-1'><TbLocation
            size={25} className='mr-4'/>Direcciones</li>
            <li className='text-xl py-4 flex gap-1'><FaWhatsapp 
            size={25} className='mr-4'/>WhatsApp</li>
        </ul>
    </nav>
    
    </div>


    </div>
  )
}

export default MenuNav
