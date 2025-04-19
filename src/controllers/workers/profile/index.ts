import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { getWorkerById, updateWorker } from '../../../services/workers/index.js';
import { WorkerRegisterPayload } from '../auth/type';
import { validateLocation, validateSkills, validateTheme, validateWorkingHours } from '../../../helpers/auth/helpers';
import { validateGender } from '../../../helpers/auth/helpers';
import { validateImageUrl } from '../../../helpers/auth/helpers';
import { getSkillsById } from '../../../services/skills';
import { Theme, LanguageType, CurrencyType, TimezoneType, NotificationsType } from '../../../types';

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

export const updatePushTokenController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user.id;
        const { pushToken } = req.body;
        if(!pushToken) {
            throw new Error("Push token is required")
        }
        const user = await getWorkerById(userId);
        if(user.error || !user.data) {
            throw new Error(user.error || "User not found");
        }
        const { data, error } = await updateWorker(userId, {
            settings: {
                notifications: {
                    email: user.data?.settings?.notifications?.email as boolean,
                    sms: user.data?.settings?.notifications?.sms as boolean,
                    pushNotification: user.data?.settings?.notifications?.pushNotification as boolean,
                    pushToken
                },
                theme: user.data?.settings?.theme as Theme,
                language: user.data?.settings?.language as LanguageType,
                currency: user.data?.settings?.currency as CurrencyType,
                timezone: user.data?.settings?.timezone as TimezoneType
            }
        });
        if(error || !data) {
            throw new Error(error);
        }
        return res.status(200).json({
            message: "Push token updated successfully",
            data
        })
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
}

export const updateThemeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user.id;
        const { theme } = req.body;
        if(!theme) {
            throw new Error("Theme is required")
        }
        if(!validateTheme(theme)) {
            throw new Error("Invalid theme")
        }
        const user = await getWorkerById(userId);
        if(user.error || !user.data) {
            throw new Error(user.error || "User not found");
        }
        const { data, error } = await updateWorker(userId, {
            settings: {
                theme,
                language: user.data?.settings?.language as LanguageType,
                currency: user.data?.settings?.currency as CurrencyType,
                timezone: user.data?.settings?.timezone as TimezoneType,
                notifications: user.data?.settings?.notifications as NotificationsType
            }
        });
        if(error || !data) {
            throw new Error(error || "Failed to update theme");
        }
        return res.status(200).json({
            message: "Theme updated successfully",
            data
        })
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
}

export const togglePushNotificationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user.id;
        const { pushNotification } = req.body;
        if(typeof pushNotification !== "boolean") {
            throw new Error("Push notification must be a boolean")
        }
        const user = await getWorkerById(userId);
        if(user.error || !user.data) {
            throw new Error(user.error || "User not found");
        }
        const { data, error } = await updateWorker(userId, {
            settings: {
                notifications: {
                    sms: user.data?.settings?.notifications?.sms as boolean,
                    email: user.data?.settings?.notifications?.email as boolean,
                    pushToken: user.data?.settings?.notifications?.pushToken as string,
                    pushNotification
                },
                theme: user.data?.settings?.theme as Theme,
                language: user.data?.settings?.language as LanguageType,
                currency: user.data?.settings?.currency as CurrencyType,
                timezone: user.data?.settings?.timezone as TimezoneType
            }
        });
        if(error || !data) {
            throw new Error(error || "Failed to update push notification");
        }
        return res.status(200).json({
            message: "Push notification updated successfully",
            data
        })
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
}
