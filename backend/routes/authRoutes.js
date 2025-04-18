// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, googleLogin } = require('../controllers/authController');

router.post(
    '/register',
    [
        body('name')
            .trim()
            .notEmpty().withMessage('El nombre es obligatorio')
            .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
            .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/).withMessage('El nombre solo debe contener letras y espacios'),

        body('email')
            .trim()
            .isEmail().withMessage('Correo electrónico inválido'),

        body('password')
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    ],
    register
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email inválido'),
        body('password').notEmpty().withMessage('La contraseña es obligatoria'),
        body('captchaToken').notEmpty().withMessage('Captcha requerido')
    ],
    login
);
router.post('/google', googleLogin); // 👈 esta es la nueva ruta para Google

module.exports = router;
