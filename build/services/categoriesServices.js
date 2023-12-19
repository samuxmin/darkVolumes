"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletecategory = exports.createcategory = exports.areCatArrayValid = exports.getBookCategories = exports.getAllCategories = void 0;
const database_1 = __importDefault(require("../database"));
async function getAllCategories() {
    return new Promise((resolve, reject) => {
        database_1.default.execute("SELECT category from category", function (err, results) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            results = results;
            if (Array.isArray(results)) {
                const categories = results.map((row) => row.category);
                resolve(categories);
            }
            else {
                resolve([]);
            }
        });
    });
}
exports.getAllCategories = getAllCategories;
async function getBookCategories(bookId) {
    return new Promise((resolve, reject) => {
        database_1.default.execute(`SELECT category from volumeCategory where id = ${bookId}`, function (err, results) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            results = results;
            if (Array.isArray(results)) {
                const categories = results.map((row) => row.category);
                resolve(categories);
            }
            else {
                resolve([]);
            }
        });
    });
}
exports.getBookCategories = getBookCategories;
async function areCatArrayValid(categories) {
    const allCategories = await getAllCategories();
    let catsValidas = true;
    if (Array.isArray(categories)) {
        categories.forEach((c) => {
            if (allCategories.includes(c)) {
                //joya
            }
            else {
                catsValidas = false;
                return;
            }
        });
        return catsValidas;
    }
    else {
        return false;
    }
}
exports.areCatArrayValid = areCatArrayValid;
async function createcategory(category) {
    try {
        const [result] = await database_1.default.promise().execute("INSERT INTO category values(?)", [category]);
        return "ok";
    }
    catch (err) {
        return err;
    }
}
exports.createcategory = createcategory;
async function deletecategory(category) {
    try {
        database_1.default.execute("DELETE category where category = ?", [category]);
    }
    catch (error) {
    }
}
exports.deletecategory = deletecategory;
