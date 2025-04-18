import React from 'react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

function FooterMenu() {
    return (
        <footer className="bg-gray-300 rounded-lg shadow-sm m-4">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between font-montserrat">
                <p className="text-sm text-gray-700 sm:text-center font-semibold">
                Copyright &copy; Terrazas del Lago - {' '}
                <a 
                    href="https://kiad.com.ar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline text-emerald-800 hover:text-emerald-600 transition-colors"
                >
                    Develop by KIAD
                </a>
                </p>
                
                <ul className="flex flex-wrap items-center mt-3 md:mt-0 space-x-6 text-2xl text-gray-700">
                <li>
                    <a 
                    href="https://instagram.com/tuinstagram" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-600 transition-colors"
                    aria-label="Instagram"
                    >
                    <FaInstagram />
                    </a>
                </li>
                <li>
                    <a 
                    href="https://wa.me/tunumerodewhatsapp" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-600 transition-colors"
                    aria-label="WhatsApp"
                    >
                    <FaWhatsapp />
                    </a>
                </li>
                </ul>
            </div>
            </footer>
    )
}

export default FooterMenu