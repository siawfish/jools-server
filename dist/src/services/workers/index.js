"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkerById = exports.getWorkerByPhoneNumber = exports.createWorker = void 0;
const constants_1 = require("../../helpers/constants");
const xata_1 = require("../../xata");
const types_1 = require("./types");
const xata = (0, xata_1.getXataClient)();
const createWorker = (worker) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, companyName, phoneNumber, location, workRate, acceptedTerms, documents, email, type, skills } = worker;
        const dbWorker = yield xata.db.workers.create({
            firstName: firstName === null || firstName === void 0 ? void 0 : firstName.trim(),
            lastName: lastName === null || lastName === void 0 ? void 0 : lastName.trim(),
            companyName: companyName === null || companyName === void 0 ? void 0 : companyName.trim(),
            phoneNumber: phoneNumber.trim(),
            location,
            workRate,
            acceptedTerms,
            type,
            documents,
            email: email.trim(),
            skills,
        });
        yield xata.db.everyone.create({
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            userType: types_1.UserTypes.WORKER,
            type,
            userId: dbWorker.id,
            firstName: firstName === null || firstName === void 0 ? void 0 : firstName.trim(),
            lastName: lastName === null || lastName === void 0 ? void 0 : lastName.trim(),
            companyName: companyName === null || companyName === void 0 ? void 0 : companyName.trim(),
        });
        return { data: dbWorker };
    }
    catch (error) {
        return { error: (0, constants_1.formatDbError)(error === null || error === void 0 ? void 0 : error.message) };
    }
});
exports.createWorker = createWorker;
const getWorkerByPhoneNumber = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const worker = yield xata.db.workers.filter({ phoneNumber }).getFirst();
        if (!worker) {
            throw new Error(`User with phone number ${phoneNumber} does not exist`);
        }
        return { data: worker };
    }
    catch (error) {
        return { error: error === null || error === void 0 ? void 0 : error.message };
    }
});
exports.getWorkerByPhoneNumber = getWorkerByPhoneNumber;
const getWorkerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const worker = yield xata.db.workers.read(id);
        if (!worker) {
            throw new Error(`User with id "${id}" does not exist`);
        }
        return { data: worker };
    }
    catch (error) {
        return { error: error === null || error === void 0 ? void 0 : error.message };
    }
});
exports.getWorkerById = getWorkerById;
