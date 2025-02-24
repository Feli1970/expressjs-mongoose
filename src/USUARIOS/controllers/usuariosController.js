//const Usuario = require('../models/Usuario');
import Usuario from '../models/Usuario.js'; // Importa el modelo de Usuario

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

/**
 * @description Obtener el método de pago del usuario autenticado
 * @param {Object} req - Solicitud HTTP (debe incluir la información del usuario autenticado en `req.session.user.id`)
 * @param {Object} res - Respuesta HTTP
 * @returns {Object} Método de pago del usuario
 */
export const getConfigurarMetodoPagoUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ "authId": req.params.id });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Verificar si el usuario tiene configuración de método de pago
    const metodoPago = {
      cuentas_digitales: usuario.cuentas_digitales,
      cuentas_bancaria: usuario.cuentas_bancaria,
      cuenta: usuario.cuenta,
      numero_identificacion:usuario.numero_identificacion,
      nombre_completo:usuario.nombre_completo
    };

    res.status(200).json(metodoPago);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el método de pago', error: error.message });
  }
};

/**
 * @description Crear o establecer el método de pago del usuario autenticado
 * @param {Object} req - Solicitud HTTP (debe incluir el cuerpo con  `req.body`)
 * @param {Object} res - Respuesta HTTP
 * @returns {Object} Mensaje de éxito o error
 */
export const createConfigurarMetodoPagoUsuario = async (req, res) => {
  const { tipo } = req.body;

  // Validación de entrada
  if (!tipo) {
    return res.status(400).json({ message: 'Tipo y número son requeridos' });
  }

  try {
    // Buscar al usuario autenticado
    let usuario = await Usuario.findOne({ authId: req.session.user.id });

    if (!usuario) {
      // Crear un nuevo usuario si no existe
      usuario = new Usuario({
        authId: req.session.user.id, // Asignar automáticamente el authId del usuario autenticado
      });
    }

    // Validación para cuentas digitales y bancarias
    if (tipo === 'digitales') {
      
      
      const { tipo_cuenta, numero_cuenta, numero_identificacion, nombre_completo } = req.body;

      if (!tipo_cuenta || !numero_cuenta) {
        return res.status(400).json({ message: 'Tipo de cuenta digital y número de cuenta son requeridos' });
      }

      usuario.cuentas_digitales = { tipo_cuenta, numero_cuenta };
      usuario.cuenta.digitales = true;
      usuario.cuenta.bancaria = false;
      usuario.numero_identificacion = numero_identificacion
      usuario.nombre_completo = nombre_completo

    } else if (tipo === 'bancaria') {
      const { nombre_de_entidad_bancaria, tipo_cuenta, numero_cuenta, numero_identificacion, nombre_completo } = req.body;

      if (!nombre_de_entidad_bancaria || !tipo_cuenta || !numero_cuenta) {
        return res.status(400).json({ message: 'Nombre de entidad bancaria, tipo de cuenta y número de cuenta son requeridos' });
      }
      usuario.cuentas_bancaria = { nombre_de_entidad_bancaria, tipo_cuenta, numero_cuenta };
      usuario.cuenta.digitales = false;
      usuario.cuenta.bancaria = true;
      usuario.numero_identificacion = numero_identificacion
      usuario.nombre_completo = nombre_completo
    } else {
      return res.status(400).json({ message: 'Tipo de pago no válido' });
    }

    // Guardar el usuario con el método de pago configurado
    await usuario.save();
    
    res.status(201).json({ message: 'Método de pago configurado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el método de pago', error: error.message });
  }
};

/**
 * @description Actualizar el método de pago del usuario autenticado
 * @param {Object} req - Solicitud HTTP (debe incluir el cuerpo con `tipo` y `numero` en `req.body`)
 * @param {Object} res - Respuesta HTTP
 * @returns {Object} Mensaje de éxito o error
 */
export const updateConfigurarMetodoPagoUsuario = async (req, res) => {
  const { tipo, tipo_cuenta, numero_cuenta, nombre_de_entidad_bancaria } = req.body;

  // Validación de entrada
  if (!tipo || (!tipo_cuenta && !numero_cuenta)) {
    return res.status(400).json({ message: 'Tipo de pago y número de cuenta son requeridos' });
  }

  try {
    const usuario = await Usuario.findById(req.session.user.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Actualizar según el tipo de pago
    if (tipo === 'digitales') {
      usuario.cuentas_digitales = { tipo_cuenta, numero_cuenta };
      usuario.cuenta.digitales = true;
      usuario.cuenta.bancaria = false;
    } else if (tipo === 'bancaria') {
      usuario.cuentas_bancaria = { nombre_de_entidad_bancaria, tipo_cuenta, numero_cuenta };
      usuario.cuenta.digitales = false;
      usuario.cuenta.bancaria = true;
    } else {
      return res.status(400).json({ message: 'Tipo de pago no válido' });
    }

    // Guardar los cambios
    await usuario.save();

    res.status(200).json({ message: 'Método de pago actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el método de pago', error: error.message });
  }
};

/**
 * @description Eliminar el método de pago del usuario autenticado
 * @param {Object} req - Solicitud HTTP (debe incluir la información del usuario autenticado en `req.session.user.id`)
 * @param {Object} res - Respuesta HTTP
 * @returns {Object} Mensaje de éxito o error
 */
export const deleteConfigurarMetodoPagoUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.session.user.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Eliminar el método de pago (se pueden eliminar ambas configuraciones)
    usuario.cuentas_digitales = undefined;
    usuario.cuentas_bancaria = undefined;
    usuario.cuenta.digitales = false;
    usuario.cuenta.bancaria = false;

    // Guardar los cambios
    await usuario.save();

    res.status(200).json({ message: 'Método de pago eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el método de pago', error: error.message });
  }
};