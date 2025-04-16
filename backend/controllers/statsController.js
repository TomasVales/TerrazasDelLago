const User = require('../models/user');
const Order = require('../models/order');

const getStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalOrders = await Order.count();

        res.json({
            users: totalUsers,
            orders: totalOrders
        });
    } catch (err) {
        console.error('Error al obtener estadísticas:', err);
        res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
};

module.exports = { getStats }; // ✅ esto va con llaves
