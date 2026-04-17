import prisma from "../../config/prisma";



export const createStation = async (data:any) => {
    const {name,address,latitude,longitude,adminId} = data;

    return prisma.chargingStation.create({
        data:{
            name,
            address,
            latitude,
            longitude,
            adminId: adminId || null
        }
    })
}

export const getAllStations = async () => {
     return prisma.chargingStation.findMany({
        where:{isActive:true},
        include:{
            admin:{
                select:{id:true,name:true,email:true}
            }
        }
     })
}


export const getStationById = async (id:string) => {
    return prisma.chargingStation.findUnique({
        where:{
            id
        },
        include:{
            slots:true,
            admin:{
                select:{id:true,name:true}
            }
        }
    }) 
}

export const updateStation = async (id:string,data:any) => {
    return prisma.chargingStation.update({
        where:{id},
        data
    })
}