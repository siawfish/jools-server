
import {
  // AcceptedTermsType,
  // DaysOfTheWeekType,
  // DocumentsType,
  // GhanaCard,
  // LocationType,
  Skill,
  // WorkingHours
} from "../services/workers/types";
import { UserTypes } from "../types";

// export const validateResources = (resources: ResourceType[]): boolean => {
//   if (!Array.isArray(resources)) return false;
//   if (resources.length < 1) return false;
//   for (const resource of resources) {
//     if (typeof resource !== "object") return false;
//     if (typeof resource.name !== "string") return false;
//     if (typeof resource.url !== "string") return false;
//     if (typeof resource.skill !== "string") return false;
//     if (!resource.id) return false;
//   }
//   return true;
// };
  
export const validateUserRole = (role: string): boolean => {
  return (
    role === UserTypes.ADMIN ||
    role === UserTypes.SUPER_ADMIN ||
    role === UserTypes.USER
  );
}

// export const validateUploadResourceType = (type: string): boolean => {
//   return (
//     type?.toLowerCase() === ResourceUploadType.COMMENTS.toLowerCase() ||
//     type?.toLowerCase() === ResourceUploadType.DOCUMENTS.toLowerCase() ||
//     type?.toLowerCase() === ResourceUploadType.PORTFOLIO.toLowerCase() ||
//     type?.toLowerCase() === ResourceUploadType.AVATAR.toLowerCase()
//   );
// };