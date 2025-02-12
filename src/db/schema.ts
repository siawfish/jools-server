import { integer, pgTable, varchar, uuid, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { BookingStatuses, Theme, ServiceLocationType, UserTypes } from "../types";

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    avatar: varchar({ length: 255 }).notNull(),
    phoneNumber: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    deletedAt: timestamp("deleted_at"),
    accountStatus: integer("account_status").default(1).$type<0 | 1 | 2>(),
    settings: varchar("settings").references(() => settingsTable.id),
    acceptedTerms: jsonb("accepted_terms"),
    location: varchar("locations").references(() => locationTable.id),
    isVerified: boolean("is_verified").default(false),
    userType: varchar("user_type", { length: 255 }).default("USER").notNull().$type<UserTypes>(),
    rating: integer("rating")
});

export const workerTable = pgTable("workers", {
    userId: uuid("user_id").references(() => usersTable.id),
    workingHours: jsonb("working_hours"),
    ghanaCard: varchar("ghana_card").references(() => ghanaCardTable.id),
    skills: jsonb("skills").references(() => skillTable.id).$type<string[]>(),
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
    resources: jsonb("resources").references(() => resourceTable.id).$type<string[]>(),
    skills: jsonb("skills").references(() => skillTable.id).$type<string[]>(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    createdBy: uuid("created_by").references(() => usersTable.id),
});

export const resourceTable = pgTable("resources", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    uri: varchar({ length: 255 }).notNull(),
    width: integer("width"),
    height: integer("height"),
    type: varchar("type", { length: 255 }).notNull().$type<'IMAGE' | 'VIDEO' | 'PDF'>(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    createdBy: uuid("created_by").references(() => usersTable.id),
});

export const ghanaCardTable = pgTable("ghana_card", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    number: varchar({ length: 255 }).notNull(),
    front: varchar({ length: 255 }).notNull(),
    back: varchar({ length: 255 }).notNull(),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    createdBy: uuid("created_by").references(() => usersTable.id),
});

export const locationTable = pgTable("locations", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    address: varchar({ length: 255 }).notNull(),
    lat: integer("lat").notNull(),
    lng: integer("lng").notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    userId: uuid("user_id").notNull().primaryKey(),
});

const settingsTable = pgTable("settings", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    notifications: varchar("notifications").references(() => notificationsTable.id),
    theme: varchar("theme", { length: 255 }).notNull().$type<Theme>(),
    language: varchar("language", { length: 255 }).notNull(),
    currency: varchar("currency", { length: 255 }).notNull(),
    timezone: varchar("timezone", { length: 255 }).notNull(),
    userId: uuid("user_id").notNull().primaryKey(),
});

const notificationsTable = pgTable("notifications", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    token: varchar("token", { length: 255 }).notNull(),
    enabled: boolean("enabled").default(true),
    userId: uuid("user_id").notNull().primaryKey(),
});

export const otpTable = pgTable("otps", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    phoneNumber: varchar("phone_number", { length: 255 }).notNull(),
    otp: varchar("otp", { length: 255 }).notNull(),
    referenceId: varchar("reference_id", { length: 255 }).notNull(),
});

export const bookingTable = pgTable("bookings", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    estimatedDuration: integer("estimated_duration").notNull(),
    estimatedPrice: integer("estimated_price").notNull(),
    requiredSkills: jsonb("required_skills").references(() => skillTable.id).$type<string[]>(),
    requiredTools: jsonb("required_tools").$type<string[]>(),
    status: varchar("status", { length: 255 }).notNull().$type<BookingStatuses>(),
    workerId: uuid("worker_id").references(() => workerTable.userId),
    userId: uuid("user_id").references(() => usersTable.id),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    location: varchar("location").references(() => locationTable.id),
    description: varchar("description", { length: 255 }).notNull(),
    date: timestamp("date").notNull(),
    startTime: timestamp("start_time").notNull(),
    estimatedEndTime: timestamp("estimated_end_time").notNull(),
    media: jsonb("media").references(() => resourceTable.id).$type<string[]>(),
    serviceType: varchar("service_type", { length: 255 }).notNull().$type<ServiceLocationType>(),
});








