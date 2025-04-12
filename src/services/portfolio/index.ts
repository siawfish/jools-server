import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../../db";
import { portfolioTable, portfolioCommentsTable, portfolioLikesTable, usersTable } from "../../db/schema";
import { formatDbError } from "../../helpers/errorHandlers";
import { Portfolio, CreatePortfolioPayload, UpdatePortfolioPayload, PortfolioComment } from "../../controllers/workers/portfolio/type";
import { Asset, AssetModule } from "../assets/type";
import { deleteAssetByUrl } from "../assets";

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

export const getPortfolioById = async (id: string, userId: string): Promise<{error?: string; data?: Portfolio}> => {
    try {
        const portfolioData = await db
            .select({
                id: portfolioTable.id,
                description: portfolioTable.description,
                assets: portfolioTable.assets,
                skills: portfolioTable.skills,
                createdAt: portfolioTable.createdAt,
                updatedAt: portfolioTable.updatedAt,
                createdBy: portfolioTable.createdBy,
                likes: sql<number>`(
                    select count(*)
                    from ${portfolioLikesTable}
                    where ${portfolioLikesTable.portfolioId} = ${portfolioTable.id}
                )::int`,
                comments: sql<number>`(
                    select count(*)
                    from ${portfolioCommentsTable}
                    where ${portfolioCommentsTable.portfolioId} = ${portfolioTable.id}
                )::int`,
                hasLiked: userId ? sql<boolean>`(
                    select count(*) > 0
                    from ${portfolioLikesTable}
                    where ${portfolioLikesTable.portfolioId} = ${portfolioTable.id}
                    and ${portfolioLikesTable.authorId} = ${userId}
                )` : sql<boolean>`false`,
                hasCommented: userId ? sql<boolean>`(
                    select count(*) > 0
                    from ${portfolioCommentsTable}
                    where ${portfolioCommentsTable.portfolioId} = ${portfolioTable.id}
                    and ${portfolioCommentsTable.authorId} = ${userId}
                )` : sql<boolean>`false`,
            })
            .from(portfolioTable)
            .where(eq(portfolioTable.id, id));
        
        if (!portfolioData?.length) {
            throw new Error("Portfolio not found");
        }

        return { data: portfolioData[0] as unknown as Portfolio };
    } catch (error: any) {
        return { error: formatDbError(error?.message) };
    }
};

export const getPortfoliosByWorkerId = async (workerId: string): Promise<{error?: string; data?: Portfolio[]}> => {
    try {
        // Base portfolio query
        const portfoliosQuery = db
            .select({
                id: portfolioTable.id,
                description: portfolioTable.description,
                assets: portfolioTable.assets,
                skills: portfolioTable.skills,
                createdAt: portfolioTable.createdAt,
                updatedAt: portfolioTable.updatedAt,
                createdBy: portfolioTable.createdBy,
            })
            .from(portfolioTable)
            .where(eq(portfolioTable.createdBy, workerId))
            .orderBy(desc(portfolioTable.createdAt));

        // Likes count and hasLiked query
        const likesQuery = db
            .select({
                portfolioId: portfolioLikesTable.portfolioId,
                count: sql<number>`count(*)::int`,
                hasLiked: sql<boolean>`bool_or(${portfolioLikesTable.authorId} = ${workerId})`
            })
            .from(portfolioLikesTable)
            .groupBy(portfolioLikesTable.portfolioId);

        // Comments count and hasCommented query
        const commentsQuery = db
            .select({
                portfolioId: portfolioCommentsTable.portfolioId,
                count: sql<number>`count(*)::int`,
                hasCommented: sql<boolean>`bool_or(${portfolioCommentsTable.authorId} = ${workerId})`
            })
            .from(portfolioCommentsTable)
            .groupBy(portfolioCommentsTable.portfolioId);

        // Run all queries concurrently
        const [portfolios, likesData, commentsData] = await Promise.all([
            portfoliosQuery,
            likesQuery,
            commentsQuery
        ]);

        // Create maps for quick lookup
        const likesMap = new Map(likesData.map(l => [l.portfolioId, { count: l.count, hasLiked: l.hasLiked }]));
        const commentsMap = new Map(commentsData.map(c => [c.portfolioId, { count: c.count, hasCommented: c.hasCommented }]));

        // Combine the results
        const enrichedPortfolios = portfolios.map(portfolio => ({
            ...portfolio,
            likes: likesMap.get(portfolio.id)?.count || 0,
            hasLiked: likesMap.get(portfolio.id)?.hasLiked || false,
            comments: commentsMap.get(portfolio.id)?.count || 0,
            hasCommented: commentsMap.get(portfolio.id)?.hasCommented || false,
        }));

        return { data: enrichedPortfolios as unknown as Portfolio[] };
    } catch (error: any) {
        return { error: formatDbError(error?.message) };
    }
};

