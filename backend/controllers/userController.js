const User = require('../models/user');

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
            attributes: ['id', 'name', 'email']
        });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
};

// PUT /api/users/me
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const { name } = req.body;
        if (name && name.length > 1) user.name = name;

        await user.save();
        res.json({ message: 'Perfil actualizado', user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Error actualizando perfil:', err);
        res.status(500).json({ message: 'Error interno' });
    }
};

module.exports = {
    getAllUsers, getCurrentUser,
    updateUserProfile
};
