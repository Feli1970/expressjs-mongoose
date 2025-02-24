// /_config/multerFile.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.session.user?.id; // Asegúrate de que el ID del usuario esté disponible en la sesión
        const userFolder = path.join('uploads/comprobantes', userId.toString());

        // Crear la carpeta si no existe
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        cb(null, userFolder);
    },
    filename: (req, file, cb) => {
        const userId = req.session.user?.id; // Asegúrate de que el ID del usuario esté disponible en la sesión
        cb(null, `${userId.toString()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
                    allowedTypes.test(file.mimetype);
    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos JPEG, JPG, y PNG'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
});

module.exports = upload;