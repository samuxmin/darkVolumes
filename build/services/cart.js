"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCart = void 0;
const database_1 = __importDefault(require("../database"));
async function getUserCart(user) {
    try {
        const [cart] = await database_1.default
            .promise()
            .execute("SELECT v.*, c.amount FROM cart as c JOIN volume as v ON v.id = c.bookId   where usermail = ?", [user]);
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return [];
        }
        return cart;
    }
    catch (err) {
        console.log(err);
        return [];
    }
}
exports.getUserCart = getUserCart;
