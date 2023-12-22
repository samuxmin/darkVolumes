"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userServices_1 = require("../services/userServices");
const database_1 = __importDefault(require("../database"));
const volumeServices_1 = require("../services/volumeServices");
const cart_1 = require("../services/cart");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const { user } = req.body;
    if ((await (0, userServices_1.getUserByEmail)(user)) == undefined) {
        res.status(400).send("Invalid user");
        return;
    }
    try {
        const cart = await (0, cart_1.getUserCart)(user);
        res.json(cart);
    }
    catch (err) {
        console.log(err);
        res.status(500).send();
    }
});
router.post("/add", async (req, res) => {
    const { user, items } = req.body;
    if ((await (0, userServices_1.getUserByEmail)(user)) == undefined) {
        res.status(400).send("Invalid user");
        return;
    }
    const userCart = await (0, cart_1.getUserCart)(user);
    let cartIds = userCart.map(b => b.id);
    if (!Array.isArray(items)) {
        res.status(400).send("Invalid list of items");
        return;
    }
    await database_1.default.promise().query("START TRANSACTION");
    for (let i = 0; i < items.length; i++) {
        let { book, amount } = items[i];
        let id = book.id;
        if (!id || !amount) {
            res.status(400).send("Invalid list of items");
            await database_1.default.promise().query("ROLLBACK");
            return;
        }
        let bookFromBD = await (0, volumeServices_1.getBookByID)(id);
        if (bookFromBD == undefined) {
            res.status(400).send(`Invalid id ${id} of book`);
            await database_1.default.promise().query("ROLLBACK");
            return;
        }
        if (isNaN(amount)) {
            res.status(400).send();
            await database_1.default.promise().query("ROLLBACK");
            return;
        }
        if (cartIds.includes(bookFromBD.id)) {
            let totalAmount = userCart[cartIds.indexOf(bookFromBD.id)].amount + amount;
            if (bookFromBD.stock < totalAmount) {
                res.status(418).send("not enough items in stock");
                await database_1.default.promise().query("ROLLBACK");
                return;
            }
            //UPDATE
            try {
                await database_1.default.promise().query("UPDATE cart set amount = amount + ? WHERE usermail = ? and bookId = ?", [amount, user, id]);
            }
            catch (error) {
                console.log(error);
                res.status(500).send();
                await database_1.default.promise().query("ROLLBACK");
                return;
            }
        }
        else if (bookFromBD.stock < amount) {
            res.status(418).send("not enough items in stock");
            await database_1.default.promise().query("ROLLBACK");
            return;
        }
        else {
            //INSERT INTO
            try {
                await database_1.default.promise().query("INSERT INTO cart(usermail,bookId,amount) values(?, ?, ?)", [user, id, amount]);
            }
            catch (error) {
                console.log(error);
                res.status(500).send();
                await database_1.default.promise().query("ROLLBACK");
                return;
            }
        }
    }
    await database_1.default.promise().query("COMMIT");
    res.status(201).send();
});
router.post("/remove", async (req, res) => {
    const { user, items } = req.body;
    if ((await (0, userServices_1.getUserByEmail)(user)) == undefined) {
        res.status(400).send("Invalid user");
        return;
    }
    const userCart = await (0, cart_1.getUserCart)(user);
    let cartIds = userCart.map(b => b.id);
    if (!Array.isArray(items)) {
        res.status(400).send("Invalid list of items");
        return;
    }
    await database_1.default.promise().query("START TRANSACTION");
    for (let i = 0; i < items.length; i++) {
        let { book, amount } = items[i];
        let id = book.id;
        if (!id || !amount) {
            res.status(400).send("Invalid list of items");
            await database_1.default.promise().query("ROLLBACK");
            return;
        }
        if (!cartIds.includes(id)) {
            res.status(400).send(`Id ${id} is not in the cart`);
            await database_1.default.promise().query("ROLLBACK");
        }
        ;
        let bookFromDB = await (0, volumeServices_1.getBookByID)(id);
        if (bookFromDB == undefined) {
            res.status(400).send(`Invalid id ${id} of book`);
            await database_1.default.promise().query("ROLLBACK");
            return;
        }
        if (isNaN(amount)) {
            res.status(400).send();
            await database_1.default.promise().query("ROLLBACK");
            return;
        }
        if (cartIds.includes(id)) {
            let newAmount = userCart[cartIds.indexOf(id)].amount - amount;
            if (newAmount < 0) {
                newAmount = 0;
            }
            try {
                await database_1.default.promise().query("UPDATE cart set amount = ? WHERE usermail = ? and bookId = ?", [newAmount, user, id]);
            }
            catch (err) {
                console.log(err);
                res.status(500).send(`Book by id ${id} is not in the cart`);
                await database_1.default.promise().query("ROLLBACK");
                return;
            }
        }
        else {
            res.status(400).send(`Book by id ${id} is not in the cart`);
            await database_1.default.promise().query("ROLLBACK");
            return;
        }
    }
    await database_1.default.promise().query("COMMIT");
    res.status(201).send();
});
router.delete("/drop", async (req, res) => {
    const { user } = req.body;
    if ((await (0, userServices_1.getUserByEmail)(user)) == undefined) {
        res.status(400).send("Invalid user");
    }
    try {
        const [cart] = await database_1.default.promise().execute("DELETE FROM cart where usermail = ?", [user]);
        res.json(cart);
    }
    catch (err) {
        console.log(err);
        res.status(500).send();
    }
});
exports.default = router;
