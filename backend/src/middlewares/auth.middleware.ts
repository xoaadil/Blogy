import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Extend Request type to include user info
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      return res.status(401).json({ message: "Token format invalid" });
    }

    // ✅ Check 4: Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    req.userId = decoded.id;
    console.log("User ID:", req.userId);

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(403).json({ message: "Token verification failed" });
  }
};

export default isAuthorized;
