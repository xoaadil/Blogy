import express,{Response,Request} from "express";
const router = express.Router();
import {CreateAPost, deletePost, editAPost, getAllPosts, toggleLikePost} from "../controllers/post.controller"
import isAuthorized from "../middlewares/auth.middleware";
import upload from "../middlewares/upload.middleware";

router.get("/",(req:Request,res:Response)=>{
res.send("this is post root");
})
router.post("/create",isAuthorized,upload.single("postImage"),CreateAPost);
router.delete("/:id",isAuthorized,deletePost);
router.put("/:id",isAuthorized,editAPost);
router.get("/:id",isAuthorized,getAllPosts);
router.post("/like/:id",isAuthorized,toggleLikePost)
export default router;