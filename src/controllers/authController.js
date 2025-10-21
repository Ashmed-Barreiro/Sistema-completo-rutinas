import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
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

// Controladores
export const mostrarRegistro = (req, res) => {
    if (req.session.user) return res.redirect("/rutinas");
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
        perfil: {
            nombre: "",
            edad: "",
            objetivo: ""
        },
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

    req.session.user = {
        id: nuevo.id,
        username: nuevo.username,
        email: nuevo.email
    };

    res.redirect("/rutinas");
};

export const mostrarLogin = (req, res) => {
    if (req.session.user) return res.redirect("/rutinas");
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

    req.session.user = { id: user.id, username: user.username, email: user.email };
    res.redirect("/rutinas");
};

export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};

// Helpers
const cryptoRandomId = () =>
    "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);

// Export para que otros controladores puedan leer/guardar
export const _leerUsuarios = leerUsuarios;
export const _guardarUsuarios = guardarUsuarios;
