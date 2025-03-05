import Usuarios from "../models/Usuarios.js";
import Cliente from "../models/Cliente.js";
import { check, validationResult } from "express-validator";
import { createToken } from "../helpers/handleJWT.js";
import Vehiculo from "../models/Vehiculo.js";


const usuariosLogin = async (req, res) => {
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
        
        const user = await Usuarios.findOne({email})
        if (!user)
        {
            return res.status(418).json({msg: "El usuario no existe"})
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
const usuariosRegister = async (req, res) => {
    const {email,password} = req.body

    try
    {
        //Validación de valores vacíos
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        
        await check("email")
        .isEmail()
        .trim()
        .normalizeEmail()
        .withMessage("Error en el formato del email")
        .run(req)

        await check("nombre")
        .isString()
        .isLength({min: 2, max: 10})
        .withMessage("Error en el formato del nombre")
        .run(req)

        await check("apellido")
        .isString()
        .isLength({min: 2, max: 15})
        .withMessage("Error en el formato del apellido")
        .run(req)

        await check("password")
        .isAlphanumeric()
        .isLength({min: 7, max: 15})
        .withMessage("Error en el formato de la contraseña")
        .run(req)

        const errores = validationResult(req)

        if (!errores.isEmpty()) {
            return res.status(418).json({
                msg: errores.array()
            })
        }

        //Validar existencia del email
        const verificarEmailBDD = await Usuarios.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"El email ya se encuentra registrado"})
        
        const nuevoUsuario = new Usuarios(req.body)
        
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password)
        
        // Guaradar en BDD
        await nuevoUsuario.save()

        return res.status(200).json({msg:"Usuario creado satisfactoriamente"})
    }
    catch (error)
    {
        return res.status(418).json({msg: "Error al registrar un usuario"})
    }
}



const createCliente = async (req, res) => {
    const {email,password} = req.body

    try
    {
        //Validación de valores vacíos
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        
        await check("email")
        .exists()
        .isEmail()
        .trim()
        .normalizeEmail()
        .withMessage("Error en el formato del email")
        .run(req)

        await check("nombre")
        .exists()
        .isString()
        .isLength({min: 2, max: 10})
        .withMessage("Error en el formato del nombre")
        .run(req)

        await check("apellido")
        .exists()
        .isString()
        .isLength({min: 2, max: 15})
        .withMessage("Error en el formato del apellido")
        .run(req)

        await check("password")
        .exists()
        .isAlphanumeric()
        .isLength({min: 7, max: 15})
        .withMessage("Error en el formato de la contraseña")
        .run(req)

        const errores = validationResult(req)

        if (!errores.isEmpty()) {
            return res.status(418).json({
                msg: errores.array()
            })
        }

        //Validar existencia del email
        const verificarEmailBDD = await Cliente.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"El email ya se encuentra registrado"})

        const nuevoCliente = new Cliente(req.body)
        
        nuevoCliente.password = await nuevoCliente.encryptPassword(password)
        
        // Guaradar en BDD
        await nuevoCliente.save()

        return res.status(200).json({msg:"cliente creado satisfactoriamente"})
    }
    catch (error)
    {
        return res.status(418).json({msg: "Error al crear un cliente"})
    }
}

//No se pueden actualizar los emails
const updateCliente = async (req, res) => {
    const {email} = req.body

    try
    {
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debe llenar todos los campos"})
        const userBD = Cliente.findOne({email})
        if (!userBD) return res.status(418).json({msg: "El cliente buscado no existe"})
        
        await userBD.findOneAndUpdate({email}, req.body)
        
        return res.status(200).json({msg: "El cliente se actualizó correctamente"})
    }
    catch
    {
        return res.status(418).json({msg: "Error al actualizar un cliente"})
    }   
}
const readAllCliente = async (req, res) => {
    try 
    {
        const conferencistas = await Cliente.find()

        return res.status(200).json(conferencistas)
    } 
    catch (error)
    {
        return res.status(418).json({msg: "Error al buscar todos los clientes"})
    }
}
const deleteCliente = async (req, res) => {
    const { email } = req.body

    try
    {
        const deletedCliente = await Cliente.deleteOne({email})

        if (!deletedCliente) return res.status(418).json({msg: "Error al eliminar un cliente"})
        
        return res.status(200).json({msg: "cliente eliminado satisfactoriamente"})
    } 
    catch (error)
    {
        return res.status(418).json({msg: "Error al eliminar un cliente"})
    }
}


















