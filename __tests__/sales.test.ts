import app from "../src/app";
import pool from "../src/database";
import { saveSaleToDB } from "../src/services/sales";
import { getUserByNick } from "../src/services/userServices";
import { getBookByID } from "../src/services/volumeServices";
import { BookWithAmount } from "../src/types";
import {Server} from "http"
import request from "supertest"
//const response = request(app).get("api/volumes")
let server:Server
console.log("RUNNIG CART AND SALES TESTS")


beforeAll(()=>{
    const PORT = 3002;
    server = app.listen(PORT);
})

afterAll(async() => {
    server.close();
    pool.end();
});


//it("compra",buy)
it("cart tests", testCart)
async function buy(){
    let token = await loginAsUser();
    let booksAm : BookWithAmount[] = [];
    for(let i = 1;i<5; i++){
      let book = await  getBookByID(i);
      let bA : BookWithAmount = {
        book,
        amount:2
      } 
      booksAm.push(bA)
    }
    const response = await request(app).post("/api/buy/").send({token,books:booksAm});
  }

  async function loginAsUser(){
    const response = await request(app).post("/api/user/login").send({
        email:"mail@mail.com",
        password:"1234"
    });
    expect(response.statusCode).toBe(200);
    return response.body.token;
}

async function testCart(){

  let token = await loginAsUser();
  let dropCart = await request(app).delete("/api/cart/drop").send({token});

  let booksAm : BookWithAmount[] = [];
    for(let i = 1;i<5; i++){
      let book = await  getBookByID(i);
      let bA : BookWithAmount = {

        book,
        amount:2
      } 

      booksAm.push(bA)
    }

    let addRes = await  request(app).post("/api/cart/add").send({token, items:booksAm }); 
    let cartDB = await  request(app).get("/api/cart/").send({token});
   
    expect(cartDB.body.length).toBe(booksAm.length);
    for(let i = 0; i< cartDB.body.length; i++){
      expect(cartDB.body[i].id).toBe(booksAm[i].book.id);
    }

    let deleteRes = await request(app).post("/api/cart/remove").send({token, items:booksAm });
    cartDB = await  request(app).get("/api/cart/").send({token});
    expect(cartDB.body[0].amount).toBe(0);
    dropCart = await request(app).delete("/api/cart/drop").send({token});
    cartDB = await  request(app).get("/api/cart/").send({token});
    expect(cartDB.body).toEqual([]);
}