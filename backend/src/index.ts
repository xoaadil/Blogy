import  express, {Response,Request} from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./middlewares/error.middleware"
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/post.routes"
import commentRoutes from "./routes/comment.routes"
import userRoutes from "./routes/user.routes"
dotenv.config();
let app=express()
import "./config/db";
app.use(express.json());
app.use(cors());

let PORT=process.env.PORT || 5000;

app.get("/",(req: Request,res: Response)=>{
    res.send("this is root");
})

app.use("/api/auth",authRoutes);
app.use("/api/post",postRoutes);
app.use("/api/comment",commentRoutes);
app.use("/api/user",userRoutes);

app.use(errorHandler);



app.listen(PORT, () => {
    console.log(`app is working on ${PORT}`);
})