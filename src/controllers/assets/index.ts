import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../helpers/errorHandlers';
import { uploadAssets, deleteAssetById, getAssetById } from '../../services/assets';
import { AssetType, AssetUploadInput, AssetModule } from '../../services/assets/type';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';

/**
 * Controller for uploading assets
 * Handles multiple file uploads and processes them through Cloudinary
 */
export const uploadAssetsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if files exist in the request
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded',
      });
    }

    if(!req.body.module) {
      return errorResponse('Module is required', res, 400);
    }

    if(!Object.values(AssetModule).includes(req.body.module)) {
      return errorResponse('Invalid module', res, 400);
    }

    const files = req.files;
    
    // Prepare assets for upload
    const assetsToUpload: AssetUploadInput[] = [];
    
    // Handle both array of files and single file cases
    if (Array.isArray(files.assets)) {
      // Multiple files
      for (const file of files.assets) {
        const assetType = file.mimetype.startsWith('video/') 
          ? AssetType.VIDEO 
          : AssetType.IMAGE;
          
        assetsToUpload.push({
          id: uuidv4(),
          asset: file, // Pass the UploadedFile directly
          type: assetType,
        });
      }
    } else if (files.assets) {
      // Single file
      const file = files.assets as UploadedFile;
      const assetType = file.mimetype.startsWith('video/') 
        ? AssetType.VIDEO 
        : AssetType.IMAGE;
        
      assetsToUpload.push({
        id: uuidv4(),
        asset: file, // Pass the UploadedFile directly
        type: assetType,
      });
    }
    
    // Upload assets to Cloudinary
    const uploadResults = await uploadAssets(assetsToUpload, req.body.module);
    
    // Return results
    return res.status(200).json({
      success: true,
      message: 'Assets uploaded successfully',
      data: uploadResults,
    });
    
  } catch (error) {
    console.error('Error in uploadAssetsController:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to upload assets', res, 500);
  }
};

/**
 * Controller for deleting assets
 * Deletes assets from Cloudinary based on provided URLs or public IDs
 */
export const deleteAssetsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicId } = req.body;
    const user = res.locals.user;
    // Validate request
    if (!publicId) {
      return errorResponse('Asset ID is required', res, 400);
    }

    const encodedPublicId = encodeURIComponent(publicId);

    const {data, error} = await getAssetById(encodedPublicId);
    if(error) {
      console.log('error', error);
      return errorResponse('Asset not found', res, 404);
    }

    console.log('asset', data);

    const assetOwner = extractImageOwnerFromUrl(data.secure_url);
    console.log('assetOwner', assetOwner);
    console.log('user.id', user.id);
    if(assetOwner !== user.id) {
      return errorResponse('Unauthorized', res, 403);
    }

    await deleteAssetById(encodedPublicId);
    
    return res.status(200).json({
      message: 'Asset deleted successfully',
    });
    
  } catch (error) {
    console.error('Error in deleteAssetsController:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to delete assets', res, 500);
  }
};

const extractImageOwnerFromUrl = (url: string) => {
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/');
  // Find the index of the module (e.g. PORTFOLIO)
  const moduleIndex = pathParts.findIndex(part => 
    Object.values(AssetModule).includes(part as AssetModule)
  );
  // Owner ID is right after the module
  return moduleIndex >= 0 ? pathParts[moduleIndex + 1] : null;
}
