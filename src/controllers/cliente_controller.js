import { check, validationResult } from "express-validator";
import { createToken } from "../helpers/handleJWT.js";
import Reserva from "../models/Reserva.js";
import mongoose from "mongoose";
import Cliente from "../models/Cliente.js";


const clienteLogin = async (req, res) => {
    const { email, password } = req.body

    try {
        if (Object.values(req.body).includes("")) return res.status(418).json({msg: "Debe enviar todos los datos"})
    
        await check("email")
        .isEmail()
        .trim()
        .normalizeEmail()
        .withMessage("Error en el formato del email")
        .run(req)

        const errores = validationResult(req)

        if (!errores.isEmpty()) {
            return res.status(418).json({
                msg: errores.array()
            })
        }
        
        const user = await Cliente.findOne({email})
        if (!user)
        {
            return res.status(418).json({msg: "El cliente no existe"})
        }
        
        const passwordMatch = await user.matchPassword(password)
        
        if (!passwordMatch) return res.status(418).json({msg: "La contraseña ingresada es incorrecta"})
        
        const jwt = createToken({_id: user._id, role: user.role, nombre: user.nombre})
        
        return res.status(200).json({token: jwt, role: user.role, nombre: user.nombre, _id: user._id})
    }
    catch (error) 
    {
        return res.status(418).json({msg: "Error al iniciar sesión", error})
    }
}


const createReserva = async (req, res) => {
    try
    {
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debe llenar todos los campos"})
        
        /*
        await check("codigo")
        .exists()
        .isAlphanumeric()
        .isLength({min: 2, max: 4})
        .trim()
        .withMessage("Error en el formato del código")
        .run(req)

        await check("descripcion")
        .exists()
        .isString()
        .isLength({min: 0, max: 100})
        .withMessage("Error en el formato de la descripción")
        .run(req)

        await check("auditorio")
        .exists()
        .run(req)

        await check("clientes")
        .exists()
        .run(req)

        const errores = validationResult(req)

        if (!errores.isEmpty()) {
            return res.status(418).json({
                msg: errores.array()
            })
        }
        */
        const newReserva = new Reserva(req.body)

        await newReserva.save()

        return res.status(200).json({msg: "Reserva creada satisfactoriamente"})
    } 
    catch (error) 
    {
        return res.status(418).json({msg: "Error al crear una reserva", error})
    }
}
const updateReserva = async (req, res) => {
    const { codigo } = req.body
    try 
    {
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debe llenar todos los campos"})
        /*
        await check("descripcion")
        .optional()
        .isString()
        .isLength({min: 0, max: 100})
        .withMessage("Error en el formato de la descripción")
        .run(req)

        await check("auditorio")
        .optional()
        .run(req)

        const errores = validationResult(req)

        if (!errores.isEmpty()) {
            return res.status(418).json({
                msg: errores.array()
            })
        }
         */
        const reservaUpdated = await Reserva.findOneAndUpdate({codigo}, req.body)
        if (!reservaUpdated) return res.status(418).json({msg:"Reserva no encontrada"})
        
        return res.status(200).json({msg: "Reserva actualizada satisfactoriamente"})
    } 
    catch (error) 
    {
        return res.status(418).json({msg: "Error al actualizar una reserva", error})
    }
}
const getReservas = async (req, res) => {
    try
    {
        const x = req.user._id
        if(!mongoose.Types.ObjectId.isValid(x)) return res.status(418).json({msg:`_id incorrecto`});
        
        const reservas = await Reserva.find({idConferencista: req.user._id})
        
        return res.status(200).json(reservas)
    } 
    catch (error)
    {
        return res.status(418).json({msg: "Error al buscar las reservas", error})
    }
}
const deleteReserva = async (req, res) => {
    const { codigo } = req.body
    try
    {
        const deletedReserva = await Reserva.deleteOne({codigo})

        if (!deletedReserva) return res.status(418).json({msg: "Error al eliminar una reseva"})
        
        return res.status(200).json({msg: "Reserva eliminado satisfactoriamente"})
    } 
    catch (error)
    {
        return res.status(418).json({msg: "Error al eliminar una reserva"})
    }
}

export {
    clienteLogin,
    
    createReserva,
    updateReserva,
    getReservas,
    deleteReserva
}