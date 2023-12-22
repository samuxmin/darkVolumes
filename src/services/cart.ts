import pool from "../database";
import { Book, BookWithAmount } from "../types";

export async function getUserCart(user: string) {
  try {
    const [cart] = await pool
      .promise()
      .execute(
        "SELECT v.*, c.amount FROM cart as c JOIN volume as v ON v.id = c.bookId   where usermail = ?",
        [user]
      );
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return [];
    }
    return cart as Book[];
  } catch (err) {
    console.log(err);
    return [];
  }
}
