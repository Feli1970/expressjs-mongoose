import express from 'express';
const router = express.Router();
// Rutas de paginas de autenticacion
router.get('/register', (req, res) => {
    res.render('AUTH/views/index', {secciones:"register-page", header:false});
})

router.get('/login', (req, res) => {
    res.render('AUTH/views/index', {secciones:"login-page", header:false});
});

router.get('/nosotros', (req, res) => {
    res.render('AUTH/views/index', {secciones:"nosotros-page", header:false});
});

router.get('/', (req, res) => {
    res.render('AUTH/views/index', {secciones:"inicio-page", header:true});
});

export default router; // Aquí usamos export default