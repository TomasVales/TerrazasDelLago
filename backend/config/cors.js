

const allowedOrigins = [
    'http://localhost:5173',  // Frontend local
    'http://localhost:3000',  // Backend local
    'https://tudominio.com',  // Producción (actualizalo cuando lo tengas)
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('❌ Not allowed by CORS'));
        }
    },
    credentials: true, // si usás cookies o headers personalizados
};

module.exports = corsOptions;
