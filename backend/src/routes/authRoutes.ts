import express,{Response,Request} from "express";
import {Signup,Login} from "../controllers/auth.controller"
const router = express.Router();

router.get("/",(req:Request,res: Response)=>{
    res.send("this is auth root")
})

router.post("/Signup",Signup);
router.post("/Login",Login);



export default router;
