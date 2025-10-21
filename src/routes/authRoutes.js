import express from "express";
import {
    mostrarRegistro,
    registrarUsuario,
    mostrarLogin,
    procesarLogin,
    logout
} from "../controllers/authController.js";

const router = express.Router();

router.get("/register", mostrarRegistro);
router.post("/register", registrarUsuario);

router.get("/login", mostrarLogin);
router.post("/login", procesarLogin);

router.get("/logout", logout);

export default router;
