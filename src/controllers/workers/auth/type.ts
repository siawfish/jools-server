import { WorkingHours, LocationType, GhanaCard, AcceptedTermsType, SkillType, Gender } from "../../../types";

export type WorkerRegisterPayload = {
    name: string;
    email: string;
    avatar: string;
    gender: Gender;
    phoneNumber: string;
    location: LocationType;
    workingHours: WorkingHours;
    ghanaCard: GhanaCard;
    acceptedTerms: AcceptedTermsType;
    skills: SkillType[];
}
