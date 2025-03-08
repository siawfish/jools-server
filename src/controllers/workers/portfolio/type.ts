import { Asset } from "../../../services/assets/type";

export interface Portfolio {
    id: string;
    description: string;
    assets: Asset[];
    skills: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}

export interface CreatePortfolioPayload {
    description: string;
    assets?: Asset[];
    skills?: string[];
    createdBy: string;
}

export interface UpdatePortfolioPayload {
    description?: string;
    assets?: Asset[];
    skills?: string[];
    createdBy: string;
}

export interface PortfolioResponse {
    message: string;
    data: Portfolio | Portfolio[];
}

export interface DeletePortfolioResponse {
    message: string;
    success: boolean;
}
