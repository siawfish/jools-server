import { formatDbError } from "../../helpers/constants";
import { SkillType } from "../../types";

export const createSkill = async (skill: SkillType): Promise<{ error?: string; data?:SkillType }> => {
    try {
        return { 
            data: skill as SkillType
        }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getSkills = async (): Promise<{ error?: string; data?:SkillType[] }> => {
    try {
        return { data: [] as SkillType[] }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getSkillById = async (id: string): Promise<{ error?: string; data?:SkillType }> => {
    try {
        const data = {
            id: "123",
            name: "Plumbing",
            rate: 100,
            yearsOfExperience: 5,
            description: "Plumbing is the installation and maintenance of systems for collecting, distributing and treating water",
            icon: "https://example.com/icon.jpg",
            createdBy: "123",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        if(!data) {
            throw new Error(`Skill with id "${id}" does not exist`)
        }
        return { data: data as SkillType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const updateSkill = async (id: string, skill: SkillType): Promise<{ error?: string; data?:SkillType }> => {
    try {
        const data = {
            id: "123",
            name: "Plumbing",
            rate: 100,
            yearsOfExperience: 5,
            description: "Plumbing is the installation and maintenance of systems for collecting, distributing and treating water",
            icon: "https://example.com/icon.jpg",
            createdBy: "123",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        return { data: data as SkillType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const deleteSkill = async (id: string): Promise<{ error?: string; data?:SkillType }> => {
    try {
        const data = {
            id: "123",
            name: "Plumbing",
            rate: 100,
            yearsOfExperience: 5,
            description: "Plumbing is the installation and maintenance of systems for collecting, distributing and treating water",
            icon: "https://example.com/icon.jpg",
            createdBy: "123",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        return { data: data as SkillType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}