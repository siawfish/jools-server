import { validateUploadResourceType } from "../../../helpers/constants";
import { errorResponse } from "../../../helpers/errorHandlers";
import { uploadImages, uploadVideos } from "../../../services/files";
import { RequestFiles, ResourceUploadType } from "../../../services/files/types";
import { ResourceType } from "../../../services/portfolio/types";
import { NextFunction, Request, Response } from 'express';

export const uploadFilesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!res?.locals?.user?.id){
            throw new Error("Invalid authentication token")
        }
        if (!req.files || Object.keys(req.files).length === 0) {
            throw new Error("No files were uploaded.")
        }
        const { images, videos } = req.files as RequestFiles;
        const { type } = req.body as { type: ResourceUploadType }
        if(!type){
            throw new Error("Resource type is required")
        }
        if(!validateUploadResourceType(type)){
            throw new Error("Invalid resource type")
        }
        if(!images && !videos){
            throw new Error("At least one image or video is required")
        }
        const resources: ResourceType[] = []
        if(images){
            const imagesArray = Array.isArray(images) ? images : [images]
            if (imagesArray.length < 1) {
                throw new Error("At least one image is required")
            }
            const options: { public_id?: string; folder?: string; } = {}
            if(type?.toLowerCase() === ResourceUploadType.AVATAR?.toLowerCase()){
                options.public_id = `clients/avatars/${res.locals.user.id}`
            } else {
                options.folder= `clients/images/${type?.toLowerCase()}/${res.locals.user.id}`
            }
            const { data, error } = await uploadImages(imagesArray, options)
            if (error) {
                throw new Error(error)
            }
            if(data){
                resources.push(...data)
            }
            
        }
        if(videos){
            const videosArray = Array.isArray(videos) ? videos : [videos]
            if (videosArray.length < 1) {
                throw new Error("At least one video is required")
            }
            const options = {
                folder: `clients/videos/portfolio/${res.locals.user.id}`
            }
            const { error, data } = await uploadVideos(videosArray, options)
            if (error) {
                throw new Error(error)
            }
            if(data){
                resources.push(...data)
            }
        }
        return res.status(201).json({
            message: "Files uploaded successfully",
            data: resources
        })
    } catch (error: any) {
        errorResponse(error?.message, res, 400)
    }
}