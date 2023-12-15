import pool from "../database.js";
import { IUser } from "../types";

export async function getUserByEmail(email:string):Promise<IUser|undefined>{
    if(!email) return undefined;
    const [rows] = await pool.promise().execute("SELECT * FROM user WHERE email = ?",[email]);
    const usrs = rows as IUser[]
    if(usrs.length >0){
        usrs[0].password = "";
        return usrs[0]
    }else{
        return undefined
    }
}

export async function getUserByNick(nick:string):Promise<IUser|undefined>{
    if(!nick) return undefined;
    const [rows] = await pool.promise().execute("SELECT * FROM user WHERE nick = ?",[nick]);
    const usrs = rows as IUser[]
    if(usrs.length >0){
        usrs[0].password = "";
        return usrs[0]
    }else{
        return undefined
    }
}