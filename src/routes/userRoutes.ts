import { Router } from "express";
import { login, register } from "../services/auth";
import { getUserByEmail, getUserByNick } from "../services/userServices";

const router = Router();

router.post("/register",register);
router.post("/login",login)
router.get("/email/:email",async (req,res)=>{
    const {email} = req.params
    const usr = await getUserByEmail(email);
    
    if(usr){
        usr.password = ""
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
        usr.password = "";
        res.json(usr);
    }else{
        res.status(404);
        res.send("User not found by nick " + nick)
    }
})


export default router;