"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyWorkerOTPController = exports.verifyWorkerPhoneNumberController = exports.registerController = void 0;
const errorHandlers_1 = require("../../../helpers/errorHandlers");
const xata_js_1 = require("../../../xata.js");
const constants_js_1 = require("../../../helpers/constants.js");
const index_js_1 = require("../../../services/otp/index.js");
const index_js_2 = __importStar(require("../../../services/sms/index.js"));
const types_js_1 = require("./types.js");
const xata = (0, xata_js_1.getXataClient)();
const registerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, companyName, phoneNumber, location, workRate, acceptedTerms, type, documents, email, skills, } = req.body;
        if (type !== types_js_1.UserTypes.USER && type !== types_js_1.UserTypes.WORKER) {
            throw new Error("Invalid User Type");
        }
        if (type === types_js_1.UserTypes.USER) {
            if (!(firstName === null || firstName === void 0 ? void 0 : firstName.trim())) {
                throw new Error("First Name is required");
            }
            if (!(lastName === null || lastName === void 0 ? void 0 : lastName.trim())) {
                throw new Error("Last Name is required");
            }
        }
        if (type === types_js_1.UserTypes.WORKER) {
            if (!(companyName === null || companyName === void 0 ? void 0 : companyName.trim())) {
                throw new Error("Company Name is required");
            }
        }
        if (!(0, constants_js_1.validatePhoneNumber)(phoneNumber === null || phoneNumber === void 0 ? void 0 : phoneNumber.trim())) {
            throw new Error("Phone Number is required");
        }
        if (!(0, constants_js_1.validateLocation)(location)) {
            throw new Error("Location is required");
        }
        if (!(0, constants_js_1.validateEmail)(email === null || email === void 0 ? void 0 : email.trim())) {
            throw new Error("Email is required");
        }
        if (!(0, constants_js_1.validateAcceptedTerms)(acceptedTerms)) {
            throw new Error("Accepted Terms is required");
        }
        if (documents) {
            if (!(0, constants_js_1.validateDocuments)(documents)) {
                throw new Error("Documents is required");
            }
        }
        if (!workRate) {
            throw new Error("Work Rate is required");
        }
        if (!(0, constants_js_1.validateWorkRate)(workRate)) {
            throw new Error("Invalid Work Rate");
        }
        if (!(0, constants_js_1.validateSkills)(skills)) {
            throw new Error("Skills is required");
        }
        try {
            const worker = yield xata.db.workers.create({
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
                userType: type,
                userId: worker.id,
                firstName: firstName === null || firstName === void 0 ? void 0 : firstName.trim(),
                lastName: lastName === null || lastName === void 0 ? void 0 : lastName.trim(),
                companyName: companyName === null || companyName === void 0 ? void 0 : companyName.trim(),
            });
            return res.status(200).json({
                message: "Registration Successful",
                data: worker
            });
        }
        catch (error) {
            throw new Error((0, constants_js_1.formatDbError)(error === null || error === void 0 ? void 0 : error.message));
        }
    }
    catch (error) {
        (0, errorHandlers_1.errorResponse)(error === null || error === void 0 ? void 0 : error.message, res, 400);
    }
});
exports.registerController = registerController;
const verifyWorkerPhoneNumberController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.query;
        if (!(0, constants_js_1.validatePhoneNumber)(phoneNumber.trim())) {
            throw new Error("Phone Number is required");
        }
        const worker = yield xata.db.workers.filter({ phoneNumber }).getFirst();
        if (worker) {
            throw new Error(`Worker with phone number ${phoneNumber} already exists`);
        }
        const { error, data } = yield (0, index_js_1.createOtp)({ phoneNumber });
        if (error) {
            throw new Error(error);
        }
        if (!data) {
            throw new Error("An error occurred");
        }
        const content = (0, index_js_2.constructVerificationSms)(data.otp);
        const options = {
            to: phoneNumber,
            content,
        };
        const { error: smsError } = yield (0, index_js_2.default)(options);
        if (smsError) {
            (0, index_js_1.removeOtp)({ referenceId: data.referenceId });
            throw new Error("An error occurred sending sms, please resend code");
        }
        return res.status(200).json({
            message: "OTP sent successfully",
            data: {
                referenceId: data.referenceId,
                phoneNumber
            }
        });
    }
    catch (error) {
        (0, errorHandlers_1.errorResponse)(error === null || error === void 0 ? void 0 : error.message, res, 400);
    }
});
exports.verifyWorkerPhoneNumberController = verifyWorkerPhoneNumberController;
const verifyWorkerOTPController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, referenceId, phoneNumber } = req.body;
        if (!otp) {
            throw new Error("OTP is required");
        }
        if (otp.length !== 4) {
            throw new Error("Invalid OTP");
        }
        if (!referenceId) {
            throw new Error("Reference ID is required");
        }
        if (!phoneNumber) {
            throw new Error("Phone Number is required");
        }
        if (!(0, constants_js_1.validatePhoneNumber)(phoneNumber.trim())) {
            throw new Error("Phone Number is required");
        }
        const { error, data } = yield (0, index_js_1.verifyOtp)({ otp, referenceId, phoneNumber });
        if (error) {
            throw new Error(error);
        }
        if (!data) {
            throw new Error("An error occurred");
        }
        return res.status(200).json({
            message: "Phone Number Verified Successfully"
        });
    }
    catch (error) {
        (0, errorHandlers_1.errorResponse)(error === null || error === void 0 ? void 0 : error.message, res, 400);
    }
});
exports.verifyWorkerOTPController = verifyWorkerOTPController;
