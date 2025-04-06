const Order = require('./order');
const OrderItem = require('./orderItem');
const Product = require('./products');
const User = require('./user');

// Relaciones
Order.belongsTo(User); // Order.userId
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });