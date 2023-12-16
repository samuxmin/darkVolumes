import { RowDataPacket } from "mysql2";

export interface Book extends RowDataPacket{
    id:number
    author: string;
    title: string;
    description: string;
    isbn: string;
    year: number;
    image: string;
    stock: number;
    categories: string[];
    price:number;
}
export interface User {
    email:string;
    nick:string;
    password:string;
    birth:Date;
}
export type BookWithAmount = { //Each book with the amount of copies
    book:Book,
    amount:number
}
export interface SaleDetails{ //Sale with the user, the date, and books
    user:string,
    date:Date,
    books:BookWithAmount
}

export type sortBy = "id" | "isbn" | "title" | "author" | "year" | "stock" | "description";

export function isSortBY(value:string){
    const validSorts = ["id", "isbn", "title" , "author", "year", "stock", "description"]
    return validSorts.includes(value);
}