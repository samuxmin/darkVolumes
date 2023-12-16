var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import p from "../database.js";
const pool = p.promise();
export function saveSaleToDB(user, books) {
    return __awaiter(this, void 0, void 0, function* () {
        const saleDate = new Date();
        let price = 0;
        try {
            yield pool.query("START TRANSACTION");
            // Insert sale details into the 'saleDetails' table
            const saleDetailsResult = yield pool.query(`INSERT INTO saleDetails (userMail, saleDate) VALUES (?, ?)`, [user.email, saleDate]);
            console.log(saleDetailsResult);
            const saleID = saleDetailsResult[0].insertId;
            // Insert book sale amounts into the 'BookSaleAmount' table
            for (let i = 0; i < books.length; i++) {
                const { book, amount } = books[i];
                price += book.price;
                // Update book stock
                yield pool.query("UPDATE volume SET stock = stock - ? WHERE id = ?", [amount, book.id]);
                yield pool.query("UPDATE saleDetails SET total_price = ? WHERE saleID = ?", [price, saleID]);
                // Insert book sale amount details
                yield pool.query("INSERT INTO saleBooks (saleID, bookID, bookISBN, amount) VALUES (?, ?, ?, ?)", [saleID, book.id, book.isbn, amount]);
            }
            // Commit the transaction*/
            yield pool.query("COMMIT");
            console.log("Sale successfully saved to the database");
        }
        catch (error) {
            // Rollback the transaction if an error occurs
            yield pool.query("ROLLBACK");
            console.error("Error saving sale to the database:", error);
            throw error; // Rethrow the error for higher-level error handling
        }
    });
}
