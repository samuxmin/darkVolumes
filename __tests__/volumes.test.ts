import {Server} from "http"
import app from "../src/app";
import request from "supertest"
import pool from "../src/database";

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