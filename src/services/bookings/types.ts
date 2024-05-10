import { ResourceType } from "../portfolio/types";
import { SkillType } from "../workers/types";

export interface BookingType {
    id?: string;
    start: Date;
    end: Date;
    timelines?: Timelines[];
    workerId: any;
    userId: any;
    day: Date;
    status?: BookingStatuses;
    fee?: number;
    description: string;
    media: ResourceType[];
    estimatedFee: number;
    skillset: SkillType[];
}

export enum BookingStatuses {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    PAUSED = "PAUSED",
}

export interface Timelines {
    timestamp: Date;
    status: BookingStatuses;
}