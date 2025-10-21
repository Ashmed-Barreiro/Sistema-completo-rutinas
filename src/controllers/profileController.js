import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { _leerUsuarios, _guardarUsuarios } from "./authController.js";

const signToken = (user) =>
    jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

const cookieOpts = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7
};

export const verPerfil = (req, res) => {
    const usuarios = _leerUsuarios();
    const user = usuarios.find((u) => u.id === req.user.id);
    res.render("perfil", { perfil: user.perfil || { nombre: "", edad: "", objetivo: "" } });
};

export const actualizarPerfil = async (req, res) => {
    const { nombre, edad, objetivo, username, email, password } = req.body;

    const usuarios = _leerUsuarios();
    const idx = usuarios.findIndex((u) => u.id === req.user.id);
    if (idx === -1) return res.redirect("/login");

    usuarios[idx].perfil = {
        nombre: nombre || "",
        edad: edad || "",
        objetivo: objetivo || ""
    };

    if (username) usuarios[idx].username = username;
    if (email) usuarios[idx].email = email;

    if (password && password.trim().length >= 6) {
        const hash = await bcrypt.hash(password.trim(), 10);
        usuarios[idx].passwordHash = hash;
    }

    _guardarUsuarios(usuarios);

    // Re emitir JWT con datos actualizados
    const token = signToken(usuarios[idx]);
    res.cookie("token", token, cookieOpts);

    res.redirect("/perfil");
};