import { Status, Theme } from "../../types";

export interface WorkerType {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  accountStatus?: Status;
  settings?: Settings;
  acceptedTerms: AcceptedTermsType;
  location: LocationType;
  isVerified?: boolean;
  workingHours: WorkingHours;
  ghanaCard?: GhanaCard;
  skills: Skill[];
  rating?: number;
}

export interface Settings {
  notifications: Notifications;
  theme: Theme;
  language: string;
  currency: string;
  timezone: string;
}

export interface Notifications {
  token: string;
  enabled: boolean;
}

export interface GhanaCard {
  number: string;
  front: string;
  back: string;
}

export interface Skill {
  id: string;
  name: string;
  rate: number;
  yearsOfExperience: number;
  icon?: string;
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

export interface WorkingHours {
  [key: string]: {
    from: string;
    to: string;
    enabled: boolean;
  };
}
  
export interface AcceptedTermsType {
  status: boolean;
  acceptedAt: Date;
}
  
export interface LocationType {
  address?: string;
  lat: number;
  lng: number;
}
  
export interface DocumentsType {
  url: string;
  isVerified: boolean;
}
  
export interface VerifyOTPpayloadType { 
  otp: string;
  referenceId: string;
  phoneNumber: string 
}