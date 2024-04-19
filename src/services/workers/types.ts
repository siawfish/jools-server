export interface WorkerType {
    firstName?: string;
    lastName?: string;
    companyName?: string;
    phoneNumber: string;
    location: LocationType;
    workRate: number;
    acceptedTerms: AcceptedTermsType;
    type: AccountTypes;
    documents?: DocumentsType;
    email: string;
    skills: SkillType[];
    score?: number;
    rating?: number;
    isVerified?: boolean;
    pushToken?: string;
    id?: string;
  }
  
  export enum UserTypes {
    WORKER = "WORKER",
    USER = "USER",
  }

  export enum AccountTypes {
    INDIVIDUAL = "INDIVIDUAL",
    COMPANY = "COMPANY",
  }
  
  export interface AcceptedTermsType {
    status: boolean;
    acceptedAt: Date;
  }
  
  export interface LocationType {
    lat: number;
    lng: number;
  }
  
  export interface DocumentsType {
    url: string;
    isVerified: boolean;
  }
  
  export interface SkillType {
    id: string;
    name: string;
    icon: string;
  };
  
  export interface VerifyOTPpayloadType { 
    otp: string;
    referenceId: string;
    phoneNumber: string 
  }
  