const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: 'Faltan datos' });

        const existing = await User.findOne({ where: { email } });
        if (existing)
            return res.status(400).json({ message: 'El correo ya está registrado' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });

        res.status(201).json({ message: 'Usuario creado con éxito', user: { id: user.id, name: user.name } });
    } catch (err) {
        console.error('Error al registrar:', err);
        res.status(500).json({ message: 'Error en el registro' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Error login:', err);
        res.status(500).json({ message: 'Error en el login' });
    }
}

module.exports = { register, login };
