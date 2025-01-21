import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized: Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secretKey = process.env.JWT_SECRET || "defaultSecret"; // Use your actual secret
    const decoded = jwt.verify(token, secretKey) as any;
    req.user = decoded; // Attach user data to the request
    next();
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(403).send({ message: "Invalid or expired token" });
  }
};

export default validateToken;
