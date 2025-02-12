import { formatDbError } from "../../helpers/constants";
import { AdminType } from "./types";

const admin: AdminType = {
    id: "123",
    firstName: "Admin",
    lastName: "Admin",
    email: "admin@example.com",
    phoneNumber: "+233540000000",
    role: "admin",
}
export const createUser = async (admin: AdminType): Promise<{error?:string; data?:AdminType}> => {
    try {
      
        return { 
            data: admin
        };
    } catch (error:any) {
        return { error: formatDbError(error?.message) };
    }
};

export const getAdminByPhoneNumber = async (phoneNumber: string): Promise<{error?:string; data?:AdminType}> => {
    try {
        if(!admin) {
            throw new Error(`Admin with phone "${phoneNumber}" does not exist`);
        }
        return { data: admin as AdminType };
    } catch (error:any) {
        return { error: error?.message };
    }
}

export const getAdminById = async (id: string): Promise<{error?:string; data?:AdminType}> => {
    try {
        if(!admin) {
            throw new Error(`Admin with id ${id} does not exist`);
        }
        return { data: admin as AdminType };
    } catch (error:any) {
        return { error: error?.message };
    }
}

export const updateAdmin = async (id: string, admin: AdminType): Promise<{error?:string; data?:AdminType}> => {
    try {
        return { 
            data: admin
        };
    } catch (error:any) {
        return { error: formatDbError(error?.message) };
    }
};

export const deleteAdmin = async (id: string): Promise<{error?:string; data?:AdminType}> => {
    try {
        return { 
            data: admin
        };
    } catch (error:any) {
        return { error: formatDbError(error?.message) };
    }
}

export const getAdmins = async (): Promise<{error?:string; data?:AdminType[]}> => {
    try {
        const admins = [] as AdminType[];
        return { 
            data: admins
        };
    } catch (error:any) {
        return { error: formatDbError(error?.message) };
    }
}