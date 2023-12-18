import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

export function validateJWT ( req:Request, res:Response , next: NextFunction){

    // x-token headers
    const token = req.body.token || req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { email } = jwt.verify(
            token,
            'your-secret-key'
        ) as JwtPayload;
    req.body.user = email;


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
    next();
}