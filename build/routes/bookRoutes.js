"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const volumeServices_1 = require("../services/volumeServices");
const types_1 = require("../types");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const books = await (0, volumeServices_1.getAllBooksWithCategories)();
    res.json(books);
    //console.log(books);
});
router.get("/sortby/:sort", async (req, res) => {
    const { sort } = req.params;
    if (!(0, types_1.isSortBY)(sort)) {
        return res.send("el pepe ete sech añaña");
    }
    const sortType = sort;
    let books = await (0, volumeServices_1.getBooksOrdered)(sortType);
    res.json(books);
});
router.get("/id/:id", async (req, res) => {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
        res.status(400);
        res.send("id must be a valid number");
        return;
    }
    const bookData = await (0, volumeServices_1.getBookByID)(idNum);
    if (bookData)
        res.json(bookData);
    else {
        res.status(400);
        res.send("Error, book identifyed by id " + id + " doesnt exists");
    }
});
router.get("/isbn/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const isbnNum = parseInt(isbn);
    if (isNaN(isbnNum)) {
        res.status(400);
        res.send("isbn must be a valid number");
        return;
    }
    const bookData = await (0, volumeServices_1.getBookByISBN)(isbnNum);
    if (bookData)
        res.json(bookData);
    else
        res.status(404);
    res.send("Error, book with isbn " + isbn + " doesnt exists");
});
router.get("/search/:text", async (req, res) => {
    const { text } = req.params;
    const results = await (0, volumeServices_1.getBookSearch)(text);
    res.json(results);
});
/*
router.post("/",async (req,res) => {

    addBook("autor","title","descriptin","isbn",2020,"img",14,["cat1","cat2"])
})*/
exports.default = router;
