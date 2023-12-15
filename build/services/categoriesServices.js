var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from "../database.js";
export function getAllCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.execute("SELECT category from category", function (err, results) {
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
    });
}
export function getBookCategories(bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.execute(`SELECT category from volumeCategory where id = ${bookId}`, function (err, results) {
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
    });
}
export function areCatArrayValid(categories) {
    return __awaiter(this, void 0, void 0, function* () {
        const allCategories = yield getAllCategories();
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
    });
}
export function createcategory(category) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [result] = yield pool.promise().execute("INSERT INTO category values(?)", [category]);
            return "ok";
        }
        catch (err) {
            return err;
        }
    });
}
export function deletecategory(category) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            pool.execute("DELETE category where category = ?", [category]);
        }
        catch (error) {
        }
    });
}
