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
                ghanaCard: {
                    ...worker.ghanaCard,
                    isVerified: false
                },
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
            settings: userAndWorker[0].users.settings,
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
            settings: userAndWorker[0].users.settings,
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

export const updateWorker = async (id:string, worker: Partial<Worker>): Promise<{error?:string; data?:Worker}> => {
    try {
        // Prepare updates for different tables
        const workerTableUpdates: Record<string, any> = {};
        const userTableUpdates: Record<string, any> = {};
        const skills = worker.skills || [];
        const hasSkillsUpdate = skills.length > 0;
        
        // Prepare worker table updates
        if (worker.workingHours) {
            workerTableUpdates.workingHours = worker.workingHours;
        }
        
        if (hasSkillsUpdate) {
            workerTableUpdates.skills = skills;
            userTableUpdates.skills = skills.map((skill) => skill.id);
        }
        
        // Prepare user table updates
        if (worker.name) {
            userTableUpdates.name = worker.name;
        }
        
        if (worker.avatar) {
            userTableUpdates.avatar = worker.avatar;
        }
        
        if (worker.location) {
            userTableUpdates.location = worker.location;
        }

        if (worker.settings) {
            userTableUpdates.settings = worker.settings;
        }
        
        // Prepare update operations
        const updateOperations = [];
        
        // Add worker table update if needed
        if (Object.keys(workerTableUpdates).length > 0) {
            updateOperations.push(
                db.update(workerTable)
                    .set(workerTableUpdates)
                    .where(eq(workerTable.userId, id))
            );
        }
        
        // Add user table update if needed
        if (Object.keys(userTableUpdates).length > 0) {
            updateOperations.push(
                db.update(usersTable)
                .set({
                    ...userTableUpdates,
                    updatedAt: new Date()
                })
                .where(eq(usersTable.id, id))
            );
        }
        
        // Prepare skills update operations
        if (hasSkillsUpdate) {
            // Delete and insert need to be sequential, but can run concurrently with other updates
            updateOperations.push(
                (async () => {
                    await db.delete(workerSkillsTable)
                        .where(eq(workerSkillsTable.workerId, id));
                    
                    await db.insert(workerSkillsTable).values(
                        skills.map(skill => ({
                            workerId: id,
                            skillId: skill.skillId,
                            rate: skill.rate,
                            yearsOfExperience: skill.yearsOfExperience
                        }))
                    );
                })()
            );
        }
        
        // Run all update operations concurrently
        if (updateOperations.length > 0) {
            await Promise.all(updateOperations);
        }

        // Fetch the updated worker data
        const { data, error } = await getWorkerById(id);
        
        if (error) {
            throw new Error(error);
        }
        
        return { data };
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

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