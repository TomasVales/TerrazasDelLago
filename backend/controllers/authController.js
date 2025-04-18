const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const { validationResult } = require('express-validator');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Registro con validación de reCAPTCHA
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    try {
        const { name, email, password, captchaToken } = req.body;

        if (!name || !email || !password || !captchaToken)
            return res.status(400).json({ message: 'Faltan datos' });

        // Validar reCAPTCHA
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
        const response = await axios.post(verifyUrl);

        if (!response.data.success) {
            return res.status(400).json({ message: 'Captcha inválido. Por favor, verificalo.' });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing)
            return res.status(400).json({ message: 'El correo ya está registrado' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });

        res.status(201).json({
            message: 'Usuario creado con éxito',
            user: { id: user.id, name: user.name }
        });
    } catch (err) {
        console.error('❌ Error al registrar:', err);
        res.status(500).json({ message: 'Error en el registro', error: err.message });
    }
};

// Login clásico con validación de reCAPTCHA
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    try {
        const { email, password, captchaToken } = req.body;

        if (!captchaToken) return res.status(400).json({ message: 'Captcha requerido' });

        // Validar reCAPTCHA
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
        const response = await axios.post(verifyUrl);

        if (!response.data.success) {
            return res.status(400).json({ message: 'Captcha inválido.' });
        }

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
};

// Login con Google
const googleLogin = async (req, res) => {
    const { credential } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ where: { email } });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: 'google_auth',
                role: 'user'
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
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
        console.error('Error login Google:', err);
        res.status(401).json({ message: 'Token de Google inválido' });
    }
};

module.exports = { register, login, googleLogin };
