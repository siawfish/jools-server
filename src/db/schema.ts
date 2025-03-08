import { integer, pgTable, varchar, uuid, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { BookingStatuses, Theme, ServiceLocationType, UserTypes, WorkingHours, SettingsType, LanguageType, CurrencyType, TimezoneType, AcceptedTermsType, LocationType, GhanaCard } from "../types";
import { Asset } from "../services/assets/type";

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    avatar: varchar({ length: 255 }).notNull(),
    phoneNumber: varchar({ length: 255 }).unique().notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    deletedAt: timestamp("deleted_at"),
    accountStatus: integer("account_status").default(1).$type<0 | 1 | 2>(),
    settings: jsonb("settings").default({
        notifications: {
            email: true,
            sms: true,
            pushToken: "",
        },
        theme: Theme.LIGHT,
        language: LanguageType.ENGLISH,
        currency: CurrencyType.GHS,
        timezone: TimezoneType.GHANA,
    }).notNull().$type<SettingsType>(),
    acceptedTerms: jsonb("accepted_terms").default({
        status: false,
        acceptedAt: "",
    }).notNull().$type<AcceptedTermsType>(),
    location: jsonb("location").$type<LocationType>().notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    userType: varchar("user_type", { length: 255 }).default("USER").notNull().$type<UserTypes>(),
    rating: integer("rating").default(0).notNull(),
});

export const workerTable = pgTable("workers", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id").references(() => usersTable.id).unique().notNull(),
    workingHours: jsonb("working_hours").$type<WorkingHours>().notNull(),
    ghanaCard: jsonb("ghana_card").$type<GhanaCard>().notNull(),
    skills: jsonb("skills").references(() => skillTable.id).$type<string[]>().notNull(),
});

export const skillTable = pgTable("skills", { 
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar({ length: 255 }).notNull(),
    rate: integer("rate").default(0),
    yearsOfExperience: integer("years_of_experience").default(0),
    icon: varchar({ length: 255 }),
});

export const portfolioTable = pgTable("portfolios", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    description: varchar({ length: 255 }).notNull(),
    assets: jsonb("assets").references(() => assetTable.id).$type<Asset[]>(),
    skills: jsonb("skills").references(() => skillTable.id).$type<string[]>(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    createdBy: uuid("created_by").references(() => usersTable.id),
});

export const assetTable = pgTable("assets", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    uri: varchar({ length: 255 }).notNull(),
    width: integer("width"),
    height: integer("height"),
    type: varchar("type", { length: 255 }).notNull().$type<'IMAGE' | 'VIDEO' | 'PDF'>(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    createdBy: uuid("created_by").references(() => usersTable.id),
});

export const otpTable = pgTable("otps", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    phoneNumber: varchar("phone_number", { length: 255 }).notNull().unique(),
    otp: varchar("otp", { length: 255 }).notNull(),
    referenceId: varchar("reference_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const bookingTable = pgTable("bookings", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    estimatedDuration: integer("estimated_duration").notNull(),
    estimatedPrice: integer("estimated_price").notNull(),
    requiredSkills: jsonb("required_skills").$type<string[]>(),
    requiredTools: jsonb("required_tools").$type<string[]>(),
    status: varchar("status", { length: 255 }).notNull().$type<BookingStatuses>(),
    workerId: uuid("worker_id").references(() => workerTable.userId),
    userId: uuid("user_id").references(() => usersTable.id),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    location: jsonb("location").$type<LocationType>().notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    date: timestamp("date").notNull(),
    startTime: timestamp("start_time").notNull(),
    estimatedEndTime: timestamp("estimated_end_time").notNull(),
    media: jsonb("media").references(() => assetTable.id).$type<string[]>(),
    serviceType: varchar("service_type", { length: 255 }).notNull().$type<ServiceLocationType>(),
});








