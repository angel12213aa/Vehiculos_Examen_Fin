import { Router } from "express";

import { verifyToken } from "../helpers/handleJWT.js";
import { createCliente, createVehiculo, deleteCliente, deleteVehiculo, getVehiculo, readAllCliente, updateCliente, updateVehiculo, usuariosLogin, usuariosRegister } from "../controllers/usuario_controller.js";

const router = Router()


router.post("/usuario/register", usuariosRegister)
router.post("/usuario/login", usuariosLogin)

router.post("/usuario/cliente", verifyToken, createCliente)
router.put("/usuario/cliente", verifyToken, updateCliente)
router.get("/usuario/cliente", verifyToken, readAllCliente)
router.delete("/usuario/cliente", verifyToken, deleteCliente)

router.post("/usuario/vehiculo", verifyToken, createVehiculo)
router.put("/usuario/vehiculo", verifyToken, updateVehiculo)
router.get("/usuario/vehiculo", verifyToken, getVehiculo)
router.delete("/usuario/vehiculo", verifyToken, deleteVehiculo)

export default router