export interface SkillType {
    id?: string;
    name: string;
    description: string;
    icon: string;
    createdBy: any;
    properties: SkillProperties[];
}

export interface SkillProperties {
    name: string;
    description: string;
    rate: number;
}