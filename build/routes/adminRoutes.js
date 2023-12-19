"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const volumeServices_1 = require("../services/volumeServices");
const categoriesServices_1 = require("../services/categoriesServices");
const router = (0, express_1.Router)();
router.post("/createbook", async (req, res) => {
    console.log(req.body);
    const { author, title, description, isbn, year, image, stock, categories, price } = req.body;
    if (await (0, volumeServices_1.isBookValid)(author, title, description, isbn, year, image, stock, categories)) {
        res.status(200);
        const result = await (0, volumeServices_1.addBook)(author, title, description, isbn, year, image, stock, categories, price);
        res.json(result);
    }
    else {
        res.status(400);
        res.send("error papu");
        console.log("Libro no valido");
    }
});
router.get("/", (req, res) => {
    res.send("soy admin");
});
router.put("/modifybook/id/:id", async (req, res) => {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
        res.status(400);
        res.send("id must be a number");
        return;
    }
    const { author, title, description, isbn, year, image, stock, categories, price } = req.body;
    const book = await (0, volumeServices_1.getBookByID)(idNum);
    if (categories !== undefined && !(await (0, categoriesServices_1.areCatArrayValid)(categories))) {
        res.status(400);
        res.send("Invalid categories");
        return;
    }
    ;
    if (book) {
        console.log("libro valido");
        (0, volumeServices_1.modifyBook)(book, author, title, description, isbn, year, image, stock, categories, price);
        res.status(200);
        res.send("ok");
    }
    else {
        res.status(404);
        res.send("Error, book identifyed by id " + id + " doesnt exists");
    }
});
router.delete("/deletebook/id/:id", async (req, res) => {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
        res.status(400);
        res.send("id must be a number");
        return;
    }
    const book = await (0, volumeServices_1.getBookByID)(idNum);
    if (!book) {
        res.status(404);
        res.send("Error, book identifyed by id " + id + " doesnt exists");
    }
});
router.post("/createcategory", async (req, res) => {
    try {
        const { category } = req.body;
        if (category) {
            const result = await (0, categoriesServices_1.createcategory)(category);
            if (result == "ok") {
                res.status(200);
                res.send(`category ${category} created`);
                return;
            }
            else {
                res.status(400);
                res.send("gg");
            }
        }
        else
            throw ("category undefined");
    }
    catch (err) {
        res.status(400);
        res.send(err);
    }
});
router.delete("/deletecategory/:category", (req, res) => {
    const { category } = req.params;
    try {
        (0, categoriesServices_1.deletecategory)(category);
        res.status(200);
        res.send(`category ${category} deleted`);
        return;
    }
    catch (error) {
        res.status(400);
        res.send(error);
    }
});
exports.default = router;
