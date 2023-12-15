export function isSortBY(value) {
    const validSorts = ["id", "isbn", "title", "author", "year", "stock", "description"];
    return validSorts.includes(value);
}
