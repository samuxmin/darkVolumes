"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdmin = void 0;
const database_1 = __importDefault(require("../database"));
async function validateAdmin(req, res, next) {
    const { user } = req.body;
    if (!user) {
        return res.status(401).json({ ok: false, msg: "Not logged in" });
    }
    try {
        // Check if the user's email exists in the admin table
        const [adminResult] = await database_1.default.promise().execute("SELECT * FROM ADMIN where email = ?", [user]);
        if (adminResult.length > 0) {
            // If the email is found in the admin table, continue to the next middleware
            next();
        }
        else {
            // If the email is not found in the admin table, deny access
            res.status(403).json({ ok: false, msg: "Not authorized" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: "Internal server error" });
    }
}
exports.validateAdmin = validateAdmin;
