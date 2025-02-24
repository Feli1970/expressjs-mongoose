const Auth = require('../models/Auth');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { nombre, email, celular, password } = req.body;

  // Eliminar espacios al inicio y al final de los campos
  const trimmedNombre = nombre.trim();
  const trimmedEmail = email.trim();
  const trimmedCelular = celular.trim();
  const trimmedPassword = password.trim();

  try {
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    const newUser = await Auth.create({ 
      nombre: trimmedNombre, 
      email: trimmedEmail, 
      celular: trimmedCelular, 
      password: hashedPassword 
    });

     // Almacenar información en la sesión
     req.session.user = {
      id: newUser._id,
      nombre: newUser.nombre,
      email: newUser.email,
    };

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: req.session.user });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Eliminar espacios al inicio y al final de los campos
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  try {
    const user = await Auth.findOne({ email: trimmedEmail });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });
  // Almacenar información en la sesión
    req.session.user = {
      id: user._id,
      nombre: user.nombre,
      email: user.email
    };
    res.status(200).json({ message: 'Inicio de sesión exitoso', user:req.session.user });
  } catch (error) {
    res.status(400).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

exports.logout = (req, res) => {
  try {
    // Eliminar información del usuario de la sesión
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al cerrar sesión', error: err.message });
      }
      res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al procesar cierre de sesión', error: error.message });
  }
};
