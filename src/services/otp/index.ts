import { eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { otpTable } from "../../db/schema";
import { randomUUID } from "node:crypto";
import { formatDbError } from "../../helpers/errorHandlers";

export const createOtp = async (phoneNumber: string) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpData = await db.insert(otpTable).values({
            phoneNumber,
            otp,
            referenceId: randomUUID(),
            createdAt: sql`now()`,
        }).returning();
        return {
            error: null,
            data: {
                referenceId: otpData[0].referenceId,
                phoneNumber: otpData[0].phoneNumber,
                otp: otpData[0].otp,
            },
        };
    } catch (error:any) {
        return {
            error: formatDbError(error)
        }
    }
}

export const updateOtp = async (phoneNumber: string) => {
    try {
        const oldOtpData = await db.select().from(otpTable).where(eq(otpTable.phoneNumber, phoneNumber));
        if(oldOtpData.length === 0) {
            throw new Error("Something went wrong, contact support")
        }
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const minutesSinceOtpCreated = new Date(oldOtpData[0].createdAt).getTime() - fiveMinutesAgo.getTime();
        if(minutesSinceOtpCreated > 0) {
            throw new Error("You can only request a new OTP every 5 minutes")
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpData = await db.update(otpTable).set({ phoneNumber, otp, createdAt: sql`now()` }).where(eq(otpTable.referenceId, oldOtpData[0].referenceId)).returning();
        return {
            error: null,
            data: {
                referenceId: otpData[0].referenceId,
                phoneNumber: otpData[0].phoneNumber,
                otp: otpData[0].otp,
            }
        }
    } catch (error:any) {
        return {
            error: error?.message || formatDbError(error),
        }
    }
}

export const removeOtp = async (referenceId: string) => {
    try {
        await db.delete(otpTable).where(eq(otpTable.referenceId, referenceId));
        return {
            error: null,
            data: true
        }
    } catch (error:any) {
        return {
            error: formatDbError(error),
            data: false
        }
    }
}

export const verifyOtp = async (referenceId: string, otp: string, phoneNumber: string) => {
    try {
        const otpData = await db.select().from(otpTable).where(eq(otpTable.referenceId, referenceId));
        if(otpData.length === 0) {
            throw new Error("OTP not found")
        }
        if(otpData[0].otp !== otp) {
            throw new Error("Invalid OTP")
        }
        // check if otp was created more than 5 minutes ago
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);        
        if(otpData[0].createdAt < fiveMinutesAgo) {
            await removeOtp(referenceId);
            throw new Error("OTP expired")
        }
        if(otpData[0].phoneNumber !== phoneNumber) {
            throw new Error("Don't try to hack the system")
        }
        return {
            error: null,
            data: true
        }
    } catch (error:any) {
        const errorMessage = error.message || formatDbError(error);
        return {
            error: errorMessage,
            data: false
        }
    }
}