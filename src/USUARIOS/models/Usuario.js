import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema(
  {
    cartera: { type: Number, default: 0 }, // Saldo de la cartera del usuario
    authId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Auth', 
      required: true // Relación con el esquema Auth
    },
    cuenta: {
      digitales: { type: Boolean, default: false }, 
      bancaria: { type: Boolean, default: false }
    },
    cuentas_digitales: {
      tipo_cuenta: { 
        type: String, 
        enum: ['nequi', 'daviplata', 'ahorro_a_la_mano'], // Tipos de cuentas digitales permitidos
      },
      numero_cuenta: { type: String } // Número de la cuenta digital
    },
    cuentas_bancaria: {
      nombre_de_entidad_bancaria: { type: String,}, // Nombre del banco
      tipo_cuenta: { 
        type: String, 
        enum: ['Ahorros', 'Corriente'], // Tipos de cuenta bancaria permitidos
      },
      numero_cuenta: { type: String, } // Número de cuenta bancaria
    },
    inversiones: [
      {
        inversionId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Inversion', 
          required: true // Relación con el esquema Inversion
        }
      }
    ],
    nombre_completo: { type: String }, // Identificación del usuario
    numero_identificacion: { type: String }, // Identificación del usuario
  },
  { timestamps: true }
);

// Exportamos el modelo usando export default
const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;