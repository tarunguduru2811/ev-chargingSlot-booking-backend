import express from "express"
import cors from "cors"
import prisma from "./config/prisma";
import { swaggerDocs } from "./config/swagger";
import authRoutes from "./modules/auth/auth.routes"
import stationRoutes from "./modules/station/station.routes"
import slotRoutes from "./modules/slot/slot.routes"

const app = express();

app.use(cors());
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/stations",stationRoutes)
app.use("/api/slots",slotRoutes)
app.get("/",(req,res)=>{
    res.send("EV Charging API Running");
})

swaggerDocs(app);

app.get("/users",async(req,res)=>{
    const users  = await prisma.user.findMany();
    res.json(users);
})
export default app;