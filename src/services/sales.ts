import { BookWithAmount, User } from "../types";
import p from "../database";
import { ResultSetHeader } from "mysql2";

const pool = p.promise();
export async function saveSaleToDB(user: User, books: BookWithAmount[]) { //Save sale to DB, controls must be done before calling this function
  const saleDate = new Date();
    let price:number = 0;
  try {

    await pool.query("START TRANSACTION");

    // Insert sale details into the 'saleDetails' table
    const saleDetailsResult = await pool.query<ResultSetHeader>(
      `INSERT INTO saleDetails (userMail, saleDate) VALUES (?, ?)`,
      [user, saleDate]
    );
    console.log(saleDetailsResult)
    const saleID = saleDetailsResult[0].insertId;

    // Insert book sale amounts into the 'BookSaleAmount' table
    for (let i = 0; i < books.length; i++) {
      const { book, amount } = books[i];
        price += book.price;
      // Update book stock
      await pool.query(
        "UPDATE volume SET stock = stock - ? WHERE id = ?",
        [amount, book.id]
      );
      await pool.query(
        "UPDATE saleDetails SET total_price = ? WHERE saleID = ?",
        [price, saleID]
      );
      // Insert book sale amount details
      await pool.query(
        "INSERT INTO saleBooks (saleID, bookID, bookISBN, amount) VALUES (?, ?, ?, ?)",
        [saleID, book.id, book.isbn, amount]
      );
    }

    // Commit the transaction*/
    await pool.query("COMMIT");
    console.log("Sale successfully saved to the database");
  } catch (error) {
    // Rollback the transaction if an error occurs
    await pool.query("ROLLBACK");

    console.error("Error saving sale to the database:", error);
    throw error; // Rethrow the error for higher-level error handling
  }
}
