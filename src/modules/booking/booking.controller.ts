import { Response } from "express";
import { AuthRequest } from "../../types/express";
import { cancelBooking, createBooking, getUserBookings } from "./booking.service";


export const createBookingController = async(req:AuthRequest,res:Response) => {
    try{
        const booking = await createBooking(req.user,req.body);

        res.status(201).json({
            message:"Booking Successfull",
            booking
        })
    }catch(err:any){
        return res.status(400).json({
            error:err.message
        })
    }
}

export const getMyBookingsController = async (req:AuthRequest,res:Response) => {
    try{
        const bookings = await getUserBookings(req.user)

        res.status(200).json({
            bookings,
        })
    }catch(err:any){
        res.status(400).json({
            error:err.message
        })
    }
}


export const cancelBookingController = async(req:AuthRequest,res:Response)=>{
    try{
        const result = await cancelBooking(req.params.id as string,req.user)

        res.json(result);
    }catch(err:any){
        res.status(500).json({
            error:err.message
        })
    }
}