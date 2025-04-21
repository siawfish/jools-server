import { User } from "./types";
import { UserTypes } from "../../types";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { ClientRegisterPayload } from "../../controllers/clients/auth/type";
import { eq } from "drizzle-orm";
import { formatDbError } from "../../helpers/errorHandlers";

export const createClient = async (client: ClientRegisterPayload): Promise<{error?:string; data?:User }> => {
    try {
        const userData = await db.insert(usersTable).values({
            name: client.name,
            email: client?.email,
            avatar: client?.avatar,
            phoneNumber: client?.phoneNumber,
            acceptedTerms: client?.acceptedTerms,
            userType: UserTypes.USER,
            location: client?.location,
            gender: client?.gender,
        }).returning();
        if(!userData?.length) {
            throw new Error("Failed to create user")
        }
        return { data: userData[0] }
    } catch (error:any) {
        return { error: formatDbError(error) }
    }
}

export const getClientById = async (id: string): Promise<{error?:string; data?:User }> => {
    try {
        const res = await db.select().from(usersTable).where(eq(usersTable.id, id));
        if(!res.length) {
            throw new Error("User not found")
        }
        return { data: res[0] }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getClientByPhoneNumber = async (phoneNumber: string) => {
    try {
        const res = await db.select().from(usersTable).where(eq(usersTable.phoneNumber, phoneNumber));
        if(!res.length) {
            throw new Error("User not found")
        }
        return { data: res[0] }
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