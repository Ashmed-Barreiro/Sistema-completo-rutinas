import express from "express";
import { verRutinas, mostrarEditarRutina, actualizarRutina } from "../controllers/rutinasController.js";

const router = express.Router();

const authRequired = (req, res, next) => {
    if (!req.session.user) return res.redirect("/login");
    next();
};

router.get("/rutinas", authRequired, verRutinas);
router.get("/rutinas/editar", authRequired, mostrarEditarRutina);
router.post("/rutinas/editar", authRequired, actualizarRutina);

export default router;
