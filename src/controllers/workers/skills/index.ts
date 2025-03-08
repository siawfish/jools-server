import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { 
    getSkills, 
    getSkillsById, 
} from '../../../services/skills/index';

// Get skill by ID
export const getSkillByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            throw new Error("Skill ID is required");
        }
        
        const { error, data } = await getSkillsById(id);
        
        if (error) {
            throw new Error(error);
        }
        
        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }
        
        return res.status(200).json({
            message: "Skill fetched successfully",
            data: data[0]
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};

// Get all skills with optional filtering
export const getSkillsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { error, data } = await getSkills();
        
        if (error) {
            throw new Error(error);
        }
        
        return res.status(200).json({
            message: "Skills fetched successfully",
            data
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};
