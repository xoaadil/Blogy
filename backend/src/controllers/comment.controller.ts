import express, { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Comment from "../models/comment.model";
import User from "../models/user.model";
export const CreateAComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { content } = req.body;
    let userId = req.userId;
    let postId = req.params.id;
    if (!userId) {
      return res.status(404).json({
        message: "user not founnd",
      });
    }
    if (!postId) {
      return res.status(404).json({
        message: "post not founnd",
      });
    }
    let postObjectId = new Types.ObjectId(postId);
    let userObjectId = new Types.ObjectId(userId);
    let comment= await Comment.create({
        content : content,
        commentedBy : userObjectId,
        onPost : postObjectId
    });
    return res.status(201).json({
        message : "comment has been done",
        comment
    })
  } catch (err) {
    res.status(500);
    next(err);
  }
};


export const EditAComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const commentId = req.params.id;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
      if (!commentId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const user = await User.findById(userId);
     if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const isOwner = comment.commentedBy.toString() === userId;
    const isAdmin = user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: Not allowed to edit" });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (err) {
    res.status(500);
    next(err);
  }
};


export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId;
   
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized because of userid" });
    }
      if (!commentId) {
      return res.status(401).json({ message: "Unauthorized because of comment id" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const user = await User.findById(userId);
     if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const isOwner = comment.commentedBy.toString() === userId;
    const isAdmin = user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: Not allowed to edit" });
    }

    await comment.deleteOne();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const CommentsOnPost = async (req:Request,res:Response,next : NextFunction)=>{
  const postId=req.params.id;
  try{
let comments= await Comment.find({onPost : postId}).populate("commentedBy" , "_id name avatar");
res.json(comments);
  }
  catch(err){
    res.status(500);
    next(err);
  }
}


