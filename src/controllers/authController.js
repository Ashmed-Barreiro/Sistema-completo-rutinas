import fs from "fs";
import path from "path";
import brcypt from "bcryptjs";
import { json } from "body-parser";

const usersFile = path.join("src", "data", "users.json");
 // con esto leemos los usuarios
const leerUsuarios= () => {
    if (!fs.existsSync(usersFile)) return[];
    const data = fs.readFileSync(usersFile, "utf8");
    return data ? JSON.parse(data) : []
}

// funcion para guardar los usuarios

const guardarUsers = (usuarios) =>{
    fs.writeFileSync(usersFile, JSON.stringify(usuarios, null, 2));

};

// mostrar el formilario de registro

export const mostrarRegistro = (req, res) => {
    res.render("auth/register");
};

