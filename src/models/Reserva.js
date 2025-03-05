import { model, Schema } from "mongoose"

const reservaSchema = new Schema({
    codigo: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        require: true
    },
    clientes: 
    [{
        type: String,
        require: true
    }],
    vehiculo: {
        type: String,
        require: true
    },
    idCliente: {
        type: String,
        require: true
    }
},
{
    timestamps: true
})

export default model("Reserva", reservaSchema)