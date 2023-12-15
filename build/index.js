import express from "express";
import bookRouter from "./routes/bookRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
console.log("Hola mundo");
const app = express();
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto " + PORT);
});
app.use(express.json());
app.get("/", (_, res) => {
    res.send("hola");
});
app.use("/api/volumes", bookRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
