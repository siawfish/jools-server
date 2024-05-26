export interface WorkerType {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phoneNumber: string;
  location: LocationType;
  acceptedTerms: AcceptedTermsType;
  type: AccountTypes;
  documents?: DocumentsType;
  email: string;
  skills: string[];
  score?: number;
  rating?: number;
  pushToken?: string;
  workingHours?: WorkingDayType[];
  id?: string;
  properties: SkillProperties[];
  status?: Status;
}

export enum Status {
  DELETED = 2,
  ACTIVE = 1,
  INACTIVE = 0,
}


export interface SkillProperties {
  skillId: string;
  name: string;
  description: string;
  rate: number;
}
  export interface WorkingDayType {
    day: DaysOfTheWeekType;
    start: string;
    end: string;
  }

  export enum DaysOfTheWeekType {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY",
  }

  
  export enum UserTypes {
    WORKER = "WORKER",
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
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