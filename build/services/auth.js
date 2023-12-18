var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getUserByEmail, getUserByNick } from "./userServices.js";
import bcrypt from "bcrypt";
import pool from "../database.js";
import { createToken } from "./token.js";
export function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, nick, password, birthdate } = req.body;
        if (email == undefined || nick == undefined || password == undefined || birthdate == undefined) {
            res.status(400);
            res.send("Fields undefined");
            return;
        }
        if (yield getUserByEmail(email)) {
            res.status(400);
            res.send("Email in use");
            return;
        }
        if (yield getUserByNick(nick)) {
            res.status(400);
            res.send("Nick in use");
            return;
        }
        try {
            bcrypt.hash(password, 12).then((hash) => __awaiter(this, void 0, void 0, function* () {
                const result = yield pool.promise().execute("INSERT INTO user(email,nick,password,birthdate) values(?,?,?,?)", [email, nick, hash, birthdate]);
                res.json({ ok: true, msg: "register", result });
            }));
        }
        catch (err) {
            console.log(err);
            res.status(500);
            res.send();
        }
    });
}
export function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send("Fields undefined");
            return;
        }
        const user = yield getUserByEmail(email);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (!isMatch) {
                res.status(401).json({ ok: false, msg: "login unsuccesful" });
                return;
            }
            else {
                const token = createToken(user);
                res.json({ ok: true, msg: "Login successful", token, user });
            }
        });
    });
}
