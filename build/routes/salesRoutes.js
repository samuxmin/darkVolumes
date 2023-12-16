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
import { getUserByEmail } from "../services/userServices.js";
import { getBookByID } from "../services/volumeServices.js";
import { saveSaleToDB } from "../services/sales.js";
const router = Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: userMail, books } = req.body;
    if (!userMail || !(Array.isArray(books))) {
        res.status(400);
        res.send("Invalid request body");
        return;
    }
    const user = yield getUserByEmail(userMail);
    if (user == undefined) {
        res.status(400);
        res.send("User not found");
        return;
    }
    try {
        //Verify each book is valid
        for (let i = 0; i < books.length; i++) {
            let b = books[i];
            let book = yield getBookByID(b.book.id);
            if (book == undefined) {
                res.status(400);
                res.send(`Book with id ${b.book.id} not found`);
                return;
            }
            if (b.amount > book.stock) {
                res.status(400).send("Not enough units for sale");
                return;
            }
            books[i].book = book;
        }
        saveSaleToDB(user, books);
        res.status(200).send("ok");
    }
    catch (err) {
        console.log(err);
        res.status(400);
        res.send("Something went wrong ಠ╭╮ಠ");
        return;
    }
}));
export default router;
