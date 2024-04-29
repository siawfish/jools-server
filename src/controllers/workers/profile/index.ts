import { NextFunction, Request, Response } from 'express';
import { deleteWorker, getWorkerById, updateWorker } from '../../../services/workers/index.js';
import { errorResponse } from '../../../helpers/errorHandlers.js';
import { WorkerType } from '../../../services/workers/types.js';
import { validateLocation, validateSkills, validateWorkRate, validateWorkingHours } from '../../../helpers/constants.js';

export const getWorkerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id }  = req.params as { id: string };
        if(!id) {
            throw new Error("id is required")
        }
        const { error, data } = await getWorkerById(id);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Worker fetched successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}

export const updateWorkerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id }  = req.params as { id: string };
        const { firstName, lastName, companyName, location, workRate, skills, workingHours } : Partial<WorkerType> = req.body;
        if(!id) {
            throw new Error("id is required")
        }
        if(!firstName && !lastName && !companyName && !location && !workRate && !skills && !workingHours) {
            throw new Error("Only firstName, lastName, companyName, location, workRate and skills are allowed")
        }
        const worker: Partial<WorkerType> = {};
        if(firstName){
            if(!firstName.trim()) {
                throw new Error("First Name is required")
            }
            worker.firstName = firstName.trim()
        }
        if(lastName){
            if(!lastName.trim()) {
                throw new Error("Last Name is required")
            }
            worker.lastName = lastName.trim()
        }
        if(companyName){
            if(!companyName.trim()) {
                throw new Error("Company Name is required")
            }
            worker.companyName = companyName.trim()
        }
        if(location) {
            if(!validateLocation(location)) {
                throw new Error("Invalid location")
            }
            worker.location = location
        }
        if(workRate) {
            if(!validateWorkRate(workRate)) {
                throw new Error("Invalid work rate")
            }
            worker.workRate = workRate
        }
        if(skills) {
            if(!skills.length) {
                throw new Error("Skills must be an array")
            }
            if(!validateSkills(skills)) {
                throw new Error("Invalid skills")
            }
            worker.skills = skills
        }
        if(workingHours) {
            if(!workingHours.length) {
                throw new Error("Working hours must be an array")
            }
            if(!validateWorkingHours(workingHours)) {
                throw new Error("Invalid working hours")
            }
            worker.workingHours = workingHours
        }
        const { error, data } = await updateWorker(id, worker);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Worker updated successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}

export const deleteWorkerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id }  = req.params as { id: string };
        if(!id) {
            throw new Error("Authentication failed")
        }
        const { error, data } = await deleteWorker(id);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Worker deleted successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}