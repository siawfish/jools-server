import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { 
    createSkill, 
    getSkills, 
    getSkillsById, 
    updateSkill, 
    deleteSkill 
} from '../../../services/skills/index';
import { SkillCreatePayload, SkillUpdatePayload } from './type';

// Create a new skill
export const createSkillController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, rate, yearsOfExperience, icon }: SkillCreatePayload = req.body;
        
        // Validate required fields
        if (!name) {
            throw new Error("Name is required");
        }
        
        const { error, data } = await createSkill(name, rate, yearsOfExperience, icon);
        
        if (error) {
            throw new Error(error);
        }
        
        return res.status(201).json({
            message: "Skill created successfully",
            data
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};

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

// Update a skill
export const updateSkillController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updates: SkillUpdatePayload = req.body;
        
        if (!id) {
            throw new Error("Skill ID is required");
        }
        
        if (Object.keys(updates).length === 0) {
            throw new Error("No updates provided");
        }
        
        const db = req.app.locals.db;
        
        const { error, data } = await updateSkill(id, updates);
        
        if (error) {
            throw new Error(error);
        }
        
        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }
        
        return res.status(200).json({
            message: "Skill updated successfully",
            data: data[0]
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};

// Delete a skill
export const deleteSkillController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            throw new Error("Skill ID is required");
        }
        
        const db = req.app.locals.db;
        
        const { error, data } = await deleteSkill(id);
        
        if (error) {
            throw new Error(error);
        }
        
        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }
        
        return res.status(200).json({
            message: "Skill deleted successfully",
            data: data[0]
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};
