import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { getClientById, updateClient } from '../../../services/clients/index.js';
import { ClientRegisterPayload } from '../auth/type';
import { validateLocation, validateTheme } from '../../../helpers/auth/helpers';
import { validateGender } from '../../../helpers/auth/helpers';
import { validateImageUrl } from '../../../helpers/auth/helpers';
import { Theme, LanguageType, CurrencyType, TimezoneType, NotificationsType } from '../../../types';

export const updateClientProfileController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user.id;
        const { name, email, avatar, location, gender }: ClientRegisterPayload = req.body;
        if(!name && !email && !avatar && !location && !gender) {
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
        if(location && !validateLocation(location)) {
            errorsArr.push("Location is invalid")
        }
        if(email) {
            errorsArr.push("Email cannot be updated")
        }
        const { data, error } = await updateClient(userId, {
            name,
            avatar,
            location,
            gender,
            email
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
        const user = await getClientById(userId);
        if(user.error || !user.data) {
            throw new Error(user.error || "User not found");
        }
        const { data, error } = await updateClient(userId, {
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
        const user = await getClientById(userId);
        if(user.error || !user.data) {
            throw new Error(user.error || "User not found");
        }
        const { data, error } = await updateClient(userId, {
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
        const user = await getClientById(userId);
        if(user.error || !user.data) {
            throw new Error(user.error || "User not found");
        }
        const { data, error } = await updateClient(userId, {
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
