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
import { getAllBooksWithCategories, getBookByID, getBookByISBN, getBookSearch, getBooksOrdered } from "../services/volumeServices.js";
import { isSortBY } from "../types.js";
const router = Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield getAllBooksWithCategories();
    res.json(books);
    //console.log(books);
}));
router.get("/sortby/:sort", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort } = req.params;
    if (!isSortBY(sort)) {
        return res.send("el pepe ete sech añaña");
    }
    const sortType = sort;
    let books = yield getBooksOrdered(sortType);
    res.json(books);
}));
router.get("/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
        res.status(400);
        res.send("id must be a valid number");
        return;
    }
    const bookData = yield getBookByID(idNum);
    if (bookData)
        res.json(bookData);
    else {
        res.status(400);
        res.send("Error, book identifyed by id " + id + " doesnt exists");
    }
}));
router.get("/isbn/:isbn", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn } = req.params;
    const isbnNum = parseInt(isbn);
    if (isNaN(isbnNum)) {
        res.status(400);
        res.send("isbn must be a valid number");
        return;
    }
    const bookData = yield getBookByISBN(isbnNum);
    if (bookData)
        res.json(bookData);
    else
        res.status(404);
    res.send("Error, book with isbn " + isbn + " doesnt exists");
}));
router.get("/search/:text", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.params;
    const results = yield getBookSearch(text);
    res.json(results);
}));
/*
router.post("/",async (req,res) => {

    addBook("autor","title","descriptin","isbn",2020,"img",14,["cat1","cat2"])
})*/
export default router;
