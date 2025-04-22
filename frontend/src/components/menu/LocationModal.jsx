import React from 'react';

const LocationModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative animate-fade-in overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">📍 Acá nos ubicamos</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Contenido */}
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Mapa */}
                    <div className="p-4">
                        <iframe
                            title="Ubicación Terrazas del Lago"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.1556403077184!2d-58.4382327!3d-34.6421948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccb2adf203aaf%3A0xf6a50abeb8e6f1d6!2sTerrazas%20del%20Lago!5e0!3m2!1ses!2sar!4v1619630636362!5m2!1ses!2sar"
                            width="100%"
                            height="300"
                            allowFullScreen
                            loading="lazy"
                            className="rounded-lg border w-full"
                        ></iframe>
                        <div className="mt-2 text-sm text-center">
                            <a
                                href="https://www.google.com/maps/place/Terrazas+del+Lago,+B1876+Don+Bosco,+Provincia+de+Buenos+Aires"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-700 underline hover:text-emerald-900"
                            >
                                Ver en Google Maps
                            </a>
                        </div>
                    </div>

                    {/* Horarios */}
                    <div className="p-6 bg-gray-50 flex flex-col justify-center">
                        <h3 className="text-xl font-semibold text-emerald-800 mb-4">🕗 Horarios de atención</h3>
                        <ul className="text-sm text-gray-800 space-y-2 leading-relaxed">
                            <li>
                                <strong>Salón:</strong> <br />
                                Mar a Dom — <span className="text-gray-600">08:00 a 00:00 hs</span>
                            </li>
                            <li>
                                <strong>Delivery:</strong> <br />
                                Mar a Dom — <span className="text-gray-600">12:00 a 15:00 y 20:00 a 23:00 hs</span>
                            </li>
                            <li className="text-red-600 font-medium">
                                <strong>Lunes:</strong> Cerrado
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
