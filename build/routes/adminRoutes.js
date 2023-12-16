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
import { addBook, getBookByID, isBookValid, modifyBook } from "../services/volumeServices.js";
import { areCatArrayValid, createcategory, deletecategory } from "../services/categoriesServices.js";
const router = Router();
router.post("/createbook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { author, title, description, isbn, year, image, stock, categories, price } = req.body;
    if (yield isBookValid(author, title, description, isbn, year, image, stock, categories)) {
        res.status(200);
        const result = yield addBook(author, title, description, isbn, year, image, stock, categories, price);
        res.send(result);
    }
    else {
        res.status(400);
        res.send("error papu");
        console.log("Libro no valido");
    }
}));
router.get("/", (req, res) => {
    res.send("soy admin");
});
router.put("/modifybook/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
        res.status(400);
        res.send("id must be a number");
        return;
    }
    const { author, title, description, isbn, year, image, stock, categories, price } = req.body;
    const book = yield getBookByID(idNum);
    if (categories !== undefined && !(yield areCatArrayValid(categories))) {
        res.status(400);
        res.send("Invalid categories");
        return;
    }
    ;
    if (book) {
        console.log("libro valido");
        modifyBook(book, author, title, description, isbn, year, image, stock, categories, price);
        res.status(200);
        res.send("ok");
    }
    else {
        res.status(404);
        res.send("Error, book identifyed by id " + id + " doesnt exists");
    }
}));
router.delete("/deletebook/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
        res.status(400);
        res.send("id must be a number");
        return;
    }
    const book = yield getBookByID(idNum);
    if (!book) {
        res.status(404);
        res.send("Error, book identifyed by id " + id + " doesnt exists");
    }
}));
router.post("/createcategory", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.body;
        if (category) {
            const result = yield createcategory(category);
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
}));
router.delete("/deletecategory/:category", (req, res) => {
    const { category } = req.params;
    try {
        deletecategory(category);
        res.status(200);
        res.send(`category ${category} deleted`);
        return;
    }
    catch (error) {
        res.status(400);
        res.send(error);
    }
});
export default router;
