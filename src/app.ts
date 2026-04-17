import express from "express"
import cors from "cors"
import prisma from "./config/prisma";
import { swaggerDocs } from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("EV Charging API Running");
})

swaggerDocs(app);

app.get("/users",async(req,res)=>{
    const users  = await prisma.user.findMany();
    res.json(users);
})
export default app;