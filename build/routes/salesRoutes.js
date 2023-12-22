"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userServices_1 = require("../services/userServices");
const volumeServices_1 = require("../services/volumeServices");
const sales_1 = require("../services/sales");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const { user, books } = req.body;
    if (!user || !(Array.isArray(books))) {
        res.status(400);
        res.send({ ok: false, msg: "Invalid request body" });
        return;
    }
    const userVerf = await (0, userServices_1.getUserByEmail)(user);
    if (userVerf == undefined) {
        res.status(400);
        res.send({ ok: false, msg: "User not found" });
        return;
    }
    try {
        //Verify each book is valid
        for (let i = 0; i < books.length; i++) {
            let b = books[i];
            let book = await (0, volumeServices_1.getBookByID)(b.book.id);
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
        await (0, sales_1.saveSaleToDB)(user, books);
        res.status(200).send({ ok: true, msg: "ok" });
    }
    catch (err) {
        console.log(err);
        res.status(400);
        res.send({ ok: false, msg: "Something went wrong ಠ╭╮ಠ" });
        return;
    }
});
exports.default = router;
