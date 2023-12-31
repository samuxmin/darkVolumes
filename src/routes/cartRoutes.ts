import { Router } from "express";
import { getUserByEmail } from "../services/userServices";
import pool from "../database";
import { getBookByID } from "../services/volumeServices";
import { Book } from "../types";
import { getUserCart } from "../services/cart";

const router = Router();

router.get("/", async (req,res)=>{
    const {user} = req.body;
    if( (await getUserByEmail(user)) == undefined ){
        res.status(400).send("Invalid user");
        return;
    }
    try{
        const cart = await getUserCart(user);
        res.json(cart);
    }catch(err){

        console.log(err)
        res.status(500).send()
    }
    
})

router.post("/add",async (req,res) => {
    const {user,items} = req.body;
    if( (await getUserByEmail(user)) == undefined ){
        res.status(400).send("Invalid user")
        return;
    }
    const userCart = await getUserCart(user);

    let cartIds = userCart.map(b=>b.id);

    if(!Array.isArray(items)){
        res.status(400).send("Invalid list of items");
        return;
    }
    await pool.promise().query("START TRANSACTION");
    for(let i = 0; i < items.length; i++){
        let {book, amount} = items[i];
        let id = book.id
        if(!id || !amount){
            res.status(400).send("Invalid list of items");
            await pool.promise().query("ROLLBACK");
            return;
        }
        let bookFromBD:Book = await getBookByID(id)

        if( bookFromBD == undefined ){
            res.status(400).send(`Invalid id ${id} of book`);
            await pool.promise().query("ROLLBACK");
            return;
        }

        if(isNaN(amount)){
            res.status(400).send();
            await pool.promise().query("ROLLBACK");
            return;
        }
        
        if(cartIds.includes(bookFromBD.id)){
            let totalAmount = userCart[cartIds.indexOf(bookFromBD.id)].amount + amount;
            if(bookFromBD.stock < totalAmount){
                res.status(418).send("not enough items in stock");
                await pool.promise().query("ROLLBACK");
                return;
            }

            //UPDATE
            try {
                await pool.promise().query("UPDATE cart set amount = amount + ? WHERE usermail = ? and bookId = ?",[amount, user,id]);
            } catch (error) {
                console.log(error)
                res.status(500).send()
                await pool.promise().query("ROLLBACK");
                return;
            }

        }else if(bookFromBD.stock < amount){
            res.status(418).send("not enough items in stock");
            await pool.promise().query("ROLLBACK");
            return;
        }else{
            //INSERT INTO
            try {
                await pool.promise().query("INSERT INTO cart(usermail,bookId,amount) values(?, ?, ?)",[user,id,amount]);              
            } catch (error) {
                console.log(error)
                res.status(500).send();
                await pool.promise().query("ROLLBACK");
                return;
            }
        }
        
    }
    await pool.promise().query("COMMIT");
    res.status(201).send()
});

router.post("/remove", async (req,res) => {
    const {user,items} = req.body;
    if( (await getUserByEmail(user)) == undefined ){
        res.status(400).send("Invalid user")
        return;
    }
    const userCart = await getUserCart(user);

    let cartIds = userCart.map(b=>b.id);

    if(!Array.isArray(items)){
        res.status(400).send("Invalid list of items");
        return;
    }
    await pool.promise().query("START TRANSACTION");

    for(let i = 0; i < items.length;i++){
        let {book, amount} = items[i];
        let id = book.id
        if(!id || !amount){
        res.status(400).send("Invalid list of items");
        await pool.promise().query("ROLLBACK");
        return;
        }
        if(!cartIds.includes(id)){
            res.status(400).send(`Id ${id} is not in the cart`);
            await pool.promise().query("ROLLBACK");
        };
        let bookFromDB:Book = await getBookByID(id)

        if( bookFromDB == undefined ){
            res.status(400).send(`Invalid id ${id} of book`);
            await pool.promise().query("ROLLBACK");
            return;
        }

        if(isNaN(amount)){
            res.status(400).send();
            await pool.promise().query("ROLLBACK");
            return;
        }
        
        if(cartIds.includes(id)){
            let newAmount = userCart[cartIds.indexOf(id)].amount - amount;
            if(newAmount < 0){
                newAmount = 0;
            }
            try{
            await pool.promise().query("UPDATE cart set amount = ? WHERE usermail = ? and bookId = ?",[newAmount, user,id]);
            }catch(err){
                console.log(err);
                res.status(500).send(`Book by id ${id} is not in the cart`);
                await pool.promise().query("ROLLBACK");
                return;
            }
        }else{
            res.status(400).send(`Book by id ${id} is not in the cart`);
            await pool.promise().query("ROLLBACK");
            return;
        }
    }
    await pool.promise().query("COMMIT");
    res.status(201).send();
});

router.delete("/drop",async (req,res) => {
    const {user} = req.body;
    if( (await getUserByEmail(user)) == undefined ){
        res.status(400).send("Invalid user")
    }
    try{
        const [cart] = await pool.promise().execute("DELETE FROM cart where usermail = ?",[user])
        res.json(cart);
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
});

export default router;