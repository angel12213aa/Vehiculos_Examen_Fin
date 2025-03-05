import { model, Schema } from "mongoose"

const vehiculoSchema = new Schema({
    marca: {
        type: String,
        require: true,
        trim: true
    },
    modelo: {
        type: String,
        trim: true
    },
    anio_fabricacion: {
        type: Date,
        trim: true
    },
    placa: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    color: {
        type: String,
        trim: true
    },
    tipo_vehiculo: {
        type: String,
        trim: true
    },
    kilometraje: {
        type: Number
    },
    descripcion: {
        type: String
    }
},
{
    timestamps: true
})

export default model("Vehiculo", vehiculoSchema)