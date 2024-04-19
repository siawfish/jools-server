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
exports.deleteWorkerController = exports.updateWorkerController = exports.getWorkerController = void 0;
const index_js_1 = require("../../../services/workers/index.js");
const errorHandlers_js_1 = require("../../../helpers/errorHandlers.js");
const constants_js_1 = require("../../../helpers/constants.js");
const getWorkerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(req.query);
        if (!id) {
            throw new Error("id is required");
        }
        const { error, data } = yield (0, index_js_1.getWorkerById)(id);
        if (error) {
            throw new Error(error);
        }
        if (!data) {
            throw new Error("An error occurred");
        }
        return res.status(200).json({
            message: "Worker fetched successfully",
            data
        });
    }
    catch (error) {
        (0, errorHandlers_js_1.errorResponse)(error === null || error === void 0 ? void 0 : error.message, res, 400);
    }
});
exports.getWorkerController = getWorkerController;
const updateWorkerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName, companyName, location, workRate, skills } = req.body;
        if (!id) {
            throw new Error("id is required");
        }
        if (!firstName && !lastName && !companyName && !location && !workRate && !skills) {
            throw new Error("Only firstName, lastName, companyName, location, workRate and skills are allowed");
        }
        const worker = {};
        if (firstName) {
            if (!firstName.trim()) {
                throw new Error("First Name is required");
            }
            worker.firstName = firstName;
        }
        if (lastName) {
            if (!lastName.trim()) {
                throw new Error("Last Name is required");
            }
            worker.lastName = lastName;
        }
        if (companyName) {
            if (!companyName.trim()) {
                throw new Error("Company Name is required");
            }
            worker.companyName = companyName;
        }
        if (location) {
            if (!(0, constants_js_1.validateLocation)(location)) {
                throw new Error("Invalid location");
            }
            worker.location = location;
        }
        if (workRate) {
            if (!(0, constants_js_1.validateWorkRate)(workRate)) {
                throw new Error("Invalid work rate");
            }
            worker.workRate = workRate;
        }
        if (skills) {
            if (skills.length) {
                if (!(0, constants_js_1.validateSkills)(skills)) {
                    throw new Error("Invalid skills");
                }
                worker.skills = skills;
            }
        }
        const { error, data } = yield (0, index_js_1.updateWorker)(id, worker);
        if (error) {
            throw new Error(error);
        }
        if (!data) {
            throw new Error("An error occurred");
        }
        return res.status(200).json({
            message: "Worker updated successfully",
            data
        });
    }
    catch (error) {
        (0, errorHandlers_js_1.errorResponse)(error === null || error === void 0 ? void 0 : error.message, res, 400);
    }
});
exports.updateWorkerController = updateWorkerController;
const deleteWorkerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Authentication failed");
        }
        const { error, data } = yield (0, index_js_1.deleteWorker)(id);
        if (error) {
            throw new Error(error);
        }
        if (!data) {
            throw new Error("An error occurred");
        }
        return res.status(200).json({
            message: "Worker deleted successfully",
            data
        });
    }
    catch (error) {
        (0, errorHandlers_js_1.errorResponse)(error === null || error === void 0 ? void 0 : error.message, res, 400);
    }
});
exports.deleteWorkerController = deleteWorkerController;
