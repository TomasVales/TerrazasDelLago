const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const upload = require('../config/multerConfig');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { getAllUsers, getCurrentUser, updateUserProfile } = require('../controllers/userController');





router.get('/', verifyToken, isAdmin, getAllUsers);


router.get('/me', verifyToken, getCurrentUser);


router.put(
    '/me',
    verifyToken,
    upload.single('image'),
    [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    ],
    updateUserProfile
);

module.exports = router;
