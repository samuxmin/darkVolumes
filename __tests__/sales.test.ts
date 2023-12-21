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
let token:string;


beforeAll(()=>{
    const PORT = 3002;
    server = app.listen(PORT,()=>{
    console.log("Test server running on port " + PORT)
});
})

afterAll(async() => {
    server.close();
    pool.end();
});


it("compra",buy)
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
    console.log(response);
  }

  async function loginAsUser(){
    const response = await request(app).post("/api/user/login").send({
        email:"mail@mail.com",
        password:"1234"
    });
    expect(response.statusCode).toBe(200);
    return response.body.token;
}