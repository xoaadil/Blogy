import express ,{Request,Response} from "express";
import { userAllComments, userAllPosts, userDetails } from "../controllers/user.controller";
import isAuthorized from "../middlewares/auth.middleware";
let router =express.Router();
router.get("/",isAuthorized,userDetails);
router.get("/posts",isAuthorized,userAllPosts);
router.get("/comments",isAuthorized,userAllComments)
export default router;