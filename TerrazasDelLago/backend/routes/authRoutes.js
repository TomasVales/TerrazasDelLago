// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, googleLogin } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin); // 👈 esta es la nueva ruta para Google

module.exports = router;
