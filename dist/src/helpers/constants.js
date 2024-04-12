"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDbError = exports.validateSkills = exports.validateWorkRate = exports.validateDocuments = exports.validateAcceptedTerms = exports.validateLocation = exports.validateEmail = exports.validatePhoneNumber = void 0;
// export a function that validates ghanaian phone numbers
const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^(?:0|\+233)[0-9]{9}$/;
    return phoneRegex.test(phoneNumber);
};
exports.validatePhoneNumber = validatePhoneNumber;
// export function that validates email
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
// export function that validates location
const validateLocation = (location) => {
    if (typeof location !== "object")
        return false;
    if (typeof location.lat !== "number" || typeof location.lng !== "number")
        return false;
    return true;
};
exports.validateLocation = validateLocation;
const validateAcceptedTerms = (acceptedTerms) => {
    return acceptedTerms.status && acceptedTerms.acceptedAt ? true : false;
};
exports.validateAcceptedTerms = validateAcceptedTerms;
const validateDocuments = (documents) => {
    return documents.url && documents.isVerified ? true : false;
};
exports.validateDocuments = validateDocuments;
const validateWorkRate = (workRate) => {
    if (typeof workRate !== "number")
        return false;
    return workRate >= 0;
};
exports.validateWorkRate = validateWorkRate;
const validateSkills = (skills) => {
    if (!Array.isArray(skills))
        return false;
    if (skills.length < 1)
        return false;
    for (const skill of skills) {
        if (typeof skill !== "object")
            return false;
        if (typeof skill.name !== "string")
            return false;
        if (typeof skill.icon !== "string")
            return false;
        if (!skill.id)
            return false;
    }
    return true;
};
exports.validateSkills = validateSkills;
// format db error message
// db error format invalid record: column [phoneNumber]: is not unique
// write function that takes in the error message and returns the column and the message
const formatDbError = (error, suffix) => {
    const [_, column, message] = error.split(":");
    const columnName = column.split("[")[1].split("]")[0]; // Extracts 'phoneNumber' from 'column [phoneNumber]'
    if (message.trim() === 'is not unique') {
        return `${columnName} ${suffix !== null && suffix !== void 0 ? suffix : "is already registered"}`;
    }
    return `${columnName}:${message}`;
};
exports.formatDbError = formatDbError;
