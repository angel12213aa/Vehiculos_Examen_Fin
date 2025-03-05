import { model, Schema } from "mongoose"
import bcrypt from "bcryptjs";

const clienteSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    apellido: {
        type: String,
        require: true,
        trim: true
    },
    cedula: {
        type: String,
        trim: true
    },
    ciudad: {
        type: String
    },
    direccion: {
        type: String
    },
    fecha_nacimiento: {
        type: Date,
    },
    telefono: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    empresa: {
        type: String
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "cliente",
        require: true
    }
},
{
    timestamps: true
})

clienteSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}


clienteSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

export default model("Cliente", clienteSchema)
