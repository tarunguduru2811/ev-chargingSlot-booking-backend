import prisma from "../../config/prisma";


export const createBooking = async (user:any,data:any) => {
    const {slotId} = data;

    return prisma.$transaction(async (tx)=> {
        const slot = await tx.chargingSlot.findUnique({
            where:{id:slotId}
        })

        if(!slot) throw new Error("No Slot Found")

        if (slot.status !== "AVAILABLE"){
            throw new Error("Slot not availabale")
        }

        const now = new Date();

        if(slot.startTime < now){
            throw new Error("Cannot book past slot")
        }

        const updatedSlot = await tx.chargingSlot.updateMany({
            where:{
                id:slotId,
                status:"AVAILABLE"
            },
            data:{
                status:"BOOKED",
                version:{increment:1}
            }
        })

        if(updatedSlot.count == 0 ){
            throw new Error("Slot already booked by someone else")
        }

        const booking = await tx.booking.create({
            data:{
                userId:user.id,
                slotId:slot.id,
                startTime:slot.startTime,
                endTime:slot.endTime,
                status:"BOOKED"
            }
        })

        return booking;
    })
}

export const getUserBookings = async (user:any) => {
    return prisma.booking.findMany({
        where:{
            userId:user.id
        },
        include:{
            slot:true
        },
        orderBy:{
            createdAt:"desc"
        }
    })
}

export const cancelBooking = async(bookingId:string,user:any) => {
    return prisma.$transaction(async(tx)=> {
        const booking = await tx.booking.findUnique({
            where:{
                id:bookingId
            }
        })

        if(!booking) throw new Error("Booking not found")

        if(booking.userId !== user.id) throw new Error("Not Authorised")
        
        if(booking.status !== "BOOKED") throw new Error("Booking Already Cancelled/Completed")
        
        await tx.booking.update({
            where:{id:bookingId},
            data:{
                status:"CANCELLED",
                cancelledAt:new Date()
            }
        })

        //Free slots
        await tx.chargingSlot.update({
            where:{id:booking.slotId},
            data:{
                status:"AVAILABLE",
                version:{increment:1}
            }
        })

        return {message:"Booking Cancelled"}
    })
}