import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers.js';
import { validateLocation, validateSkillProperties, validateSkills, validateUserRole, validateWorkingHours } from '../../../helpers/constants.js';
import { AdminType } from '../../../services/admin/types.js';
import { SkillType, Status, UserTypes, WorkerType } from '../../../services/workers/types.js';
import { updateWorker, updateWorkerStatus } from '../../../services/workers/index.js';
import { getSkillById } from '../../../services/skills/index.js';

export const updateWorkerController = async (req: Request, res: Response, next: NextFunction) => {
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
        
        const { firstName, lastName, companyName, location, skills, workingHours, avatar, properties } : Partial<WorkerType> = req.body;
        if(!firstName && !lastName && !companyName && !location && !skills && !workingHours && !properties && !avatar) {
            throw new Error("Only firstName, lastName, companyName, location, avatar, workingHours, properties, skills are allowed")
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
                skillsArr.push({
                    ...skill.data,
                    id: skill.data.id as string
                })
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

