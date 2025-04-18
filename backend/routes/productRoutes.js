
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');
const { body } = require('express-validator');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas para admin
router.post(
    '/',
    verifyToken,
    isAdmin,
    upload.single('image'), // name="image" en el form
    [
        body('name')
            .trim()
            .notEmpty().withMessage('El nombre del producto es obligatorio')
            .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),

        body('type')
            .notEmpty().withMessage('La categoría es obligatoria'),

        body('price')
            .notEmpty().withMessage('El precio es obligatorio')
            .isFloat({ min: 0 }).withMessage('El precio debe ser un número válido'),

        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 }).withMessage('La descripción no puede superar los 500 caracteres')
    ],
    productController.createProduct
);

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    upload.single('image'),
    [
        body('name')
            .trim()
            .notEmpty().withMessage('El nombre del producto es obligatorio')
            .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),

        body('type')
            .notEmpty().withMessage('La categoría es obligatoria'),

        body('price')
            .notEmpty().withMessage('El precio es obligatorio')
            .isFloat({ min: 0 }).withMessage('El precio debe ser un número válido'),

        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 }).withMessage('La descripción no puede superar los 500 caracteres')
    ],
    productController.updateProduct
);

router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;