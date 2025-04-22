const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware obligatorio para rutas protegidas
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};

// Middleware para rutas opcionalmente protegidas (usuarios invitados)
const verifyTokenOptional = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // No se envió token → dejar pasar como invitado
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        // Si el token es inválido, simplemente continúa sin `req.user`
    }

    next();
};

// Middleware para validar rol admin
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: Solo admins' });
    }
    next();
};

module.exports = {
    verifyToken,
    verifyTokenOptional,
    isAdmin
};
