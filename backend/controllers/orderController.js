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
        const userId = req.user.id;
        const { items, address, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'El pedido no contiene productos.' });
        }

        // Crear el pedido con total 0 por ahora
        const order = await Order.create({
            userId,
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

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
};
