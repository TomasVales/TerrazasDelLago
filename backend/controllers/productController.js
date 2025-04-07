const Product = require('../models/products');
const fs = require('fs');
const path = require('path');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products); // ✅ devolvés directamente el array
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cargar productos' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, type, price, description } = req.body;

        // Verificar si se subió una imagen
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

        // Eliminar la imagen subida si hubo error
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

        // Si se subió una nueva imagen
        if (req.file) {
            // Eliminar la imagen anterior si existe
            if (product.image) {
                const oldImagePath = path.join(__dirname, '../public', product.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            imagePath = '/uploads/products/' + req.file.filename;
        }

        await product.update({
            name,
            image: imagePath,
            type,
            price
        });

        res.json(product);
    } catch (err) {
        // Eliminar la imagen subida si hubo un error
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

        // Eliminar la imagen asociada si existe
        if (product.image) {
            const imagePath = path.join(__dirname, '../public', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await product.destroy();
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};
