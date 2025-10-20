import fs from "fs";
import path from "path";
import brcypt from "bcryptjs";
import { json } from "body-parser";

const usersFile = path.join("src", "data", "users.json");
// con esto leemos los usuarios
const leerUsuarios = () => {
    if (!fs.existsSync(usersFile)) return [];
    const data = fs.readFileSync(usersFile, "utf8");
    return data ? JSON.parse(data) : []
}

// funcion para guardar los usuarios

const guardarUsers = (usuarios) => {
    fs.writeFileSync(usersFile, JSON.stringify(usuarios, null, 2));

};

// mostrar el formilario de registro

export const mostrarRegistro = (req, res) => {
    res.render("auth/register");
};

// Mostrar formulario de login
export const mostrarLogin = (req, res) => {
    res.render("auth/login");
};

// Procesar login
export const procesarLogin = async (req, res) => {
    const { email, password } = req.body;

    const data = fs.readFileSync(usersFile, "utf8");
    const usuarios = data ? JSON.parse(data) : [];

    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
        return res.send("No existe una cuenta con ese email");
    }

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
        return res.send("Contraseña incorrecta");
    }

    // Guardar usuario en la sesión
    req.session.user = {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email
    };

    res.redirect("/rutinas");
};

// Cerrar sesión
export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};
