import { log } from "console";
import express from "express";
import session from "express-session";
import methodOverride from "method-override";
import { userInfo } from "os";
import path from "path";
import { fileURLToPath } from "url";
 const _filename = fileURLToPath(import.meta.url);
 const _dirname = path.dirname(_filename);

 const app = express();
 const PORT = 3000;
// Creamos el intermediario Middleware
 app.use(express.urlencoded({ extender: true}));
 app.use(methodOverride("_method"));
 app.use(express.static(path.join(_dirname,"../public")));
app.set("view engine", "ejs");
app.set("views", path.join(_dirname, "views"));
// configuramos las sesiones
 app.use(session({
    secret:"secreto",
    resave: false,
    saveUninitialized: false
 }));

 // rutas 
 app.get("/",(req, res)=>{
    res.render("home", {user: req.session.user});
 });
// arrancamos el server y mostramos por consola
// el mensaje con el enlace para comprobar que este correcto
 app.listen(PORT, ()=> console.log(`Servidor en http://localhost:${PORT}`))

