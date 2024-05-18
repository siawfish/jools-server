import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers.js';
import { validateEmail, validatePhoneNumber, validateUserRole } from '../../../helpers/constants.js';
import { AdminType } from '../../../services/admin/types.js';
import { deleteAdmin, getAdminById, updateAdmin } from '../../../services/admin/index.js';
import { UserTypes } from '../../../services/workers/types.js';

export const getAdminController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user  = res.locals?.user as AdminType;
        if(!user?.id) {
            throw new Error("Authentication failed")
        }
        const admin = await getAdminById(user.id);
        return res.status(200).json({
            message: "Admin fetched successfully",
            data: admin
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}

export const updateAdminController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, role }  = res.locals?.user as AdminType;
        const { firstName, lastName, email, phoneNumber, role: requestRole } : AdminType = req.body;
        if(!id) {
            throw new Error("Authentication failed")
        }
        if(role !== UserTypes.SUPER_ADMIN) {
            throw new Error("You are not authorized to update this admin")
        }
        if(!firstName && !lastName && !email && !phoneNumber) {
            throw new Error("Only firstName, lastName, email and phoneNumber can be updated")
        }
        const admin = {} as AdminType;
        if(firstName){
            if(!firstName.trim()) {
                throw new Error("First Name is required")
            }
            admin.firstName = firstName.trim()
        }
        if(lastName){
            if(!lastName.trim()) {
                throw new Error("Last Name is required")
            }
            admin.lastName = lastName.trim()
        }
        if(email) {
            if(!validateEmail(email)) {
                throw new Error("Email is required")
            }
            admin.email = email
        }
        if(phoneNumber) {
            if(!validatePhoneNumber(phoneNumber)) {
                throw new Error("Phone number location")
            }
            admin.phoneNumber = phoneNumber
        }
        if(requestRole) {
            if(!validateUserRole(requestRole)) {
                throw new Error("Invalid role")
            }
            admin.role = requestRole
        }
        const { error, data } = await updateAdmin(id, admin);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Admin updated successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}

export const deleteAdminController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, role }  = res.locals?.user as AdminType;
        if(!id) {
            throw new Error("Authentication failed")
        }
        if(role !== UserTypes.SUPER_ADMIN) {
            throw new Error("You are not authorized to delete this admin")
        }
        const { error, data } = await deleteAdmin(id);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Admin deleted successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}