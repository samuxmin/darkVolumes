import { RowDataPacket } from "mysql2";

export interface IBook extends RowDataPacket{
    id:number
    author: string;
    title: string;
    description: string;
    isbn: string;
    year: number;
    image: string;
    stock: number;
    categories: string[];
}
export interface IUser {
    email:string;
    nick:string;
    password:string;
    birth:Date;
}

export type sortBy = "id" | "isbn" | "title" | "author" | "year" | "stock" | "description";

export function isSortBY(value:string){
    const validSorts = ["id", "isbn", "title" , "author", "year", "stock", "description"]
    return validSorts.includes(value);
}
export interface ErrorResult {
    error: true;
    msg: string;
  }