"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriesServices_1 = require("../services/categoriesServices");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    res.json(await (0, categoriesServices_1.getAllCategories)());
});
exports.default = router;
