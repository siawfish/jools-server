import { AcceptedTermsType, LocationType } from "../workers/types";

export interface ClientType {
    id?: string;
    avatar?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    location: LocationType;
    acceptedTerms: AcceptedTermsType;
    pushToken?: string;
    status: number;
}