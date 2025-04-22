const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { verifyToken, isAdmin, verifyTokenOptional } = require('../middlewares/authMiddleware');

// ✅ Importás las funciones del controlador
const {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
} = require('../controllers/orderController');

// 🟢 Ruta para crear orden (logueado o invitado)
router.post(
    '/',
    verifyTokenOptional,
    [
        body('items')
            .isArray({ min: 1 }).withMessage('El pedido debe tener al menos un producto'),

        body('items.*.productId')
            .isInt({ min: 1 }).withMessage('ID de producto inválido'),

        body('items.*.quantity')
            .isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),

        body('address')
            .trim()
            .notEmpty().withMessage('La dirección de entrega es obligatoria'),

        body('notes')
            .optional()
            .trim()
            .isLength({ max: 300 }).withMessage('Las notas no pueden superar los 300 caracteres'),

        body('guestName')
            .if((value, { req }) => !req.user) // Solo validar si no hay user
            .notEmpty().withMessage('Debe estar logueado o indicar un nombre de invitado.')
    ],
    createOrder
);

// 🔒 Ordenes del usuario autenticado
router.get('/user', verifyToken, getUserOrders);

// 🔒 Admin: obtener todas las órdenes
router.get('/', verifyToken, isAdmin, getAllOrders);

// 🔒 Admin: cambiar estado
router.put('/:id', verifyToken, isAdmin, updateOrderStatus);

// 🔒 Admin: eliminar orden
router.delete('/:id', verifyToken, isAdmin, deleteOrder);

module.exports = router;
