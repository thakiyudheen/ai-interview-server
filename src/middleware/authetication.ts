import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "password";

interface JwtPayload {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.jwtToken;
  
  console.log("this is the tocken that available in this application",req?.cookies?.jwtToken);
  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Please login !" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    
    req.user = decoded;
    next();
  
  } catch (err) {
     next(err)
  }
};
