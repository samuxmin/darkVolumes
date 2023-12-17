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
import pool from "../database.js";
import { getBookByID } from "../services/volumeServices.js";
import { getUserCart } from "../services/cart.js";
const router = Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    if ((yield getUserByEmail(user)) == undefined) {
        res.status(400).send("Invalid user");
        return;
    }
    try {
        const cart = yield getUserCart(user);
        res.json(cart);
    }
    catch (err) {
        console.log(err);
        res.status(500).send();
    }
}));
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, items } = req.body;
    if ((yield getUserByEmail(user)) == undefined) {
        res.status(400).send("Invalid user");
        return;
    }
    const userCart = yield getUserCart(user);
    let cartIds = userCart.map(b => b.id);
    if (!Array.isArray(items)) {
        res.status(400).send("Invalid list of items");
        return;
    }
    yield pool.promise().execute("START TRANSACTION");
    for (let i = 0; i < items.length; i++) {
        let { id, amount } = items[i];
        if (!id || !amount) {
            res.status(400).send("Invalid list of items");
            yield pool.promise().execute("ROLLBACK");
            return;
        }
        let book = yield getBookByID(id);
        if (book == undefined) {
            res.status(400).send(`Invalid id ${id} of book`);
            yield pool.promise().execute("ROLLBACK");
            return;
        }
        if (isNaN(amount)) {
            res.status(400).send();
            yield pool.promise().execute("ROLLBACK");
            return;
        }
        if (cartIds.includes(book.id)) {
            let totalAmount = userCart[cartIds.indexOf(book.id)] + amount;
            if (book.stock < totalAmount) {
                res.status(418).send("not enough items in stock");
                yield pool.promise().execute("ROLLBACK");
                return;
            }
            //UPDATE
            try {
                yield pool.promise().execute("UPDATE cart set amount = ? WHERE usermail = ? and bookId = ?", [totalAmount, user, id]);
            }
            catch (error) {
                console.log(error);
                res.status(500).send();
                yield pool.promise().execute("ROLLBACK");
                return;
            }
        }
        else if (book.stock < amount) {
            res.status(418).send("not enough items in stock");
            yield pool.promise().execute("ROLLBACK");
            return;
        }
        else {
            //INSERT INTO
            try {
                yield pool.promise().execute("INSERT INTO cart(usermail,bookId,amount) values(?, ?, ?)", [user, id, amount]);
            }
            catch (error) {
                console.log(error);
                res.status(500).send();
                yield pool.promise().execute("ROLLBACK");
                return;
            }
        }
    }
    yield pool.promise().execute("COMMIT");
    res.status(201).send();
}));
router.post("/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, items } = req.body;
    if ((yield getUserByEmail(user)) == undefined) {
        res.status(400).send("Invalid user");
        return;
    }
    const userCart = yield getUserCart(user);
    let cartIds = userCart.map(b => b.id);
    if (!Array.isArray(items)) {
        res.status(400).send("Invalid list of items");
        return;
    }
    yield pool.promise().execute("START TRANSACTION");
    for (let i = 0; i < items.length; i++) {
        let { id, amount } = items[i];
        if (!id || !amount) {
            res.status(400).send("Invalid list of items");
            yield pool.promise().execute("ROLLBACK");
            return;
        }
        if (!cartIds.includes(id)) {
            res.status(400).send(`Id ${id} is not in the cart`);
            yield pool.promise().execute("ROLLBACK");
        }
        ;
        let book = yield getBookByID(id);
        if (book == undefined) {
            res.status(400).send(`Invalid id ${id} of book`);
            yield pool.promise().execute("ROLLBACK");
            return;
        }
        if (isNaN(amount)) {
            res.status(400).send();
            yield pool.promise().execute("ROLLBACK");
            return;
        }
        if (cartIds.includes(id)) {
            let newAmount = userCart[cartIds.indexOf(id)].amount - amount;
            if (newAmount < 0) {
                newAmount = 0;
            }
            try {
                yield pool.promise().execute("UPDATE cart set amount = ? WHERE usermail = ? and bookId = ?", [newAmount, user, id]);
            }
            catch (err) {
                console.log(err);
                res.status(500).send(`Book by id ${id} is not in the cart`);
                yield pool.promise().execute("ROLLBACK");
                return;
            }
        }
        else {
            res.status(400).send(`Book by id ${id} is not in the cart`);
            yield pool.promise().execute("ROLLBACK");
            return;
        }
    }
    yield pool.promise().execute("COMMIT");
    res.status(201).send();
}));
router.delete("/drop", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    if ((yield getUserByEmail(user)) == undefined) {
        res.status(400).send("Invalid user");
    }
    try {
        const [cart] = yield pool.promise().execute("DELETE FROM cart where usermail = ?", [user]);
        res.json(cart);
    }
    catch (err) {
        console.log(err);
        res.status(500).send();
    }
}));
export default router;
