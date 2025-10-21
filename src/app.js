import express from "express";
import session from "express-session";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import rutinasRoutes from "./routes/rutinasRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware base
app.use(express.urlencoded({ extended: true })); // <- estaba mal escrito
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));

// Sesión (en memoria para desarrollo)
app.use(
   session({
      secret: process.env.SESSION_SECRET || "supersecreto-dev",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 4 } // 4 horas
   })
);

// Motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para exponer user a las vistas
app.use((req, res, next) => {
   res.locals.user = req.session.user || null;
   next();
});

// Rutas
app.use("/", authRoutes);
app.use("/", rutinasRoutes);
app.use("/", profileRoutes);

// Home
app.get("/", (req, res) => {
   if (req.session.user) return res.redirect("/rutinas");
   res.render("home");
});

// 404 simple
app.use((req, res) => {
   res.status(404).send("Página no encontrada");
});

app.listen(PORT, () =>
   console.log(`Servidor en http://localhost:${PORT}`)
);
