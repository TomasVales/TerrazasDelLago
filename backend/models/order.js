const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    total: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    guestName: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Order;