const Product = require('../models/products');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        // Si no hay productos, devuelve array vacío (no error)
        res.status(200).json({
            success: true,
            data: products || [] // Asegura que siempre sea array
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Error al cargar productos"
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price } = req.body;
        const product = await Product.create({ name, image, type, price });
        res.status(201).json(product);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error al crear producto' });
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
        const { name, image, type, price } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        await product.update({ name, image, type, price });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

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
