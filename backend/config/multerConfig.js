const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Obtener la ruta absoluta al directorio backend
const backendDir = path.resolve(__dirname, '..'); // Retrocede un nivel hasta /backend

// Ruta absoluta a la carpeta de uploads dentro de backend/public
const uploadDir = path.join(backendDir, 'public', 'uploads');

// Crear la carpeta si no existe (con recursión para crear todas las carpetas necesarias)
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Directorio de uploads creado en: ${uploadDir}`);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Verificar nuevamente que el directorio existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, 'product-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (JPEG, PNG, WEBP)'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Mensaje de verificación
console.log('Multer configurado para guardar imágenes en:', uploadDir);

module.exports = upload;