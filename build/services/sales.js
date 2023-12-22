"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSaleToDB = void 0;
const database_1 = __importDefault(require("../database"));
const pool = database_1.default.promise();
async function saveSaleToDB(user, books) {
    const saleDate = new Date();
    let price = 0;
    try {
        await pool.query("START TRANSACTION");
        // Insert sale details into the 'saleDetails' table
        const saleDetailsResult = await pool.query(`INSERT INTO saleDetails (userMail, saleDate) VALUES (?, ?)`, [user, saleDate]);
        console.log(saleDetailsResult);
        const saleID = saleDetailsResult[0].insertId;
        // Insert book sale amounts into the 'BookSaleAmount' table
        for (let i = 0; i < books.length; i++) {
            const { book, amount } = books[i];
            price += book.price;
            // Update book stock
            await pool.query("UPDATE volume SET stock = stock - ? WHERE id = ?", [amount, book.id]);
            await pool.query("UPDATE saleDetails SET total_price = ? WHERE saleID = ?", [price, saleID]);
            // Insert book sale amount details
            await pool.query("INSERT INTO saleBooks (saleID, bookID, bookISBN, amount) VALUES (?, ?, ?, ?)", [saleID, book.id, book.isbn, amount]);
        }
        // Commit the transaction*/
        await pool.query("COMMIT");
        console.log("Sale successfully saved to the database");
    }
    catch (error) {
        // Rollback the transaction if an error occurs
        await pool.query("ROLLBACK");
        console.error("Error saving sale to the database:", error);
        throw error; // Rethrow the error for higher-level error handling
    }
}
exports.saveSaleToDB = saveSaleToDB;
