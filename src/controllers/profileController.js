import bcrypt from "bcryptjs";
import { _leerUsuarios, _guardarUsuarios } from "./authController.js";

export const verPerfil = (req, res) => {
    const usuarios = _leerUsuarios();
    const user = usuarios.find((u) => u.id === req.session.user.id);
    res.render("perfil", { perfil: user?.perfil || { nombre: "", edad: "", objetivo: "" } });
};

export const actualizarPerfil = async (req, res) => {
    const { nombre, edad, objetivo, username, email, password } = req.body;

    const usuarios = _leerUsuarios();
    const idx = usuarios.findIndex((u) => u.id === req.session.user.id);
    if (idx === -1) return res.redirect("/login");

    // Actualizamos perfil
    usuarios[idx].perfil = { nombre: nombre || "", edad: edad || "", objetivo: objetivo || "" };

    // Actualizamos cuenta (si cambia)
    if (username) usuarios[idx].username = username;
    if (email) usuarios[idx].email = email;

    if (password && password.trim().length >= 6) {
        const hash = await bcrypt.hash(password.trim(), 10);
        usuarios[idx].passwordHash = hash;
    }

    _guardarUsuarios(usuarios);

    // refresca la sesión
    req.session.user = {
        id: usuarios[idx].id,
        username: usuarios[idx].username,
        email: usuarios[idx].email
    };

    res.redirect("/perfil");
};
