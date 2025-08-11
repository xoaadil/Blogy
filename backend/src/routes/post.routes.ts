import express,{Response,Request} from "express";
const router = express.Router();
import {CreateAPost, deletePost, editAPost, getAllPostsOfUser, toggleLikePost,getAllPosts} from "../controllers/post.controller"
import isAuthorized from "../middlewares/auth.middleware";
import upload from "../middlewares/upload.middleware";

router.get("/ping",(req:Request,res:Response)=>{
res.send("this is post root");
})
router.post("/create",isAuthorized,upload.single("postImage"),CreateAPost);
router.delete("/:id",isAuthorized,deletePost);
router.put("/:id",isAuthorized,editAPost);
router.get("/:id",isAuthorized,getAllPostsOfUser);
router.post("/like/:id",isAuthorized,toggleLikePost);
router.get("/",getAllPosts)
export default router;