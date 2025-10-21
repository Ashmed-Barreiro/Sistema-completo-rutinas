import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Archivo de usuarios
const usersFile = path.join(__dirname, "../data/users.json");

// Utilidades de lectura/escritura
const leerUsuarios = () => {
    if (!fs.existsSync(usersFile)) return [];
    const data = fs.readFileSync(usersFile, "utf8");
    try {
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const guardarUsuarios = (usuarios) => {
    fs.mkdirSync(path.dirname(usersFile), { recursive: true });
    fs.writeFileSync(usersFile, JSON.stringify(usuarios, null, 2), "utf8");
};

// Helpers
const cryptoRandomId = () =>
    "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);

const signToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const cookieOpts = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
};

// Controladores
export const mostrarRegistro = (req, res) => {
    if (res.locals.user) return res.redirect("/rutinas");
    res.render("register");
};

export const registrarUsuario = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
        return res.render("register", { error: "Completa todos los campos." });

    const usuarios = leerUsuarios();
    const yaExiste = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (yaExiste)
        return res.render("register", { error: "Ese email ya está registrado." });

    const hash = await bcrypt.hash(password, 10);

    const nuevo = {
        id: cryptoRandomId(),
        username,
        email,
        passwordHash: hash,
        perfil: { nombre: "", edad: "", objetivo: "" },
        rutina: {
            titulo: "Mi rutina base",
            items: [
                { dia: "Lunes", ejercicio: "Pecho y tríceps" },
                { dia: "Miércoles", ejercicio: "Espalda y bíceps" },
                { dia: "Viernes", ejercicio: "Pierna y hombro" }
            ]
        }
    };
    usuarios.push(nuevo);
    guardarUsuarios(usuarios);

    const token = signToken(nuevo);
    res.cookie("token", token, cookieOpts);
    res.redirect("/rutinas");
};

export const mostrarLogin = (req, res) => {
    if (res.locals.user) return res.redirect("/rutinas");
    res.render("login");
};

export const procesarLogin = async (req, res) => {
    const { email, password } = req.body;
    const usuarios = leerUsuarios();
    const user = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user)
        return res.render("login", { error: "Email o contraseña incorrectos." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
        return res.render("login", { error: "Email o contraseña incorrectos." });

    const token = signToken(user);
    res.cookie("token", token, cookieOpts);
    res.redirect("/rutinas");
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
};

// Export para otros controladores
export const _leerUsuarios = leerUsuarios;
export const _guardarUsuarios = guardarUsuarios;