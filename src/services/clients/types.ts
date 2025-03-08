import { Status, Theme } from "../../types";
import { InferInsertModel } from 'drizzle-orm';
import { usersTable, workerTable, skillTable } from '../../db/schema';

// Infer the types from your schema
export type User = InferInsertModel<typeof usersTable>;
export type Worker = InferInsertModel<typeof workerTable> & User;
export type Skill = InferInsertModel<typeof skillTable>;

// You can also create types for inserts if needed
export type NewUser = InferInsertModel<typeof usersTable>;
export type NewWorker = InferInsertModel<typeof workerTable>;

// Example of combining types
export type WorkerWithUser = User & Worker;

// Example of extending types
export type WorkerResponse = WorkerWithUser & {
  skills: Skill[];
};