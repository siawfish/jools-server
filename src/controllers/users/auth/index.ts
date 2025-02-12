import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { validateAcceptedTerms, validateEmail, validateLocation, validatePhoneNumber, validateSkills, validateWorkRate } from '../../../helpers/constants.js';
import { createOtp, removeOtp, verifyOtp } from '../../../services/otp/index.js';
import sendSms, { constructVerificationSms } from '../../../services/sms/index.js';
import { addToBlacklist, createJwtToken, isTokenBlacklisted, verifyJwtToken } from '../../../services/jwt';
import { createUser, getUserById, getUserByPhoneNumber } from '../../../services/users';
import { ClientType } from '../../../services/users/type';
import { UserTypes } from '../../../types';
import { VerifyOTPpayloadType } from '../../../services/workers/types';

export const registerUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { 
            firstName,
            lastName,
            phoneNumber,
            location,
            acceptedTerms,
            email,
         }: ClientType = req.body;
        if(!firstName?.trim()) {
            throw new Error("First Name is required")
        }
        if(!lastName?.trim()) {
            throw new Error("Last Name is required")
        }
        if(!validatePhoneNumber(phoneNumber?.trim())) {
            throw new Error("Phone Number is required")
        }
        if(!validateLocation(location)) {
            throw new Error("Location is required")
        }
        if(!validateEmail(email?.trim())) {
            throw new Error("Email is required")
        }
        if(!validateAcceptedTerms(acceptedTerms)) {
            throw new Error("Accepted Terms is required")
        }
        const { error, data } = await createUser({
            firstName,
            lastName,
            phoneNumber,
            location,
            acceptedTerms,
            email,
        });
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(201).json({
            message: "User registered successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}

export const verifyUserPhoneNumberController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber } = req.query as { phoneNumber: string };
        if(!validatePhoneNumber(phoneNumber.trim())) {
            throw new Error("Phone Number is required")
        }
        const { error, data } = await createOtp({ phoneNumber });
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        const content = constructVerificationSms(data.otp);
        const options = {
            to: phoneNumber,
            content,
        }
        const { error: smsError } = await sendSms(options);
        if(smsError){
            removeOtp({ referenceId: data.referenceId });
            throw new Error("An error occurred sending sms, please resend code")
        }
        return res.status(200).json({
            message: "OTP sent successfully",
            data: {
                referenceId: data.referenceId,
                phoneNumber
            }
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}

export const verifyUserOTPController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp, referenceId, phoneNumber } : VerifyOTPpayloadType = req.body;
        if(!otp) {
            throw new Error("OTP is required")
        }
        if(otp.length !== 4) {
            throw new Error("Invalid OTP")
        }
        if(!referenceId) {
            throw new Error("Reference ID is required")
        }
        if(!phoneNumber) {
            throw new Error("Phone Number is required")
        }
        if(!validatePhoneNumber(phoneNumber.trim())) {
            throw new Error("Phone Number is invalid")
        }

        const [_o, _w] = await Promise.all([
            verifyOtp({ otp, referenceId, phoneNumber }),
            getUserByPhoneNumber(phoneNumber)
        ]);
        if(_o?.error) {
            throw new Error(_o?.error)
        }
        if(!_o?.data) {
            throw new Error("An error occurred verifying OTP")
        }
        if(_w?.data?.id) {
            const token = createJwtToken({
                id: _w?.data?.id,
                type: UserTypes.USER
            })
            if(token){
                return res.status(200).json({
                    message: "Phone Number Verified Successfully",
                    data: {
                        token,
                        user: _w?.data
                    }
                })
            }
        }
        return res.status(200).json({
            message: "Phone Number Verified Successfully",
            data: {
                phoneNumber
            }
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}

export const verifyUserJwtTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {
            throw new Error("Token is required")
        }
        if(isTokenBlacklisted(token)) {
            throw new Error("Token is invalid")
        }
        const decodedToken = await verifyJwtToken(token);
        if(!decodedToken?.id) {
            throw new Error()
        }
        const { error, data } = await getUserById(decodedToken.id);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        res.locals.user = data;
        next();
    } catch (error:any) {
        errorResponse("Bearer token is invalid", res, 401)
    }
}

export const meController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user as ClientType;
        return res.status(200).json({
            message: "User fetched successfully",
            data: user
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 401)
    }
}

export const signOutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {
            throw new Error("Token is required")
        }
        addToBlacklist(token);
        return res.status(200).json({
            message: "User signed out successfully"
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 401)
    }
}