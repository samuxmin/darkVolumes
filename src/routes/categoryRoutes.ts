import { Router } from "express";
import { getAllCategories } from "../services/categoriesServices";


const router = Router();

router.get("/",async (req,res)=>{

    res.json(await getAllCategories())
})


export default router;