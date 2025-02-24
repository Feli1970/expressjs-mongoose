import express from 'express';
import path from 'path';
import session from 'express-session';
import connectDB from './_config/db.js'; // Asegúrate de usar la extensión `.js` si es un archivo JS
import dotenv from 'dotenv';

dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la sesión
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Cambia esto si usas HTTPS
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(path.dirname(import.meta.url), './src')); // Ajuste aquí para usar import.meta.url
app.use('/uploads', express.static(path.join(path.dirname(import.meta.url), 'uploads'))); // Ajuste aquí
app.use('/public', express.static(path.join(path.dirname(import.meta.url), 'public'))); // Ajuste aquí

// Importar rutas
import authRoutesViews from './AUTH/routers/router-auth.js';
import authRoutesApi from './AUTH/routers/router-auth-apis.js';
import usuariosRoutesViews from './USUARIOS/routers/router-usuarios.js';
import usuariosRoutesApi from './USUARIOS/routers/router-usuarios-apis.js';
import inversionesRoutes from './INVERSIONES/routers/router-inversiones.js';
import retirosRoutes from './RETIROS/routers/router-retiros.js';

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
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
