
const { body } = require('express-validator');

const validateProduct = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('type')
        .notEmpty().withMessage('El tipo es obligatorio'),
    body('price')
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
];

module.exports = validateProduct;
