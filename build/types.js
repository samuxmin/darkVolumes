"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSortBY = void 0;
function isSortBY(value) {
    const validSorts = ["id", "isbn", "title", "author", "year", "stock", "description"];
    return validSorts.includes(value);
}
exports.isSortBY = isSortBY;
