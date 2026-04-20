import prisma from "../../config/prisma";



export const createStation = async (data:any) => {
    const {name,address,latitude,longitude,adminId} = data;

    const user = await prisma.user.findUnique({
        where:{
            id:adminId
        }
    })

    if(!user){
        throw new Error("No User Found");
    }

    await prisma.user.update({
        where:{id:adminId},
        data:{
            role:"STATION_ADMIN"
        }
    })
    console.log("Role Updated Successfully...");

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

export const deleteStation = async(id:string) => {
    return prisma.chargingStation.delete({
        where:{id}
    })
}