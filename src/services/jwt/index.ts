import jwt from "jsonwebtoken";
import config from "../../../config";
import { JwtPayload } from "./types";

const jwtSecret = config?.jwt_secret ?? "";
const tokenBlacklist = new Set();

export const createJwtToken = (payload: JwtPayload) => {
  return jwt.sign(payload, jwtSecret);
};

export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, jwtSecret) as JwtPayload;
};

export const addToBlacklist = (token: string) => {
  tokenBlacklist.add(token);
}

export const isTokenBlacklisted = (token: string) => {
  return tokenBlacklist.has(token);
}
