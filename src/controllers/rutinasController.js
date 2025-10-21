import { _leerUsuarios, _guardarUsuarios } from "./authController.js";

export const verRutinas = (req, res) => {
    const usuarios = _leerUsuarios();
    const user = usuarios.find((u) => u.id === req.user.id);
     res.render("rutinas/index", {
        user,               // usuario completo
        perfil: user.perfil || null,   // perfil opcional
        rutina: user.rutina || null    // rutina opcional
    });
};

export const mostrarEditarRutina = (req, res) => {
    const usuarios = _leerUsuarios();
    const user = usuarios.find((u) => u.id === req.user.id);
    res.render("rutinas/edit", { rutina: user?.rutina || { titulo: "", items: [] } });
};

export const actualizarRutina = (req, res) => {
    const { titulo } = req.body;
    const dias = Array.isArray(req.body.itemDia) ? req.body.itemDia : [req.body.itemDia].filter(Boolean);
    const ejercicios = Array.isArray(req.body.itemEjercicio) ? req.body.itemEjercicio : [req.body.itemEjercicio].filter(Boolean);

    const items = [];
    for (let i = 0; i < Math.max(dias.length, ejercicios.length); i++) {
        if ((dias[i] || "").trim() || (ejercicios[i] || "").trim()) {
            items.push({ dia: (dias[i] || "").trim(), ejercicio: (ejercicios[i] || "").trim() });
        }
    }

    const usuarios = _leerUsuarios();
    const idx = usuarios.findIndex((u) => u.id === req.user.id);
    if (idx === -1) return res.redirect("/login");

    usuarios[idx].rutina = { titulo: titulo || "Mi rutina", items };
    _guardarUsuarios(usuarios);

    res.redirect("/rutinas");
};