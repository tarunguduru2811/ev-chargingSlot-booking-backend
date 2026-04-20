import prisma from "../../config/prisma";



export const createSlot = async (data:any,user:any) => {
    const {stationId,startTime,endTime,price} = data;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if(start >= end){
        throw new Error("Start Time must be before end time");
    }

    if(start < now){
        throw new Error("Cannot create slot in the past")
    }

    const station = await prisma.chargingStation.findUnique({
        where:{id:stationId}
    })

    if(!station) throw new Error("Station Not Found..")

    if(station.adminId !== user.id){
        throw new Error("Not Authorized for this station..")
    }

    const overlapping = await prisma.chargingSlot.findFirst({
        where:{
            stationId,
            AND:[
                {
                    startTime:{lt:end}
                },
                {
                    endTime:{gt:start}
                }
            ]
        }
    })

    if(overlapping) throw new Error("Slot overlaps with existing slot");

    return prisma.chargingSlot.create({
        data:{
            stationId,
            startTime:start,
            endTime:end,
            price,
        }
    })
}


export const getSlots = async (stationId:string,date:string) => {
    const startOfDay =  new Date(date);
    const endOfDay = new Date(date);

    startOfDay.setHours(0,0,0,0);
    endOfDay.setHours(23,59,59,999);

    return prisma.chargingSlot.findMany({
        where:{
            stationId,
            startTime:{
                gte:startOfDay,
                lte:endOfDay
            }
        },
        orderBy:{startTime:"asc"}
    })
}

export const updateSlot = async (slotId:string,data:any,user:any) => {
    const slot = await prisma.chargingSlot.findUnique({
        where:{id:slotId},
        include:{station:true}
    })

    if(!slot) throw new Error("Slot Not Found")

    if(slot.station.adminId !== user.id){
        throw new Error("Not Authorized")
    }

    const start = new Date(data.startTime || slot.startTime);
    const end = new Date(data.endTime || slot.endTime);

    if(start >= end) throw new Error("Invalid time range");

      const overlap = await prisma.chargingSlot.findFirst({
        where: {
        stationId: slot.stationId,
        id: { not: slotId },
        AND: [
            { startTime: { lt: end } },
            { endTime: { gt: start } },
        ],
        },
    });

    if(overlap) throw new Error("Slot Overlaps")
    
    return prisma.chargingSlot.update({
        where:{id:slotId},
        data
    })

}

export const deleteSlot = async (slotId:string,user:any) => {
    const slot = await prisma.chargingSlot.findUnique({
        where:{id:slotId},
        include:{ station:true, bookings:true }
    })

    if(!slot) throw new Error("No Slot Found")
    
    if(slot.station.adminId !== user.id) {
        throw new Error("Not Authorised")
    }

    if(slot.bookings.length > 0){
        throw new Error("Cannot Delete booked slot")
    }

    return prisma.chargingSlot.delete({
        where:{id:slotId}
    })
}

export const updateSlotStatus = async (slotId:string,status:"AVAILABLE" | "BOOKED",user:any)=>{
    const slot = await prisma.chargingSlot.findUnique({
        where:{id:slotId},
        include:{station:true}
    })

    if(!slot) throw new Error("No Slot Found")

    if(slot.station.adminId !== user.id){
        throw new Error("Not Authorised")
    }

    return prisma.chargingSlot.update({
        where:{id:slotId},
        data:{status}
    })
}

export const getAdminSlots = async (user:any) => {
    return prisma.chargingSlot.findMany({
        where:{
            station:{
                adminId:user.id,
            }
        },
        orderBy:{
            startTime:"asc"
        }
    })
}

export const getAvailableSlots = async (
    stationId:string,
    date:string
) => {
    const start = new Date(date);
    const end = new Date(date);

    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999)

    return prisma.chargingSlot.findMany({
        where:{
            stationId,
            status:"AVAILABLE",
            startTime:{
                gte:start,
                lte:end
            }
        },
        orderBy:{startTime:"asc"}
    })
}
