export enum ServiceLocationType {
    SHOP = 'shop',
    PERSON = 'person'
}

export enum Theme {
  SYSTEM = 'system',
  LIGHT = 'light',
  DARK = 'dark',
}

export enum Status {
  DELETED = 2,
  ACTIVE = 1,
  INACTIVE = 0,
}
  
export enum UserTypes {
  WORKER = "WORKER",
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum BookingStatuses {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  ONGOING = "ONGOING",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  PAUSED = "PAUSED",
}

export interface SkillType {
  id?: string;
  name: string;
  description: string;
  icon: string;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
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

export interface WorkingHours extends Record<DaysOfTheWeekType, {
  from: string;
  to: string;
  opened: boolean;
}> {}

export interface LocationType {
  address: string;
  lat: number;
  lng: number;
}

export interface GhanaCard {
  number: string;
  front: string;
  back: string;
  isVerified: boolean;
}

export interface AcceptedTermsType {
  status: boolean;
  acceptedAt: string;
}

export interface SettingsType {
  notifications: NotificationsType;
  theme: Theme;
  language: LanguageType;
  currency: CurrencyType;
  timezone: TimezoneType;
}

export enum LanguageType {
  ENGLISH = "en",
  FRENCH = "fr",
}

export enum CurrencyType {
  GHS = "GHS",
}

export enum TimezoneType {
  GHANA = "Africa/Accra",
}

export interface NotificationsType {
  email: boolean;
  sms: boolean;
  pushToken: string;
}
