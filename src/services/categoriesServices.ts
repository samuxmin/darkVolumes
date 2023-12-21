import { RowDataPacket } from "mysql2";
import pool from "../database";

export async function getAllCategories() : Promise<string[]>{
    return new Promise<string[]>((resolve, reject) => {
        pool.execute("SELECT category from category", function (err, results) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            results = results as RowDataPacket [];
            if (Array.isArray(results)) {
                const categories = results.map((row) => (row as RowDataPacket).category);
                resolve(categories);
            } else {
                resolve([]);
            }
        });
    });
}

export async function getBookCategories(bookId:number) : Promise<string[]>{
    return new Promise<string[]>((resolve, reject) => {
        pool.execute(`SELECT category from volumeCategory where id = ${bookId}`, function (err, results) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            results = results as RowDataPacket [];
            if (Array.isArray(results)) {
                const categories = results.map((row) => (row as RowDataPacket).category);
                resolve(categories);
            } else {
                resolve([]);
            }
        });
    });
}

export async function areCatArrayValid(categories:string[]){

    const allCategories = await getAllCategories();
    let catsValidas = true;
    if (Array.isArray(categories)) {
      categories.forEach((c: string) => {
        if (allCategories.includes(c)) {
          //joya
        } else {
          catsValidas = false;
          return;
        }
      });
      return catsValidas;
    }else{
        return false;
    }
}

export async function createcategory(category:string){
    try{
        
        const [result] = await pool.promise().execute("INSERT INTO category values(?)",[category]);
        return "ok";
    }catch(err){
        return err;
    }
}

export async function deletecategory(category:string){
    let allCats = await getAllCategories();
    if(!(allCats.includes(category))){
        return false;
    }
    try {
        await pool.promise().execute("DELETE from category where category = ?",[category]);
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}