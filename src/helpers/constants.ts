import { ResourceUploadType } from "../services/files/types";
import { ResourceType } from "../services/portfolio/types";
import {
  AcceptedTermsType,
  DaysOfTheWeekType,
  DocumentsType,
  GhanaCard,
  LocationType,
  Skill,
  WorkingHours
} from "../services/workers/types";
import { UserTypes } from "../types";

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
  if (typeof location.lat !== "number" || typeof location.lng !== "number")
    return false;
  return true;
};

export const validateAcceptedTerms = (
  acceptedTerms: AcceptedTermsType
): boolean => {
  return acceptedTerms.status && acceptedTerms.acceptedAt ? true : false;
};

export const validateDocuments = (documents: DocumentsType): boolean => {
  return documents.url && documents.isVerified ? true : false;
};

export const validateWorkRate = (workRate: number): boolean => {
  if (typeof workRate !== "number") return false;
  return workRate >= 0;
};

export const validateWorkingHours = (
  workingHours: WorkingHours[]
): boolean => {
  if (!Array.isArray(workingHours)) return false;
  if (workingHours.length < 1 || workingHours.length > 7) return false;
  for (const workingHour of workingHours) {
    if (typeof workingHour !== "object") return false;
    if (typeof workingHour.from !== "string") return false;
    if (typeof workingHour.to !== "string") return false;
    if (typeof workingHour.enabled !== "boolean") return false;
    if(Object.keys(workingHour).some(key => !DaysOfTheWeekType[key as keyof typeof DaysOfTheWeekType])) return false;
    if (parseInt(workingHour.from) < 0 || parseInt(workingHour.from) > 23) return false;
    if (parseInt(workingHour.to) < 0 || parseInt(workingHour.to) > 23) return false;
    if (parseInt(workingHour.from) > parseInt(workingHour.to)) return false;
  }
  return true;
};

export const validateResources = (resources: ResourceType[]): boolean => {
  if (!Array.isArray(resources)) return false;
  if (resources.length < 1) return false;
  for (const resource of resources) {
    if (typeof resource !== "object") return false;
    if (typeof resource.name !== "string") return false;
    if (typeof resource.url !== "string") return false;
    if (typeof resource.skill !== "string") return false;
    if (!resource.id) return false;
  }
  return true;
};

export const formatDbError = (error: string, suffix?: string): string => {
  console.log(error);
  const [_, column, message] = error.split(":");
  const columnName = column.split("[")[1].split("]")[0]; // Extracts 'phoneNumber' from 'column [phoneNumber]'
  if (message.trim() === "is not unique") {
    return `${convertCamelCaseToSentence(columnName)} ${
      suffix ?? "is already registered"
    }`;
  }
  return `${columnName}:${message}`;
};

export const convertCamelCaseToSentence = (camelCase: string): string => {
  return camelCase.replace(/([A-Z])/g, " $1").toLowerCase();
};

export const validateUploadResourceType = (type: string): boolean => {
  return (
    type?.toLowerCase() === ResourceUploadType.COMMENTS.toLowerCase() ||
    type?.toLowerCase() === ResourceUploadType.DOCUMENTS.toLowerCase() ||
    type?.toLowerCase() === ResourceUploadType.PORTFOLIO.toLowerCase() ||
    type?.toLowerCase() === ResourceUploadType.AVATAR.toLowerCase()
  );
};

export const validateDayStartEnd = (day: Date, start: Date, end: Date) => {
  if (isNaN(day.getTime()) || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }
  if (start.getTime() > end.getTime()) {
    return false;
  }
  if (start.getDate() !== end.getDate()) {
    return false;
  }
  return true;
};

export const validateUserRole = (role: string): boolean => {
  return (
    role === UserTypes.ADMIN ||
    role === UserTypes.SUPER_ADMIN ||
    role === UserTypes.USER
  );
}

export const validateSkills = (skills: Skill[]): boolean => {
  if (typeof skills !== "object") return false;
  if (skills.length < 1) return false;
  const errors = [];
  skills.forEach((skill) => {
    if (!skill?.name || !skill?.rate) {
      errors.push('name and rate are required');
    };
    if (typeof skill?.id !== "string") {
      errors.push('id must be a string');
    }
    if (typeof skill?.name !== "string") {
      errors.push('name must be a string');
    };
    if (typeof skill?.rate !== "number") {
      errors.push('rate must be a number');
    };
    if (!validateWorkRate(skill?.rate)) {
      errors.push('invalid rate');
    };
  });
  if (errors.length > 0) {
    return false;
  }
  return true;
}

export const validateGhanaCard = (ghanaCard: GhanaCard): boolean => {
  if (typeof ghanaCard !== "object") return false;
  if (typeof ghanaCard.number !== "string") return false;
  if (typeof ghanaCard.front !== "string") return false;
  if (typeof ghanaCard.back !== "string") return false;
  return true;
}