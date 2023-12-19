"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = 3000;
app_1.default.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto " + PORT);
});
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
