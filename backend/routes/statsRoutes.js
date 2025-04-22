const express = require('express');
const router = express.Router();
const {
    getMonthlySales,
    getSalesByDate,
    getTopProducts,
    getTodayIncome,
} = require('../controllers/orderController');

const { getStats } = require('../controllers/statsController'); // <- lo importás bien así
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Todas las rutas requieren admin
router.get('/', verifyToken, isAdmin, getStats);
router.get('/monthly-sales', verifyToken, isAdmin, getMonthlySales);
router.get('/sales-by-date', verifyToken, isAdmin, getSalesByDate);
router.get('/top-products', verifyToken, isAdmin, getTopProducts);
router.get('/today-income', verifyToken, isAdmin, getTodayIncome);

module.exports = router;
