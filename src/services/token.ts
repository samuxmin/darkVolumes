import { User } from "../types";
import jwt, { JwtPayload } from 'jsonwebtoken';

export function createToken(user:User) {
    const payload = { userNick: user.nick, email: user.email }; // Customize the payload as needed
    const secretKey = 'your-secret-key'; // Replace with your actual secret key
    const options = { expiresIn: '2h' }; // Token expiration time

    return jwt.sign(payload, secretKey, options);
}
