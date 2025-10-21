import express from "express";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import rutinasRoutes from "./routes/rutinasRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import { decodeUserToLocals } from "./middlewares/auth.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares base
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());

// Inyecta user (si hay token válido) en res.locals.user para las vistas
app.use(decodeUserToLocals);

// Vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rutas
app.use("/", authRoutes);
app.use("/", rutinasRoutes);
app.use("/", profileRoutes);

// Home
app.get("/", (req, res) => {
   if (res.locals.user) return res.redirect("/rutinas");
   res.render("home");
});

// 404
app.use((req, res) => {
   res.status(404).send("Página no encontrada");
});

app.listen(PORT, () => {
   console.log(`Servidor en http://localhost:${PORT}`);
});