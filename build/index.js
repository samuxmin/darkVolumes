"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
console.log("Starting server...");
const PORT = 3000;
app_1.default.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
/*

testeando()*/ 
