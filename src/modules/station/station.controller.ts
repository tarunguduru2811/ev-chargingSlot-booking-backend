import { Request,Response } from "express";
import { createStation, deleteStation, getAllStations, getNearbyStations, getStationById, updateStation } from "./station.service";


export const createStationController = async(req:Request,res:Response) => {
    try{
        const station = await createStation(req.body);
        res.status(201).json({
            station
        })
    }catch(err:any){
        return res.status(500).json({
            message:"Internal Server Error",
            error:err.message
        })
    }
}

export const getStationsController = async (req:Request,res:Response) => {
    try{
        const stations = await getAllStations();
        res.json(stations);
    }catch(err:any){
        return res.status(500).json({
            message:"Internal Server Error",
            error:err.message
        })
    }
}

export const getStationController = async (req:Request,res:Response) => {
    try{
        const station = await getStationById(req.params.id as string);

        if(!station) {
            return res.status(404).json({
                message:"Station Not Found"
            })
        }

        res.json(station);
    }catch(err:any){
        return res.status(500).json({
            message:"Internal Server Error",
            error:err.message
        })
    }
}

export const updateStationController = async (req:Request,res:Response) => {
    try{
        const updated  = await updateStation(req.params.id as string,req.body);
        res.json(updated)
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}

export const deleteStationController = async (req:Request,res:Response) => {
    try{
            const updated = await deleteStation(req.params.id as string);
            res.json({
                message:"Station deleted successfully"
            })
    }catch(err:any){
        return res.status(400).json({
            error:err.message
        })
    }
}


export const getNearbyStationsController = async (req: any, res: any) => {
  try {
    const { lat, lng, radius, page, limit, search } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const result = await getNearbyStations({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radius: radius ? parseFloat(radius) : 5,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search: search || "",
    });
    console.log("Printing Nearby station result",result)
    res.json(result);
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
};