const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // continúa a la ruta
    } else {
        res.status(403).json({ message: 'Acceso denegado. Solo para administradores.' });
    }
};

module.exports = isAdmin;
