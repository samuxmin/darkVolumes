"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCart = void 0;
const database_1 = __importDefault(require("../database"));
async function getUserCart(user) {
    const [cart] = await database_1.default.promise().execute("SELECT v.*, c.amount FROM cart as c JOIN volume as v ON v.id = c.bookId   where usermail = ?", [user]);
    return cart;
}
exports.getUserCart = getUserCart;
