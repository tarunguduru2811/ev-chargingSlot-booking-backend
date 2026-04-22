import { off } from "node:cluster";
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

export const getNearbyStations = async (params: any) => {
  const {
    lat,
    lng,
    radius = 5,
    page = 1,
    limit = 10,
    search = "",
  } = params;

  const offset = (page - 1) * limit;

  const stations = await prisma.$queryRaw`
    SELECT * FROM (
        SELECT *,
        (6371 * acos(
            cos(radians(${lat})) *
            cos(radians("latitude")) *
            cos(radians("longitude") - radians(${lng})) +
            sin(radians(${lat})) *
            sin(radians("latitude"))
        )) AS distance
        FROM "ChargingStation"
        WHERE "isActive" = true
        AND "name" ILIKE ${"%" + search + "%"}
    ) AS sub
    WHERE distance < ${radius}
    ORDER BY distance ASC
    LIMIT ${limit}
    OFFSET ${offset}
    `;

  const countResult: any = await prisma.$queryRaw`
    SELECT COUNT(*) FROM (
      SELECT 1,
        (6371 * acos(
          cos(radians(${lat})) *
          cos(radians("latitude")) *
          cos(radians("longitude") - radians(${lng})) +
          sin(radians(${lat})) *
          sin(radians("latitude"))
        )) AS distance
      FROM "ChargingStation"
      WHERE "isActive" = true
        AND "name" ILIKE ${"%" + search + "%"}
    ) AS sub
    WHERE distance < ${radius}
  `;

  const total = parseInt(countResult[0].count);

  return {
    data: stations,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};