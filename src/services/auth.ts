import { Request, Response } from "express";
import { getUserByEmail, getUserByNick } from "./userServices.js";
import bcrypt from "bcrypt"
import pool from "../database.js";
import { createToken } from "./token.js";

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
        bcrypt.hash(password,12).then(async (hash)=>{

            const result = await pool.promise().execute("INSERT INTO user(email,nick,password,birthdate) values(?,?,?,?)",[email,nick,hash,birthdate]);
            res.json({ok:true,msg:"register",result});
        })


    }catch(err){
        console.log(err)
        res.status(500);
        res.send();
    }
    
}

export async function login(req:Request,res:Response){
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400).send("Fields undefined");
        return;
    }
    const user = await getUserByEmail(email);
    if(!user){
        res.status(404).send("User not found");
        return;
    }

    bcrypt.compare(password,user.password,(err,isMatch) => {
        if(!isMatch){
            res.status(401).json({ok: false, msg: "login unsuccesful" });
            return
        }else{
            const token = createToken(user);
            res.json({ ok: true, msg: "Login successful", token, user });
        }
    });
}