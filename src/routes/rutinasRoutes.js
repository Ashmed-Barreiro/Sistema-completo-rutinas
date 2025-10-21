import express from "express";
import { verRutinas, mostrarEditarRutina, actualizarRutina } from "../controllers/rutinasController.js";
import { authRequired } from "../middlewares/auth.js";

const router = express.Router();

router.get("/rutinas", authRequired, verRutinas);
router.get("/rutinas/editar", authRequired, mostrarEditarRutina);
router.post("/rutinas/editar", authRequired, actualizarRutina);

export default router;