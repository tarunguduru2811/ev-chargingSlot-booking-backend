import jwt  from "jsonwebtoken";
import prisma from "../../config/prisma";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../config/jwt";

dotenv.config()

export const registerUser = async (data:any) => {
    const {name,email,password,role} = data;

    const existingUser = await prisma.user.findUnique({where:{email}})

    if(existingUser){
        throw new Error("User Already Exists")
    }

    if(role === "STATION_ADMIN") {
        throw new Error("Admin creation not allowed")
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await prisma.user.create({
        data:{
            name,
            email,
            password:hashedPassword,
            role : role || "USER"
        }
    })

    return user;
}

export const loginUser = async (email:string,password:string) => {
    const user = await prisma.user.findUnique({
        where:{email}
    })

    if(!user){
        throw new Error("Invalid Credentials")
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch) throw new Error("Invalid Credentials")


    const token = jwt.sign(
        {id:user.id,role:user.role},
        JWT_SECRET,
       {expiresIn: JWT_EXPIRES_IN}
    )

    return {user,token}
}