import { ResourceUploadType } from "../services/files/types";
import { ResourceType } from "../services/portfolio/types";
import {
  AcceptedTermsType,
  DaysOfTheWeekType,
  DocumentsType,
  LocationType,
  SkillProperties,
  UserTypes,
  WorkingDayType,
} from "../services/workers/types";

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

export const validateSkills = (skills: string[]): boolean => {
  if (!Array.isArray(skills)) return false;
  if (skills.length < 1) return false;
  for (const skill of skills) {
    if (typeof skill !== "string") return false;
  }
  return true;
};

export const validateWorkingHours = (
  workingHours: WorkingDayType[]
): boolean => {
  if (!Array.isArray(workingHours)) return false;
  if (workingHours.length < 1) return false;
  for (const workingHour of workingHours) {
    if (typeof workingHour !== "object") return false;
    if (typeof workingHour.day !== "string") return false;
    if (typeof workingHour.start !== "string") return false;
    if (typeof workingHour.end !== "string") return false;
    if (
      workingHour?.day?.toUpperCase() !== DaysOfTheWeekType.MONDAY &&
      workingHour?.day?.toUpperCase() !== DaysOfTheWeekType.TUESDAY &&
      workingHour?.day?.toUpperCase() !== DaysOfTheWeekType.WEDNESDAY &&
      workingHour?.day?.toUpperCase() !== DaysOfTheWeekType.THURSDAY &&
      workingHour?.day?.toUpperCase() !== DaysOfTheWeekType.FRIDAY &&
      workingHour?.day?.toUpperCase() !== DaysOfTheWeekType.SATURDAY &&
      workingHour?.day?.toUpperCase() !== DaysOfTheWeekType.SUNDAY
    )
      return false;
    const [startHour, startMinute] = workingHour.start.split(":");
    const [endHour, endMinute] = workingHour.end.split(":");
    if (parseInt(startHour) < 0 || parseInt(startHour) > 23) return false;
    if (parseInt(startMinute) < 0 || parseInt(startMinute) > 59) return false;
    if (parseInt(endHour) < 0 || parseInt(endHour) > 23) return false;
    if (parseInt(endMinute) < 0 || parseInt(endMinute) > 59) return false;
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

export const validateSkillProperties = (properties: SkillProperties[]): boolean => {
  if (typeof properties !== "object") return false;
  if (Object.keys(properties).length < 1) return false;
  const errors = [];
  properties.forEach((property) => {
    if (!property?.name || !property?.rate || !property?.skillId) {
      errors.push('name, skillId and rate are required');
    };
    if (typeof property?.skillId !== "string") {
      errors.push('skillId must be a string');
    }
    if (typeof property?.name !== "string") {
      errors.push('name must be a string');
    };
    if (typeof property?.rate !== "number") {
      errors.push('rate must be a number');
    };
    if (!validateWorkRate(property?.rate)) {
      errors.push('invalid rate');
    };
  });
  if (errors.length > 0) {
    return false;
  }
  return true;
}