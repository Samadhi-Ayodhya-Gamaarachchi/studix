import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.header("Authorization");
  const token = header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // decoded is the payload we signed (e.g., { id: user._id, iat, exp })
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
