import express from "express";
import { verPerfil, actualizarPerfil } from "../controllers/profileController.js";

const router = express.Router();

const authRequired = (req, res, next) => {
    if (!req.session.user) return res.redirect("/login");
    next();
};

router.get("/perfil", authRequired, verPerfil);
router.post("/perfil", authRequired, actualizarPerfil);

export default router;
