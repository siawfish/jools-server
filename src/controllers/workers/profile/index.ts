import { NextFunction, Request, Response } from 'express';
import { deleteWorker, getWorkerById, updateWorker } from '../../../services/workers/index.js';
import { errorResponse } from '../../../helpers/errorHandlers.js';
import { WorkerType } from '../../../services/workers/types.js';
import { validateLocation, validateSkillProperties, validateSkills, validateWorkRate, validateWorkingHours } from '../../../helpers/constants.js';
import { SkillType } from '../../../services/skills/types.js';
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
        const skills = [] as SkillType[];
        const SkillsPromises = (data?.skills).map(async (id) => {
            return getSkillById(id);
        });
        const skillsData = await Promise.all(SkillsPromises);
        skillsData.forEach((skill) => {
            if(skill?.data) {
                skills.push(skill.data)
            }
        });
        return res.status(200).json({
            message: "Worker fetched successfully",
            data: {
                ...data,
                skills
            }
        })
    } catch (error:any) {
        errorResponse(error?.message, res)
    }
}

export const updateWorkerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id }  = res.locals?.user;
        const { firstName, lastName, companyName, location, skills, workingHours, avatar, properties } : Partial<WorkerType> = req.body;
        if(!id) {
            throw new Error("Authentication failed")
        }
        if(!firstName && !lastName && !companyName && !location && !skills && !workingHours && !properties && !avatar) {
            throw new Error("Only firstName, lastName, companyName, location, avatar, workingHours, properties and skills are allowed")
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
        if(avatar) {
            if(!avatar.trim()) {
                throw new Error("Avatar is required")
            }
            worker.avatar = avatar.trim()
        }
        if(properties) {
            if(!properties.length) {
                throw new Error("Properties must be an array")
            }
            if(!validateSkillProperties(properties)) {
                throw new Error("Invalid properties")
            }
            worker.properties = properties
        }
        const { error, data } = await updateWorker(id, worker);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        const skillsArr = [] as SkillType[];
        const SkillsPromises = (data?.skills).map(async (id) => {
            return getSkillById(id);
        });
        const skillsData = await Promise.all(SkillsPromises);
        skillsData.forEach((skill) => {
            if(skill?.data) {
                skillsArr.push(skill.data)
            }
        });
        return res.status(200).json({
            message: "Worker updated successfully",
            data: {
                ...data,
                skills: skillsArr
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

export const updatePushTokenController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id }  = res.locals?.user;
        const { pushToken } = req.body;
        if(!id) {
            throw new Error("Authentication failed")
        }
        if(!pushToken) {
            throw new Error("pushToken is required")
        }
        const { error, data } = await updateWorker(id, { pushToken });
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        const skills = [] as SkillType[];
        const SkillsPromises = (data?.skills).map(async (id) => {
            return getSkillById(id);
        });
        const skillsData = await Promise.all(SkillsPromises);
        skillsData.forEach((skill) => {
            if(skill?.data) {
                skills.push(skill.data)
            }
        });
        return res.status(200).json({
            message: "Push token updated successfully",
            data: {
                ...data,
                skills
            }
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}