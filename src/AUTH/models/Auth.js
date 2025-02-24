import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  celular: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'soporte', 'subdirector', 'usuario'], default: 'usuario' }
}, { timestamps: true });

// Usamos export default para exportar el modelo
const Auth = mongoose.model('Auth', authSchema);
export default Auth;

