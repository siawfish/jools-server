import { BookingStatuses } from "../../types";
import { ResourceType } from "../portfolio/types";

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
    skills: string[];
}

export interface Timelines {
    timestamp: Date;
    status: BookingStatuses;
}