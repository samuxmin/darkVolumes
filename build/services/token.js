"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createToken(user) {
    const payload = { userNick: user.nick, email: user.email }; // Customize the payload as needed
    const secretKey = 'your-secret-key'; // Replace with your actual secret key
    const options = { expiresIn: '2h' }; // Token expiration time
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
}
exports.createToken = createToken;
