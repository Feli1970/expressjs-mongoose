import mongoose from 'mongoose';

const retiroSchema = new mongoose.Schema({
  monto_retiro: { type: String},
  inversionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inversion'},
  mesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inversion'},
  estado: { type: String, enum: ['pendiente', 'aprobado', 'terminado'], default: 'pendiente' }, //
  creado_por:{ type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
  autorizado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
  reporte_documento:{ type: String }
}, { timestamps: true });

module.exports = mongoose.model('Retiro', retiroSchema);
