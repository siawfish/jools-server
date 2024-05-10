import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers.js';
import { validateLocation, validateSkills, validateWorkRate, validateWorkingHours } from '../../../helpers/constants.js';
import { deleteClient, getUserById, updateClient } from '../../../services/users/index.js';
import { ClientType } from '../../../services/users/type.js';

export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id }  = req.params as { id: string };
        if(!id) {
            throw new Error("id is required")
        }
        const { error, data } = await getUserById(id);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "User fetched successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id }  = res.locals?.user;
        const { firstName, lastName, location, avatar } : Partial<ClientType> = req.body;
        if(!id) {
            throw new Error("Authentication failed")
        }
        if(!firstName && !lastName && !location && !avatar) {
            throw new Error("Only firstName, lastName, location and avatar can be updated")
        }
        const client: Partial<ClientType> = {};
        if(firstName){
            if(!firstName.trim()) {
                throw new Error("First Name is required")
            }
            client.firstName = firstName.trim()
        }
        if(lastName){
            if(!lastName.trim()) {
                throw new Error("Last Name is required")
            }
            client.lastName = lastName.trim()
        }
        if(location) {
            if(!validateLocation(location)) {
                throw new Error("Invalid location")
            }
            client.location = location
        }
        if(avatar) {
            if(!avatar.trim()) {
                throw new Error("Avatar is required")
            }
        }
        const { error, data } = await updateClient(id, client);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "User updated successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id }  = res.locals?.user;
        if(!id) {
            throw new Error("Authentication failed")
        }
        const { error, data } = await deleteClient(id);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "User deleted successfully",
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
        const { error, data } = await updateClient(id, { pushToken });
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Push token updated successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}