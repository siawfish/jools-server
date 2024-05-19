import { formatDbError } from "../../helpers/constants";
import { getXataClient } from "../../xata";
import { AdminType } from "./types";

const xata = getXataClient();

export const createUser = async (admin: AdminType): Promise<{error?:string; data?:AdminType}> => {
    try {
        const adminData = await xata.db.admin.create(admin);
        return { 
            data: adminData as AdminType
        };
    } catch (error:any) {
        return { error: formatDbError(error?.message) };
    }
};

export const getAdminByPhoneNumber = async (phoneNumber: string): Promise<{error?:string; data?:AdminType}> => {
    try {
        const admin = await xata.db.admin.filter({ phoneNumber }).getFirst();
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
        const admin = await xata.db.admin.filter({ id }).getFirst();
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
        const adminData = await xata.db.admin.update(id, admin);
        return { 
            data: adminData as AdminType
        };
    } catch (error:any) {
        return { error: formatDbError(error?.message) };
    }
};

export const deleteAdmin = async (id: string): Promise<{error?:string; data?:AdminType}> => {
    try {
        const adminData = await xata.db.admin.update(id, { status: 0 });
        return { 
            data: adminData as AdminType
        };
    } catch (error:any) {
        return { error: formatDbError(error?.message) };
    }
}

export const getAdmins = async (): Promise<{error?:string; data?:AdminType[]}> => {
    try {
        const admins = await xata.db.admin.filter({ status: 1 }).getAll();
        return { 
            data: admins as AdminType[]
        };
    } catch (error:any) {
        return { error: formatDbError(error?.message) };
    }
}