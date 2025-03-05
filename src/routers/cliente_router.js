import { Router } from "express";
import { verifyToken } from "../helpers/handleJWT.js";
import { clienteLogin, createReserva, deleteReserva, getReservas, updateReserva } from "../controllers/cliente_controller.js";

const router = Router()

router.post("/cliente/login", clienteLogin)

router.post("/cliente/reserva", verifyToken, createReserva)
router.put("/cliente/reserva", verifyToken, updateReserva)
router.get("/cliente/reserva", verifyToken, getReservas)
router.delete("/cliente/reserva", verifyToken, deleteReserva)


export default router