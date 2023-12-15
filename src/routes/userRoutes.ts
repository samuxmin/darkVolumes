import { Router } from "express";
import { register } from "../services/auth.js";
import { getUserByEmail, getUserByNick } from "../services/userServices.js";

const router = Router();

router.post("/register",register);

router.get("/email/:email",async (req,res)=>{
    const {email} = req.params
    const usr = await getUserByEmail(email);
    if(usr){
        res.json(usr);
    }else{
        res.status(404);
        res.send("User not found by email " + email)
    }
})

router.get("/nick/:nick",async (req,res)=>{
    const {nick} = req.params
    const usr = await getUserByNick(nick);
    if(usr){
        res.json(usr);
    }else{
        res.status(404);
        res.send("User not found by nick " + nick)
    }
})


export default router;