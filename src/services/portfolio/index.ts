import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import { portfolioTable } from "../../db/schema";
import { formatDbError } from "../../helpers/errorHandlers";
import { Portfolio, CreatePortfolioPayload, UpdatePortfolioPayload } from "../../controllers/workers/portfolio/type";

export const createPortfolio = async (payload: CreatePortfolioPayload): Promise<{error?: string; data?: Portfolio}> => {
    try {
        const portfolioData = await db.insert(portfolioTable).values({
            description: payload.description,
            assets: payload.assets,
            skills: payload.skills || [],
            createdBy: payload.createdBy,
        }).returning();

        if (!portfolioData?.length) {
            throw new Error("Failed to create portfolio");
        }

        return { data: portfolioData[0] as Portfolio };
    } catch (error: any) {
        return { error: formatDbError(error) };
    }
};

export const getPortfolioById = async (id: string): Promise<{error?: string; data?: Portfolio}> => {
    try {
        const portfolioData = await db.select().from(portfolioTable).where(eq(portfolioTable.id, id));
        
        if (!portfolioData?.length) {
            throw new Error("Portfolio not found");
        }

        return { data: portfolioData[0] as Portfolio };
    } catch (error: any) {
        return { error: formatDbError(error?.message) };
    }
};

export const getPortfoliosByWorkerId = async (workerId: string): Promise<{error?: string; data?: Portfolio[]}> => {
    try {
        const portfolioData = await db.select().from(portfolioTable).where(eq(portfolioTable.createdBy, workerId)).orderBy(desc(portfolioTable.createdAt));
        
        return { data: portfolioData as Portfolio[] };
    } catch (error: any) {
        return { error: formatDbError(error?.message) };
    }
};

export const updatePortfolio = async (id: string, payload: UpdatePortfolioPayload): Promise<{error?: string; data?: Portfolio}> => {
    try {
        const portfolioData = await db.update(portfolioTable)
            .set({
                description: payload.description,
                assets: payload.assets,
                skills: payload.skills,
                updatedAt: new Date(),
            })
            .where(and(
                eq(portfolioTable.id, id),
                eq(portfolioTable.createdBy, payload.createdBy)
            ))
            .returning();

        if (!portfolioData?.length) {
            throw new Error("Failed to update portfolio or portfolio not found");
        }

        return { data: portfolioData[0] as Portfolio };
    } catch (error: any) {
        return { error: formatDbError(error?.message) };
    }
};

export const deletePortfolio = async (id: string, workerId: string): Promise<{error?: string; success?: boolean}> => {
    try {
        const deletedPortfolio = await db.delete(portfolioTable)
            .where(and(
                eq(portfolioTable.id, id),
                eq(portfolioTable.createdBy, workerId)
            ))
            .returning();

        if (!deletedPortfolio?.length) {
            throw new Error("Failed to delete portfolio or portfolio not found");
        }

        return { success: true };
    } catch (error: any) {
        return { error: formatDbError(error?.message) };
    }
}; 