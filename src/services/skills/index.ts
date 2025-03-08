import { eq, sql } from "drizzle-orm";
import { skillTable } from "../../db/schema";
import { formatDbError } from "../../helpers/errorHandlers";
import { db } from "../../db";

// Create a new skill
export async function createSkill(name: string, rate: number = 0, yearsOfExperience: number = 0, icon: string | null = null) {
    try {
        const skill = await db.insert(skillTable).values({
            name,
            rate,
            yearsOfExperience,
            icon
        }).returning();
        return {
            data: skill,
            error: null
        }
    } catch (error: any) {
        return {
            data: null,
            error: formatDbError(error)
        }
    }
}

// Get all skills by id
export async function getSkillsById(id: string) {
    try {
        const skill = await db.select().from(skillTable).where(eq(skillTable.id, id));
        if (!skill) {
            throw new Error("Skill not found");
        }
        return {
            data: skill,
            error: null
        }
    } catch (error: any) {
        return {
            data: null,
            error: formatDbError(error)
        }
    }
}

// Read skills
export async function getSkills() {
    try {
        const skills = await db.select().from(skillTable);
        return {
            data: skills,
            error: null
        }
    } catch (error: any) {
        return {
            data: null,
            error: formatDbError(error)
        }
    }
}

// Update a skill
export async function updateSkill(id: string, updates: Record<string, any>) {
    try {
        const skill = await db.update(skillTable).set(updates).where(sql`${skillTable.id} = ${id}`).returning();
        return {
            data: skill,
            error: null
        }
    } catch (error: any) {
        return {
            data: null,
            error: formatDbError(error)
        }
    }
}

// Delete a skill
export async function deleteSkill(id: string) {
    try {
        const skill = await db.delete(skillTable).where(sql`${skillTable.id} = ${id}`).returning();
        return {
            data: skill,
            error: null
        }
    } catch (error: any) {
        return {
            data: null,
            error: formatDbError(error)
        }
    }
}
