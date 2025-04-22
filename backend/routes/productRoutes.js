const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');
const { body } = require('express-validator');
const Product = require('../models/products');


// 🟢 Ruta para obtener productos destacados (ANTES de /:id)
router.get('/featured', async (req, res) => {
    try {
        const featured = await Product.findAll({ where: { isFeatured: true } });
        res.json(featured);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener productos destacados.' });
    }
});

// 🔄 Ruta para marcar producto como destacado (limita a 3)
router.put('/:id/featured', verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { isFeatured } = req.body;

    try {
        const totalFeatured = await Product.count({ where: { isFeatured: true } });

        if (isFeatured === true && totalFeatured >= 3) {
            return res.status(400).json({ message: 'Solo se pueden destacar hasta 3 productos.' });
        }

        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });

        product.isFeatured = isFeatured;
        await product.save();

        res.json({ message: 'Producto actualizado como destacado.', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar destacado.' });
    }
});

// 🔍 Obtener todos los productos
router.get('/', productController.getAllProducts);

// 🔍 Obtener un producto por ID
router.get('/:id', productController.getProductById);

// 🔐 Crear producto (admin)
router.post(
    '/',
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
    productController.createProduct
);

// ✏️ Editar producto
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

// 🗑️ Eliminar producto
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
