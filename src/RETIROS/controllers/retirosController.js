import Inversion from '../../INVERSIONES/models/Inversion.js'; // Cambiar a import

import Usuario from '../../USUARIOS/models/Usuario.js'; // Cambiar a import

// Solicitar un retiro
export const solicitarRetiro = async (req, res) => {
  const { inversionId, mesId } = req.params;
  const { id } = req.session.user;

  try {
    console.log("Realizando solicitud de retiro")
    const inversion = await Inversion.findById(inversionId);
    if (!inversion) {
      return res.status(404).json({ message: 'Inversión no encontrada' });
    }

    const mesValor = inversion.mes_valor_inversion.id(mesId);
    if (!mesValor) {
      return res.status(404).json({ message: 'Mes de inversión no encontrado' });
    }

    mesValor.estado = "Solicitud de pago";
    mesValor.creado_por = id;
    await inversion.save();
    res.status(200).json({ message: 'Solicitud de retiro creada con éxito', retiro: mesValor });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al solicitar retiro', error: error.message });
  }
};

// Obtener retiros pendientes para una inversión específica
export const getRetirosPendientes = async (req, res) => {
  const { id } = req.session.user;
  try {
    const usuario = await Usuario.findOne({'authId':id});
    if (!usuario) {
      return res.status(404).json({ message: 'Inversión no encontrada' });
    }
     // Buscar todas las inversiones
     const retiros = await Inversion.find({'usuarioId':usuario._id}).lean();

     // Filtrar solo los retiros con estado 'Solicitud de pago'
     const solicitudesPendientes = await Promise.all(
       retiros.flatMap(async (retiro) => {
         // Filtrar mes_valor_inversion con estado 'Solicitud de pago'
         const retirosFiltrados = retiro.mes_valor_inversion.filter(mes => mes.estado === 'Solicitud de pago');
 
         // Si no hay retiros pendientes, no se procesa este retiro
         if (retirosFiltrados.length === 0) return [];
 
         // Obtener el usuario creador de la inversión
         const user = await Usuario.findById(retiro.usuarioId).select('nombre_completo cuenta cuentas_digitales').lean();
 
         // Crear el objeto de respuesta
         return retirosFiltrados.map(mes => ({
           inversionId: retiro._id,
           mesId: mes._id,
           retiro: mes,
           creado_por: user
         }));
       })
     );
 
     // Aplanar el array de arrays
     const resultadoFinal = solicitudesPendientes.flat();
     res.status(200).json(resultadoFinal);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al obtener retiros pendientes', error: error.message });
  }
};

// Autorizar un retiro
export const autorizarRetiro = async (req, res) => {
  const { inversionId, mesId } = req.params;
  const { estado } = req.body;
  const { id } = req.session.user;
  console.log(inversionId, mesId)
  console.log(estado)
  console.log(id)
  console.log(req.file)
  try {
    const inversion = await Inversion.findById(inversionId);
    if (!inversion) {
      return res.status(404).json({ message: 'Inversión no encontrada' });
    }
    const mesValor = inversion.mes_valor_inversion.id(mesId);
    if (!mesValor) {
      return res.status(404).json({ message: 'Mes de inversión no encontrado' });
    }
    mesValor.estado = estado;
    mesValor.reporte_documento = req.file?.filename || null;
    mesValor.autorizado_por = id;
    await inversion.save();
    res.status(200).json({ message: 'Retiro autorizado con éxito', retiro: mesValor });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error al autorizar retiro', error: error.message });
  }
};

// Obtener retiros pendientes para el administrador
export const getRetirosPendientesAdmin = async (req, res) => {
  try {
    // Buscar todas las inversiones
    const retiros = await Inversion.find({}).lean();

    // Filtrar solo los retiros con estado 'Solicitud de pago'
    const solicitudesPendientes = await Promise.all(
      retiros.flatMap(async (retiro) => {
        // Filtrar mes_valor_inversion con estado 'Solicitud de pago'
        const retirosFiltrados = retiro.mes_valor_inversion.filter(mes => mes.estado === 'Solicitud de pago');

        // Si no hay retiros pendientes, no se procesa este retiro
        if (retirosFiltrados.length === 0) return [];

        // Obtener el usuario creador de la inversión
        const user = await Usuario.findById(retiro.usuarioId).select('nombre_completo cuenta cuentas_digitales').lean();

        // Crear el objeto de respuesta
        return retirosFiltrados.map(mes => ({
          inversionId: retiro._id,
          mesId: mes._id,
          retiro: mes,
          creado_por: user
        }));
      })
    );

    // Aplanar el array de arrays
    const resultadoFinal = solicitudesPendientes.flat();
    res.status(200).json(resultadoFinal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener retiros para el administrador', error: error.message });
  }
};