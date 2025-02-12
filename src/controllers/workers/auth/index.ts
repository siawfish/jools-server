import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { validateAcceptedTerms, validateGhanaCard, validateEmail, validateLocation, validatePhoneNumber, validateSkills } from '../../../helpers/constants.js';
import { createOtp, removeOtp, verifyOtp } from '../../../services/otp/index.js';
import sendSms, { constructVerificationSms } from '../../../services/sms/index.js';
import { VerifyOTPpayloadType, WorkerType, Skill } from '../../../services/workers/types.js';
import { getWorkerById, getWorkerByPhoneNumber, updateWorker } from '../../../services/workers/index.js';
import { addToBlacklist, createJwtToken, isTokenBlacklisted, verifyJwtToken } from '../../../services/jwt';
import { SkillType } from '../../../types';
import { getSkillById } from '../../../services/skills';
import { Status, UserTypes } from '../../../types';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { 
            name,
            email,
            avatar,
            phoneNumber,
            location,
            workingHours,
            ghanaCard,
            acceptedTerms,
            skills,
         }: WorkerType = req.body;
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
        if(ghanaCard) {
            if(!validateGhanaCard(ghanaCard)) {
                throw new Error("Ghana Card is required")
            }
        }
        if(!validateSkills(skills as Skill[])) {
            throw new Error("Invalid Skills")
        }
        const errorsArr = [] as string[];
        if(errorsArr.length > 0) {
            throw new Error(errorsArr.join(", "))
        }
        // const { error, data } = await createWorker({
        //     firstName,
        //     lastName,
        //     companyName,
        //     phoneNumber,
        //     location,
        //     acceptedTerms,
        //     type,
        //     documents,
        //     email,
        //     skills,
        //     properties
        // });
        // if(error) {
        //     throw new Error(error)
        // }
        // if(!data) {
        //     throw new Error("An error occurred")
        // }
        return res.status(201).json({
            message: "User registered successfully",
            data: {
                name,
                email,
                avatar,
                phoneNumber,
                location,
                workingHours,
                ghanaCard,
            }
        })
    } catch (error:any) {
        errorResponse(error?.message, res)
    }
}

export const verifyWorkerPhoneNumberController = async (req: Request, res: Response, next: NextFunction) => {
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

export const verifyWorkerOTPController = async (req: Request, res: Response, next: NextFunction) => {
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
            getWorkerByPhoneNumber(phoneNumber)
        ]);
        if(_o?.error) {
            throw new Error(_o?.error)
        }
        if(!_o?.data) {
            throw new Error("An error occurred verifying OTP")
        }
        if(_w?.data?.id) {
            if(_w?.data?.accountStatus === Status.DELETED) {
                await updateWorker(_w?.data?.id, { accountStatus: Status.ACTIVE });
            }
            const token = createJwtToken({
                id: _w?.data?.id,
                type: UserTypes.WORKER
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
        if(!decodedToken?.id) {
            throw new Error()
        }
        const { error, data } = await getWorkerById(decodedToken.id);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        const skills = [] as SkillType[];
        const SkillsPromises = (data?.skills).map(async (skill: Skill) => {
            return getSkillById(skill.id);
        });
        const skillsData = await Promise.all(SkillsPromises);
        skillsData.forEach((skill) => {
            if(skill?.data) {
                skills.push(skill.data)
            }
        });
        res.locals.user = {
            ...data,
            skills
        };
        next();
    } catch (error:any) {
        errorResponse("Bearer token is invalid", res)
    }
}

export const meController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user as WorkerType;
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