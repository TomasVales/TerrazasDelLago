const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const {
    getAllUsers,
    getCurrentUser,
    updateUserProfile
} = require('../controllers/userController');

const upload = require('../config/multerConfig');

const router = express.Router();


router.get('/', verifyToken, isAdmin, getAllUsers);


router.get('/me', verifyToken, getCurrentUser);


router.put('/me', verifyToken, upload.single('image'), updateUserProfile);

module.exports = router;
