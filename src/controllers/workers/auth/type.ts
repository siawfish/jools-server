import { WorkingHours, LocationType, GhanaCard, AcceptedTermsType } from "../../../types";

export type WorkerRegisterPayload = {
    name: string;
    email: string;
    avatar: string;
    phoneNumber: string;
    location: LocationType;
    workingHours: WorkingHours;
    ghanaCard: GhanaCard;
    acceptedTerms: AcceptedTermsType;
    skills: string[];
}
