const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('../routes/productRoutes');
const authRoutes = require('../routes/authRoutes');

require('dotenv').config();

const sequelize = require('../config/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send(' API Terrazas del Lago funcionando');
});


const Product = require('../models/products');

sequelize.sync({ alter: true }) // o { force: true } si querés borrar y recrear cada vez
    .then(() => {
        console.log('🗂 Tablas sincronizadas');
        app.listen(process.env.PORT, () => {
            console.log(`🌐 Servidor corriendo en http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => console.error('❌ Error al sincronizar tablas', err));


// Funcionamiento servidor base de datos KIAD