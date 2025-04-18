const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');



// ✅ Importás solo las funciones del controlador
const {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
} = require('../controllers/orderController');

// ✅ Usa verifyToken (no authMiddleware)
router.post(
    '/',
    verifyToken,
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
            .isLength({ max: 300 }).withMessage('Las notas no pueden superar los 300 caracteres')
    ],
    createOrder
);

router.get('/user', verifyToken, getUserOrders);
router.get('/', verifyToken, isAdmin, getAllOrders);
router.put('/:id', verifyToken, isAdmin, updateOrderStatus);
router.delete('/:id', verifyToken, isAdmin, deleteOrder);

module.exports = router;
