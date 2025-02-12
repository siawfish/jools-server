import { UserTypes } from "../../types";

export interface JwtPayload {
    id: string;
    type: UserTypes;
}