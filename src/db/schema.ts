import { integer, pgTable, varchar, uuid, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { BookingStatuses, Theme, ServiceLocationType, UserTypes, WorkingHours, SettingsType, LanguageType, CurrencyType, TimezoneType, AcceptedTermsType, LocationType, GhanaCard, SkillType, Gender } from "../types";
import { Asset } from "../services/assets/type";

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    avatar: varchar({ length: 255 }).notNull(),
    phoneNumber: varchar({ length: 255 }).unique().notNull(),
    gender: varchar("gender", { length: 255 }).notNull().$type<Gender>(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    deletedAt: timestamp("deleted_at"),
    accountStatus: integer("account_status").default(1).$type<0 | 1 | 2>(),
    settings: jsonb("settings").default({
        notifications: {
            email: true,
            sms: true,
            pushToken: "",
            pushNotification: false,
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
    skills: jsonb("skills").default([]).$type<string[]>().notNull(),
});

export const skillTable = pgTable("skills", { 
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar({ length: 255 }).notNull(),
    icon: varchar({ length: 255 }),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    createdBy: uuid("created_by").references(() => usersTable.id),
    updatedBy: uuid("updated_by").references(() => usersTable.id),
});

export const workerSkillsTable = pgTable("worker_skills", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    workerId: uuid("worker_id").references(() => workerTable.userId).notNull(),
    skillId: uuid("skill_id").references(() => skillTable.id).notNull(),
    rate: integer("rate").default(0).notNull(),
    yearsOfExperience: integer("years_of_experience").default(0).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const portfolioTable = pgTable("portfolios", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    description: varchar({ length: 255 }).notNull(),
    assets: jsonb("assets").$type<Asset[]>(),
    skills: jsonb("skills").$type<string[]>(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    createdBy: uuid("created_by").references(() => usersTable.id),
}, (table) => ({
    // Composite index for efficient portfolio listing with sorting
    createdByIdx: index("portfolios_created_by_idx").on(table.createdBy, table.description, table.createdAt),
    // Index for timestamp-based queries
    createdAtIdx: index("portfolios_created_at_idx").on(table.createdAt),
}));

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
    media: jsonb("media").$type<Asset[]>(),
    serviceType: varchar("service_type", { length: 255 }).notNull().$type<ServiceLocationType>(),
});

export const portfolioLikesTable = pgTable("portfolio_likes", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    portfolioId: uuid("portfolio_id").references(() => portfolioTable.id).notNull(),
    authorId: uuid("author_id").references(() => usersTable.id).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
}, (table) => ({
    // Composite index for both counting and user-specific queries
    portfolioAuthorIdx: index("portfolio_likes_portfolio_author_idx").on(table.portfolioId, table.authorId),
}));

export const portfolioCommentsTable = pgTable("portfolio_comments", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    portfolioId: uuid("portfolio_id").references(() => portfolioTable.id).notNull(),
    authorId: uuid("author_id").references(() => usersTable.id).notNull(),
    comment: varchar("comment", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
}, (table) => ({
    // Composite index for both counting and user-specific queries
    portfolioAuthorIdx: index("portfolio_comments_portfolio_author_idx").on(table.portfolioId, table.authorId),
    // Index for chronological access
    createdAtIdx: index("portfolio_comments_created_at_idx").on(table.createdAt),
}));







