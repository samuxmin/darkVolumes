var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from "../database.js";
export function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email)
            return undefined;
        const [rows] = yield pool.promise().execute("SELECT * FROM user WHERE email = ?", [email]);
        const usrs = rows;
        if (usrs.length > 0) {
            usrs[0].password = "";
            return usrs[0];
        }
        else {
            return undefined;
        }
    });
}
export function getUserByNick(nick) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!nick)
            return undefined;
        const [rows] = yield pool.promise().execute("SELECT * FROM user WHERE nick = ?", [nick]);
        const usrs = rows;
        if (usrs.length > 0) {
            usrs[0].password = "";
            return usrs[0];
        }
        else {
            return undefined;
        }
    });
}
