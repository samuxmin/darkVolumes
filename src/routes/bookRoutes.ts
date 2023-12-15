import { Router } from "express";
import { addBook, getAllBooks, getAllBooksWithCategories, getBookByID, getBookByISBN, getBookSearch, getBooksOrdered } from "../services/volumeServices.js";
import { IBook, isSortBY, sortBy } from "../types.js";

const router = Router();

router.get("/", async (req,res)=>{
    const books = await getAllBooksWithCategories();
    res.json(books);
    //console.log(books);
})
router.get("/sortby/:sort",async(req,res)=>{
    const { sort } = req.params;
    
    
    if(!isSortBY(sort)){
        return res.send("el pepe ete sech añaña")
        
    }
    const sortType = sort as sortBy;
    let books: IBook[] = await getBooksOrdered(sortType)
    res.json(books);
});
router.get("/id/:id",async(req,res)=>{
    const {id} = req.params;
    const idNum = parseInt(id);
    if(isNaN(idNum)){
        res.status(400);
        res.send("id must be a valid number");
        return;
    }
    const bookData = await getBookByID(idNum);
    if(bookData)
        res.json(bookData);
    else{
        res.status(400);
        res.send("Error, book identifyed by id " + id + " doesnt exists");
    }
        
})

router.get("/isbn/:isbn",async(req,res)=>{
    const {isbn} = req.params;
    const isbnNum = parseInt(isbn);
    if(isNaN(isbnNum)){
        res.status(400);
        res.send("isbn must be a valid number");
        return;
    }
    const bookData = await getBookByISBN(isbnNum);
    if(bookData)
        res.json(bookData);
    else
        res.status(404 )
        res.send("Error, book with isbn " + isbn + " doesnt exists");
})

router.get("/search/:text",async (req,res)=>{
    const {text} = req.params
    const results = await getBookSearch(text)
    res.json(results)

})
/*
router.post("/",async (req,res) => {

    addBook("autor","title","descriptin","isbn",2020,"img",14,["cat1","cat2"])
})*/
export default router
