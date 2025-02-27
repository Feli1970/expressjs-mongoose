// src/middlewares/authMiddleware.js
// Verificar autenticación
  export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    return res.redirect('/auth/login'); // Redirigir al login si no está autenticado
  };
  
  // Verificar rol
  export const hasRole = (roles) => {
    return (req, res, next) => {
      if (req.session && req.session.user && roles.includes(req.session.user.rol)) {
        return next();
      }
      return res.status(403).send('Acceso denegado. No tienes los permisos necesarios.');
    };
  };
  