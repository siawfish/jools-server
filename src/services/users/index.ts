import { formatDbError } from "../../helpers/constants";
import { ClientType } from "./type";

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
        return { data: user as ClientType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getUserByPhoneNumber = async (phoneNumber: string): Promise<{error?:string; data?:ClientType}> => {
    try {
        const user = {
            id: "123",
            firstName: "John",
            lastName: "Doe",
            phoneNumber: "+233540000000",
            location: {
                lat: 12.345678,
                lng: 12.345678
            },
            acceptedTerms: {
                status: true,
                acceptedAt: new Date()
            },
            email: "john.doe@example.com",
            avatar: "https://example.com/avatar.jpg",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 1
        }
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
        const user = {
            id: "123",
            firstName: "John",
            lastName: "Doe",
            phoneNumber: "+233540000000",
            location: {
                lat: 12.345678,
                lng: 12.345678
            },
            acceptedTerms: {
                status: true,
                acceptedAt: new Date()
            },
            email: "john.doe@example.com",
            avatar: "https://example.com/avatar.jpg",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 1
        }
        if(!user) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        return { data: user as ClientType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const updateClient = async (id:string, client: Partial<ClientType>): Promise<{error?:string; data?:ClientType}> => {
    try {
        const user = {
            id: "123",
            firstName: "John",
            lastName: "Doe",
            phoneNumber: "+233540000000",
            location: {
                lat: 12.345678,
                lng: 12.345678
            },
            acceptedTerms: {
                status: true,
                acceptedAt: new Date()
            },
            email: "john.doe@example.com",
            avatar: "https://example.com/avatar.jpg",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 1
        }
        if(!user) {
            throw new Error(`User with id "${id}" does not exist`)
        }
        return { data: user as ClientType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const deleteClient = async (id: string): Promise<{error?:string; data?:ClientType}> => {
    try {
        const user = {
            id: "123",
            firstName: "John",
            lastName: "Doe",
            phoneNumber: "+233540000000",
            location: {
                lat: 12.345678,
                lng: 12.345678
            },
            acceptedTerms: {
                status: true,
                acceptedAt: new Date()
            },
            email: "john.doe@example.com",
            avatar: "https://example.com/avatar.jpg",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 1
        }
        return { data: user as ClientType }
    } catch (error:any) {
        return { error: error?.message }
    }
}