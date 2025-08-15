import express ,{Request,Response} from "express";
import { userAllComments, userAllPosts, userDetails } from "../controllers/user.controller";
import isAuthorized from "../middlewares/auth.middleware";
let router =express.Router();
router.get("/:id",userDetails);
router.get("/posts/:id",userAllPosts);
router.get("/comments/:id",userAllComments);
export default router;