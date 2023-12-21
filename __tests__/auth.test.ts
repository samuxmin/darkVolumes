import {Server} from "http"
import app from "../src/app";
import request from "supertest"
import pool from "../src/database";
import { Book } from "../src/types";
import { getBookByID } from "../src/services/volumeServices";

//const response = request(app).get("api/volumes")
let server:Server
let token:string;

let newBook = {
 
    author:"samuel",
    title:"No rest only test",
    description:"No smile only compile",
    isbn:"1231231231231",
    year:2023,
    image:"img.png",
    stock:20000,
    price: 20,
    categories:[
        "Fiction"
    ]


}
beforeAll(()=>{
    const PORT = 3001;
    server = app.listen(PORT,()=>{
    console.log("Test server running on port " + PORT)
});
})

afterAll(async() => {
    server.close();
    pool.end();
});

it("login user",loginAsUser);
it("create as normal user",usersUnauth);

it("login admin",loginAsAdmin);
it("create as admin", adminCreate);

async function loginAsUser(){
    const response = await request(app).post("/api/user/login").send({
        email:"mail@mail.com",
        password:"1234"
    });
    expect(response.statusCode).toBe(200);
    token = response.body.token;
}

async function usersUnauth(){
    let response = await createBook();
    expect(response.statusCode).toBe(403);
}

async function loginAsAdmin(){
    const response = await request(app).post("/api/user/login").send({
        email:"admin@mail.com",
        password:"1234"
    });
    expect(response.statusCode).toBe(200);
    token = response.body.token;
}

async function createBook(){
    const response = await request(app).post("/api/admin/createbook").send({...newBook,token});
    return response;
}
async function adminCreate(){
    let response = await createBook();
    let {id} = response.body
    expect(response.statusCode).toBe(200);
    expect(await getBookByID(response.body.id)).not.toBe(undefined);

    const modifyBookResponse = await request(app)
    .put(`/api/admin/modifybook/id/${id}`)
    .send({
      author: 'New Author Name',
      title: 'New Title of the Book',
      description: 'New Description of the book',
      isbn: '9876543210123',
      year: 2024,
      image: 'https://example.com/new_book_image.jpg',
      stock: 15,
      categories: ['Adventure', 'Mystery'],
      price: 25,
      token,
    });
    let bookModifyed = await getBookByID(id);
    
    expect(bookModifyed).toEqual({
        id,
        author: 'New Author Name',
        title: 'New Title of the Book',
        description: 'New Description of the book',
        isbn: '9876543210123',
        year: 2024,
        image: 'https://example.com/new_book_image.jpg',
        stock: 15,
        categories: ['Adventure', 'Mystery'],
        price: 25
      })
    let delResp = await deleteBook(response.body.id);

    expect(delResp.body.ok);
    
   // expect(await getBookByID(response.body.id)).toBe(undefined);
}
async function deleteBook(id:number){
    const response = await request(app).delete("/api/admin/deletebook/id/"+id).send({token});
    //console.log(response);
    return response;
}