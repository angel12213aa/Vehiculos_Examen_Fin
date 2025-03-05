import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new Schema({
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
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "usuario",
        require: true
    }
},
{
    timestamps: true
})

usuarioSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}

usuarioSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password, this.password)
    return response
}

export default model("Usuario", usuarioSchema)
