"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookCategories = exports.updateBookBD = exports.modifyBook = exports.addBook = exports.isBookValid = exports.getBookSearch = exports.getBooksOrdered = exports.getAllBooksWithCategories = exports.getAllBooks = exports.getBookByISBN = exports.getBookByID = void 0;
const database_1 = __importDefault(require("../database"));
const categoriesServices_1 = require("./categoriesServices");
async function getBookByID(id) {
    return new Promise((resolve, reject) => {
        database_1.default.execute(`SELECT * from volume WHERE id = ${id}`, async function (err, rows) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const books = rows;
            if (books[0]) {
                books[0].categories = await (0, categoriesServices_1.getBookCategories)(id);
            }
            resolve(books[0]);
        });
    });
}
exports.getBookByID = getBookByID;
async function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        database_1.default.execute(`SELECT * from volume WHERE isbn = ${isbn}`, async function (err, rows) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const books = rows;
            if (books[0]) {
                books[0].categories = await (0, categoriesServices_1.getBookCategories)(isbn);
            }
            resolve(books[0]);
        });
    });
}
exports.getBookByISBN = getBookByISBN;
async function getAllBooks() {
    return new Promise((resolve, reject) => {
        database_1.default.execute("SELECT * from volume", function (err, rows) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const books = rows;
            resolve(books);
        });
    });
}
exports.getAllBooks = getAllBooks;
async function getAllBooksWithCategories() {
    return new Promise((resolve, reject) => {
        database_1.default.execute("SELECT * from volume", async function (err, rows) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const books = rows;
            await Promise.all(books.map(async (b) => {
                b.categories = await (0, categoriesServices_1.getBookCategories)(b.id);
            }));
            resolve(books);
        });
    });
}
exports.getAllBooksWithCategories = getAllBooksWithCategories;
async function getBooksOrdered(sort) {
    return new Promise((resolve, reject) => {
        database_1.default.execute(`SELECT * from volume ORDER BY ${sort}`, function (err, rows) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const books = rows;
            resolve(books);
        });
    });
}
exports.getBooksOrdered = getBooksOrdered;
async function getBookSearch(text) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT DISTINCT v.*
        FROM volume v
        JOIN volumeCategory vc ON v.id = vc.id
        WHERE
          vc.category LIKE ? OR
          v.description LIKE ? OR
          v.title LIKE ? OR
          v.author LIKE ? OR
          CAST(v.year AS CHAR) LIKE ?;
      `;
        const searchPattern = `%${text}%`;
        database_1.default.execute(query, [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern], function (err, rows) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const books = rows;
            resolve(books);
        });
    });
}
exports.getBookSearch = getBookSearch;
async function isBookValid(author, title, description, isbn, year, image, stock, categories) {
    if (author == undefined || title == undefined || description == undefined || isbn == undefined || year == undefined || image == undefined || stock == undefined || categories == undefined) {
        return false;
    }
    const isbnNum = parseInt(isbn);
    if (isNaN(isbnNum))
        return false;
    const bookIsbn = await getBookByISBN(isbnNum);
    if (bookIsbn) {
        return false;
    }
    if (!(await (0, categoriesServices_1.areCatArrayValid)(categories)))
        return false;
    return true;
}
exports.isBookValid = isBookValid;
async function addBook(author, title, description, isbn, year, image, stock, categories, price) {
    try {
        // Obtén todos los libros existentes para calcular el nuevo ID
        let books = await getAllBooks();
        let id = Math.max(...books.map((b) => b.id)) + 1;
        // Inserta el nuevo libro en la tabla 'volume'
        const insertBookQuery = `INSERT INTO volume (id, author, title, description, isbn, year, image, stock, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const insertBookValues = [id, author, title, description, isbn, year, image, stock, price];
        await database_1.default.execute(insertBookQuery, insertBookValues);
        // Inserta las categorías en la tabla 'volumeCategory' asociadas al nuevo libro
        const insertCategoryQuery = `INSERT INTO volumeCategory (id, category) VALUES (?, ?)`;
        // Usa Promise.all para esperar a que todas las inserciones de categorías se completen
        await Promise.all(categories.map((cat) => {
            return database_1.default.execute(insertCategoryQuery, [id, cat]);
        }));
        console.log('Libro agregado con éxito');
        // Obtén el libro recién insertado
        const book = await getBookByID(id);
        return book;
    }
    catch (error) {
        console.error('Error al agregar el libro:', error);
        return;
    }
}
exports.addBook = addBook;
async function modifyBook(book, author, title, description, isbn, year, image, stock, categories, price) {
    if (author !== undefined) {
        book.author = author;
    }
    if (title !== undefined) {
        book.title = title;
    }
    if (description !== undefined) {
        book.description = description;
    }
    if (isbn !== undefined) {
        book.isbn = isbn;
    }
    if (year !== undefined) {
        book.year = year;
    }
    if (image !== undefined) {
        book.image = image;
    }
    if (stock !== undefined) {
        book.stock = stock;
    }
    if (price !== undefined) {
        book.price = price;
    }
    if (categories !== undefined) {
        book.categories = categories;
        await updateBookCategories(book);
    }
    await updateBookBD(book);
}
exports.modifyBook = modifyBook;
async function updateBookBD(book) {
    const { id, author, title, description, isbn, year, image, stock, categories, price } = book;
    const sql = `UPDATE volume 
                 SET author = ?, title = ?, description = ?, isbn = ?, year = ?, image = ?, stock = ?, price = ?
                 WHERE id = ?`;
    const values = [author, title, description, isbn, year, image, stock, id, price];
    try {
        database_1.default.query(sql, values);
    }
    catch (error) {
        console.error('Error al actualizar el libro:', error);
    }
}
exports.updateBookBD = updateBookBD;
async function updateBookCategories(book) {
    const { id, categories } = book;
    //DELETE PREVIOUS CATEGORIES
    const sql1 = `DELETE FROM volumeCategory where id = ?`;
    const values1 = [id];
    await database_1.default.promise().execute(sql1, values1);
    const insertCategoryQuery = `INSERT INTO volumeCategory (id, category) VALUES (?, ?)`;
    // Usa Promise.all para esperar a que todas las inserciones de categorías se completen
    await Promise.all(categories.map((cat) => {
        return database_1.default.execute(insertCategoryQuery, [id, cat]);
    }));
}
exports.updateBookCategories = updateBookCategories;
// CATEGORIAS
