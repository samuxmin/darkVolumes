import { Router } from "express";
import { addBook, getBookByID, isBookValid, modifyBook } from "../services/volumeServices";
import { areCatArrayValid, createcategory, deletecategory } from "../services/categoriesServices";
import pool from "../database";

const router = Router();

router.post("/createbook", async (req, res) => {
  const { author, title, description, isbn, year, image, stock, categories, price } =
    req.body;
  
 if(await isBookValid( author, title, description, isbn, year, image, stock, categories )){
  res.status(200);
  const result = await addBook(
    author,
    title,
    description,
    isbn,
    year,
    image,
    stock,
    categories,
    price
  );
  res.json(result);
 } else {
    res.status(400);
    res.send({ok:false,msg:"libro no valido"});

  }

});

router.get("/", (req, res) => {
  res.send("soy admin");
});

router.put("/modifybook/id/:id", async (req,res)=>{
  const {id} = req.params
  const idNum = parseInt(id);


  if(isNaN(idNum)){
    res.status(400)
    res.send({ok:false,msg:"id must be a number"})
    return;
  }
  const { author, title, description, isbn, year, image, stock, categories, price } = req.body;
  const book = await getBookByID(idNum);

  if(categories !== undefined && !(await areCatArrayValid(categories))){
    res.status(400)
    res.send({ok:false,msg:"Invalid categories"});
    return;
  };

  if(book){
    await modifyBook(book,author, title, description, isbn, year, image, stock, categories,price);
    res.status(200);
    res.send({ok:true, msg:"book modifyed"});
  }else{
    res.status(404);
    res.send({ok:false, msg:"Error, book identifyed by id " + id + " doesnt exists"});
  }
})


router.delete("/deletebook/id/:id",async(req,res) => {
  const {id} = req.params
  const idNum = parseInt(id);
  if(isNaN(idNum)){
    res.status(400)
    res.send("id must be a number")
    return;

  }
  const book = await getBookByID(idNum);
  if(!book){
    res.status(404);
    res.send("Error, book identifyed by id " + id + " doesnt exists");
  }else{
    try{
      await pool.promise().query("START TRANSACTION");
      await pool.promise().query("delete from volumeCategory where id = ?",[idNum]);
      await pool.promise().query("delete from volume where id = ?",[idNum]);
      await pool.promise().query("COMMIT");
      res.status(200).send({ok:true,msg:"book deleted"});
    return;
  }catch(err){
    console.log(err)
    pool.execute("ROLLBACK");
    res.status(500).send();
  }
  }
})

router.post("/createcategory",async(req,res) => {
  try{
    const {category} = req.body;
    if(category){
      const result =await createcategory(category);
      if(result =="ok"){
        res.status(200);
        res.send({ok:true, msg:`category ${category} created`});
        return;
      }else{
        res.status(400);
        res.send({ok:false, msg:"category already exists"});
      }
    }else throw("category undefined");
  }catch(err){
    res.status(400);
    res.send(err)
  }
})

router.delete("/deletecategory/:category",async (req,res)=>{
  const {category} = req.params
  try {
    let del = await deletecategory(category);
    if(del){
      res.status(200);
      res.send(`category ${category} deleted`);
    }
    
    return;
  } catch (error) {
    res.status(400);
    res.send(error);
  }
})

export default router;
