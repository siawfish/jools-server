import { ResourceUploadType } from "../services/files/types";
import { ResourceType } from "../services/portfolio/types";
import { AcceptedTermsType, DocumentsType, LocationType, SkillType } from "../services/workers/types";

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

export const validateSkills = (skills: SkillType[]): boolean => {
    if (!Array.isArray(skills)) return false;
    if (skills.length < 1) return false;
    for (const skill of skills) {
        if (typeof skill !== "object") return false;
        if (typeof skill.name !== "string") return false;
        if (typeof skill.icon !== "string") return false;
        if (!skill.id) return false;
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

// format db error message
// db error format invalid record: column [phoneNumber]: is not unique
// write function that takes in the error message and returns the column and the message
export const formatDbError = (error: string, suffix?: string): string => {
    const [_, column, message] = error.split(":");
    const columnName = column.split("[")[1].split("]")[0]; // Extracts 'phoneNumber' from 'column [phoneNumber]'
    if (message.trim() === 'is not unique') {
        return `${convertCamelCaseToSentence(columnName)} ${suffix ?? "is already registered"}`;
    }
    return `${columnName}:${message}`;
};

export const convertCamelCaseToSentence = (camelCase: string): string => {
    return camelCase.replace(/([A-Z])/g, " $1").toLowerCase();
}

export const validateUploadResourceType = (type: string): boolean => {
    return type?.toLowerCase() === ResourceUploadType.COMMENTS.toLowerCase() || type?.toLowerCase() === ResourceUploadType.DOCUMENTS.toLowerCase() || type?.toLowerCase() === ResourceUploadType.PORTFOLIO.toLowerCase();
}