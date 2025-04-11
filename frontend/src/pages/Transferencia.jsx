import React from 'react';

const Transferencia = ({ onVolver }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            <div className="bg-gray-100 p-8 rounded-xl shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-[#208850] mb-4">Pago por Transferencia</h1>
                <p className="mb-4 text-gray-700">
                    Para completar tu pedido, transferí el total al siguiente alias:
                </p>
                <div className="bg-white border border-dashed border-gray-500 p-4 rounded-lg text-center mb-6">
                    <p className="text-lg font-bold text-[#208850]">terrazas.lago.mp</p>
                </div>
                <p className="mb-4 text-gray-600 text-sm">
                    Una vez realizado el pago, por favor envianos el comprobante vía WhatsApp.
                </p>
                <a
                    href="https://wa.me/5491151393916"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-[#208850] text-white py-2 rounded-lg font-semibold hover:bg-[#1a6f3c] transition"
                >
                    Enviar Comprobante
                </a>

                <button
                    onClick={onVolver}
                    className="mt-6 w-full py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-200 transition"
                >
                    Volver al Menú
                </button>
            </div>
        </div>
    );
};

export default Transferencia;
