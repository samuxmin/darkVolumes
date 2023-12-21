import pool from "../database";
import { Book, sortBy } from "../types";
import { areCatArrayValid, getAllCategories, getBookCategories } from "./categoriesServices";


export async function getBookByID(id:number) : Promise<Book>{
    return new Promise<Book>((resolve, reject) => {
        
        pool.execute(`SELECT * from volume WHERE id = ${id}`, async function (err, rows) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const books = rows as Book[];
            if(books[0]){
                books[0].categories = await getBookCategories(id);
            }
            
            resolve(books[0]);
        });
    });
}

export async function getBookByISBN(isbn:number) : Promise<Book>{
    return new Promise<Book>((resolve, reject) => {
        
        pool.execute(`SELECT * from volume WHERE isbn = ${isbn}`, async function (err, rows) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const books = rows as Book[];
            if(books[0]){
                books[0].categories = await getBookCategories(isbn);
            }
            
            resolve(books[0]);
        });
    });
}

export async function getAllBooks() : Promise<Book[]>{
    return new Promise<Book[]>((resolve, reject) => {
        pool.execute("SELECT * from volume", function (err, rows) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const books = rows as Book[];
            resolve(books);
        });
    });
}

export async function getAllBooksWithCategories() : Promise<Book[]>{
    return new Promise<Book[]>((resolve, reject) => {
        pool.execute("SELECT * from volume",async function (err, rows) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const books = rows as Book[];
            await Promise.all(
                books.map(async (b: Book) => {
                  b.categories = await getBookCategories(b.id);
                })
              );

            resolve(books);
        });
    });
}

export async function getBooksOrdered(sort: sortBy):Promise<Book[]> {
    
    return new Promise<Book[]>((resolve, reject) => {
        pool.execute(`SELECT * from volume ORDER BY ${sort}`, function (err, rows) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const books = rows as Book[];
            resolve(books);
        });
    });
}

export async function getBookSearch(text: string): Promise<Book[]> {
    return new Promise<Book[]>((resolve, reject) => {
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
  
        const books = rows as Book[];
        resolve(books);
      });
    });
}
  
export async function isBookValid(author: string, title: string, description: string, isbn: string, year: number, image: string, stock: number, categories: string[]):Promise<boolean>{

    if(author == undefined || title ==undefined || description == undefined || isbn == undefined || year ==undefined || image == undefined || stock ==undefined || categories == undefined){
      return false;
    }
    const isbnNum = parseInt(isbn)
    if(isNaN(isbnNum))return false;
    const bookIsbn = await getBookByISBN(isbnNum);
    if(bookIsbn){
        return false;
    }
    if(! (await areCatArrayValid(categories) ))return false;
    return true;
}

export async function addBook(author: string, title: string, description: string, isbn: string, year: number, image: string, stock: number, categories: string[],price:number){
    try {
      // Obtén todos los libros existentes para calcular el nuevo ID
      let books = await getAllBooks();
      let id: number = Math.max(...books.map((b) => b.id)) + 1;
      
  
      // Inserta el nuevo libro en la tabla 'volume'
      const insertBookQuery = `INSERT INTO volume (id, author, title, description, isbn, year, image, stock, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const insertBookValues = [id, author, title, description, isbn, year, image, stock,price];
  
      await pool.promise().execute(insertBookQuery, insertBookValues);
  
      // Inserta las categorías en la tabla 'volumeCategory' asociadas al nuevo libro
      const insertCategoryQuery = `INSERT INTO volumeCategory (id, category) VALUES (?, ?)`;
  
      // Usa Promise.all para esperar a que todas las inserciones de categorías se completen
      await Promise.all(
        categories.map((cat) => {
          return pool.execute(insertCategoryQuery, [id, cat]);
        })
      );
  
      // Obtén el libro recién insertado
      const book = await getBookByID(id);
  
      return book;
    } catch (error) {
      console.error('Error al agregar el libro:', error);
      return ;
    }
  }
  
  
  export async function modifyBook(book:Book,author: string, title: string, description: string, isbn: string, year: number, image: string, stock: number, categories: string[],price:number){
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
      if(price !== undefined){
        book.price = price;
      }
      if (categories !== undefined) {
        book.categories = categories;
        
        await updateBookCategories(book);
      }
 
      await updateBookBD(book);
  }
  export async function updateBookBD(book: Book) {
    const { id, author, title, description, isbn, year, image, stock, categories, price } = book;

    const sql = `UPDATE volume 
                 SET author = ?, title = ?, description = ?, isbn = ?, year = ?, image = ?, stock = ?, price = ?
                 WHERE id = ?`;
 

    const values = [author, title, description, isbn, year, image, stock, price, id];
  
    try {

      let q = await pool.promise().query(sql, values);

    } catch (error) {
      console.error('Error al actualizar el libro:', error);
    }
  }

export async function updateBookCategories(book:Book){
    const {id,categories} = book;
    //DELETE PREVIOUS CATEGORIES
    const sql1 = `DELETE FROM volumeCategory where id = ?`;
    const values1 = [id];
    await pool.promise().execute(sql1,values1);

    const insertCategoryQuery = `INSERT INTO volumeCategory (id, category) VALUES (?, ?)`;
  
    // Usa Promise.all para esperar a que todas las inserciones de categorías se completen
    await Promise.all(
      categories.map(async (cat) => {
        await pool.promise().execute(insertCategoryQuery, [id, cat]);
      })
    )

}
// CATEGORIAS
