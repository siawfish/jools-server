import { ResourceType } from "../portfolio/types";
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary'
import { ExpressFile } from "./types";

export const uploadImages = async (images: ExpressFile[], options?:UploadApiOptions): Promise<{error?: string; data?: ResourceType[]}> => {
    try {
        const resources: ResourceType[] = []
        if (Array.isArray(images)) {
            if (images.length < 1) {
                throw new Error("At least one image is required")
            }
            for (const image of images) {
                const result = await cloudinary.uploader.upload(image.tempFilePath, {
                    resource_type: 'image',
                    ...options
                });
                resources.push({
                    id: getIdFromUrl(result.public_id),
                    url: result.secure_url,
                    name: image.name
                });
            }  
        }
        return { data: resources }
    } catch (error: any) {
        return { error: error?.message }
    }
}

export const uploadVideos = async (videos:ExpressFile[], options?:UploadApiOptions): Promise<{error?: string; data?: ResourceType[]}> => {
    try {
        const resources: ResourceType[] = []
        if (Array.isArray(videos)) {
            if (videos.length < 1) {
                throw new Error("At least one video is required")
            }
            for (const video of videos) {
                const result = await cloudinary.uploader.upload(video.tempFilePath, {
                    resource_type: 'video',
                    ...options
                });
                resources.push({
                    id: getIdFromUrl(result.public_id),
                    url: result.secure_url,
                    name: video.name
                });
            }
        }
        return { data: resources }
    } catch (error: any) {
        return { error: error?.message }
    }
}

function getIdFromUrl(url:string) {
    const parts = url.split('/');
    return parts[parts.length - 1];
}