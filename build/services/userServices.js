"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByNick = exports.getUserByEmail = void 0;
const database_1 = __importDefault(require("../database"));
async function getUserByEmail(email) {
    if (!email)
        return undefined;
    const [rows] = await database_1.default.promise().execute("SELECT * FROM user WHERE email = ?", [email]);
    const usrs = rows;
    if (usrs.length > 0) {
        return usrs[0];
    }
    else {
        return undefined;
    }
}
exports.getUserByEmail = getUserByEmail;
async function getUserByNick(nick) {
    if (!nick)
        return undefined;
    const [rows] = await database_1.default.promise().execute("SELECT * FROM user WHERE nick = ?", [nick]);
    const usrs = rows;
    if (usrs.length > 0) {
        return usrs[0];
    }
    else {
        return undefined;
    }
}
exports.getUserByNick = getUserByNick;
