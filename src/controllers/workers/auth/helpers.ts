import { start } from "repl";
import { DaysOfTheWeekType } from "../../../types";
import { WorkingHours, AcceptedTermsType, LocationType, GhanaCard } from "../../../types";
import jwt from "jsonwebtoken";
import { UserTypes } from "../../../types";

// export a function that validates ghanaian phone numbers
export const validatePhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^(?:0|\+233)[0-9]{9}$/;
    return phoneRegex.test(phoneNumber);
};

// export function that validates email
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// export function that validates location
export const validateLocation = (location: LocationType): boolean => {
    if (typeof location !== "object") return false;
    if (typeof location.lat !== "number" || typeof location.lng !== "number") return false;
    if (typeof location.address !== "string") return false;
    if (location.address.length < 1) return false;
    return true;
};

export const validateAcceptedTerms = (
    acceptedTerms: AcceptedTermsType
  ): boolean => {
    return acceptedTerms?.status && acceptedTerms?.acceptedAt ? true : false;
};
  
// export const validateDocuments = (documents: DocumentsType): boolean => {
//     return documents.url && documents.isVerified ? true : false;
// };
  
export const validateWorkRate = (workRate: number): boolean => {
    if (typeof workRate !== "number") return false;
    return workRate >= 0;
};

export const validateDayStartEnd = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0);
    
    const endDate = new Date(); 
    endDate.setHours(endHours, endMinutes, 0);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return false;
    }
    if (startDate.getTime() > endDate.getTime()) {
      return false;
    }
    if (startDate.getDate() !== endDate.getDate()) {
      return false;
    }
    return true;
};
  
export const validateWorkingHours = (
    workingHours: WorkingHours
  ): boolean => {
    if (typeof workingHours !== "object") return false;
    if (Object.keys(workingHours).length < 1) return false;
    if (Object.keys(workingHours).length > 7) return false;
    for (const day of Object.keys(workingHours)) {
        if (typeof workingHours[day as keyof WorkingHours] !== "object") return false;
        if (typeof workingHours[day as keyof WorkingHours].from !== "string") return false;
        if (typeof workingHours[day as keyof WorkingHours].to !== "string") return false;
        if (typeof workingHours[day as keyof WorkingHours].opened !== "boolean") return false;
        if (!validateDayStartEnd(workingHours[day as keyof WorkingHours].from, workingHours[day as keyof WorkingHours].to)) return false;
    }
    return true;
};
  
  export const validateSkills = (skills: string[]): boolean => {
    if (!Array.isArray(skills)) return false;
    if (skills.length < 1) return false;
    if (skills.some(skill => typeof skill !== "string")) return false;
    return true;
  }
  
  export const validateGhanaCard = (ghanaCard: GhanaCard): boolean => {
    if (typeof ghanaCard !== "object") return false;
    if (typeof ghanaCard.number !== "string") return false;
    if (typeof ghanaCard.front !== "string") return false;
    if (typeof ghanaCard.back !== "string") return false;
    return true;
  }

  export const constructVerificationSms = (otp: string) => {
    return `Your verification code is ${otp}`;
  }

  export const createJwtToken = (id: string, type: UserTypes) => {
    return jwt.sign({ id, type }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  }

  // Store blacklisted tokens in memory
  // In a production environment, this should be stored in a database or Redis
  const tokenBlacklist = new Set<string>();

  /**
   * Add a token to the blacklist
   * @param token JWT token to blacklist
   */
  export const addToBlacklist = (token: string) => {
    tokenBlacklist.add(token);
  }

  /**
   * Check if a token is blacklisted
   * @param token JWT token to check
   * @returns boolean indicating if token is blacklisted
   */
  export const isTokenBlacklisted = (token: string): boolean => {
    return tokenBlacklist.has(token);
  }

  /**
   * Verify a JWT token
   * @param token JWT token to verify
   * @returns Decoded token payload or null if invalid
   */
  export const verifyJwtToken = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }