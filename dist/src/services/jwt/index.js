"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenBlacklisted = exports.addToBlacklist = exports.verifyJwtToken = exports.createJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const jwtSecret = (_a = config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.jwt_secret) !== null && _a !== void 0 ? _a : "";
const tokenBlacklist = new Set();
const createJwtToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, jwtSecret);
};
exports.createJwtToken = createJwtToken;
const verifyJwtToken = (token) => {
    return jsonwebtoken_1.default.verify(token, jwtSecret);
};
exports.verifyJwtToken = verifyJwtToken;
const addToBlacklist = (token) => {
    tokenBlacklist.add(token);
};
exports.addToBlacklist = addToBlacklist;
const isTokenBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};
exports.isTokenBlacklisted = isTokenBlacklisted;
