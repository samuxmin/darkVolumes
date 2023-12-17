import pool from "../database.js";
import { Book } from "../types.js";

export async function getUserCart(user:string){
    const [cart] = await pool.promise().execute("SELECT v.*, c.amount FROM cart as c JOIN volume as v ON v.id = c.bookId   where usermail = ?",[user]);
    return cart as Book[];
}
