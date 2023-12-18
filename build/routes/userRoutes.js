var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { login, register } from "../services/auth.js";
import { getUserByEmail, getUserByNick } from "../services/userServices.js";
const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/email/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const usr = yield getUserByEmail(email);
    if (usr) {
        res.json(usr);
    }
    else {
        res.status(404);
        res.send("User not found by email " + email);
    }
}));
router.get("/nick/:nick", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nick } = req.params;
    const usr = yield getUserByNick(nick);
    if (usr) {
        res.json(usr);
    }
    else {
        res.status(404);
        res.send("User not found by nick " + nick);
    }
}));
export default router;
