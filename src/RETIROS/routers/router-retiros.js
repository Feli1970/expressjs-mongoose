import express from 'express';
import { solicitarRetiro, getRetirosPendientes, autorizarRetiro, getRetirosPendientesAdmin } from '../controllers/retirosController.js'; // Usamos import { ... } en vez de require
import upload from '../../_config/multerFile.js'; // Usamos import en vez de require

const router = express.Router();

// Rutas de retiros
router.post('/:inversionId/:mesId', solicitarRetiro); // Solicitar un retiro
router.get('/pending', getRetirosPendientes); // Listar retiros pendientes para una inversión específica
router.put('/:inversionId/:mesId', upload.single('comprobante_foto_recibo_pago'), autorizarRetiro); // Aprobar/rechazar un retiro
router.get('/admin/pending/all', getRetirosPendientesAdmin); // Listar retiros pendientes para el administrador

export default router; // Exportamos el router