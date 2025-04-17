const Product = require('../models/products');
const fs = require('fs');
const path = require('path');

const backendDir = path.resolve(__dirname, '..');
const uploadDir = path.join(backendDir, 'public', 'uploads');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products); // 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cargar productos' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, type, price, description } = req.body;


        let imagePath = '';
        if (req.file) {
            imagePath = '/uploads/' + req.file.filename;
        }

        const product = await Product.create({
            name,
            image: imagePath,
            type,
            price,
            description
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Error al crear producto:', error);


        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '../public', req.file.path));
        }

        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};
const getProductById = async (req, res) => {
    const { id } = req.params;

    // Strict validation - only allow positive integers
    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ message: "El ID debe ser un número entero positivo" });
    }

    try {
        const product = await Product.findByPk(Number(id));
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { name, type, price, existingImage } = req.body;

        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        let imagePath = existingImage || product.image;

        if (req.file) {
            if (product.image) {
                const oldImagePath = path.join(__dirname, '../public', product.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            imagePath = '/uploads/' + req.file.filename;
        }

        await product.update({ name, image: imagePath, type, price });

        // ¡Asegúrate de devolver la ruta de la imagen actualizada o existente!
        res.json({
            ...product.get({ plain: true }),
            image: imagePath // Esto es crítico
        });

    } catch (err) {
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '../public', req.file.path));
        }
        res.status(400).json({ error: err.message });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        if (product.image) {
            const imagePath = path.join(uploadDir, path.basename(product.image));

            // Verificación adicional de seguridad
            if (!imagePath.startsWith(uploadDir)) {
                throw new Error('Intento de acceso a ruta no permitida');
            }

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Imagen eliminada: ${imagePath}`);
            } else {
                console.warn(`Imagen no encontrada en: ${imagePath}`);
            }
        }

        await product.destroy();
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({
            error: 'Error interno al eliminar el producto',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};
