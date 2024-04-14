"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXataClient = exports.XataClient = void 0;
// Generated by Xata Codegen 0.29.3. Please do not edit.
const client_1 = require("@xata.io/client");
const tables = [
    {
        name: "workers",
        columns: [
            { name: "firstName", type: "string" },
            { name: "lastName", type: "string" },
            { name: "companyName", type: "string" },
            { name: "phoneNumber", type: "string", unique: true },
            { name: "location", type: "json" },
            { name: "workRate", type: "float" },
            { name: "acceptedTerms", type: "json" },
            { name: "type", type: "string" },
            { name: "documents", type: "json" },
            { name: "email", type: "email", unique: true },
            { name: "score", type: "float" },
            { name: "rating", type: "float" },
            { name: "isVerified", type: "bool" },
            { name: "pushToken", type: "text" },
            { name: "skills", type: "json" },
        ],
        revLinks: [
            { column: "createdBy", table: "portfolios" },
            { column: "worker", table: "bookings" },
            { column: "worker", table: "messages" },
        ],
    },
    {
        name: "otp",
        columns: [
            { name: "phoneNumber", type: "string", unique: true },
            { name: "code", type: "string" },
            { name: "loginAttempts", type: "int" },
        ],
    },
    {
        name: "portfolios",
        columns: [
            { name: "caption", type: "text" },
            { name: "type", type: "string" },
            { name: "resource", type: "json" },
            { name: "createdBy", type: "link", link: { table: "workers" } },
        ],
        revLinks: [{ column: "portfolio", table: "comments" }],
    },
    {
        name: "skills",
        columns: [
            { name: "name", type: "string", unique: true },
            { name: "icon", type: "string" },
        ],
        revLinks: [{ column: "skill", table: "bookings" }],
    },
    {
        name: "users",
        columns: [
            { name: "firstName", type: "string" },
            { name: "lastName", type: "string" },
            { name: "email", type: "email", unique: true },
            { name: "phoneNumber", type: "string", unique: true },
            { name: "location", type: "json" },
            { name: "acceptedTerms", type: "json" },
            { name: "pushToken", type: "text" },
        ],
        revLinks: [
            { column: "user", table: "bookings" },
            { column: "user", table: "messages" },
            { column: "reviewer", table: "reviews" },
        ],
    },
    {
        name: "bookings",
        columns: [
            { name: "startedAt", type: "datetime" },
            { name: "endedAt", type: "datetime" },
            { name: "timelines", type: "json" },
            { name: "worker", type: "link", link: { table: "workers" } },
            { name: "user", type: "link", link: { table: "users" } },
            { name: "skill", type: "link", link: { table: "skills" } },
            { name: "messages", type: "link", link: { table: "messages" } },
            { name: "reviews", type: "link", link: { table: "reviews" } },
        ],
        revLinks: [{ column: "booking", table: "reviews" }],
    },
    {
        name: "messages",
        columns: [
            { name: "worker", type: "link", link: { table: "workers" } },
            { name: "user", type: "link", link: { table: "users" } },
            { name: "message", type: "text" },
            { name: "attachments", type: "file[]" },
        ],
        revLinks: [{ column: "messages", table: "bookings" }],
    },
    {
        name: "comments",
        columns: [
            { name: "portfolio", type: "link", link: { table: "portfolios" } },
            { name: "comment", type: "text" },
            { name: "author", type: "link", link: { table: "everyone" } },
            { name: "attachments", type: "file[]" },
        ],
    },
    {
        name: "everyone",
        columns: [
            { name: "userId", type: "string", unique: true },
            { name: "userType", type: "string" },
            { name: "firstName", type: "string" },
            { name: "lastName", type: "string" },
            { name: "companyName", type: "string" },
            { name: "phoneNumber", type: "string" },
            { name: "email", type: "email" },
            { name: "pushToken", type: "text" },
            { name: "type", type: "string" }
        ],
        revLinks: [
            { column: "author", table: "comments" },
            { column: "sender", table: "support" },
        ],
    },
    {
        name: "reviews",
        columns: [
            { name: "booking", type: "link", link: { table: "bookings" } },
            { name: "review", type: "text" },
            { name: "attachments", type: "file[]" },
            { name: "reviewer", type: "link", link: { table: "users" } },
        ],
        revLinks: [{ column: "reviews", table: "bookings" }],
    },
    {
        name: "support",
        columns: [
            { name: "sender", type: "link", link: { table: "everyone" } },
            { name: "question", type: "text" },
            { name: "attachments", type: "file[]" },
        ],
    },
    {
        name: "contacts",
        columns: [
            { name: "firstName", type: "string" },
            { name: "lastName", type: "string" },
            { name: "email", type: "email" },
            { name: "phone", type: "string" },
            { name: "message", type: "text" },
        ],
    },
];
const DatabaseClient = (0, client_1.buildClient)();
const defaultOptions = {
    databaseURL: "https://siawfish-s-workspace-783gv5.ap-southeast-2.xata.sh/db/joolsmen",
};
class XataClient extends DatabaseClient {
    constructor(options) {
        super(Object.assign(Object.assign({}, defaultOptions), options), tables);
    }
}
exports.XataClient = XataClient;
let instance = undefined;
const getXataClient = () => {
    if (instance)
        return instance;
    instance = new XataClient();
    return instance;
};
exports.getXataClient = getXataClient;
