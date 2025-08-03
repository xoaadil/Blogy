import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { z } from "zod";
import bcrypt from "bcrypt";
import { error } from "console";
import { ApiError } from "../utils/ApiError";

export const Signup = async (req: Request, res: Response) => {
  const userSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(4).max(100),
  });
  try {
    console.log("Incoming body:", req.body);
    let result = userSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Bad Request",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }
    const { name, email, password } = result.data;
    const { adminCode } = req.body;
    let hashpass = await bcrypt.hash(password, 5);

    console.log("Looking for user in DB...");
    let user = await User.findOne({ email });
    if (user) {
      return res.json({
        message: "this email adress is alred register please login",
        error: error,
      });
    } else {
      let role = "user";
      if(process.env.ADMIN_PASSCODE as string ===adminCode){
        role="admin";
      }
      console.log("Creating new user...");
      user = await User.create({
        name,
        email,
        password: hashpass,
       role: role,
      });
    }
    let token: string = generateToken(user._id as string);

    res.json({
      message: "SignUp successful",
      user,
      token,
    });
  } catch (error: any) {
    throw new ApiError("internal server side error", 500);
  }
};

export const Login = async (req: Request, res: Response,next :NextFunction) => {
  const userSchema = z.object({
    password: z.string().min(3).max(100),
    email: z.string().min(3).max(100).email(),
  });
  try {
    let result = userSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Bad Request",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }
    const { email, password } = result.data;
    let user = await User.findOne({ email: email });
    if (!user) {
      return next(new ApiError("incorrect detail", 401)) ;
      
    } else {
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new ApiError("Password is incorrect", 400);
        return;
      } else {
        let token = generateToken(user._id as string);
        return res.status(200).json({
          message: "Login successfull",
          token,
          user,
        });
      }
    }
  } catch (err) {
    throw new ApiError("internal server side error", 500);
  }
};
