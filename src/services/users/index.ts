import { formatDbError } from "../../helpers/constants";
import { getXataClient } from "../../xata";
import { UserTypes } from "../workers/types";
import { ClientType } from "./type";

const xata = getXataClient();

export const createUser = async (user: Partial<ClientType>): Promise<{error?:string; data?:ClientType}> => {
    try {
        const {
            firstName,
            lastName,
            phoneNumber,
            location,
            acceptedTerms,
            email,
        } = user;
        const dbUser = await xata.db.users.create({
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            phoneNumber: phoneNumber?.trim(),
            location,
            acceptedTerms,
            email: email?.trim(),
        })
        await xata.db.everyone.create({
            email: email?.trim(),
            phoneNumber: phoneNumber?.trim(),
            userType: UserTypes.USER,
            userId: dbUser.id,
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
        })
        return { data: dbUser as ClientType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getUserByPhoneNumber = async (phoneNumber: string): Promise<{error?:string; data?:ClientType}> => {
    try {
        const user = await xata.db.users.filter({ phoneNumber, status: 1 }).getFirst();
        if(!user) {
            throw new Error(`User with phone number ${phoneNumber} does not exist`)
        }
        return { data: user as ClientType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const getUserById = async (id: string): Promise<{error?:string; data?:ClientType}> => {
    try {
        const users = await xata.db.users.filter({ id, status: 1 }).getFirst();
        if(!users) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        return { data: users as ClientType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const updateClient = async (id:string, client: Partial<ClientType>): Promise<{error?:string; data?:ClientType}> => {
    try {
        const [_dbClient, _dbEveryone] = await Promise.all([xata.db.users.filter({ id, status: 1 }).getFirst(), xata.db.everyone.filter({ userId: id }).getFirst()]);
        if(!_dbClient) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        if(!_dbEveryone) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        if(_dbClient.id !== id) {
            throw new Error("You are not authorized to perform this action")
        }
        if(!client?.firstName && !client?.lastName && !client?.avatar && !client?.pushToken) {
            const _w = await xata.db.users.update(id, client);
            return { data: _w as ClientType };
        }
        const everyOneObj:Partial<ClientType> = {}
        if(client?.firstName) {
            everyOneObj.firstName = client?.firstName
        }
        if(client?.lastName) {
            everyOneObj.lastName = client?.lastName
        }
        if(client?.pushToken) {
            everyOneObj.pushToken = client?.pushToken
        }
        if(client?.avatar) {
            everyOneObj.avatar = client?.avatar
        }
        const [_w, _e] = await Promise.all([xata.db.users.update(_dbClient?.id, client), xata.db.everyone.update(_dbEveryone?.id, everyOneObj)])
        return { data: _w as ClientType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const deleteClient = async (id: string): Promise<{error?:string; data?:ClientType}> => {
    try {
        const [_w, _e] = await Promise.all([xata.db.users.filter({ id }).getFirst(), xata.db.everyone.filter({ userId: id }).getFirst()]);
        if(!_w || !_e) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        if(_w.id !== id) {
            throw new Error("You are not authorized to perform this action")
        }
        const [worker] = await Promise.all([xata.db.users.update(_w.id, { status: 0 }), xata.db.everyone.update(_e.id, { status: 0 })])
        return { data: worker as ClientType }
    } catch (error:any) {
        return { error: error?.message }
    }
}