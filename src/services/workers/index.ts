import typesense from "../../../config/typesense";
import { Worker } from "./types";
import { UserTypes, WorkingHours, GhanaCard } from "../../types";
import { db } from "../../db";
import { usersTable, workerSkillsTable, workerTable, skillTable } from "../../db/schema";
import { WorkerRegisterPayload } from "../../controllers/workers/auth/type";
import { eq } from "drizzle-orm";
import { formatDbError } from "../../helpers/errorHandlers";

export const createWorker = async (worker: WorkerRegisterPayload): Promise<{error?:string; data?:Worker }> => {
    try {
        const userData = await db.insert(usersTable).values({
            name: worker.name,
            email: worker.email,
            avatar: worker.avatar,
            gender: worker.gender,
            phoneNumber: worker.phoneNumber,
            acceptedTerms: worker.acceptedTerms,
            userType: UserTypes.WORKER,
            location: worker.location,
        }).returning();
        if(!userData?.length) {
            throw new Error("Failed to create worker")
        }
        await Promise.allSettled([
            db.insert(workerTable).values({
                userId: userData[0].id,
                workingHours: worker.workingHours,
                ghanaCard: worker.ghanaCard,
                skills: worker.skills.map((skill) => skill.id),
            }),
            db.insert(workerSkillsTable).values(worker.skills.map((skill) => ({
                workerId: userData[0].id,
                skillId: skill.id,
                rate: skill.rate,
                yearsOfExperience: skill.yearsOfExperience,
            })))
        ]);
        const { data} = await getWorkerById(userData[0].id);
        return { data }
    } catch (error:any) {
        return { error: formatDbError(error) }
    }
}

export const getWorkerById = async (id: string): Promise<{error?:string; data?:Worker }> => {
    try {
        const [userAndWorker, workerSkills] = await Promise.all([
            db.select()
                .from(usersTable)
                .leftJoin(workerTable, eq(usersTable.id, workerTable.userId))
                .where(eq(usersTable.id, id)),
            db.select()
                .from(workerSkillsTable)
                .leftJoin(skillTable, eq(workerSkillsTable.skillId, skillTable.id))
                .where(eq(workerSkillsTable.workerId, id))
        ]);

        if(!userAndWorker.length) {
            throw new Error("Worker not found")
        }

        return { data: {
            id: userAndWorker[0].users.id,
            name: userAndWorker[0].users.name,
            email: userAndWorker[0].users.email,
            gender: userAndWorker[0].users.gender,
            phoneNumber: userAndWorker[0].users.phoneNumber,
            location: userAndWorker[0].users.location,
            workingHours: userAndWorker[0]?.workers?.workingHours as WorkingHours,
            ghanaCard: userAndWorker[0]?.workers?.ghanaCard as GhanaCard,
            skills: workerSkills.map(s=>({
                ...s.worker_skills,
                id: s.skills?.id,
                name: s.skills?.name,
                rate: s.worker_skills?.rate,
                yearsOfExperience: s.worker_skills?.yearsOfExperience,
            })),
            avatar: userAndWorker[0].users.avatar,
            createdAt: userAndWorker[0].users.createdAt,
            updatedAt: userAndWorker[0].users.updatedAt,
            accountStatus: userAndWorker[0].users.accountStatus,
            userType: userAndWorker[0].users.userType,
            acceptedTerms: userAndWorker[0].users.acceptedTerms,
            userId: userAndWorker[0].users.id,
        } }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getWorkerByPhoneNumber = async (phoneNumber: string) => {
    try {
        const userAndWorker = await db.select()
            .from(usersTable)
            .leftJoin(workerTable, eq(usersTable.id, workerTable.userId))
            .where(eq(usersTable.phoneNumber, phoneNumber));

        if(!userAndWorker.length) {
            throw new Error("Worker not found")
        }

        const workerSkills = await db.select()
            .from(workerSkillsTable)
            .leftJoin(skillTable, eq(workerSkillsTable.skillId, skillTable.id))
            .where(eq(workerSkillsTable.workerId, userAndWorker[0].users.id));

        const worker: Worker = {
            id: userAndWorker[0].users.id,
            name: userAndWorker[0].users.name,
            email: userAndWorker[0].users.email,
            gender: userAndWorker[0].users.gender,
            phoneNumber: userAndWorker[0].users.phoneNumber,
            location: userAndWorker[0].users.location,
            workingHours: userAndWorker[0].workers?.workingHours as WorkingHours,
            ghanaCard: userAndWorker[0].workers?.ghanaCard as GhanaCard,
            skills: workerSkills.map(s=>({
                ...s.worker_skills,
                id: s.skills?.id,
                name: s.skills?.name,
                rate: s.worker_skills?.rate,
                yearsOfExperience: s.worker_skills?.yearsOfExperience,
            })),
            avatar: userAndWorker[0].users.avatar,
            createdAt: userAndWorker[0].users.createdAt,
            updatedAt: userAndWorker[0].users.updatedAt,
            accountStatus: userAndWorker[0].users.accountStatus,
            userType: userAndWorker[0].users.userType,
            acceptedTerms: userAndWorker[0].users.acceptedTerms,
            userId: userAndWorker[0].users.id,
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