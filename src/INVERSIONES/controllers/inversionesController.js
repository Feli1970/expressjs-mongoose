const Inversion = require('../models/Inversion');
const Usuario = require('../../USUARIOS/models/Usuario');

const sumarMeses = (fecha, meses) => {
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setMonth(nuevaFecha.getMonth() + meses);
  return nuevaFecha.toISOString().split('T')[0]; // Retorna en formato YYYY-MM-DD
};

// Crear una inversión
exports.crearInversion = async (req, res) => {
  const { id } = req.session.user || {};
  const { monto, cantidad_plasos_mes: plazoMeses } = req.body;

  try {
    // Validación básica de entrada
    if (!monto || !plazoMeses) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    // Calcular rendimiento usando objeto de mapeo
    const rendimientos = {
      '3': 5,
      '6': 15,
      '12': 20
    };
    const rendimiento = rendimientos[plazoMeses] || 5;

    // Buscar usuario y validar
    const usuario = await Usuario.findOne({ "authId": id });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Crear inversión
    const nuevaInversion = await Inversion.create({
      monto: monto,
      cantidad_plazos_mes: plazoMeses,
      rendimiento,
      usuarioId: usuario._id,
      comprobante_foto_recibo_pago: req.file?.filename || null
    });

    // Calcular rendimientos por mes y agregarlos a mes_valor_inversion
    const fechaActual = '2024-11-15'// new Date(); // Usar la fecha actual
    for (let i = 1; i <= nuevaInversion.cantidad_plazos_mes; i++) {
      const mes = sumarMeses(fechaActual, i); // Sumar meses a la fecha actual
      const valor = (nuevaInversion.monto * nuevaInversion.rendimiento) / 100; // Calcular el valor del rendimiento
      nuevaInversion.mes_valor_inversion.push({
        mes,
        valor,
        estado: "En proceso",
        creado_por: usuario._id
      });
    }

    // Guardar cambios en la inversión
    await nuevaInversion.save();

    // Actualizar usuario
    usuario.inversiones.push({ inversionId: nuevaInversion._id });
    await usuario.save();

    // Respuesta segura (excluyendo datos sensibles)
    const responseData = {
      id: nuevaInversion._id,
      monto: nuevaInversion.monto,
      plazo: nuevaInversion.cantidad_plazos_mes,
      rendimiento: nuevaInversion.rendimiento
    };

    return res.status(200).json({
      message: 'Inversión creada exitosamente',
      inversion: responseData
    });
  } catch (error) {
    console.log('Error en crearInversion:', error);
    return res.status(500).json({
      message: 'Error al procesar la solicitud',
      error: process.env.NODE_ENV === 'dev' ? error.message : 'Detalles ocultos en producción'
    });
  }
};
exports.getInversionesByUser = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({'authId':req.session.user.id})
    const inversiones = await Inversion.find({ usuarioId: usuario._id }); // Solo inversiones del usuario autenticado
    res.status(200).json(inversiones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener inversiones', error: error.message });
  }
};

exports.getInversionByUser = async (req, res) => {
  const { id_inversion } = req.params;
  try {
    const usuario = await Usuario.findOne({'authId':req.session.user.id})
    const inversion = await Inversion.findOne({
      _id: id_inversion,
      usuarioId: usuario._id,
    }); // Solo la inversión específica del usuario autenticado

    if (!inversion) {
      return res.status(404).json({ message: 'Inversión no encontrada' });
    }

    res.status(200).json(inversion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la inversión', error: error.message });
  }
};

// Funciones para el administrador o subdirector
exports.actualizarEstadoInversion = async (req, res) => {
  const { id_inversion } = req.params;
  const { estado } = req.body;
  try {
    const inversion = await Inversion.findById(id_inversion);
    if (!inversion) return res.status(404).json({ message: 'Inversión no encontrada' });

    inversion.estado = estado;
    await inversion.save();
    res.status(200).json({ message: 'Estado de inversión actualizado', inversion });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado de la inversión', error: error.message });
  }
};

exports.eliminarInversion = async (req, res) => {
  const { id_inversion } = req.params;

  try {
    const inversion = await Inversion.findByIdAndDelete(id_inversion);
    if (!inversion) return res.status(404).json({ message: 'Inversión no encontrada' });

    res.status(200).json({ message: 'Inversión eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar inversión', error: error.message });
  }
};

exports.getTodasInversiones = async (req, res) => {
  try {
    const inversiones = await Inversion.find().populate({
      path: 'usuarioId',
      select: '+cartera +authId +cuenta +cuentas_digitales +cuentas_bancaria +inversiones +nombre_completo +numero_identificacion'
    });
    res.status(200).json(inversiones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener inversiones', error: error.message });
  }
};

/**
 * // codeOrUser buscar por codigo o por usuario sea por nombre_completo o numero_indentificacion por el id de la inverison un que mas bien voy a crear a futuro un codigo unico
  // el codigo creo que va hacer a futuro // 0000000-inv-2014-02-15 consetutivos 00001-inv-2014-02-15 00002-inv-2014-02-15 etc..
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

  exports.getTodasInversionesSearch = async (req, res) => {
    const { codeOrUser, tipoEstado } = req.body;
    console.log(req.body)
    try {
      // Crear el filtro de búsqueda
      const filtro = {
        $or: [
          { codigo: codeOrUser }, // Buscar por código único
          { 
            usuarioId: await Usuario.find({
              $or: [
                { nombre_completo: { $regex: codeOrUser, $options: 'i' } }, // Buscar por nombre (insensible a mayúsculas/minúsculas)
                { numero_identificacion: codeOrUser } // Buscar por número de identificación
              ]
            }).distinct('_id') // Obtener los IDs de los usuarios que coinciden
          }
        ]
      };
  
      // Si se especifica un estado, agregarlo al filtro
      //if (tipoEstado && tipoEstado !== "todos") {
      //  filtro.estado = tipoEstado;
      //}
      // Buscar inversiones con el filtro
      const inversiones = await Inversion.find(filtro).populate({
        path: 'usuarioId',
        select: '+cartera +authId +cuenta +cuentas_digitales +cuentas_bancaria +inversiones +nombre_completo +numero_identificacion'
      });
  
      // Si no se encuentran inversiones, retornar un mensaje
      if (inversiones.length === 0) {
        return res.status(404).json({ message: 'No se encontraron inversiones con los criterios de búsqueda proporcionados.' });
      }
  
      // Retornar las inversiones encontradas
      res.status(200).json(inversiones);
    } catch (error) {
      // Manejar errores
      res.status(500).json({ message: 'Error al obtener inversiones', error: error.message });
    }
  };