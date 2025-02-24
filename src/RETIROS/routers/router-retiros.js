const express = require('express');
const router = express.Router();
const retirosController = require('../controllers/retirosController');
const upload = require('../../_config/multerFile');

// Rutas de retiros
router.post('/:inversionId/:mesId', retirosController.solicitarRetiro); // Solicitar un retiro
router.get('/pending', retirosController.getRetirosPendientes); // Listar retiros pendientes para una inversión específica
router.put('/:inversionId/:mesId', upload.single('comprobante_foto_recibo_pago'), retirosController.autorizarRetiro); // Aprobar/rechazar un retiro
router.get('/admin/pending/all', retirosController.getRetirosPendientesAdmin); // Listar retiros pendientes para el administrador

module.exports = router;
