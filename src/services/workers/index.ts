import { formatDbError } from "../../helpers/constants";
import { getXataClient } from "../../xata";
import { DaysOfTheWeekType, UserTypes, WorkerType, WorkingDayType } from "./types";

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
        const worker = await xata.db.workers.filter({ phoneNumber, status: 1 }).getFirst();
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
        const worker = await xata.db.workers.filter({ id, status: 1 }).getFirst();
        if(!worker) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        return { data: worker as WorkerType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const updateWorker = async (id:string, worker: Partial<WorkerType>): Promise<{error?:string; data?:WorkerType}> => {
    try {
        const [_dbWorker, _dbEveryone] = await Promise.all([xata.db.workers.filter({ id, status: 1 }).getFirst(), xata.db.everyone.filter({ userId: id }).getFirst()]);
        if(!_dbWorker) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        if(!_dbEveryone) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        if(_dbWorker.id !== id) {
            throw new Error("You are not authorized to perform this action")
        }
        const obj = {
            ...worker,
        }
        if(obj?.workingHours && obj?.workingHours?.length > 0){
            const workingHours = _dbWorker?.workingHours?.map((wh:WorkingDayType) => {
                const found = obj?.workingHours?.find(o => o.day === wh?.day)
                if(found) {
                    return {
                        ...found,
                        day: found?.day?.toUpperCase() as DaysOfTheWeekType
                    }
                }
                return {
                    ...wh,
                    day: wh?.day?.toUpperCase() as DaysOfTheWeekType
                }
            })
            obj.workingHours = workingHours
        }
        if(!obj?.firstName && !obj?.lastName && !obj?.companyName) {
            const _w = await xata.db.workers.update(id, obj);
            return { data: _w as WorkerType };
        }
        const everyOneObj:Partial<WorkerType> = {}
        if(obj?.firstName) {
            everyOneObj.firstName = obj?.firstName
        }
        if(obj?.lastName) {
            everyOneObj.lastName = obj?.lastName
        }
        if(obj?.companyName) {
            everyOneObj.companyName = obj?.companyName
        }
        if(obj?.pushToken) {
            everyOneObj.pushToken = obj?.pushToken
        }
        const [_w, _e] = await Promise.all([xata.db.workers.update(_dbWorker?.id, obj), xata.db.everyone.update(_dbEveryone?.id, everyOneObj)])
        return { data: _w as WorkerType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const deleteWorker = async (id: string): Promise<{error?:string; data?:WorkerType}> => {
    try {
        const worker = await xata.db.workers.update(id, { status: 0 })
        const updatedWorker = await xata.db.everyone.filter({ userId: id }).getFirst()
        if(updatedWorker) {
            await xata.db.everyone.update(updatedWorker.id, { status: 0 })
        }
        return { data: worker as WorkerType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}