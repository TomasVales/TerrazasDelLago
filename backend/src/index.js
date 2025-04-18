const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
require('dotenv').config();

const productRoutes = require('../routes/productRoutes');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const statsRoutes = require('../routes/statsRoutes');
const orderRoutes = require('../routes/orderRoutes');

const User = require('../models/user');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Product = require('../models/products');
require('../models/associations');

const sequelize = require('../config/db');
const corsOptions = require('../config/cors');

const app = express();

// 🛡️ Seguridad y rendimiento
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(bodyParser.json());

// 📁 Archivos públicos
const uploadsPath = path.resolve(__dirname, '../public/uploads');
app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});
app.use('/uploads', express.static(uploadsPath));

// 📦 Rutas
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// 🧪 Ruta test
app.get('/', (req, res) => {
    res.send('API Terrazas del Lago funcionando');
});

// 🗄️ Conexión DB
sequelize.sync({ alter: true })
    .then(() => {
        console.log('🗂 Tablas sincronizadas');
        app.listen(process.env.PORT, () => {
            console.log(`🌐 Servidor corriendo en http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => console.error('❌ Error al sincronizar tablas', err));
