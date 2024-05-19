import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers.js';
import { getSkillById, getSkills } from '../../../services/skills/index.js';

export const getSkillsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error, data } = await getSkills();
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Skills fetched successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res)
    }
}

export const getSkillController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if(!id) {
            throw new Error("Skill id is required")
        }
        const { error, data } = await getSkillById(id);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Skill fetched successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res)
    }
}