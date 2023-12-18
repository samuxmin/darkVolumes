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
export function validateAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user } = req.body;
        if (!user) {
            return res.status(401).json({ ok: false, msg: "Not logged in" });
        }
        try {
            // Check if the user's email exists in the admin table
            const [adminResult] = yield pool.promise().execute("SELECT * FROM ADMIN where email = ?", [user]);
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
    });
}
