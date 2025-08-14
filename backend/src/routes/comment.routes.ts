
import express,{Response,Request} from "express";
import isAuthorized from "../middlewares/auth.middleware";
import {CommentsOnPost, CreateAComment, deleteComment, EditAComment} from "../controllers/comment.controller";
let router =express.Router();
router.get("/",(req:Request,res:Response)=>{
    res.send("this is comment root");
})
router.post("/:id",isAuthorized,CreateAComment)
router.put("/:id",isAuthorized,EditAComment);
router.delete("/:id",isAuthorized,deleteComment);
router.get("/:id",CommentsOnPost)
export default router;