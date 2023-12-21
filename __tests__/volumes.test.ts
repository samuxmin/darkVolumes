import {Server} from "http"
import app from "../src/app";
import request from "supertest"
import pool from "../src/database";
import { getAllCategories } from "../src/services/categoriesServices";

//const response = request(app).get("api/volumes")
let server:Server
beforeAll(()=>{
    const PORT = 3000;
    server = app.listen(PORT,()=>{
    console.log("Test server running on port " + PORT)
});
})

afterAll(() => {
    server.close();
   pool.end();
  });

it("get volumes",volumesDB)
it("get volume by id",getVolumeByID)
it("get volume by isbn",getVolumeByISBN)
it("Test for categories", getAllCats);


/*
- `/api/volumes/` Get all volumes
- `/api/volumes/id/:id` Get volume by id
- `/api/volumes/isbn/:isbn` Get volume by ISBN
- `/api/volumes/sortby/:sort` Get all volumes sorted (sort value: "id" | "isbn" | "title" | "author" | "year" | "stock" | "description")
- `/api/volumes/search/:text` Get all volumes with description, title, year, author containing the text

*/

async function volumesDB(){
    const response = await request(app).get("/api/volumes")
    const {body} = response
    //console.log(response)
    let isArray = Array.isArray(body);
    //expect(response).toBe(true)  
    expect(isArray).toBe(true);

    if(Array.isArray(body)){
        body.forEach(x=>{
            expect(x.id).not.toBeUndefined();
        })
    }
}

async function getVolumeByID() {
    const response = await request(app).get("/api/volumes/id/2");
    expect(response.body.id).toBe(2)
}

async function getVolumeByISBN() {
    const response = await request(app).get("/api/volumes/isbn/9781421525778");
    expect(response.body.isbn).toBe("9781421525778");
}

async function getAllCats(){
    const categories = await request(app).get("/api/categories/");
    
    expect(Array.isArray(categories.body)).toBeTruthy();
    expect(categories.body.includes("Action")).toBeTruthy();

    // TEST CREATING A CATEGORY THAT EXISTS
    const response = await request(app).post("/api/user/login").send({
        email:"admin@mail.com",
        password:"1234"
    });
    expect(response.statusCode).toBe(200);
    const {token} = response.body;

    let existingCatReq = await request(app).post("/api/admin/createcategory").send({category:"Sports",token})
    expect(existingCatReq.statusCode).toBe(400);
    expect(existingCatReq.body.msg).toBe("category already exists");

    let newCatReq = await request(app).post("/api/admin/createcategory").send({category:"testcategory",token})
    let {ok,msg} = newCatReq.body;
    expect(ok).toBeTruthy();
    expect(msg).toBe("category testcategory created")
    expect((await getAllCategories()).includes("testcategory")).toBeTruthy();

    let deleteNewCatReq = await request(app).delete("/api/admin/deletecategory/testcategory").send({token})
    
    expect((await getAllCategories()).includes("testcategory")).toBeFalsy();
    
}