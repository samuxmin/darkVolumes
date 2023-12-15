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
import { areCatArrayValid, getBookCategories } from "./categoriesServices.js";
export function getBookByID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.execute(`SELECT * from volume WHERE id = ${id}`, function (err, rows) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }
                    const books = rows;
                    if (books[0]) {
                        books[0].categories = yield getBookCategories(id);
                    }
                    resolve(books[0]);
                });
            });
        });
    });
}
export function getBookByISBN(isbn) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.execute(`SELECT * from volume WHERE isbn = ${isbn}`, function (err, rows) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }
                    const books = rows;
                    if (books[0]) {
                        books[0].categories = yield getBookCategories(isbn);
                    }
                    resolve(books[0]);
                });
            });
        });
    });
}
export function getAllBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.execute("SELECT * from volume", function (err, rows) {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                const books = rows;
                resolve(books);
            });
        });
    });
}
export function getAllBooksWithCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.execute("SELECT * from volume", function (err, rows) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }
                    const books = rows;
                    yield Promise.all(books.map((b) => __awaiter(this, void 0, void 0, function* () {
                        b.categories = yield getBookCategories(b.id);
                    })));
                    resolve(books);
                });
            });
        });
    });
}
export function getBooksOrdered(sort) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.execute(`SELECT * from volume ORDER BY ${sort}`, function (err, rows) {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                const books = rows;
                resolve(books);
            });
        });
    });
}
export function getBookSearch(text) {
    return __awaiter(this, void 0, void 0, function* () {
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
            pool.execute(query, [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern], function (err, rows) {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                const books = rows;
                resolve(books);
            });
        });
    });
}
export function isBookValid(author, title, description, isbn, year, image, stock, categories) {
    return __awaiter(this, void 0, void 0, function* () {
        if (author == undefined || title == undefined || description == undefined || isbn == undefined || year == undefined || image == undefined || stock == undefined || categories == undefined) {
            return false;
        }
        const isbnNum = parseInt(isbn);
        if (isNaN(isbnNum))
            return false;
        const bookIsbn = yield getBookByISBN(isbnNum);
        if (bookIsbn) {
            return false;
        }
        if (!(yield areCatArrayValid(categories)))
            return false;
        return true;
    });
}
export function addBook(author, title, description, isbn, year, image, stock, categories) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtén todos los libros existentes para calcular el nuevo ID
            let books = yield getAllBooks();
            let id = Math.max(...books.map((b) => b.id)) + 1;
            // Inserta el nuevo libro en la tabla 'volume'
            const insertBookQuery = `INSERT INTO volume (id, author, title, description, isbn, year, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const insertBookValues = [id, author, title, description, isbn, year, image, stock];
            yield pool.execute(insertBookQuery, insertBookValues);
            // Inserta las categorías en la tabla 'volumeCategory' asociadas al nuevo libro
            const insertCategoryQuery = `INSERT INTO volumeCategory (id, category) VALUES (?, ?)`;
            // Usa Promise.all para esperar a que todas las inserciones de categorías se completen
            yield Promise.all(categories.map((cat) => {
                return pool.execute(insertCategoryQuery, [id, cat]);
            }));
            console.log('Libro agregado con éxito');
            // Obtén el libro recién insertado
            const book = yield getBookByID(id);
            return book;
        }
        catch (error) {
            console.error('Error al agregar el libro:', error);
            return;
        }
    });
}
export function modifyBook(book, author, title, description, isbn, year, image, stock, categories) {
    return __awaiter(this, void 0, void 0, function* () {
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
        if (categories !== undefined) {
            book.categories = categories;
            yield updateBookCategories(book);
        }
        yield updateBookBD(book);
    });
}
export function updateBookBD(book) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, author, title, description, isbn, year, image, stock, categories } = book;
        const sql = `UPDATE volume 
                 SET author = ?, title = ?, description = ?, isbn = ?, year = ?, image = ?, stock = ?
                 WHERE id = ?`;
        const values = [author, title, description, isbn, year, image, stock, id];
        try {
            pool.query(sql, values);
        }
        catch (error) {
            console.error('Error al actualizar el libro:', error);
        }
    });
}
export function updateBookCategories(book) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, categories } = book;
        //DELETE PREVIOUS CATEGORIES
        const sql1 = `DELETE FROM volumeCategory where id = ?`;
        const values1 = [id];
        yield pool.promise().execute(sql1, values1);
        const insertCategoryQuery = `INSERT INTO volumeCategory (id, category) VALUES (?, ?)`;
        // Usa Promise.all para esperar a que todas las inserciones de categorías se completen
        yield Promise.all(categories.map((cat) => {
            return pool.execute(insertCategoryQuery, [id, cat]);
        }));
    });
}
// CATEGORIAS
