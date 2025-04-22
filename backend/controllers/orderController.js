const { Op, fn, col, literal } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Product = require('../models/products');
const User = require('../models/user');
const { validationResult } = require('express-validator');

// Crear nuevo pedido
const createOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { items, address, notes, guestName } = req.body;
        const userId = req.user ? req.user.id : null;

        if (!req.user && !guestName) {
            return res.status(400).json({ message: 'Debe estar logueado o indicar un nombre de invitado.' });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'El pedido no contiene productos.' });
        }

        // Crear el pedido con total 0 por ahora
        const order = await Order.create({
            userId,
            guestName: guestName || null,
            total: 0,
            address,
            notes
        });

        let total = 0;

        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado.` });
            }

            const subtotal = item.quantity * product.price;
            total += subtotal;

            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price,
            });
        }

        // Guardar el total calculado
        order.total = total;
        await order.save();

        const fullOrder = await Order.findByPk(order.id, {
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: OrderItem, include: [Product] }
            ]
        });

        res.status(201).json(fullOrder);
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ message: 'Error interno al crear el pedido.' });
    }
};

// Obtener pedidos del usuario logueado
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.findAll({
            where: { userId },
            include: [
                { model: OrderItem, include: [Product] },
                { model: User, attributes: ['name', 'email'] }
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json(orders);
    } catch (error) {
        console.error('Error al obtener pedidos del usuario:', error);
        res.status(500).json({ message: 'Error interno al obtener pedidos.' });
    }
};

// Obtener todos los pedidos (admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: OrderItem, include: [Product] }
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json(orders);
    } catch (error) {
        console.error('Error al obtener todos los pedidos:', error);
        res.status(500).json({ message: 'Error interno al obtener pedidos.' });
    }
};

// Cambiar el estado del pedido
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // El estado viene del frontend

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado.' });
        }

        // Asegúrate de que el estado esté dentro de los valores posibles
        if (!['pending', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Estado no válido.' });
        }

        order.status = status;
        await order.save();

        res.json({ message: 'Estado del pedido actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        res.status(500).json({ message: 'Error interno al actualizar pedido.' });
    }
};

// Eliminar un pedido
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado.' });
        }

        await OrderItem.destroy({ where: { orderId: id } });
        await order.destroy();

        res.json({ message: 'Pedido eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar pedido:', error);
        res.status(500).json({ message: 'Error interno al eliminar pedido.' });
    }
};


// Ventas totales del mes actual
const getMonthlySales = async (req, res) => {
    try {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const totalSales = await OrderItem.sum('quantity', {
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        res.json({ total: totalSales || 0 });
    } catch (err) {
        console.error('Error al obtener ventas del mes:', err);
        res.status(500).json({ message: 'Error al obtener ventas del mes' });
    }
};

// Gráfico de ventas por día
const getSalesByDate = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // últimos 30 días

        const result = await OrderItem.findAll({
            attributes: [
                [fn('DATE', col('"OrderItem"."createdAt"')), 'date'],

                [fn('SUM', col('quantity')), 'total']
            ],
            include: [{
                model: Product,
                attributes: []
            }],
            where: {
                createdAt: {
                    [Op.gte]: startDate
                }
            },
            group: ['date'],
            order: [[literal('date'), 'ASC']],
            raw: true
        });

        res.json(result);
    } catch (error) {
        console.error('Error al obtener ventas por fecha:', error);
        res.status(500).json({ message: 'Error al obtener ventas por fecha' });
    }
};

// Productos más vendidos
const getTopProducts = async (req, res) => {
    try {
        const results = await OrderItem.findAll({
            attributes: [
                'productId',
                [sequelize.fn('COUNT', sequelize.col('productId')), 'ventas']
            ],
            include: [{
                model: Product,
                attributes: ['name', 'price', 'image', 'stock'], // 👈 asegurate que 'stock' esté acá
            }],
            group: ['productId', 'Product.id'],
            order: [[sequelize.literal('ventas'), 'DESC']],
            limit: 5,
        });

        res.json(results);
    } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Ingresos de hoy por producto
const getTodayIncome = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const result = await OrderItem.findAll({
            attributes: [
                'productId',
                [fn('SUM', literal('"quantity" * "unitPrice"')), 'income']
            ],
            include: [{
                model: Product,
                attributes: ['name']
            }],
            where: {
                createdAt: {
                    [Op.between]: [today, tomorrow]
                }
            },
            group: ['productId', 'Product.id']
        });

        res.json(result);
    } catch (err) {
        console.error('Error al obtener ingresos de hoy:', err);
        res.status(500).json({ message: 'Error al obtener ingresos de hoy' });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    getMonthlySales,
    getSalesByDate,
    getTopProducts,
    getTodayIncome
};
