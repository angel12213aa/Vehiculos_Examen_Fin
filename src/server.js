import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./database.js";
import routerUsuario from "./routers/usuario_router.js";
import routerCliente from "./routers/cliente_router.js";

dotenv.config();
connection();
const app = express();

const PORT = process.env.PORT || 7001;
app.set("port", PORT);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:7000",
  "http://localhost:5173"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server On");
});

app.use("/api", routerUsuario);
app.use("/api", routerCliente);

export default app;
