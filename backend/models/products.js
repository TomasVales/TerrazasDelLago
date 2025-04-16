const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM('Burguers', 'Carnes', 'Pastas', 'Minutas', 'Vinos', 'Bebidas'),
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'Products', // Asegura el uso del nombre correcto con mayúscula
    timestamps: true, // Para manejar createdAt y updatedAt automáticamente
});

module.exports = Product;
