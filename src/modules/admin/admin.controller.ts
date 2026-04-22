import { Request, Response } from "express";
import { getBookingTrends, getDashboardStats, getRevenueStats, getSlotUtilization } from "./admin.service";
import { error } from "node:console";
import { stat } from "node:fs";



export const dashboardController = async (req:Request,res:Response) => {
    try{
        const stats = await getDashboardStats();
        res.json({
            stats
        })
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}


export const revenueController = async(req:Request,res:Response) => {
    try{
        const revenue = await getRevenueStats();
        res.json(revenue)
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}

export const trendsController = async(req:Request,res:Response) => {
    try{
        const trends = await getBookingTrends();
        res.json(trends)
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}

export const utilizationController = async (req:Request,res:Response) => {
    try{
        const utilization = await getSlotUtilization();
        res.json({
            utilization
        })
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}