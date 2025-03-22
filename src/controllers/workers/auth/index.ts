import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { createWorker, getWorkerById, getWorkerByPhoneNumber } from '../../../services/workers/index.js';
import { WorkerRegisterPayload } from './type';
import { 
    validateAcceptedTerms, 
    validateGhanaCard, 
    validateLocation, 
    validateEmail, 
    validatePhoneNumber, 
    validateSkills, 
    validateWorkingHours,
    constructVerificationSms,
    createJwtToken,
    isTokenBlacklisted,
    verifyJwtToken,
    addToBlacklist,
    validateImageUrl,
    validateGender,
} from '../../../helpers/auth/helpers';
import { createOtp, removeOtp, updateOtp, verifyOtp } from '../../../services/otp';
import { sendSms } from '../../../services/sms';
import { UserTypes } from '../../../types';
import { getSkillsById } from '../../../services/skills';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { 
            name,
            email,
            avatar,
            gender,
            phoneNumber,
            location,
            workingHours,
            ghanaCard,
            acceptedTerms,
            skills,
         }: WorkerRegisterPayload = req.body;
        const errorsArr = [] as string[];
        if(!name) {
            errorsArr.push("Name is required")
        }
        if(!avatar) {
            errorsArr.push("Avatar is required")
        }
        if(!gender) {
            errorsArr.push("Gender is required")
        }
        if(!validateGender(gender)) {
            errorsArr.push("Gender is invalid")
        }
        if(!validateImageUrl(avatar)) {
            errorsArr.push("Avatar is invalid")
        }
        if(!validatePhoneNumber(phoneNumber?.trim())) {
            errorsArr.push("Phone Number is required")
        }
        if(!validateLocation(location)) {
            errorsArr.push("Location is required")
        }
        if(!validateEmail(email?.trim())) {
            errorsArr.push("Email is required")
        }
        if(!validateAcceptedTerms(acceptedTerms)) {
            errorsArr.push("Accepted Terms is required")
        }
        if(!validateGhanaCard(ghanaCard)) {
            errorsArr.push("Documents are invalid")
        }
        if(!validateWorkingHours(workingHours)) {
            errorsArr.push("Invalid Working Hours")
        }
        if(!validateSkills(skills)) {
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
        const { error, data } = await createWorker(req.body);
        if(error || !data?.id) {
            throw new Error(error)
        }

        const token = createJwtToken(data?.id, UserTypes.WORKER)
        return res.status(201).json({
            message: "User registered successfully",
            data: {
                token,
                user: data
            }
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}

export const verifyWorkerPhoneNumberController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber } = req.query as { phoneNumber: string };
        if(!validatePhoneNumber(phoneNumber.trim())) {
            throw new Error("Phone Number is required")
        }
        let data;
        const { error, data: createData } = await createOtp(phoneNumber);
        if(error) {
            if(error.includes("already in use")) {
                const { error: updateError, data: updateData } = await updateOtp(phoneNumber);
                console.log(updateError, updateData);
                if(updateError) {
                    throw new Error(updateError)
                }
                if(!updateData) {
                    throw new Error("An error occurred")
                }
                data = updateData;
            } else {
                throw new Error(error)
            }
        } else {
            data = createData;
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        const message = constructVerificationSms(data.otp);
        const { error: smsError } = await sendSms(phoneNumber, message);
        if(smsError){
            removeOtp(data.referenceId);
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

export const verifyWorkerOTPController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp, referenceId, phoneNumber } = req.body;
        if(!otp) {
            throw new Error("OTP is required")
        }
        if(otp.length !== 6) {
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
            verifyOtp(referenceId, otp),
            getWorkerByPhoneNumber(phoneNumber)
        ]);
        if(_o?.error) {
            throw new Error(_o?.error)
        }
        if(!_o?.data) {
            throw new Error("An error occurred verifying OTP")
        }
        removeOtp(referenceId);
        if(_w?.data?.id && _w?.data?.userType) {
            const token = createJwtToken(_w?.data?.id, UserTypes.WORKER)
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

export const verifyWorkerJwtTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {
            throw new Error("Token is required")
        }
        if(isTokenBlacklisted(token)) {
            throw new Error("Token is invalid")
        }
        const decodedToken = await verifyJwtToken(token);
        if(!decodedToken?.id || decodedToken?.type !== UserTypes.WORKER) {
            throw new Error()
        }
        const { error, data } = await getWorkerById(decodedToken.id);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        res.locals.user = data;
        next();
    } catch (error:any) {
        errorResponse("Bearer token is invalid", res)
    }
}

export const meController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user
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