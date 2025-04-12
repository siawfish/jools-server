import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../../helpers/errorHandlers';
import { uploadAssets, deleteAssetByUrl, getAssetByName } from '../../services/assets';
import { AssetUploadInput, AssetModule } from '../../services/assets/type';
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
        const assetType = file.mimetype
          
        assetsToUpload.push({
          id: uuidv4(),
          asset: file, // Pass the UploadedFile directly
          type: assetType,
        });
      }
    } else if (files.assets) {
      // Single file
      const file = files.assets as UploadedFile;
      const assetType = file.mimetype
        
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
 * Deletes assets from Firebase Storage based on provided file names
 */
export const deleteAssetsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, module } = req.body;
    // Validate request
    if (!id) {
      return errorResponse('Asset ID is required', res, 400);
    }

    if(!Object.values(AssetModule).includes(module)) {
      return errorResponse('Invalid module', res, 400);
    }

    const {data, error} = await getAssetByName(id, module);
    if(error || !data) {
      console.log('error', error);
      return errorResponse('Asset not found', res, 404);
    }

    const { error: deleteError } = await deleteAssetByUrl(data.id, module);
    if(deleteError) {
      console.log('deleteError', deleteError);
      return errorResponse('Failed to delete asset', res, 500);
    }
    
    return res.status(200).json({
      message: 'Asset deleted successfully',
    });
    
  } catch (error) {
    console.error('Error in deleteAssetsController:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to delete assets', res, 500);
  }
};
