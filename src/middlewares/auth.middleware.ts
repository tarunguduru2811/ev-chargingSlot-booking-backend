import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/jwt";
import { AuthRequest } from "../types/express";

export const authMiddleWare = (req:AuthRequest,res:Response,next:NextFunction) => {
   const authHeader = req.headers.authorization;

   if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message:"Authorization header missing or malformed"
        })
   }

   const token = authHeader?.split(" ")[1];

   try{
    const decoded = jwt.verify(token,JWT_SECRET) as {
        id:string,
        role:string
    }
    req.user = decoded;

    next();
   }catch(err){
     return res.status(401).json({
        message:"Invalid or expired token"
     })
   }
}

export const authorize = (roles:string[]) => {
    return (req:AuthRequest,res:Response,next:NextFunction) => {
        if(!req.user){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }

        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message:"Forbidded"
            })
        }

        next();
    }
}