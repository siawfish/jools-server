import { formatDbError } from "../../helpers/constants";
import { PortfolioType } from "./types";

export const createPortfolio = async (portfolio: Partial<PortfolioType>) => {
    try {
        const dbPortfolio = {
            id: "123",
            name: "Portfolio",
            description: "Portfolio is a collection of work samples",
            createdBy: "123",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        return { data: dbPortfolio }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}