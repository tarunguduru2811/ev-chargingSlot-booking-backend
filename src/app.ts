import express from "express"
import cors from "cors"
import prisma from "./config/prisma";
import { swaggerDocs } from "./config/swagger";
import authRoutes from "./modules/auth/auth.routes"
import stationRoutes from "./modules/station/station.routes"
import slotRoutes from "./modules/slot/slot.routes"
import bookingRoutes from "./modules/booking/booking.routes"
import adminRoutes from "./modules/admin/admin.routes"

const app = express();

app.use(cors());
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/stations",stationRoutes)
app.use("/api/slots",slotRoutes)
app.use("/api/bookings",bookingRoutes)
app.use("/api/admin",adminRoutes)
app.get("/",(req,res)=>{
    res.send("EV Charging API Running");
})

swaggerDocs(app);

app.get("/users",async(req,res)=>{
    const users  = await prisma.user.findMany();
    res.json(users);
})
export default app;