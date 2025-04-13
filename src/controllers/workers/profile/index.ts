import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { updateWorker } from '../../../services/workers/index.js';
import { WorkerRegisterPayload } from '../auth/type';
import { validateEmail, validateGhanaCard, validateLocation, validateSkills, validateWorkingHours } from '../../../helpers/auth/helpers';
import { validateGender, validatePhoneNumber } from '../../../helpers/auth/helpers';
import { validateImageUrl } from '../../../helpers/auth/helpers';
import { getSkillsById } from '../../../services/skills';

export const updateWorkerProfileController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user.id;
        const { name, email, avatar, phoneNumber, location, workingHours, ghanaCard, skills, gender }: WorkerRegisterPayload = req.body;
        if(!name && !email && !avatar && !phoneNumber && !location && !workingHours && !ghanaCard && !skills && !gender) {
            throw new Error("No data provided")
        }
        // TODO: Add validation for the data
        const errorsArr = [] as string[];
        if(name && name.length < 3) {
            errorsArr.push("Name cannot be less than 3 characters")
        }
        if(avatar && !validateImageUrl(avatar)) {
            errorsArr.push("Avatar is invalid")
        }
        if(gender && !validateGender(gender)) {
            errorsArr.push("Gender is invalid")
        }
        if(phoneNumber) {
            errorsArr.push("Phone Number cannot be updated")
        }
        if(location && !validateLocation(location)) {
            errorsArr.push("Location is invalid")
        }
        if(email) {
            errorsArr.push("Email cannot be updated")
        }
        if(ghanaCard) {
            errorsArr.push("Ghana Card details cannot be updated")
        }
        if(workingHours && !validateWorkingHours(workingHours)) {
            errorsArr.push("Invalid Working Hours")
        }
        if(skills?.length && !validateSkills(skills)) {
            errorsArr.push("Invalid Skills")
        }
        if(errorsArr.length > 0) {
            throw new Error(errorsArr.join(", "))
        }
        if(skills && skills.length > 0){
            const skillPromises = skills.map(skill => getSkillsById(skill?.id));
            const skillsResults = await Promise.all(skillPromises);
            skillsResults.forEach(({ error, data }) => {
                if (error) {
                    throw new Error("Invalid skills set provided");
                }
            });
        }


        const { data, error } = await updateWorker(userId, {
            name,
            avatar,
            location,
            workingHours,
            skills: skills?.map(skill => ({
                skillId: skill?.id,
                workerId: userId,
                rate: skill?.rate,
                yearsOfExperience: skill?.yearsOfExperience
            })),
            gender
        });
        if(error || !data) {
            throw new Error(error);
        }
        return res.status(200).json({
            message: "User updated successfully",
            data
        })
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
}
