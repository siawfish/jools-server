import { formatDbError } from "../../helpers/constants";
import { getXataClient } from "../../xata";
import { UserTypes, WorkerType } from "./types";

const xata = getXataClient();

export const createWorker = async (worker: WorkerType): Promise<{error?:string; data?:WorkerType}> => {
    try {
        const {
            firstName,
            lastName,
            companyName,
            phoneNumber,
            location,
            workRate,
            acceptedTerms,
            documents,
            email,
            type,
            skills
        } = worker;
        const dbWorker = await xata.db.workers.create({
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
            userType: UserTypes.WORKER,
            type,
            userId: dbWorker.id,
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            companyName: companyName?.trim(),
        })
        return { data: dbWorker as WorkerType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getWorkerByPhoneNumber = async (phoneNumber: string): Promise<{error?:string; data?:WorkerType}> => {
    try {
        const worker = await xata.db.workers.filter({ phoneNumber }).getFirst();
        if(!worker) {
            throw new Error(`User with phone number ${phoneNumber} does not exist`)
        }
        return { data: worker as WorkerType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const getWorkerById = async (id: string): Promise<{error?:string; data?:WorkerType}> => {
    try {
        const worker = await xata.db.workers.read(id);
        if(!worker) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        return { data: worker as WorkerType }
    } catch (error:any) {
        return { error: error?.message }
    }
}