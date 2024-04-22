import { WorkerType } from "../workers/types";

export interface PortfolioType {
    id?: string;
    caption: string;
    type: MediaTypes;
    resources: ResourceType[];
    createdBy: string;
}

export enum MediaTypes {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "LINK"
};

export interface ResourceType {
    id: string;
    name: string;
    url: string;
    skill?: string;
}