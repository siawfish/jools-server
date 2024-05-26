import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../../helpers/errorHandlers.js';
import { Query } from '../../../services/search/type.js';
import { getSkillById } from '../../../services/skills/index.js';
import { searchWorker } from '../../../services/search/index.js';

export const searchController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { skill, page, limit, lat, lng } = req.query;
        if(!lat || !lng) {
            throw new Error("Location is required")
        }
        if(!skill) {
            throw new Error("Skill is required")
        }
        const query: Query = {
            skill: skill as string,
            lat: parseFloat(lat as string),
            lng: parseFloat(lng as string),
            page: parseInt(page as string ?? 1),
            limit: parseInt(limit as string ?? 10)
        }
        const { error, data } = await getSkillById(query?.skill);
        if(error) {
            throw new Error(error)
        }
        if(!data) {
            throw new Error("Skill not found")
        }
        const searchResults = await searchWorker(query);
        return res.status(200).json({
            message: "Workers fetched successfully",
            data: searchResults
        })
    } catch (error:any) {
        errorResponse(error?.message, res, 400)
    }
}