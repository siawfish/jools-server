import { LocationType, AcceptedTermsType, Gender } from "../../../types";

export type ClientRegisterPayload = {
    name: string;
    email: string;
    avatar: string;
    phoneNumber: string;
    location: LocationType;
    acceptedTerms: AcceptedTermsType;
    gender: Gender;
}
