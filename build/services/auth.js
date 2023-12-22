"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const userServices_1 = require("./userServices");
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../database"));
const token_1 = require("./token");
async function register(req, res) {
    const { email, nick, password, birthdate } = req.body;
    if (email == undefined || nick == undefined || password == undefined || birthdate == undefined) {
        res.status(400);
        res.send("Fields undefined");
        return;
    }
    if (await (0, userServices_1.getUserByEmail)(email)) {
        res.status(400);
        res.send("Email in use");
        return;
    }
    if (await (0, userServices_1.getUserByNick)(nick)) {
        res.status(400);
        res.send("Nick in use");
        return;
    }
    try {
        bcrypt_1.default.hash(password, 12).then(async (hash) => {
            const result = await database_1.default.promise().execute("INSERT INTO user(email,nick,password,birthdate) values(?,?,?,?)", [email, nick, hash, birthdate]);
            res.json({ ok: true, msg: "register", result });
        });
    }
    catch (err) {
        console.log(err);
        res.status(500);
        res.send();
    }
}
exports.register = register;
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send("Fields undefined");
        return;
    }
    const user = await (0, userServices_1.getUserByEmail)(email);
    if (!user) {
        res.status(404).send("User not found");
        return;
    }
    bcrypt_1.default.compare(password, user.password, (err, isMatch) => {
        if (!isMatch) {
            res.status(401).json({ ok: false, msg: "login unsuccesful" });
            return;
        }
        else {
            const token = (0, token_1.createToken)(user);
            user.password = "";
            res.json({ ok: true, msg: "Login successful", token, user });
        }
    });
}
exports.login = login;
