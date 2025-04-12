import { storage } from '../../../firebase/init';
import { getDownloadURL } from 'firebase-admin/storage';
import { AssetUploadInput, Asset, AssetUploadOptions, AssetModule } from './type';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads multiple assets to Firebase Storage
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
 * Uploads a single asset to Firebase Storage
 * @param asset Asset to upload
 * @param options Upload options
 * @returns Upload result
 */
const uploadSingleAsset = async (
  asset: AssetUploadInput,
  options: AssetUploadOptions
): Promise<Asset> => {
  try {
    // Get data for Firebase upload
    const fileData = await prepareFileForUpload(asset.asset);
    
    // Set folder path
    const folder = options.dir ? `${options.dir}` : 'uploads';
    
    // Generate unique filename if not provided
    const fileId = asset.id || uuidv4();
    
    // Create reference to Firebase Storage
    const storageRef = storage.bucket().file(`${folder}/${fileId}`);
    
    // Upload to Firebase Storage
    await storageRef.save(fileData, {
      contentType: asset.type,
      metadata: {
        firebaseStorageDownloadTokens: fileId,
      }
    });
    
    // Generate public URL
    const url = await getDownloadURL(storageRef);
    
    return {
      id: fileId,
      url,
      type: asset.type,
      success: true,
    };
  } catch (error: any) {
    console.error(`Error uploading asset ${asset.id}:`, error);
    // Return error result
    return {
      id: asset.id || '',
      url: '',
      type: asset.type,
      success: false,
      error: error.message || 'Unknown error',
    };
  }
};

/**
 * Prepares a file for upload to Firebase Storage
 * @param file The file to prepare
 * @returns Buffer or raw data for Firebase upload
 */
const prepareFileForUpload = (file: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      // Check if it's an express-fileupload UploadedFile
      if (file && typeof file === 'object') {
        // Handle express-fileupload with useTempFiles enabled
        if (file.tempFilePath && typeof file.tempFilePath === 'string') {
          const fs = require('fs');
          return fs.readFile(file.tempFilePath, (err: any, data: Buffer) => {
            if (err) return reject(err);
            return resolve(data);
          });
        }
        
        // Handle express-fileupload with data property
        if ('data' in file && file.data && Buffer.isBuffer(file.data)) {
          return resolve(file.data);
        }
      }
      
      // Handle case where file is already a Buffer
      if (Buffer.isBuffer(file)) {
        return resolve(file);
      }
      
      // Handle case where file is a string (base64)
      if (typeof file === 'string' && file.startsWith('data:')) {
        // Extract the base64 content without the data URL prefix
        const base64Data = file.split(',')[1];
        return resolve(Buffer.from(base64Data, 'base64'));
      }
      
      reject(new Error('Unsupported file format'));
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteAssetByUrl = async (name: string, module: AssetModule) => {
  try {
    const fileName = `${module}/${name}`;
    if (!fileName) {
      throw new Error('Invalid URL');
    }
    await storage.bucket().file(fileName).delete();
    
    return {
      message: 'Asset deleted successfully',
    };
  } catch (error) {
    console.error('Error in deleteAssetByUrl:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const getAssetByName = async (name: string, module: AssetModule) => {
  try {
    // Find file with matching id
    const file = await storage.bucket().file(`${module}/${name}`);
    
    if (!file) {
      throw new Error(`Asset with name ${name} not found`);
    }
    
    // Get signed URL
    const url = await getDownloadURL(file);
    
    // Get metadata
    const [metadata] = await file.getMetadata();
    
    return {
      message: 'Asset fetched successfully',
      data: {
        id: name,
        url,
        type: metadata.contentType,
      },
    };
  } catch (error) {
    console.error('Error in getAssetByName:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};