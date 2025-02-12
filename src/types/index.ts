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