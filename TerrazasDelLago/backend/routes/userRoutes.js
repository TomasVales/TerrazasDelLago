const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const {
    getAllUsers,
    getCurrentUser,
    updateUserProfile
} = require('../controllers/userController'); // 👈 Acá debe estar getAllUsers

const router = express.Router();

router.get('/', verifyToken, isAdmin, getAllUsers); // 👈 Ruta para admin
router.get('/me', verifyToken, getCurrentUser);
router.put('/me', verifyToken, updateUserProfile);

module.exports = router;
