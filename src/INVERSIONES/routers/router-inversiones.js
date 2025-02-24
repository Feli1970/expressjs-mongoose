const express = require('express');
const router = express.Router();
const { 
  crearInversion, 
  getInversionesByUser, 
  getInversionByUser, 
  actualizarEstadoInversion, 
  eliminarInversion, 
  getTodasInversiones,
  getTodasInversionesSearch
} = require('../controllers/inversionesController');
const { isAuthenticated, hasRole } = require('../../_middlewares/authMiddleware');
const upload = require('../../_config/multerFile');

// Rutas para el usuario
router.post('/', upload.single('comprobante_foto_recibo_pago'), isAuthenticated, crearInversion); // Crear una nueva inversión
router.get('/user', isAuthenticated, getInversionesByUser); // Obtener todas las inversiones del usuario
router.get('/user/:id_inversion', isAuthenticated, getInversionByUser); // Obtener una inversión específica del usuario

// Rutas para el administrador o subdirector
router.put('/:id_inversion', isAuthenticated, actualizarEstadoInversion); // Actualizar estado de una inversión
router.delete('/:id_inversion', isAuthenticated, hasRole(['admin', 'subdirector']), eliminarInversion); // Eliminar una inversión
// -- router.get('/all', isAuthenticated, hasRole(['admin', 'subdirector']), getTodasInversiones); // Ver todas las inversiones
router.get('/all', isAuthenticated, getTodasInversiones); // Ver todas las inversiones

//codeOrUser, tipoEstado
router.post('/all/search', isAuthenticated, getTodasInversionesSearch); // Ver todas las inversiones

module.exports = router;