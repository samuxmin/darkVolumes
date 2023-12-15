import { Router } from "express";
const router = Router();
router.post("/createbook", (req, res) => {
    console.log(req.body);
});
export default router;
