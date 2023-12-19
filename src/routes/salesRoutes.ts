import { Router } from "express";
import { getUserByEmail } from "../services/userServices";
import { getBookByID } from "../services/volumeServices";
import { BookWithAmount } from "../types";

import { saveSaleToDB } from "../services/sales";
const router = Router();
router.post("/", async (req,res) => {
    const {user : userMail, books} = req.body;
    if( !userMail || !(Array.isArray(books))){
        res.status(400);
        res.send("Invalid request body");
        return;
    }

    const user = await getUserByEmail(userMail)

    if(user == undefined){
        res.status(400);
        res.send("User not found");
        return;
    }
    try{
        //Verify each book is valid
        for(let i = 0; i < books.length; i++){
            let b : BookWithAmount = books[i];
            let book = await getBookByID(b.book.id);

            if(book == undefined){
                res.status(400);
                res.send(`Book with id ${b.book.id} not found`);
                return;
            }

            if(b.amount > book.stock){

                res.status(400).send("Not enough units for sale");
                return;
            }

            books[i].book = book;

        }
        saveSaleToDB(user ,books as BookWithAmount[]);
        res.status(200).send("ok");
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Something went wrong ಠ╭╮ಠ");
        return;
    }

})

export default router;