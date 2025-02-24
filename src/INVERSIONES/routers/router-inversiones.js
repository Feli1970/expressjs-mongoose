import express from 'express';
import { 
  crearInversion, 
  getInversionesByUser, 
  getInversionByUser, 
  actualizarEstadoInversion, 
  eliminarInversion, 
  getTodasInversiones,
  getTodasInversionesSearch 
} from '../controllers/inversionesController.js'; // Actualizamos la importación

import { isAuthenticated, hasRole } from '../../_middlewares/authMiddleware.js';
import upload from '../../_config/multerFile.js';

const router = express.Router();

// Rutas para el usuario
router.post('/', upload.single('comprobante_foto_recibo_pago'), isAuthenticated, crearInversion); // Crear una nueva inversión
router.get('/user', isAuthenticated, getInversionesByUser); // Obtener todas las inversiones del usuario
router.get('/user/:id_inversion', isAuthenticated, getInversionByUser); // Obtener una inversión específica del usuario

// Rutas para el administrador o subdirector
router.put('/:id_inversion', isAuthenticated, actualizarEstadoInversion); // Actualizar estado de una inversión
router.delete('/:id_inversion', isAuthenticated, hasRole(['admin', 'subdirector']), eliminarInversion); // Eliminar una inversión

router.get('/all', isAuthenticated, getTodasInversiones); // Ver todas las inversiones

// Para búsqueda
router.post('/all/search', isAuthenticated, getTodasInversionesSearch); // Ver todas las inversiones con búsqueda

export default router;
