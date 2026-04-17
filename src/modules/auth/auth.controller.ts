import { loginUser, registerUser } from "./auth.service"
import { Request,Response } from "express";

export const register = async (req:Request,res:Response) => {
    try{
        const user = await registerUser(req.body);
        res.status(201).json({
            message:"User Registered",
            user
        })
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}

export const login = async(req:Request,res:Response) => {
    try{
        const {email,password} = req.body
        const result = await loginUser(email,password);

        res.status(201).json({
            message:"Logged In Successfully",
            result
        })
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}