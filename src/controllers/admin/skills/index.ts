import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers.js';
import { createSkill, deleteSkill, getSkillById, getSkills, updateSkill } from '../../../services/skills/index.js';
import { SkillType, UserTypes } from '../../../types';

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

export const createSkillController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = res.locals.user;
        if (!id) {
            throw new Error("Authentication failed")
        }
        const { name, description, icon } = req.body as SkillType;
        if(!name || !description || !icon) {
            throw new Error("Name, description, icon and properties are required")
        }
        const skill = {} as SkillType;
        if(!name?.trim()){
            throw new Error("Name is required")
        }
        if(!description?.trim()){
            throw new Error("Description is required")
        }
        if(!icon?.trim()){
            throw new Error("Icon is required")
        }
        skill.name = name.trim();
        skill.description = description.trim();
        skill.icon = icon.trim();
        skill.createdBy = id;
        const { error, data } = await createSkill(skill);
        if(error) {
            throw new Error(error)
        }
        return res.status(200).json({
            message: "Skill created successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res)
    }
}

export const updateSkillController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if(!id) {
            throw new Error("Skill id is required")
        }
        const user = res.locals.user;
        if(user.role !== UserTypes.SUPER_ADMIN) {
            throw new Error("You are not authorized to update this skill")
        }
        const { name, description, icon } = req.body as SkillType;
        if(!name && !description && !icon) {
            throw new Error("Only name, description and icon can be updated")
        }
        const skill = {} as SkillType;
        if(name){
            if(!name.trim()) {
                throw new Error("Name is required")
            }
            skill.name = name.trim()
        }
        if(description){
            if(!description.trim()) {
                throw new Error("Description is required")
            }
            skill.description = description.trim()
        }
        if(icon){
            if(!icon.trim()) {
                throw new Error("Icon is required")
            }
            skill.icon = icon.trim()
        }
        const { error, data } = await updateSkill(id, skill);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Skill updated successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res)
    }
}

export const deleteSkillController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if(!id) {
            throw new Error("Skill id is required")
        }
        const user = res.locals.user;
        if(user.role !== UserTypes.SUPER_ADMIN) {
            throw new Error("You are not authorized to delete this skill")
        }
        const { error, data } = await deleteSkill(id);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Skill deleted successfully",
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