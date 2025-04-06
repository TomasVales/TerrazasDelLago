const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Product = require('../models/products');
const User = require('../models/user');

// Crear nuevo pedido
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, address, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'El pedido no contiene productos.' });
        }

        // Crear el pedido vacío con total = 0 por ahora
        const order = await Order.create({
            userId,
            total: 0,
            address,
            notes
        });

        let total = 0;

        // Insertar los ítems uno por uno
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

        // Actualizar el total del pedido
        order.total = total;
        await order.save();

        res.status(201).json({ message: 'Pedido creado con éxito.', orderId: order.id, total });
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
            where: { UserId: userId }, // ✅ corrección clave
            include: [{ model: OrderItem, include: [Product] }],
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
        const { status } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado.' });
        }

        order.status = status;
        await order.save();

        res.json({ message: 'Estado del pedido actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        res.status(500).json({ message: 'Error interno al actualizar pedido.' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificamos que el pedido exista
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado.' });
        }

        // Eliminamos los ítems del pedido primero
        await OrderItem.destroy({ where: { orderId: id } });

        // Luego el pedido
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
