import jwt from "jsonwebtoken";

const getTokenFromReq = (req) => {
    // Usamos cookie httpOnly "token"
    return req.cookies?.token || null;
};

export const authRequired = (req, res, next) => {
    const token = getTokenFromReq(req);
    if (!token) return res.redirect("/login");
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { id, username, email }
        next();
    } catch {
        res.clearCookie("token");
        return res.redirect("/login");
    }
};

// Hidrata res.locals.user para EJS (para el header, etc.)
export const decodeUserToLocals = (req, res, next) => {
    const token = getTokenFromReq(req);
    if (!token) {
        res.locals.user = null;
        return next();
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        res.locals.user = payload;
    } catch {
        res.locals.user = null;
    }
    next();
};