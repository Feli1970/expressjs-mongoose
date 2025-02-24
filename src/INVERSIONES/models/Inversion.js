const mongoose = require('mongoose');

const rendimientoMesesSchema = new mongoose.Schema({
  mes: { type: String, required: true },
  valor: { type: Number, required: true },
  estado: { type: String, default: 'En proceso', enum: ['En proceso', 'Solicitud de pago', 'Pago realizado', 'Cancelado'] },
  reporte_documento: { type: String },
  creado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  autorizado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});

const inversionSchema = new mongoose.Schema({
  codigo: { type: String, required: true, default:'0000000-inv-2014-02-15' },
  monto: { type: Number, required: true },
  cantidad_plazos_mes: { type: Number, default: 3 }, // 3 meses, 6 meses, 12 meses
  mes_valor_inversion: [rendimientoMesesSchema],
  rendimiento: { type: Number, default: 5 },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  comprobante_foto_recibo_pago: { type: String },
  estado: { type: String, enum: ['revision', 'activa', 'rechazo', 'terminada'], default: 'revision' }
}, { timestamps: true });

module.exports = mongoose.model('Inversion', inversionSchema);

//[
//  // cantidad_plasos_mes -- 3, 6, 12 
//  "3 meses - 5%"
//  "6 meses - 15%"
//  "12 meses - 20%"
//  rendimiento: si es 3 el rendimiento es 5 si es 6 el rendimiento es 15 si es 12 el rendimiento es 20
//  monto : = "100.000","150.000","200.000" otro, diferente valor, otros mas de 100.000 $ variable
//  
//]

