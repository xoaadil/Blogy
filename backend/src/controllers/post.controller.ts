import express, { Response, Request, NextFunction, response } from "express";
import { z } from "zod";
import { Types } from "mongoose";
import Post from "../models/post.model";
import User from "../models/user.model";
const postSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(3).max(50000),
});
export const CreateAPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = postSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }
    const { title, content } = result.data;

    const postImage = req.file?.path || null; // multer + cloudinary adds path to req.file
    let newPost = await Post.create({
      title,
      content,
      postedBy: req.userId,
      postImage: postImage,
    });
    res.status(201).json({
      message: "post has been created",
      post: newPost,
    });
  } catch (err) {
    res.status(500);
    next(err);
  }
};
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;
    let post = await Post.findById(postId);
    let user = await User.findOne({ _id: userId });
    console.log(post);
    if (!post) {
      res.status(401);
      return next(new Error("post doesnot exisT"));
    } else if (!user) {
      res.status(401);
      return next(new Error("User not found"));
    } else {
      const isOwner = post.postedBy.toString() === userId;
      const isAdmin = user.role === "admin";

      if (isOwner || isAdmin) {
        let deletedPost = await Post.deleteOne({ _id: post._id });

        return res.status(203).json({
          message: "post has been deleted by ",
          DeletedPost: deletedPost,
        });
      } else {
        res.status(501);
        return next(new Error("you are not owner of this post "));
      }
    }
  } catch (err) {
    res.status(500), next(err);
  }
};

export const editAPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("edit page");
    let result = postSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }
    console.log(result.data);
    const { title, content } = result.data;
    let postId = req.params.id;
    let userId = req.userId;
    let post = await Post.findById(postId);
    let user = await User.findOne({ _id: userId });

    if (!post) {
      res.status(401);
      return next(new Error("post doesnot exisT"));
    } else if (!user) {
      res.status(401);
      return next(new Error("User not found"));
    } else {
      const isOwner = post.postedBy.toString() === userId;
      const isAdmin = user.role === "admin";

      if (isOwner || isAdmin) {
        post.title = title;
        post.content = content;
        await post.save();

        res.status(201).json({
          message: "post has been edited",
          post: post,
        });
      } else {
        return next(new Error("you have no right to edit this post "));
      }
    }
  } catch (err) {
    res.status(500);
    next(err);
  }
};
export const getAllPostsOfUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let userId = req.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    let userObjectId = new Types.ObjectId(userId);
    let posts = await Post.find({ postedBy: userObjectId });
    if (!posts) {
      return res.status(203).json({
        message: "there is no post of your ",
      });
    } else {
      return res.status(401).json({
        message: "here is your all post",
        AllPosts: posts,
      });
    }
  } catch (err) {
    res.status(500);
    next(err);
  }
};
export const toggleLikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    let userObjectId = new Types.ObjectId(userId);
    let post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "post doesnot exist",
      });
    }
    let alreadyLiked = post.likedBy.includes(userObjectId);
      console.log("check karte ha like ko")
    if (alreadyLiked) {
      console.log("check ho gya phele se he like ha")
      console.log(userObjectId); 
      console.log(post.likedBy)
     post.likedBy = post.likedBy.filter((_id) => _id.toString() !== userObjectId.toString());

      console.log(post.likedBy)
    } else {
      post.likedBy.push(userObjectId);
    }
    await post.save();
    return res.status(201).json({
      message: alreadyLiked ? "unliked" : "liked",
      likes: post.likedBy.length,
      likedBy: post.likedBy,
    });
  } catch (err) {
    res.status(500);
    next(err);
  }
};
export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try { 
  let posts = await Post.aggregate([
  {
    $lookup: {
      from: "comments",           // collection name in MongoDB
      localField: "_id",          // Post's _id
      foreignField: "onPost",     // Comment's onPost
      as: "comments"
    }
  },
  {
    $addFields: {
      commentCount: { $size: "$comments" }
    }
  },
  {
    $project: {
      comments: 0 // exclude the full comments array
    }
  }
]);

// Populate postedBy with name & avatar
posts = await Post.populate(posts, { path: "postedBy", select: "name avatar" });

    
    return res.status(200).json({
      message: "here is your all post ",
      AllPosts: posts,
    });
  } catch (err) {
    res.status(500);
    next(err);
  }
};

export const singlePost=async(  req: Request,
  res: Response,
  next: NextFunction)=>{
  let id=req.params.id;
  try{
let post= await Post.findById(id);
return res.status(200).json({
  message : " here is your post",
  Post : post
})
  }
  catch(err){

  }

}