const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const connectDB = require('./_config/db'); // Importar la conexión a MongoDB
require('dotenv').config();

// Conectar a MongoDB
connectDB();

// Session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Configura `secure: true` si usas HTTPS
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar motor de vistas
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, './src/'));
app.set('views', path.join(__dirname, './src'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));
// Importar rutas
const authRoutesViews = require('./AUTH/routers/router-auth');
const authRoutesApi = require('./AUTH/routers/router-auth-apis');
const usuariosRoutesViews = require('./USUARIOS/routers/router-usuarios');
const usuariosRoutesApi = require('./USUARIOS/routers/router-usuarios-apis');
const inversionesRoutes = require('./INVERSIONES/routers/router-inversiones');
const retirosRoutes = require('./RETIROS/routers/router-retiros');

// Configurar rutas
app.use('/', authRoutesViews);
app.use('/auth', authRoutesViews);
app.use('/api/auth', authRoutesApi);
app.use('/usuarios', usuariosRoutesViews);
app.use('/api/usuarios', usuariosRoutesApi);
app.use('/inversiones', inversionesRoutes);
app.use('/api/retiros', retirosRoutes);

app.use((req, res, next) => {
  console.log(`Ruta solicitada: ${req.path}`);
  next();
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
