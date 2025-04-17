
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas para admin
router.post(
    '/',
    verifyToken,
    isAdmin,
    upload.single('image'), // 'image' debe coincidir con el name del input file
    productController.createProduct
);

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    upload.single('image'),
    productController.updateProduct
);

router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;