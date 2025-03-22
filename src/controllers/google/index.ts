import { errorResponse } from "../../helpers/errorHandlers";
import { Request, Response } from 'express';
import { reverseGeoCode } from "../../services/google";

export const reverseGeoCodeController = async (req: Request, res: Response) => {
  try {
    const { latlng } = req.params;
    // Validate request
    if (!latlng) {
      return errorResponse('latlng is required', res, 400);
    }

    if(!latlng.includes(',')) {
      return errorResponse('latlng is invalid', res, 400);
    }

    const {success, data, error} = await reverseGeoCode(latlng);
    if(!success || !data) {
      throw new Error(error?.response?.data?.error_message || 'Failed to reverse geo code');
    }

    const address = data?.results[0]?.formatted_address || 'Unknown Street';
    const lng = data?.results[0]?.geometry?.location?.lng || 0;
    const lat = data?.results[0]?.geometry?.location?.lat || 0;
    
    return res.status(200).json({
      message: 'Reverse geo code fetched successfully',
      data: {
        address,
        lng,
        lat
      }
    });
    
  } catch (error) {
    console.error('Error in reverseGeoCodeController:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to reverse geo code', res, 500);
  }
};