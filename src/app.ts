import express from "express";
import bookRouter from "./routes/bookRoutes";
import categoryRouter from "./routes/categoryRoutes";
import adminRouter from "./routes/adminRoutes";
import userRouter from "./routes/userRoutes";
import salesRouter from "./routes/salesRoutes";
import cartRouter from "./routes/cartRoutes";
import { validateAdmin } from "./middlewares/validateAdmin";
import { validateJWT } from "./middlewares/validateJWT";

console.log("Hola mundo");
const app = express();

app.use(express.json())
app.use(express.static("public"))

app.use("/api/volumes", bookRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/admin",[validateJWT,validateAdmin],adminRouter);
app.use("/api/user",userRouter);
app.use("/api/buy/",[validateJWT],salesRouter)
app.use("/api/cart/",[validateJWT],cartRouter)

export default app;
