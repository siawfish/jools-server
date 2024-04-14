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
exports.signOutController = exports.meController = exports.verifyJwtTokenMiddleware = exports.verifyWorkerOTPController = exports.verifyWorkerPhoneNumberController = exports.registerController = void 0;
const errorHandlers_1 = require("../../../helpers/errorHandlers");
const constants_js_1 = require("../../../helpers/constants.js");
const index_js_1 = require("../../../services/otp/index.js");
const index_js_2 = __importStar(require("../../../services/sms/index.js"));
const types_js_1 = require("../../../services/workers/types.js");
const index_js_3 = require("../../../services/workers/index.js");
const jwt_1 = require("../../../services/jwt");
const registerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, companyName, phoneNumber, location, workRate, acceptedTerms, type, documents, email, skills, } = req.body;
        if (type !== types_js_1.AccountTypes.INDIVIDUAL && type !== types_js_1.AccountTypes.COMPANY) {
            throw new Error("Invalid Account Type");
        }
        if (type === types_js_1.AccountTypes.INDIVIDUAL) {
            if (!(firstName === null || firstName === void 0 ? void 0 : firstName.trim())) {
                throw new Error("First Name is required");
            }
            if (!(lastName === null || lastName === void 0 ? void 0 : lastName.trim())) {
                throw new Error("Last Name is required");
            }
        }
        if (type === types_js_1.AccountTypes.COMPANY) {
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
        const { error, data } = yield (0, index_js_3.createWorker)({
            firstName,
            lastName,
            companyName,
            phoneNumber,
            location,
            workRate,
            acceptedTerms,
            type,
            documents,
            email,
            skills,
        });
        if (error) {
            throw new Error(error);
        }
        if (!data) {
            throw new Error("An error occurred");
        }
        return res.status(201).json({
            message: "User registered successfully",
            data
        });
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
    var _a, _b;
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
            throw new Error("Phone Number is invalid");
        }
        const [_o, _w] = yield Promise.all([
            (0, index_js_1.verifyOtp)({ otp, referenceId, phoneNumber }),
            (0, index_js_3.getWorkerByPhoneNumber)(phoneNumber)
        ]);
        if (_o === null || _o === void 0 ? void 0 : _o.error) {
            throw new Error(_o === null || _o === void 0 ? void 0 : _o.error);
        }
        if (!(_o === null || _o === void 0 ? void 0 : _o.data)) {
            throw new Error("An error occurred verifying OTP");
        }
        if ((_a = _w === null || _w === void 0 ? void 0 : _w.data) === null || _a === void 0 ? void 0 : _a.id) {
            const token = (0, jwt_1.createJwtToken)({
                id: (_b = _w === null || _w === void 0 ? void 0 : _w.data) === null || _b === void 0 ? void 0 : _b.id,
                type: types_js_1.UserTypes.WORKER
            });
            if (token) {
                return res.status(200).json({
                    message: "Phone Number Verified Successfully",
                    data: {
                        token,
                        user: _w === null || _w === void 0 ? void 0 : _w.data
                    }
                });
            }
        }
        return res.status(200).json({
            message: "Phone Number Verified Successfully",
            data: {
                phoneNumber
            }
        });
    }
    catch (error) {
        (0, errorHandlers_1.errorResponse)(error === null || error === void 0 ? void 0 : error.message, res, 400);
    }
});
exports.verifyWorkerOTPController = verifyWorkerOTPController;
const verifyJwtTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1];
        if (!token) {
            throw new Error("Token is required");
        }
        if ((0, jwt_1.isTokenBlacklisted)(token)) {
            throw new Error("Token is invalid");
        }
        const decodedToken = yield (0, jwt_1.verifyJwtToken)(token);
        if (!(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id)) {
            throw new Error();
        }
        const { error, data } = yield (0, index_js_3.getWorkerById)(decodedToken.id);
        if (error) {
            throw new Error(error);
        }
        if (!data) {
            throw new Error("An error occurred");
        }
        res.locals.user = data;
        next();
    }
    catch (error) {
        (0, errorHandlers_1.errorResponse)("Bearer token is invalid", res, 401);
    }
});
exports.verifyJwtTokenMiddleware = verifyJwtTokenMiddleware;
const meController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        return res.status(200).json({
            message: "User fetched successfully",
            data: user
        });
    }
    catch (error) {
        (0, errorHandlers_1.errorResponse)(error === null || error === void 0 ? void 0 : error.message, res, 401);
    }
});
exports.meController = meController;
const signOutController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const token = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(" ")[1];
        if (!token) {
            throw new Error("Token is required");
        }
        (0, jwt_1.addToBlacklist)(token);
        return res.status(200).json({
            message: "User signed out successfully"
        });
    }
    catch (error) {
        (0, errorHandlers_1.errorResponse)(error === null || error === void 0 ? void 0 : error.message, res, 401);
    }
});
exports.signOutController = signOutController;
