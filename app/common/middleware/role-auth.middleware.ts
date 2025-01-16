import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import process from "process";
import { type IUser } from "../../user/user.dto";

export const roleAuth = (
  roles: IUser['role'],
  publicRoutes: string[] = []
) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (publicRoutes.includes(req.path)) {
        next();
        return;
      }
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw createHttpError(401, {
          message: `Invalid token`,
        });
      }

      const decodedUser = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decodedUser as IUser;
      const user = req.user as IUser;
      const userId = req.user._id;
      if (user.role == null ) {
        throw createHttpError(401, { message: "Invalid user role" });
      }
      if (!roles.includes(user.role)) {
        const type =
          user.role.slice(0, 1) + user.role.slice(1).toLocaleLowerCase();

        throw createHttpError(401, {
          message: `${type} can not access this resource`,
        });
      }
      next();
    }
  );

  export const extractUserId = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
  
      if (!token) {
        throw createHttpError(401, {
          message: "Token not provided",
        });
      }
  
      try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decodedUser as IUser;
        
        // Attach the userObjectId (or user._id) to the request
        const userId = req.user._id;
        
        // Attach userId to the request object for downstream usage
        req.user._id = userId;
  
        next();
      } catch (err) {
        throw createHttpError(401, { message: "Invalid or expired token" });
      }
    }
  );

  
