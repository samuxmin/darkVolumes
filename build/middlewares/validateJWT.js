import jwt from 'jsonwebtoken';
export function validateJWT(req, res, next) {
    // x-token headers
    const token = req.body.token || req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }
    try {
        const { email } = jwt.verify(token, 'your-secret-key');
        req.body.user = email;
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
    next();
}
