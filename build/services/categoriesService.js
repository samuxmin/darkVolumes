var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from "../database";
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
