import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa los estilos
import image1 from '../../assets/1.jpg'
import image2 from '../../assets/2.jpg'
import image3 from '../../assets/3.jpg'


const Cartel = () => {
  return (
    <Carousel
      className="max-w-screen select-none cursor-grab"
      showArrows={true}
      showStatus={false}
      showThumbs={false}
      autoPlay={true}
      interval={4000}
      infiniteLoop={true}
      emulateTouch={true}>
      <div className="relative">
        <img src={image1} alt="Imagen 1" className="h-[500px] object-cover w-full" draggable={false} />
        <div className="absolute inset-0 flex items-center justify-start px-8">
          <h2 className="text-white text-left font-montserrat text-4xl md:text-7xl font-bold drop-shadow-lg leading-snug">
            <span className="block">Tu <span className="text-emerald-700">antojo</span></span>
            <span className="block"><span className="text-emerald-700">Nuestro</span> menú</span>
          </h2>
        </div>
      </div>

      <div className="relative">
        <img src={image2} alt="Imagen 1" className="h-[500px] object-cover w-full" draggable={false} />
        <div className="absolute inset-0 flex items-center justify-start px-8">
          <h2 className="text-white text-left font-montserrat text-4xl md:text-7xl font-bold drop-shadow-lg leading-snug">
            <span className="block">Más  <span className="text-emerald-700">que comida</span></span>
            <span className="block"><span className="text-emerald-700">una </span>experiencia</span>
          </h2>
        </div>
      </div>

      <div className="relative">
        <img src={image3} alt="Imagen 1" className="h-[500px] object-cover w-full" draggable={false} />
        <div className="absolute inset-0 flex items-center justify-start px-8">
          <h2 className="text-white text-left font-montserrat text-4xl md:text-7xl font-bold drop-shadow-lg leading-snug">
            <span className="block"><span className="text-emerald-700">Sabor </span>que</span>
            <span className="block">enamora</span>
          </h2>
        </div>
      </div>
    </Carousel>
  );
};

export default Cartel;
