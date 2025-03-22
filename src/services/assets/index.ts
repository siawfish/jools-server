import { v2 as cloudinary } from 'cloudinary';
import { AssetType, AssetUploadInput, Asset, AssetUploadOptions } from './type';
import cloudinaryConfig from '../../../config/cloudinary';
import { UploadedFile } from 'express-fileupload';

// Configure Cloudinary with credentials from environment variables
cloudinaryConfig()

/**
 * Uploads multiple assets to Cloudinary
 * @param assets Array of assets to upload
 * @param dir Directory to save the assets under
 * @returns Array of upload results
 */
export const uploadAssets = async (
  assets: AssetUploadInput[],
  dir: string
): Promise<Asset[]> => {
  try {
    // Process uploads in parallel
    const uploadPromises = assets.map(asset => uploadSingleAsset(asset, { dir }));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error in uploadAssets:', error);
    throw error;
  }
};

/**
 * Uploads a single asset to Cloudinary
 * @param asset Asset to upload
 * @param options Upload options
 * @returns Upload result
 */
const uploadSingleAsset = async (
  asset: AssetUploadInput,
  options: AssetUploadOptions
): Promise<Asset> => {
  try {
    // Get data for Cloudinary upload
    const fileData = await prepareFileForUpload(asset.asset);
    
    // Set resource type based on asset type
    const resourceType = asset.type === AssetType.VIDEO ? 'video' : 'image';
    
    // Set folder path
    const folder = options.dir ? `${options.dir}/${asset.id}` : 'uploads';
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileData, {
      resource_type: resourceType,
      folder,
    });
    
    return {
      id: result.public_id?.split('/')?.pop() || asset.id,
      url: result.secure_url,
      type: asset.type,
      success: true,
    };
  } catch (error: any) {
    console.error(`Error uploading asset ${asset.id}:`, error);
    
    // Return error result
    return {
      id: asset.id,
      url: '',
      type: asset.type,
      success: false,
      error: error.message || 'Unknown error',
    };
  }
};

/**
 * Prepares a file for upload to Cloudinary
 * Works with express-fileupload's UploadedFile in Node.js environment
 * @param file The file to prepare
 * @returns Data ready for Cloudinary upload
 */
const prepareFileForUpload = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Check if it's an express-fileupload UploadedFile
      if (file && typeof file === 'object' && 'tempFilePath' in file) {
        // If tempFilePath exists, return it (Cloudinary can handle file paths)
        if (file.tempFilePath) {
          return resolve(file.tempFilePath);
        }
        
        // Otherwise use the data property which contains the file buffer
        if (file.data) {
          // Convert buffer to base64 data URL
          const base64 = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
          return resolve(base64);
        }
      }
      
      // Handle case where file is already a string (URL or base64)
      if (typeof file === 'string') {
        return resolve(file);
      }
      
      // Handle case where file is a Buffer
      if (Buffer.isBuffer(file)) {
        return resolve(`data:application/octet-stream;base64,${file.toString('base64')}`);
      }
      
      reject(new Error('Unsupported file format'));
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteAssetById = async (id: string) => {
  try {
    await cloudinary.uploader.destroy(id);
  } catch (error) {
    console.error('Error in deleteAssetById:', error);
    throw error;
  }
};

export const getAssetById = async (id: string) => {
  try {
    const asset = await cloudinary.api.resource(id);
    return {
      message: 'Asset fetched successfully',
      data: asset,
    };
  } catch (error) {
    console.error('Error in getAssetById:', error);
    return {
      message: 'Asset not found',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};