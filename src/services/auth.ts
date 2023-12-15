import { Request, Response } from "express";
import { getUserByEmail, getUserByNick } from "./userServices.js";
import pool from "../database.js";

export async function register(req:Request,res:Response){
    const {email,nick,password,birthdate} = req.body
    if(email == undefined || nick == undefined || password == undefined || birthdate ==undefined){
        res.status(400);
        res.send("Fields undefined");
        return
    }
    if(await getUserByEmail(email)){
        res.status(400);
        res.send("Email in use");
        return;
    }
    if(await getUserByNick(nick)){
        res.status(400);
        res.send("Nick in use");
        return;
    }
    try{

        const result = await pool.promise().execute("INSERT INTO user(email,nick,password,birthdate) values(?,?,?,?)",[email,nick,password,birthdate]);
        res.json({ok:true,msg:"register",result});

    }catch(err){
        console.log(err)
        res.status(500);
        res.send();
    }
    
}