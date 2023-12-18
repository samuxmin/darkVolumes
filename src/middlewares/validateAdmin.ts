import { Request, Response, NextFunction } from "express";
import pool from "../database.js";

export async function validateAdmin(req: Request, res: Response, next: NextFunction) {
    const { user } = req.body;

    if (!user) {
        return res.status(401).json({ ok: false, msg: "Not logged in" });
    }

    try {
        // Check if the user's email exists in the admin table
        const [adminResult] = await pool.promise().execute("SELECT * FROM ADMIN where email = ?", [user]);

        if ((adminResult as []).length > 0) {
            // If the email is found in the admin table, continue to the next middleware
            next();
        } else {
            // If the email is not found in the admin table, deny access
            res.status(403).json({ ok: false, msg: "Not authorized" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: "Internal server error" });
    }
}
