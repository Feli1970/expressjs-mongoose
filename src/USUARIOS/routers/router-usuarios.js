const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../../_middlewares/authMiddleware');

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

module.exports = router;