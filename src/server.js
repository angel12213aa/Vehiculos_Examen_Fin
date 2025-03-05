import express from "express"

import dotenv from "dotenv"
import cors from "cors"
import connection from "./database.js"

import routerUsuario from "./routers/usuario_router.js"
import routerCliente from "./routers/cliente_router.js"

dotenv.config()
connection();
const app = express()

const PORT = process.env.PORT || 7001
app.set("port", PORT)
app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Server On")
})

app.use("/api", routerUsuario)
app.use("/api", routerCliente)

export default app;