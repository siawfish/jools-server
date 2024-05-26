import typesense from "../../../config/typesense";
import { formatDbError } from "../../helpers/constants";
import { getXataClient } from "../../xata";
import { DaysOfTheWeekType, SkillProperties, Status, UserTypes, WorkerType, WorkingDayType } from "./types";

const xata = getXataClient();

export const createWorker = async (worker: WorkerType): Promise<{error?:string; data?:WorkerType}> => {
    try {
        const {
            firstName,
            lastName,
            companyName,
            phoneNumber,
            location,
            acceptedTerms,
            documents,
            email,
            type,
            skills,
            properties
        } = worker;
        const dbWorker = await xata.db.workers.create({
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            companyName: companyName?.trim(),
            phoneNumber: phoneNumber.trim(),
            location,
            acceptedTerms,
            type,
            documents,
            email: email.trim(),
            skills,
            properties
        })
        await saveToUsersTable(dbWorker as WorkerType)
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
        const worker = await xata.db.workers.filter({ id }).getFirst();
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
        const [_dbWorker, _dbEveryone] = await Promise.all([xata.db.workers.filter({ id }).getFirst(), xata.db.everyone.filter({ userId: id }).getFirst()]);
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
        if(obj?.properties && obj?.properties?.length > 0){
            const properties = _dbWorker?.properties?.map((prop: SkillProperties) => {
                const found = obj?.properties?.find(o => o.skillId === prop?.skillId)
                if(found) {
                    return {
                        ...found
                    }
                }
                return prop
            })
            obj.properties = properties
        }
        if(!obj?.firstName && !obj?.lastName && !obj?.companyName && !obj?.avatar && !obj?.properties && !obj?.pushToken) {
            const _w = await xata.db.workers.update(id, obj);
            if(_w?.status === Status.ACTIVE) {
                updateWorkerInTypesense(id, _w as WorkerType);
            } else {
                deleteWorkerFromTypesense(id);
            }
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
        if(obj?.avatar) {
            everyOneObj.avatar = obj?.avatar
        }
        const [_w, _e] = await Promise.all([xata.db.workers.update(_dbWorker?.id, obj), xata.db.everyone.update(_dbEveryone?.id, everyOneObj)])
        if(_w?.status === Status.ACTIVE) {
            updateWorkerInTypesense(id, _w as WorkerType);
        } else {
            deleteWorkerFromTypesense(id);
        }
        return { data: _w as WorkerType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const updateWorkerStatus = async (id: string, status: Status): Promise<{error?:string; data?:WorkerType}> => {
    try {
        const [_w, _e] = await Promise.all([xata.db.workers.filter({ id }).getFirst(), xata.db.everyone.filter({ userId: id }).getFirst()]);
        if(!_w || !_e) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        if(_w.id !== id) {
            throw new Error("You are not authorized to perform this action")
        }
        const [worker] = await Promise.all([xata.db.workers.update(_w.id, { status }), xata.db.everyone.update(_e.id, { status })])
        if(status === Status.ACTIVE) {
            updateWorkerInTypesense(id, worker as WorkerType);
        } else {
            deleteWorkerFromTypesense(id);
        }
        return { data: worker as WorkerType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const deleteWorker = async (id: string): Promise<{error?:string; data?:WorkerType}> => {
    try {
        const [_w, _e] = await Promise.all([xata.db.workers.filter({ id }).getFirst(), xata.db.everyone.filter({ userId: id }).getFirst()]);
        if(!_w || !_e) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        if(_w.id !== id) {
            throw new Error("You are not authorized to perform this action")
        }
        const [worker] = await Promise.all([xata.db.workers.update(_w.id, { status: 2 }), xata.db.everyone.update(_e.id, { status: 2 })])
        deleteWorkerFromTypesense(id);
        return { data: worker as WorkerType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const updateWorkerInTypesense = async (id: string, worker: Partial<WorkerType>): Promise<void> => {
    try {
        const {
            avatar,
            firstName,
            lastName,
            companyName,
            phoneNumber,
            location,
            acceptedTerms,
            type,
            documents,
            email,
            skills,
            score,
            rating,
            pushToken,
            workingHours,
            id,
            properties,
            status,
        } = worker;
        const data = {
            id,
            firstName,
            lastName,
            companyName: companyName??"",
            phoneNumber,
            location: [location?.lat, location?.lng],
            email,
            type,
            skills,
            properties,
            acceptedTerms,
            documents,
            workingHours,
            avatar: avatar??"",
            score,
            rating,
            pushToken: pushToken??"",
            status,
        }
        await typesense.collections('workers').documents().upsert(data)
    } catch (error:any) {
        console.log("typesense update error----->", error?.message)
    }
}

const deleteWorkerFromTypesense = async (id: string): Promise<void> => {
    try {
        await typesense.collections('workers').documents(id).delete()
    } catch (error:any) {
        console.log("typesense delete error----->", error?.message)
    }
}

export const saveToUsersTable = async (worker: WorkerType): Promise<void> => {
    try {
        const {
            firstName,
            lastName,
            companyName,
            phoneNumber,
            email,
            type,
            id
        } = worker;
        await xata.db.everyone.create({
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            userType: UserTypes.WORKER,
            type,
            userId: id,
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            companyName: companyName?.trim(),
        })
    } catch (error:any) {
        console.log("save to users table error----->", error?.message)
    }
}