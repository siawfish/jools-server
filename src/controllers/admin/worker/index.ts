import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers.js';
import { validateLocation, validateSkills, validateWorkingHours } from '../../../helpers/constants.js';
import { AdminType } from '../../../services/admin/types.js';
import { SkillType, Status, UserTypes } from '../../../types';
import { updateWorker, updateWorkerStatus } from '../../../services/workers/index.js';
import { getSkillById } from '../../../services/skills/index.js';

export const updateWorkerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user  = res.locals?.user as AdminType;
        const { id } = req.params;
        const { error, data } = await updateWorker(id, req.body);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Worker updated successfully",
            data: {
                ...data,
            }
        })
    } catch (error:any) {
        errorResponse(error?.message, res)
    }
}

export const updateWorkerStatusController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user  = res.locals?.user as AdminType;
        const { id } = req.params;
        if(!id) {
            throw new Error("Worker id is required")
        }
        if(!user?.id) {
            throw new Error("Authentication failed")
        }
        if(user?.role === UserTypes.SUPER_ADMIN){
            throw new Error("You are not authorized to perform this action")
        }
        const { status } = req.body as { status: Status };
        if(!status) {
            throw new Error("Status is required")
        }
        if(status < Status.INACTIVE || status > Status.DELETED) {
            throw new Error("Invalid status")
        }
        const { error, data } = await updateWorkerStatus(id, status);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Worker status updated successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res)
    }
}

