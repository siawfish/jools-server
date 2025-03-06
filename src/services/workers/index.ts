import typesense from "../../../config/typesense";
import { User, Worker } from "./types";
import { Status, Theme, UserTypes, WorkingHours, GhanaCard } from "../../types";
import { DaysOfTheWeekType } from "../../types";
import { db } from "../../db";
import { usersTable, workerTable } from "../../db/schema";
import { WorkerRegisterPayload } from "../../controllers/workers/auth/type";
import { eq } from "drizzle-orm";
import { formatDbError } from "../../helpers/errorHandlers";

export const createWorker = async (worker: WorkerRegisterPayload): Promise<{error?:string; data?:Worker }> => {
    try {
        const userData = await db.insert(usersTable).values({
            name: worker.name,
            email: worker.email,
            avatar: worker.avatar,
            phoneNumber: worker.phoneNumber,
            acceptedTerms: worker.acceptedTerms,
            userType: UserTypes.WORKER,
            location: worker.location,
        }).returning();
        if(!userData?.length) {
            throw new Error("Failed to create worker")
        }
        const workerData = await db.insert(workerTable).values({
            userId: userData[0].id,
            workingHours: worker.workingHours,
            ghanaCard: worker.ghanaCard,
            skills: worker.skills,
        }).returning()
        if(!workerData?.length) {
            throw new Error("Failed to create worker")
        }
        const { data} = await getWorkerById(userData[0].id);
        return { data }
    } catch (error:any) {
        return { error: formatDbError(error) }
    }
}

export const getWorkerById = async (id: string): Promise<{error?:string; data?:Worker }> => {
    try {
        const res = await db.select().from(usersTable).leftJoin(workerTable, eq(usersTable.id, workerTable.userId)).where(eq(usersTable.id, id));
        if(!res.length) {
            throw new Error("Worker not found")
        }
        return { data: {
            id: res[0].users.id,
            name: res[0].users.name,
            email: res[0].users.email,
            phoneNumber: res[0].users.phoneNumber,
            location: res[0].users.location,
            workingHours: res[0]?.workers?.workingHours as WorkingHours,
            ghanaCard: res[0]?.workers?.ghanaCard as GhanaCard,
            skills: res[0]?.workers?.skills as string[],
            avatar: res[0].users.avatar,
            createdAt: res[0].users.createdAt,
            updatedAt: res[0].users.updatedAt,
            accountStatus: res[0].users.accountStatus,
            userType: res[0].users.userType,
            acceptedTerms: res[0].users.acceptedTerms,
            userId: res[0].users.id,
        } }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getWorkerByPhoneNumber = async (phoneNumber: string) => {
    try {
        const res = await db.select().from(usersTable).where(eq(usersTable.phoneNumber, phoneNumber)).leftJoin(workerTable, eq(usersTable.id, workerTable.userId));
        if(!res.length) {
            throw new Error("Worker not found")
        }
        const worker: Worker = {
            id: res[0].users.id,
            name: res[0].users.name,
            email: res[0].users.email,
            phoneNumber: res[0].users.phoneNumber,
            location: res[0].users.location,
            workingHours: res[0].workers?.workingHours as WorkingHours,
            ghanaCard: res[0].workers?.ghanaCard as GhanaCard,
            skills: res[0].workers?.skills as string[],
            avatar: res[0].users.avatar,
            createdAt: res[0].users.createdAt,
            updatedAt: res[0].users.updatedAt,
            accountStatus: res[0].users.accountStatus,
            userType: res[0].users.userType,
            acceptedTerms: res[0].users.acceptedTerms,
            userId: res[0].users.id,
        }
        return { data: worker }
    } catch (error:any) {
        return { error: error?.message }
    }
}

// export const updateWorker = async (id:string, worker: Partial<WorkerType>): Promise<{error?:string; data?:WorkerType}> => {
//     try {
//         return { data: worker as WorkerType }
//     } catch (error:any) {
//         return { error: formatDbError(error?.message) }
//     }
// }

// export const updateWorkerStatus = async (id: string, status: Status): Promise<{error?:string; data?:WorkerType}> => {
//     try {
//         const worker = {
//             id: "123",
//             name: "John Doe",
//             email: "john.doe@example.com",
//             phoneNumber: "+233540000000",
//             location: {
//                 lat: 12.345678,
//                 lng: 12.345678
//             },
//             workingHours: {
//                 [DaysOfTheWeekType.MONDAY]: {
//                     from: "09:00",
//                     to: "17:00",
//                     enabled: true
//                 }
//             },
//             ghanaCard: {
//                 number: "1234567890",
//                 front: "https://example.com/front.jpg",
//                 back: "https://example.com/back.jpg",
//                 isVerified: true
//             },
//             acceptedTerms: {
//                 status: true,
//                 acceptedAt: new Date()
//             },  
//             skills: [
//                 {
//                     id: "123",
//                     name: "Plumbing",
//                     rate: 100,
//                     yearsOfExperience: 5
//                 }
//             ],
//             avatar: "https://example.com/avatar.jpg",
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//         }
//         if(!worker) {
//             throw new Error(`User with id "${id}" does not exist`)
//         }
//         return { data: worker as WorkerType }
//     } catch (error:any) {
//         return { error: error?.message }
//     }
// }

// export const deleteWorker = async (id: string): Promise<{error?:string; data?:WorkerType}> => {
//     try {
//         const worker = {
//             id: "123",
//             name: "John Doe",
//             email: "john.doe@example.com",
//             phoneNumber: "+233540000000",
//             location: {
//                 lat: 12.345678,
//                 lng: 12.345678
//             },
//             workingHours: {
//                 [DaysOfTheWeekType.MONDAY]: {
//                     from: "09:00",
//                     to: "17:00",
//                     enabled: true
//                 }
//             },
//             ghanaCard: {
//                 number: "1234567890",
//                 front: "https://example.com/front.jpg",
//                 back: "https://example.com/back.jpg",
//                 isVerified: true
//             },
//             acceptedTerms: {
//                 status: true,
//                 acceptedAt: new Date()
//             },  
//             skills: [
//                 {
//                     id: "123",
//                     name: "Plumbing",
//                     rate: 100,
//                     yearsOfExperience: 5
//                 }
//             ],
//             avatar: "https://example.com/avatar.jpg",
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//         }
//         if(!worker) {
//             throw new Error(`User with id "${id}" does not exist`)
//         }
//         return { data: worker as WorkerType }
//     } catch (error:any) {
//         return { error: error?.message }
//     }
// }

// export const updateWorkerInTypesense = async (id: string, worker: Partial<WorkerType>): Promise<void> => {
//     try {
//         console.log("typesense update----->", worker)
//     } catch (error:any) {
//         console.log("typesense update error----->", error?.message)
//     }
// }

// const deleteWorkerFromTypesense = async (id: string): Promise<void> => {
//     try {
//         await typesense.collections('workers').documents(id).delete()
//     } catch (error:any) {
//         console.log("typesense delete error----->", error?.message)
//     }
// }

// export const saveToUsersTable = async (worker: WorkerType): Promise<void> => {
//     try {
//         console.log("save to users table----->", worker)
//     } catch (error:any) {
//         console.log("save to users table error----->", error?.message)
//     }
// }