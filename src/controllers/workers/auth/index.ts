import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { getXataClient } from '../../../xata.js'
import { formatDbError, validateAcceptedTerms, validateDocuments, validateEmail, validateLocation, validatePhoneNumber, validateSkills, validateWorkRate } from '../../../helpers/constants.js';
import { createOtp, removeOtp, verifyOtp } from '../../../services/otp/index.js';
import sendSms, { constructVerificationSms } from '../../../services/sms/index.js';
import { UserTypes, VerifyOTPpayloadType, WorkerType } from './types.js';

const xata = getXataClient();
export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { 
            firstName,
            lastName,
            companyName,
            phoneNumber,
            location,
            workRate,
            acceptedTerms,
            type,
            documents,
            email,
            skills,
         }: WorkerType = req.body;
        if(type !== UserTypes.USER && type !== UserTypes.WORKER) {
            throw new Error("Invalid User Type")
        }
        if( type === UserTypes.USER) {
            if(!firstName?.trim()) {
                throw new Error("First Name is required")
            }
            if(!lastName?.trim()) {
                throw new Error("Last Name is required")
            }
        }
        if( type === UserTypes.WORKER) {
            if(!companyName?.trim()) {
                throw new Error("Company Name is required")
            }
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
        if(documents) {
            if(!validateDocuments(documents)) {
                throw new Error("Documents is required")
            }
        }
        if(!workRate) {
            throw new Error("Work Rate is required")
        }
        if(!validateWorkRate(workRate)) {
            throw new Error("Invalid Work Rate")
        }
        if(!validateSkills(skills)) {
            throw new Error("Skills is required")
        }
        try {
            const worker = await xata.db.workers.create({
                firstName: firstName?.trim(),
                lastName: lastName?.trim(),
                companyName: companyName?.trim(),
                phoneNumber: phoneNumber.trim(),
                location,
                workRate,
                acceptedTerms,
                type,
                documents,
                email: email.trim(),
                skills,
            })
            await xata.db.everyone.create({
                email: email.trim(),
                phoneNumber: phoneNumber.trim(),
                userType: type,
                userId: worker.id,
                firstName: firstName?.trim(),
                lastName: lastName?.trim(),
                companyName: companyName?.trim(),
            })
            return res.status(200).json({
                message: "Registration Successful",
                data: worker
            })
        } catch (error:any) {
            throw new Error(formatDbError(error?.message))
        }
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
        const worker = await xata.db.workers.filter({ phoneNumber }).getFirst();
        if(worker) {
            throw new Error(`Worker with phone number ${phoneNumber} already exists`)
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
            throw new Error("Phone Number is required")
        }
        const { error, data } = await verifyOtp({ otp, referenceId, phoneNumber });
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(200).json({
            message: "Phone Number Verified Successfully"
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}