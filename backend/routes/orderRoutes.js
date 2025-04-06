const express = require('express');
const router = express.Router();
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
router.post('/', verifyToken, createOrder);
router.get('/user', verifyToken, getUserOrders);
router.get('/', verifyToken, isAdmin, getAllOrders);
router.put('/:id', verifyToken, isAdmin, updateOrderStatus);
router.delete('/:id', verifyToken, isAdmin, deleteOrder);

module.exports = router;
