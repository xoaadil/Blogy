import express, { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import User from "../models/user.model";
import { read } from "fs";
import Post from "../models/post.model";
import Comment from "../models/comment.model";
export const userDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let userId = new Types.ObjectId(req.params.id);
    let user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.json(user);
  } catch (err) {
    res.status(500);
    next(err);
  }
};

export const userAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let userId = new Types.ObjectId(req.params.id);
    let user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    let posts = await Post.find({ postedBy: userId });
    return res.json(posts);
  } catch (err) {
    res.status(500);
    next(err);
  }
};

export const userAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let userId = new Types.ObjectId(req.params.id);
    let user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    let Comments = await Comment.find({ commentedBy: userId });
    return res.json(Comments);
  } catch (err) {
    res.status(500);
    next(err);
  }
};
