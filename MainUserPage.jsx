import { useEffect, useState } from 'react';

const BACKEND_URL = 'http://localhost:3000';



//productos
function MainUserPage() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    // Obtener productos
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/products`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || 'Error al obtener productos');

                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error al obtener productos:', err);
                setError(err.message);
            }
        };

        fetchProducts();
    }, []);
    
    return (
      <>
        
<div className="relative w-full h-[100vh] bg-slate-800 overflow-hidden">
    <input
      className="hidden peer/slider1 checkbox"
      type="radio"
      name="slider"
      id="slider1"
      defaultChecked
    />
    <input
      className="hidden peer/slider2 checkbox"
      type="radio"
      name="slider"
      id="slider2"
    />
    <input
      className="hidden peer/slider3 checkbox"
      type="radio"
      name="slider"
      id="slider3"
    />
        <input
      className="hidden peer/slider4 checkbox"
      type="radio"
      name="slider"
      id="slider4"
    />

    <div
      className="relative w-[400vw] h-[100%] flex transition-all duration-500 ease-in-out peer-checked/slider1:-left-0 peer-checked/slider2:-left-[100vw] peer-checked/slider3:-left-[200vw] peer-checked/slider4:-left-[300vw]
"
    >
        <div className="relative w-full h-full flex bg-[url('/bg-2.webp')] bg-cover bg-center"></div>
        <div className="relative w-full h-full flex bg-[url('/bg-1.jpg')] bg-cover bg-center"></div>
        <div className="relative w-full h-full flex bg-[url('/bg.3.webp')] bg-cover bg-center"></div>
        <div className="relative w-full h-full flex bg-[url('/bg.4.webp')] bg-cover bg-center"></div>

    </div>

    <div
      className="absolute w-full flex justify-center gap-5 bottom-13 peer-[&_label:nth-of-type(1)]/slider1:peer-checked/slider1:opacity-100 peer-[&_label:nth-of-type(1)]/slider1:peer-checked/slider1:w-10 peer-[&_label:nth-of-type(2)]/slider2:peer-checked/slider2:opacity-100 peer-[&_label:nth-of-type(2)]/slider2:peer-checked/slider2:w-10 peer-[&_label:nth-of-type(3)]/slider3:peer-checked/slider3:opacity-100 peer-[&_label:nth-of-type(3)]/slider3:peer-checked/slider3:w-10"
    >
      <label
        className="block rounded-xl w-6 h-6 bg-[#23603f] cursor-pointer opacity-50 z-10 transition-all duration-300 ease-in-out hover:scale-125 hover:opacity-100"
        for="slider1"
      >
      </label>
      <label
        className="block rounded-xl w-6 h-6 bg-[#23603f] cursor-pointer opacity-50 z-10 transition-all duration-300 ease-in-out hover:scale-125 hover:opacity-100"
        for="slider2"
      >
      </label>
      <label
        className="block rounded-xl w-6 h-6 bg-[#23603f] cursor-pointer opacity-50 z-10 transition-all duration-300 ease-in-out hover:scale-125 hover:opacity-100"
        for="slider3"
      >
      </label>
      <label
        className="block rounded-xl w-6 h-6 bg-[#23603f] cursor-pointer opacity-50 z-10 transition-all duration-300 ease-in-out hover:scale-125 hover:opacity-100"
        for="slider4"
      >
      </label>
    </div>
  </div>

  
<div className="main w-full h-full relative z-[2]">
<header className="main-header bg-[#23603f] flex items-center rounded-md mx-[50px] my-[30px] mb-[20px] h-[70px] py-[10px] fixed top-0 z-[3] w-[calc(100%-100px)]">

          {/* CONTENEDOR PRINCIPAL DEL HEADER */}
<div className="container w-full h-[60px] flex justify-between items-center mx-[30px] relative">

{/* LOGO */}
<div className="header-logo flex items-center">
  <a href="#" className="rounded-[60px] hover:scale-[1.02] transition-all duration-500 ease-in-out">
    <img src="logo.webp" alt="Logo" className="w-[100px] h-auto rounded-[60px]" />
  </a>
</div>

{/* BOTÓN HAMBURGUESA CON ICONO CAMBIANTE */}
<button
  onClick={() => {
    const menu = document.getElementById("main-menu");
    const openIcon = document.getElementById("menu-open-icon");
    const closeIcon = document.getElementById("menu-close-icon");

    menu.classList.toggle("hidden");
    openIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");
  }}
  type="button"
  className="md:hidden p-2 z-50 text-white hover:bg-[#2c7a50] rounded-lg"
>
  {/* Icono hamburguesa */}
  <svg
    id="menu-open-icon"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>

  {/* Icono X */}
  <svg
    id="menu-close-icon"
    className="w-6 h-6 hidden"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>

{/* MENÚ FULLSCREEN SOLO EN MOBILE */}
<div
  id="main-menu"
  className="hidden fixed top-0 left-0 w-full h-screen bg-[#23603f] flex flex-col justify-center items-center space-y-8 z-40 md:hidden"
>
  {/* LINKS */}
  <a href="#" className="text-white font-cinzel text-xl underline transition-all duration-300">MENU</a>
  <a href="https://www.youtube.com/watch?v=J2uG77Rm5Rs" className="text-white font-cinzel text-xl underline transition-all duration-300">WHATSAPP</a>
  <a href="#" className="text-white font-cinzel text-xl underline transition-all duration-300">RESERVAS</a>
  <a href="#" className="text-white font-cinzel text-xl underline transition-all duration-300">EVENTOS</a>
</div>


{/* NAV NORMAL EN DESKTOP */}
<div className="hidden md:flex items-center">
  <nav>
    <ul className="list-none inline-flex gap-[30px] p-0">
      <li><a href="#" className="text-white font-cinzel text-[15px] hover:text-[#90f3c0] transition-all duration-300">MENU</a></li>
      <li><a href="https://www.youtube.com/watch?v=J2uG77Rm5Rs" className="text-white font-cinzel text-[15px] hover:text-[#90f3c0] transition-all duration-300">WHATSAPP</a></li>
      <li><a href="#" className="text-white font-cinzel text-[15px] hover:text-[#90f3c0] transition-all duration-300">RESERVAS</a></li>
      <li><a href="#" className="text-white font-cinzel text-[15px] hover:text-[#90f3c0] transition-all duration-300">EVENTOS</a></li>
    </ul>
  </nav>
</div>
</div>
</header>
  
          <div className="main-expo">
            <div className="expo flex justify-center w-full">
              <div className="bg-[#0e271a5e] subtitle fixed top-[30%] w-full text-center z-[1] pointer-events-none flex flex-col gap-2">
                <h2 className="xl:text-[80px] lg:text-[80px] md:text-[80px] ssm:text-[70px] xs:text-[60px] xss:text-[50px] x:text-[45px] h-20 m-0 text-white font-tangerine [text-shadow:0_4px_8px_rgba(0,0,0,0.5)]">
                  Bienvenidos a Terrazas del Lago
                </h2>
                <p className="md:text-[36px] ssm:text-[32px] x:text-[30px] 
               text-white font-tangerine [text-shadow:0_4px_8px_rgba(0,0,0,0.5)]">
                  Cocina de autor, sabor inolvidable
                </p>
              </div>
              <div className="expo-btn fixed top-[57%]">
                <button className="text-white border-none px-[40px] py-[14px] text-[17px] font-cinzel bg-[#23603f] cursor-pointer rounded-[10px] shadow-xl transition duration-500 hover:scale-105 hover:text-[#90f3c0]">
                  Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

export default MainUserPage; 

