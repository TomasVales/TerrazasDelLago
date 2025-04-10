import React, {useState} from 'react'
import { AiOutlineClose, AiOutlineMenu, AiOutlineSearch} from 'react-icons/ai';
import {BsFillCartFill} from 'react-icons/bs';
import {TbLocation, TbTruckDelivery} from 'react-icons/tb';
import { FaRegHeart, FaWhatsapp} from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";




const MenuNav = () => {
const [nav, setNav] = useState(false)

  return (
    <div className='max-w-[1640px] mx-auto flex justify-between 
    items-center p-4'>
        
        {/*Lado derecho del nav*/}
        <div className='flex items-center'>
        <div  onClick={()=> setNav(!nav)}  className='cursor-pointer'>
            <AiOutlineMenu color='[#208850]' size={30}/>
        </div>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl px-5'>
            <span className='text-[#208850] font-bold'> Terrazas Del Lago</span> 
        </h1>
        <div className='hidden lg:flex items-center bg-gray-200
        rounded-full p-1 text-[14px]'>
            <p className='bg-[#208850] text-white rounded-full p-2'>Delivery</p>
            <p className='p-2'>Take Away</p>
        </div>
        </div>
        
        {/*Barra de busqueda de verga*/}           
        <div className='bg-gray-200 rounded-full flex items-center px-2
        w-[200px] sm:w-[400px] lg:w-[500px]'>
            <AiOutlineSearch size={25}/>
            <input className='bg-transparent p-2 focus:outline-none w-full'
             type="text" placeholder='Buscar platos'
            />
        </div>
        {/*boton de carrito*/}
        <button className='bg-[#208850] rounded-full text-white hidden md:flex items-center pr-4 pl-4 py-2 
        hover:scale-105 duration-300 cursor-pointer'>
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
            <li className='text-xl py-4 flex'><TbTruckDelivery 
            size={25} className='mr-4'/>Ordenes</li>
            <li className='text-xl py-4 flex'><FaRegHeart            
            size={23} className='mr-4'/>Favoritos</li>
            <li className='text-xl py-4 flex'><IoWalletOutline 
            size={25} className='mr-4'/>Billetera</li>
            <li className='text-xl py-4 flex'><TbLocation
            size={25} className='mr-4'/>Direcciones</li>
            <li className='text-xl py-4 flex'><FaWhatsapp 
            size={25} className='mr-4'/>WhatsApp</li>
        </ul>
    </nav>
    
    </div>


    </div>
  )
}

export default MenuNav
