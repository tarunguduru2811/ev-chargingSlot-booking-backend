import prisma from "../../config/prisma"


export const getDashboardStats = async () => {
    const[
        totalUsers,
        totalStations,
        totalBookings,
        activeBookings,
        cancelledBookings
    ] = await Promise.all([
        prisma.user.count(),
        prisma.chargingStation.count(),
        prisma.booking.count(),
        prisma.booking.count({
            where:{status:"BOOKED"}
        }),
        prisma.booking.count({
            where:{status:"CANCELLED"}
        })
    ])

    return {
        totalUsers,
        totalStations,
        totalBookings,
        activeBookings,
        cancelledBookings
    }
}


export const getRevenueStats = async () => {
    const revenue = await prisma.booking.aggregate({
        _sum:{
            amount:true
        },
        where:{
            status:"BOOKED"
        }
    })

    return {
        totalRevenue:revenue._sum.amount || 0,
    }
}

export const getBookingTrends = async() => {
    const trends = await prisma.booking.groupBy({
        by:["createdAt"],
        _count:{
            id:true
        },
        orderBy:{
            createdAt:"asc"
        }
    })

    return trends;
}

export const getSlotUtilization = async () => {
    const totalSlots = await prisma.chargingSlot.count();

    const bookedSlots = await prisma.chargingSlot.count({
        where:{
            status:"BOOKED"
        }
    })

    const utilization = totalSlots === 0 ? 0 : (bookedSlots/totalSlots) * 100;

    return {
        totalSlots,
        bookedSlots,
        utilization:utilization.toFixed(2)
    }
}