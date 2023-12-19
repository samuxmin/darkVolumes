"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../services/auth");
const userServices_1 = require("../services/userServices");
const router = (0, express_1.Router)();
router.post("/register", auth_1.register);
router.post("/login", auth_1.login);
router.get("/email/:email", async (req, res) => {
    const { email } = req.params;
    const usr = await (0, userServices_1.getUserByEmail)(email);
    if (usr) {
        usr.password = "";
        res.json(usr);
    }
    else {
        res.status(404);
        res.send("User not found by email " + email);
    }
});
router.get("/nick/:nick", async (req, res) => {
    const { nick } = req.params;
    const usr = await (0, userServices_1.getUserByNick)(nick);
    if (usr) {
        usr.password = "";
        res.json(usr);
    }
    else {
        res.status(404);
        res.send("User not found by nick " + nick);
    }
});
exports.default = router;
