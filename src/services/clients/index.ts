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

export const updateClient = async (id:string, client: Partial<User>): Promise<{error?:string; data?:User}> => {
    try {
        const res = await db.update(usersTable).set(client).where(eq(usersTable.id, id)).returning();
        if(!res.length) {
            throw new Error("User not found")
        }
        return { data: res[0] }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}