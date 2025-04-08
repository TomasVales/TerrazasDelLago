import { useEffect, useState } from 'react';

const BACKEND_URL = 'http://localhost:3000';

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
        <div className="slider-container overflow-hidden w-full h-auto h-screen">
          <div className="slider-frame w-full h-auto relative z-[1] h-screen animate-slide">
            <ul className="flex p-0 w-[400%] translate-x-0">
              <li className="li-slider list-none w-full">
                <img src="TAL_bg-slide-1.webp" alt="" className="w-full h-[90%]" />
              </li>
              <li className="li-slider list-none w-full">
                <img src="TAL_bg-slide-2.webp" alt="" className="w-full h-[90%]" />
              </li>
              <li className="li-slider list-none w-full">
                <img src="TAL_bg-slide-4.webp" alt="" className="w-full h-[90%]" />
              </li>
              <li className="li-slider list-none w-full">
                <img src="galeria-gastronomia-7.jpg" alt="" className="w-full h-[90%]" />
              </li>
            </ul>
          </div>
        </div>
  
        <div className="main w-full h-full relative z-[2]">
          <header className="main-header bg-[#23603f] flex items-center rounded-md mx-[60px] my-[30px] mb-[20px] w-[90%] h-[70px] py-[10px] fixed top-0 z-[3]">
            <div className="container w-full h-[60px] flex justify-between mx-[30px]">
              <div className="header-logo w-auto h-auto flex items-center">
                <a href="" className="rounded-[60px] hover:transition-all hover:duration-500 hover:ease-in-out hover:scale-[1.02]">
                  <img src="logo.webp" alt="" className="w-[100px] h-auto rounded-[60px]" />
                </a>
              </div>
              <div className="nav-header w-auto flex items-center">
                <nav>
                  <ul className="list-none inline-flex gap-[30px] p-0">
                    <li className="nav-li transition-all duration-500 ease-in-out hover:translate-y-[-1px]">
                      <a href="" className="no-underline text-white font-cinzel text-[15px] tracking-[0.4px] transition-all duration-500 ease-in-out hover:text-[#90f3c0]">MENU</a>
                    </li>
                    <li className="nav-li transition-all duration-500 ease-in-out hover:translate-y-[-1px]">
                      <a href="https://www.youtube.com/watch?v=J2uG77Rm5Rs" className="no-underline text-white font-cinzel text-[15px] tracking-[0.4px] transition-all duration-500 ease-in-out hover:text-[#90f3c0]">WHATSAPP</a>
                    </li>
                    <li className="nav-li transition-all duration-500 ease-in-out hover:translate-y-[-1px]">
                      <a href="" className="no-underline text-white font-cinzel text-[15px] tracking-[0.4px] transition-all duration-500 ease-in-out hover:text-[#90f3c0]">RESERVAS</a>
                    </li>
                    <li className="nav-li transition-all duration-500 ease-in-out hover:translate-y-[-1px]">
                      <a href="" className="no-underline text-white font-cinzel text-[15px] tracking-[0.4px] transition-all duration-500 ease-in-out hover:text-[#90f3c0]">EVENTOS</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
  
          <div className="main-expo">
            <div className="expo flex justify-center w-full">
              <div className="bg-[#0e271a5e] subtitle fixed top-[30%] w-full text-center z-[1000] pointer-events-none flex flex-col gap-2">
                <h2 className="text-[80px] h-20 m-0 text-white font-tangerine [text-shadow:0_4px_8px_rgba(0,0,0,0.5)]">
                  Bienvenidos a Terrazas del Lago
                </h2>
                <p className="text-[36px] text-white font-tangerine [text-shadow:0_4px_8px_rgba(0,0,0,0.5)]">
                  Cocina de autor, sabor inolvidable
                </p>
              </div>
              <div className="expo-btn fixed top-[55%]">
                <button className="text-white border-none px-[40px] py-[15px] text-[17px] font-cinzel bg-[#23603f] cursor-pointer rounded-[10px] shadow-xl transition duration-500 hover:scale-105 hover:text-[#90f3c0]">
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
