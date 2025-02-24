const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  celular: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'soporte', 'subdirector', 'usuario'], default: 'usuario' }
}, { timestamps: true });

module.exports = mongoose.model('Auth', authSchema);
