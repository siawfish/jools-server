export interface SkillCreatePayload {
    name: string;
    rate?: number;
    yearsOfExperience?: number;
    icon?: string | null;
}

export interface SkillUpdatePayload {
    name?: string;
    rate?: number;
    yearsOfExperience?: number;
    icon?: string | null;
}

export interface SkillResponse {
    id: string;
    name: string;
    rate: number;
    yearsOfExperience: number;
    icon: string | null;
} 