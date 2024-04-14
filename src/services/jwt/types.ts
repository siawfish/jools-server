import { UserTypes } from "../workers/types";

export interface JwtPayload {
    id: string;
    type: UserTypes;
}