import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { 
    getPortfolioById, 
} from '../../../services/portfolio/index';

export const getPortfolioByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('Portfolio ID is required');
        }

        const { error, data } = await getPortfolioById(id, res.locals.user.id);
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
