import { errorHandler } from "./error.js"
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token_real_estate;

    if (!token) return next(errorHandler(401, 'Access denied!'))
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Forbidden'));
        req.user = user;
        next();
    })
}