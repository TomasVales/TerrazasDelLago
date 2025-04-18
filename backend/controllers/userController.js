const User = require('../models/user');
const fs = require('fs');
const path = require('path');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ message: 'Error al obtener usuarios.' });
    }
};

// GET /api/users/me

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'image', 'role'] // 👈 ACA te falta agregar 'image'
        });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
};

// PUT /api/users/me
const updateUserProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const { name } = req.body;
        if (name && name.length > 1) user.name = name;

        // 👇 Si se sube una nueva imagen
        if (req.file) {
            const newImagePath = `/uploads/${req.file.filename}`;

            // 👇 Borrar la imagen anterior si existe
            if (user.image && user.image !== newImagePath) {
                const oldImagePath = path.join(__dirname, '..', 'public', user.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.warn('No se pudo eliminar la imagen anterior:', err.message);
                    else console.log('Imagen anterior eliminada:', user.image);
                });
            }

            // Guardar nueva imagen
            user.image = newImagePath;
        }

        await user.save();

        res.json({
            message: 'Perfil actualizado',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image
            }
        });
    } catch (err) {
        console.error('Error actualizando perfil:', err);
        res.status(500).json({ message: 'Error interno' });
    }
};

module.exports = {
    getAllUsers, getCurrentUser,
    updateUserProfile
};