export const updatePortfolio = async (id: string, payload: UpdatePortfolioPayload): Promise<{error?: string; data?: Portfolio}> => {
    try {
        // get portfolio by id
        const portfolio = await db.select().from(portfolioTable)
            .where(and(
                eq(portfolioTable.id, id),
                eq(portfolioTable.createdBy, payload.createdBy)
            ));

        if (!portfolio?.length) {
            throw new Error("Portfolio not found");
        }
        
        // check for removed assets
        const removedAssets = portfolio[0]?.assets?.filter((asset: Asset) => !payload.assets?.map((a: Asset) => a.id).includes(asset.id));
        if(removedAssets?.length) {
            await Promise.all(removedAssets.map(async (asset: Asset) => {
                await deleteAssetByUrl(asset.id, AssetModule.PORTFOLIO);
            }));
        }
            
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

        // delete all likes and comments for the portfolio concurrently
        await Promise.all([
            db.delete(portfolioLikesTable)
                .where(eq(portfolioLikesTable.portfolioId, id)),
            db.delete(portfolioCommentsTable)
                .where(eq(portfolioCommentsTable.portfolioId, id)),
        ]);

        // delete all assets for the portfolio concurrently
        if (deletedPortfolio[0]?.assets?.length) {
            await Promise.all(deletedPortfolio[0]?.assets?.map(async (asset: Asset) => {
                await deleteAssetByUrl(asset.id, AssetModule.PORTFOLIO);
            }));
        }

        return { success: true };
    } catch (error: any) {
        return { error: formatDbError(error?.message) };
    }
}; 

export const likePortfolio = async (portfolioId: string, userId: string): Promise<{error?: string; message?: string}> => {
    try {
        const existingLike = await db.select().from(portfolioLikesTable)
            .where(and(
                eq(portfolioLikesTable.portfolioId, portfolioId),
                eq(portfolioLikesTable.authorId, userId)
            ));

        if (existingLike?.length) {
            await db.delete(portfolioLikesTable)
                .where(and(
                    eq(portfolioLikesTable.portfolioId, portfolioId),
                    eq(portfolioLikesTable.authorId, userId)
                ));

            return { message: "Portfolio unliked successfully" };
        }
        
        await db.insert(portfolioLikesTable).values({
            portfolioId,
            authorId: userId,
        });

        return { message: "Portfolio liked successfully" };
    } catch (error: any) {
        return { error: formatDbError(error?.message) };
    }
};

export const commentOnPortfolio = async (portfolioId: string, userId: string, comment: string): Promise<{error?: string; success?: boolean}> => {
    try {
        await db.insert(portfolioCommentsTable).values({
            portfolioId,
            authorId: userId,
            comment,
        });

        return { success: true };
    } catch (error: any) {
        return { error: formatDbError(error?.message) };
    }
};

export const getPortfolioComments = async (portfolioId: string): Promise<{error?: string; data?: PortfolioComment[]}> => {
    try {
        const comments = await db
            .select({
                id: portfolioCommentsTable.id,
                portfolioId: portfolioCommentsTable.portfolioId,
                authorId: portfolioCommentsTable.authorId,
                comment: portfolioCommentsTable.comment,
                createdAt: portfolioCommentsTable.createdAt,
                updatedAt: portfolioCommentsTable.updatedAt,
                author: {
                    id: usersTable.id,
                    name: usersTable.name,
                    avatar: usersTable.avatar,
                }
            })
            .from(portfolioCommentsTable)
            .leftJoin(usersTable, eq(portfolioCommentsTable.authorId, usersTable.id))
            .where(eq(portfolioCommentsTable.portfolioId, portfolioId))
            .orderBy(desc(portfolioCommentsTable.createdAt));

        return { data: comments as unknown as PortfolioComment[] };
    } catch (error: any) {
        return { error: formatDbError(error?.message) };
    }
};

