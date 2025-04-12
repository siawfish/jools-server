import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { 
    createPortfolio, 
    getPortfolioById, 
    getPortfoliosByWorkerId, 
    updatePortfolio, 
    deletePortfolio,
    likePortfolio,
    commentOnPortfolio,
    getPortfolioComments
} from '../../../services/portfolio/index';
import { validatePortfolioPayload, validateUpdatePortfolioPayload } from './helpers';
import { CreatePortfolioPayload, UpdatePortfolioPayload } from './type';
import { getSkillsById } from '../../../services/skills';

export const createPortfolioController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload: CreatePortfolioPayload = {
            ...req.body,
            createdBy: res.locals.user.id
        };

        const errors = validatePortfolioPayload(payload);

        if(payload.skills && payload.skills.length > 0){
            const skillPromises = payload.skills.map(skill => getSkillsById(skill));
            const skillsResults = await Promise.all(skillPromises);
            skillsResults.forEach(({ error, data }) => {
                if (error) {
                    throw new Error(error);
                }
            });
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const { error, data } = await createPortfolio(payload);
        if (error || !data?.id) {
            throw new Error(error);
        }

        return res.status(201).json({
            message: 'Portfolio created successfully',
            data
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};

export const getPortfolioByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('Portfolio ID is required');
        }

        const userId = res.locals.user.id;

        const { error, data } = await getPortfolioById(id, userId);
        if (error) {
            throw new Error(error);
        }

        return res.status(200).json({
            message: 'Portfolio fetched successfully',
            data
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};

export const getWorkerPortfoliosController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workerId = res.locals.user.id;
        
        const { error, data } = await getPortfoliosByWorkerId(workerId);
        if (error) {
            throw new Error(error);
        }

        return res.status(200).json({
            message: 'Portfolios fetched successfully',
            data: data || []
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};

export const updatePortfolioController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('Portfolio ID is required');
        }

        const payload: UpdatePortfolioPayload = {
            ...req.body,
            createdBy: res.locals.user.id
        };

        const errors = validateUpdatePortfolioPayload(payload);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const { error, data } = await updatePortfolio(id, payload);
        if (error) {
            throw new Error(error);
        }

        return res.status(200).json({
            message: 'Portfolio updated successfully',
            data
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};

export const deletePortfolioController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('Portfolio ID is required');
        }

        const workerId = res.locals.user.id;
        
        const { error, success } = await deletePortfolio(id, workerId);
        if (error) {
            throw new Error(error);
        }

        return res.status(200).json({
            message: 'Portfolio deleted successfully',
            success
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};

export const likePortfolioController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('Portfolio ID is required');
        }

        const { error, message } = await likePortfolio(id, res.locals.user.id);
        if (error) {
            throw new Error(error);
        }

        return res.status(200).json({
            message: message,
            success: true
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};

export const commentOnPortfolioController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('Portfolio ID is required');
        }

        const { comment } = req.body;
        if (!comment) {
            throw new Error('Comment is required');
        }

        const { error, success } = await commentOnPortfolio(id, res.locals.user.id, comment);
        if (error) {
            throw new Error(error);
        }

        return res.status(200).json({
            message: 'Comment added successfully',
            success
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};

export const getPortfolioCommentsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('Portfolio ID is required');
        }

        const { error, data } = await getPortfolioComments(id);
        if (error) {
            throw new Error(error);
        }

        return res.status(200).json({
            message: 'Portfolio comments fetched successfully',
            data
        });
    } catch (error: any) {
        errorResponse(error?.message, res, 400);
    }
};


