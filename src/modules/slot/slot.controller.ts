import {  Request,Response } from "express";
import { createSlot, deleteSlot, getAdminSlots, getAvailableSlots, getSlots, updateSlot, updateSlotStatus } from "./slot.service";
import { AuthRequest } from "../../types/express";


export const createSlotController = async(req:AuthRequest,res:Response) => {
    try{
        const slot = await createSlot(req.body,req.user);
        res.status(201).json(slot);
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}

export const getSlotsController = async(req:Request,res:Response) => {
    const {stationId,date} = req.query;

    if(!stationId || !date){
        return res.status(400).json({
            message:"StationId and Date are required"
        })
    }

    const slots = await getSlots(stationId as string,date as string);

    return res.status(200).json({
        slots
    })
}

export const updateSlotController = async(req:AuthRequest,res:Response) => {
    try{
        const updated = updateSlot(req.params.id as string,req.body,req.user);

        res.json(updated);
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}

export const deleteSlotController = async(req:AuthRequest,res:Response) => {
    try{
        const result = await deleteSlot(req.params.id as string,req.user);
        res.json({
            message:"Slot Deleted Successfully"
        })
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}

export const updateSlotStatusController = async (req:AuthRequest,res:Response) => {
    try{
        const {status} = req.body;

        if(!["AVAILABLE","BLOCKED"].includes(status)) {
            return res.status(400).json({
                message:"Invalid Status"
            })
        }

        const result = await updateSlotStatus(req.params.id as string,status,req.user)
        res.json(result)
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}

export const getAdminSlotsController  = async (req:AuthRequest,res:Response) => {
    try{
        const slots = await getAdminSlots(req.user)

        res.json(slots)
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}

export const getAvailableSlotsController = async (req:AuthRequest,res:Response) => {
    try{
        const {stationId,date} = req.query;

        if(!stationId || !date) {
            return res.status(400).json({
                message:"StationId and Date are required",
            })
        }

        const slots = await getAvailableSlots(
            stationId as string,
            date as string
        )

        res.json(slots)
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}