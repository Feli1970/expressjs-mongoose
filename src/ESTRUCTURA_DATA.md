public/
│
uploads/
│   └── comprobantes/
src/
├── _config/
│   ├── multerFile.js
│   └── db.js
├── AUTH/
│   ├── controllers/
│   │   └── authController.js
│   ├── models/
│   │   └── Auth.js
│   ├── routers/
│   │   └── router-auth.js
│   ├── views/
│       ├── register-page.ejs
│       └── login-page.ejs
├── USUARIOS/
│   ├── controllers/
│   │   └── usuariosController.js
│   ├── models/
│   │   └── Usuario.js
│   ├── routers/
│   │   └── router-usuarios.js
│   ├── views/
│       ├── dashboard-admin-page.ejs
│       └── dashboard-usuario-page.ejs
├── INVERSIONES/
│   ├── controllers/
│   │   └── inversionesController.js
│   ├── models/
│   │   └── Inversion.js
│   ├── routers/
│   │   └── router-inversiones.js
│   ├── views/
│       ├── inversiones.ejs
│       ├── detalleInversion.ejs
│       └── formInversion.ejs
├── RETIROS/
│   ├── controllers/
│   │   └── retirosController.js
│   ├── models/
│   │   └── Retiro.js
│   ├── routers/
│   │   └── router-retiros.js
│   ├── views/
│       ├── retiros.ejs
│       ├── detalleRetiro.ejs
│       └── formRetiro.ejs
└── app.js
