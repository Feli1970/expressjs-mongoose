import express from 'express';
const router = express.Router();
import { isAuthenticated, hasRole } from '../../_middlewares/authMiddleware.js'; // Cambio de require a import

// /usuarios/dashboard
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('USUARIOS/views/index', { user: req.session.user, container_page:'dashboard-usuario-page-container' });
});

// Ruta protegida para roles específicos (admin y subdirector)
//router.get('/admin/dashboard', isAuthenticated, hasRole(['admin', 'subdirector']), (req, res) => {
//    res.render('USUARIOS/views/dashboard-admin-page', { user: req.session.user });
//});

// Ruta protegida para roles específicos (admin y subdirector)
router.get('/admin/dashboard', isAuthenticated, (req, res) => {
    //res.render('USUARIOS/views/dashboard-admin-page', { user: req.session.user });
    res.render('USUARIOS/views/index', { user: req.session.user, container_page:'dashboard-admin-page-container' });
});


export default router; // Aquí usamos export default