import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers';
import { createPortfolio } from '../../../services/portfolio';
import { MediaTypes, PortfolioType } from '../../../services/portfolio/types';
import { validateResources } from '../../../helpers/constants';

export const createPortfolioController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { caption, type, resources } = req.body as Partial<PortfolioType>;
        const { user } = res.locals;
        if(!user?.id) {
            throw new Error("Authentication required")
        }
        if(type !== MediaTypes.IMAGE && type !== MediaTypes.VIDEO && type !== MediaTypes.AUDIO) {
            throw new Error("Invalid media type")
        }
        if(!resources) {
            throw new Error("Resources is required")
        }
        if(resources.length < 1) {
            throw new Error("At least one resource is required")
        }
        
        if(!validateResources(resources)) {
            throw new Error("Invalid resources")
        }
        if(!caption) {
            throw new Error("Caption is required")
        }
        const { error, data } = await createPortfolio({
            caption: caption.trim(),
            type,
            resources,
            createdBy: user?.id
        });
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("An error occurred")
        }
        return res.status(201).json({
            message: "Portfolio created successfully",
            data
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}