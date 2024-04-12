"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_js_1 = __importDefault(require("./workers/auth.js"));
const routes = {
    workersAuthRoutes: auth_js_1.default
};
exports.default = routes;
