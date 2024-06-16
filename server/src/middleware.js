import jwt from "jsonwebtoken"
import {secret} from "./utils/utils.js";

const roles = {
    "admin": 1, "customer": 2, "controller": 3, "collector": 4
}

export const isLoggedIn = (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) return res.status(401).json({error: "Unauthorized"});

    const token = authorization.split(" ")[1];
    if (!token) return res.status(401).json({error: "Unauthorized"});

    try {
        req.user = jwt.verify(token, secret);
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return res.status(401).json({error: "Invalid token"});
    }
}

export const hasRole = (searchedRole) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (roles[searchedRole] && userRole === roles[searchedRole]) {
            next();
        } else {
            return res.status(403).json({error: "Insufficient permissions"});
        }
    };
};