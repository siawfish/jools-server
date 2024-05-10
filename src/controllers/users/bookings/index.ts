import { NextFunction, Response, Request } from "express";
import { validateResources, validateSkills, validateDayStartEnd } from "../../../helpers/constants";
import { errorResponse } from "../../../helpers/errorHandlers";
import { BookingStatuses, BookingType } from "../../../services/bookings/types";
import { createBooking } from "../../../services/bookings";

export const createBookingController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!res?.locals?.user?.id){
            throw new Error("Invalid authentication token")
        }
        const { workerId, day, start, end, description, media, estimatedFee, skillset } : BookingType = req.body;
        if(!workerId && !day && !start && !end && !description && !media && !estimatedFee && !skillset){
            throw new Error("WorkerId, day, start, end, description, media, estimatedFee and skillset are required")
        }
        if(!validateDayStartEnd(day, start, end)){
            throw new Error("Invalid day, start or end")
        }
        if(media.length > 0 && !validateResources(media)){
            throw new Error("Invalid media type")
        }
        if(estimatedFee < 0){
            throw new Error("Invalid estimated fee")
        }
        if(!validateSkills(skillset)){
            throw new Error("Invalid skillset")
        }
        if(!workerId){
            throw new Error("Worker ID is required")
        }
       
        if(!description || description.trim().length < 1){
            throw new Error("Description is required")
        }
        const { error, data } = await createBooking({
            userId: res.locals.user.id,
            workerId,
            day,
            start,
            end,
            description,
            media,
            estimatedFee,
            skillset,
            timelines: [
                {
                    timestamp: new Date(),
                    status: BookingStatuses.PENDING,
                }
            ]
        });
        if(error){
            throw new Error(error)
        }
        if(!data){
            throw new Error("An error occurred creating booking")
        }
        return res.status(201).json({
            message: "Booking created successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}