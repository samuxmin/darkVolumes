import app from "./app";

const PORT = 3000;
app.listen(PORT,()=>{
  console.log("Server running on port " + PORT)
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