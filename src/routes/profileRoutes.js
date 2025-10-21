import express from "express";
import { verPerfil, actualizarPerfil } from "../controllers/profileController.js";
import { authRequired } from "../middlewares/auth.js";

const router = express.Router();

router.get("/perfil", authRequired, verPerfil);
router.post("/perfil", authRequired, actualizarPerfil);

export default router;