const createVehiculo = async (req, res) => {
    try 
    {
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debe llenar todos los campos"})
        /*
        await check("marca")
        .exists()
        .isString()
        .isLength({min: 2, max: 15})
        .trim()
        .withMessage("Error en el formato de la marca")
        .run(req)

        await check("modelo")
        .exists()
        .isString()
        .isLength({min: 5, max: 50})
        .trim()
        .withMessage("Error en el formato del modelo")
        .run(req)

        await check("anio_fabricacion")
        .exists()
        .isDate()
        .withMessage("Error en el formato de la fecha de fabricación")
        .run(req)

        await check("placa")
        .exists()
        .isString()
        .isLength({min: 2, max: 7})
        .withMessage("Error en el formato de la placa")
        .run(req)

        await check("color")
        .exists()
        .isString()
        .withMessage("Error en el formato del color")
        .run(req)

        await check("tipo_vehiculo")
        .exists()
        .isString()
        .withMessage("Error en el formato del tipo del vehículo")
        .run(req)

        await check("kilometraje")
        .exists()
        .isNumeric
        .withMessage("Error en el formato del kilometraje")
        .run(req)

        await check("descripcion")
        .exists()
        .isString()
        .withMessage("Error en el formato de la descripcion")
        .run(req)

        const errores = validationResult(req)

        if (!errores.isEmpty()) {
            return res.status(418).json({
                msg: errores.array()
            })
        }
        */
        const newVehiculo = new Vehiculo(req.body)

        const creationVehiculo = await newVehiculo.save()
        if (!creationVehiculo) return res.status(418).json({msg: "Error al crear un vehículo"})

        return res.status(200).json({msg: "Vehículo creado satisfactoriamente"})
    } 
    catch (error) 
    {
        return res.status(418).json({msg: "Error al crear un vehículo", error})
    }
}
const updateVehiculo = async (req, res) => {
    const {placa} = req.body

    try
    {
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debe llenar todos los campos"})
        const vehiculoBD = Vehiculo.findOne({placa})
        if (!vehiculoBD) return res.status(418).json({msg: "El vehículo buscado no existe"})
        
        await vehiculoBD.findOneAndUpdate({placa}, req.body)
        
        return res.status(200).json({msg: "El vehículo se actualizó satisfactoriamente"})
    }
    catch
    {
        return res.status(418).json({msg: "Error al actualizar un vehículo"})
    }   
}
const getVehiculo = async (req, res) => {
    try 
    {
        const vehiculos = await Vehiculo.find()

        return res.status(200).json(vehiculos)
    } 
    catch (error)
    {
        return res.status(418).json({msg: "Error al buscar todos los vehiculos"})
    }
}
const deleteVehiculo = async (req, res) => {
    const { placa } = req.body

    try
    {
        const deletedVehiculo = await Vehiculo.deleteOne({placa})

        if (!deletedVehiculo) return res.status(418).json({msg: "Error al eliminar un vehículo"})
        
        return res.status(200).json({msg: "Vehículo eliminado satisfactoriamente"})
    } 
    catch (error)
    {
        return res.status(418).json({msg: "Error al eliminar un vehículos"})
    }
}


export {
    usuariosLogin,
    usuariosRegister,

    createCliente,
    updateCliente,
    readAllCliente,
    deleteCliente,

    createVehiculo,
    updateVehiculo,
    getVehiculo,
    deleteVehiculo
}