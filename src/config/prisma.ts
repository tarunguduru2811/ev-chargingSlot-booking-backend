import { PrismaClient } from "../generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";


// 1. Setup the adapter
const adapter = new PrismaPg({ connectionString: "postgresql://postgres:123@localhost:5432/ev_booking" })
// 2. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter })

export default prisma;