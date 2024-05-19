import { formatDbError } from "../../helpers/constants";
import { getXataClient } from "../../xata";
import { SkillType } from "./types";

const xata = getXataClient();

export const createSkill = async (skill: SkillType): Promise<{ error?: string; data?:SkillType }> => {
    try {
        const data = await xata.db.skills.create(skill);
        return { 
            data: data as SkillType
        }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getSkills = async (): Promise<{ error?: string; data?:SkillType[] }> => {
    try {
        const data = await xata.db.skills.getAll();
        return { data: data as SkillType[] }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getSkillById = async (id: string): Promise<{ error?: string; data?:SkillType }> => {
    try {
        const data = await xata.db.skills.filter({ id }).getFirst();
        if(!data) {
            throw new Error("Skill not found")
        }
        return { data: data as SkillType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const updateSkill = async (id: string, skill: SkillType): Promise<{ error?: string; data?:SkillType }> => {
    try {
        const data = await xata.db.skills.update(id, skill);
        if(!data) {
            throw new Error("Skill not found")
        }
        return { data: data as SkillType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const deleteSkill = async (id: string): Promise<{ error?: string; data?:SkillType }> => {
    try {
        const data = await xata.db.skills.delete({ id });
        return { data: data as SkillType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}