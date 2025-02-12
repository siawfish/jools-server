import typesense from "../../../config/typesense";
import { formatDbError } from "../../helpers/constants";
import { DaysOfTheWeekType, WorkerType, WorkingHours } from "./types";
import { Status, UserTypes } from "../../types";

export const createWorker = async (worker: WorkerType): Promise<{error?:string; data?:WorkerType}> => {
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
        } = worker;
        const dbWorker = {
            name: name?.trim(),
            email: email.trim(),
            avatar: avatar?.trim(),
            phoneNumber: phoneNumber.trim(),
            location,
            workingHours,
            ghanaCard,
            acceptedTerms,
            skills,
        }
        return { data: dbWorker as WorkerType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getWorkerByPhoneNumber = async (phoneNumber: string): Promise<{error?:string; data?:WorkerType}> => {
    try {
        const worker = {
            id: "123",
            name: "John Doe",
            email: "john.doe@example.com",
            phoneNumber: "+233540000000",
            location: {
                lat: 12.345678,
                lng: 12.345678
            },
            workingHours: {
                [DaysOfTheWeekType.MONDAY]: {
                    from: "09:00",
                    to: "17:00",
                    enabled: true
                }
            },
            ghanaCard: {
                number: "1234567890",
                front: "https://example.com/front.jpg",
                back: "https://example.com/back.jpg",
                isVerified: true
            },
            acceptedTerms: {
                status: true,
                acceptedAt: new Date()
            },
            skills: [
                {
                    id: "123",
                    name: "Plumbing",
                    rate: 100,
                    yearsOfExperience: 5
                }
            ],
            avatar: "https://example.com/avatar.jpg",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
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
        const worker = {
            id: "123",
            name: "John Doe",
            email: "john.doe@example.com",
            phoneNumber: "+233540000000",
            location: {
                lat: 12.345678,
                lng: 12.345678
            },
            workingHours: {
                [DaysOfTheWeekType.MONDAY]: {
                    from: "09:00",
                    to: "17:00",
                    enabled: true
                }
            },
            ghanaCard: {
                number: "1234567890",
                front: "https://example.com/front.jpg",
                back: "https://example.com/back.jpg",
                isVerified: true
            },
            acceptedTerms: {
                status: true,
                acceptedAt: new Date()
            },
            skills: [
                {
                    id: "123",
                    name: "Plumbing",
                    rate: 100,
                    yearsOfExperience: 5
                }
            ],
            avatar: "https://example.com/avatar.jpg",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
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
        return { data: worker as WorkerType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const updateWorkerStatus = async (id: string, status: Status): Promise<{error?:string; data?:WorkerType}> => {
    try {
        const worker = {
            id: "123",
            name: "John Doe",
            email: "john.doe@example.com",
            phoneNumber: "+233540000000",
            location: {
                lat: 12.345678,
                lng: 12.345678
            },
            workingHours: {
                [DaysOfTheWeekType.MONDAY]: {
                    from: "09:00",
                    to: "17:00",
                    enabled: true
                }
            },
            ghanaCard: {
                number: "1234567890",
                front: "https://example.com/front.jpg",
                back: "https://example.com/back.jpg",
                isVerified: true
            },
            acceptedTerms: {
                status: true,
                acceptedAt: new Date()
            },  
            skills: [
                {
                    id: "123",
                    name: "Plumbing",
                    rate: 100,
                    yearsOfExperience: 5
                }
            ],
            avatar: "https://example.com/avatar.jpg",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        if(!worker) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        return { data: worker as WorkerType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const deleteWorker = async (id: string): Promise<{error?:string; data?:WorkerType}> => {
    try {
        const worker = {
            id: "123",
            name: "John Doe",
            email: "john.doe@example.com",
            phoneNumber: "+233540000000",
            location: {
                lat: 12.345678,
                lng: 12.345678
            },
            workingHours: {
                [DaysOfTheWeekType.MONDAY]: {
                    from: "09:00",
                    to: "17:00",
                    enabled: true
                }
            },
            ghanaCard: {
                number: "1234567890",
                front: "https://example.com/front.jpg",
                back: "https://example.com/back.jpg",
                isVerified: true
            },
            acceptedTerms: {
                status: true,
                acceptedAt: new Date()
            },  
            skills: [
                {
                    id: "123",
                    name: "Plumbing",
                    rate: 100,
                    yearsOfExperience: 5
                }
            ],
            avatar: "https://example.com/avatar.jpg",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        if(!worker) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        return { data: worker as WorkerType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const updateWorkerInTypesense = async (id: string, worker: Partial<WorkerType>): Promise<void> => {
    try {
        console.log("typesense update----->", worker)
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
        console.log("save to users table----->", worker)
    } catch (error:any) {
        console.log("save to users table error----->", error?.message)
    }
}