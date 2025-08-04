import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { z } from "zod";
import bcrypt from "bcrypt";

// ================== Signup Controller ==================
export const Signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(4).max(100),
  });

  try {
    console.log("Incoming body:", req.body);
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    const { name, email, password } = result.data;
    const { adminCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      return next(new Error("This email address is already registered. Please login."));
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    let role = "user";
    if ((process.env.ADMIN_PASSCODE as string) === adminCode) {
      role = "admin";
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(newUser._id as string);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: newUser,
      token,
    });
  } catch (err) {
    res.status(500);
    next(err);
  }
};

// ================== Login Controller ==================
export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3).max(100),
  });

  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    const { email, password } = result.data;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      return next(new Error("Invalid credentials"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      return next(new Error("Invalid credentials"));
    }

    const token = generateToken(user._id as string);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500);
    next(err);
  }
};
