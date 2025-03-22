import axios from 'axios';
import { ReverseGeoCodeResponse } from './type';

export const reverseGeoCode = async (latlng: string): Promise<{success: boolean, data?: ReverseGeoCodeResponse, error?: any}> => {
    try {
        const response = await axios.get<ReverseGeoCodeResponse>(`${process.env.REVERSE_GEO_CODE_URL}?latlng=${latlng}&key=${process.env.GOOGLE_API_KEY}`);
        return {
            success: true,
            data: response.data
        }
    } catch (error:any) {
        return {
            success: false,
            error: error
        }
    }
}