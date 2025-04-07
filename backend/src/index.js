const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('../routes/productRoutes');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/user');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Product = require('../models/products');
const orderRoutes = require('../routes/orderRoutes');
require('../models/associations'); // <-- importa relaciones


require('dotenv').config();

const sequelize = require('../config/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);





app.get('/', (req, res) => {
    res.send(' API Terrazas del Lago funcionando');
});

sequelize.sync({ alter: true }) // o { force: true } si querés borrar y recrear cada vez
    .then(() => {
        console.log('🗂 Tablas sincronizadas');
        app.listen(process.env.PORT, () => {
            console.log(`🌐 Servidor corriendo en http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => console.error('❌ Error al sincronizar tablas', err));


// Funcionamiento servidor base de datos KIAD