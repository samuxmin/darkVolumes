import express from "express";
import bookRouter from "./routes/bookRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import salesRouter from "./routes/salesRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import { validateAdmin } from "./middlewares/validateAdmin.js";
import { validateJWT } from "./middlewares/validateJWT.js";

import { saveSaleToDB } from "./services/sales.js";
import { getUserByEmail, getUserByNick } from "./services/userServices.js";
import { BookWithAmount } from "./types.js";
import { getBookByID } from "./services/volumeServices.js";



console.log("Hola mundo");
const app = express();

const PORT = 3000;
app.listen(PORT,()=>{
  console.log("Servidor corriendo en el puerto " + PORT)
});
app.use(express.json())
app.use(express.static("public"))

app.use("/api/volumes", bookRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/admin",[validateJWT,validateAdmin],adminRouter);
app.use("/api/user",userRouter);
app.use("/api/buy/",salesRouter)
app.use("/api/cart/",[validateJWT],cartRouter)

/*
async function testeando(){
  let booksAm : BookWithAmount[] = [];
  for(let i = 1;i<5; i++){
    let book = await  getBookByID(i);
    let bA : BookWithAmount = {
      book,
      amount:5
    } 
    booksAm.push(bA)
  }
  const u = await getUserByNick("hellboy");
  if(u == undefined){
    return
  }
  saveSaleToDB(u, booksAm);
}
testeando()*/