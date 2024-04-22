import { formatDbError } from "../../helpers/constants";
import { getXataClient } from "../../xata";
import { PortfolioType } from "./types";

const xata = getXataClient();

export const createPortfolio = async (portfolio: Partial<PortfolioType>) => {
    try {
        const dbPortfolio = await xata.db.portfolios.create(portfolio);
        return { data: dbPortfolio }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}