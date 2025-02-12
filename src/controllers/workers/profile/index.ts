import { NextFunction, Request, Response } from 'express';
import { deleteWorker, getWorkerById, updateWorker } from '../../../services/workers/index.js';
import { errorResponse } from '../../../helpers/errorHandlers.js';
import { WorkerType } from '../../../services/workers/types.js';
import { validateLocation, validateSkills, validateWorkingHours } from '../../../helpers/constants.js';
import { SkillType } from '../../../types';
import { getSkillById } from '../../../services/skills/index.js';

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
            data: {
                ...data,
            }
        })
    } catch (error:any) {
        errorResponse(error?.message, res)
    }
}

export const updateWorkerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id }  = res.locals?.user;
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
        errorResponse(error?.message, res, 400)
    }
}

export const deleteWorkerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id }  = res.locals?.user;
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

// export const updatePushTokenController = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id }  = res.locals?.user;
//         const { pushToken } = req.body;
//         if(!id) {
//             throw new Error("Authentication failed")
//         }
//         if(!pushToken) {
//             throw new Error("pushToken is required")
//         }
//         const { error, data } = await updateWorker(id, { pushToken });
//         if(error) {
//             throw new Error(error)
//         }
//         if(!data) {
//             throw new Error("An error occurred")
//         }
//         return res.status(200).json({
//         const skillsData = await Promise.all(SkillsPromises);
//         skillsData.forEach((skill) => {
//             if(skill?.data) {
//                 skills.push(skill.data)
//             }
//         });
//         return res.status(200).json({
//             message: "Push token updated successfully",
//             data: {
//                 ...data,
//                 skills
//             }
//         })
//     } catch (error:any) {
//         errorResponse(error?.message, res, 400)
//     }
// }