import express,{Response,Request} from "express";
const router = express.Router();


router.get("/",(req:Request,res:Response)=>{
res.send("this is post root");
})


export default router;