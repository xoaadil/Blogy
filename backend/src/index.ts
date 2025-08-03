import  express, {Response,Request} from "express";
import dotenv from "dotenv";
import cors from "cors";
import {errorMiddleware} from "./middlewares/error.middleware"
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/post.routes"
dotenv.config();
let app=express()

app.use(express.json());
app.use(cors());

let PORT=process.env.PORT || 5000;

app.get("/",(req: Request,res: Response)=>{
    res.send("this is root");
})

app.use("/api/auth",authRoutes);
app.use("/api/post",postRoutes);


import "./config/db";
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`app is working on ${PORT}`);
})