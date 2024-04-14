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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.removeOtp = exports.createOtp = void 0;
const index_js_1 = __importDefault(require("../../../config/index.js"));
const constants_js_1 = require("../../helpers/constants.js");
const xata_js_1 = require("../../xata.js");
const xata = (0, xata_js_1.getXataClient)();
function createOtp(_a) {
    return __awaiter(this, arguments, void 0, function* ({ phoneNumber, }) {
        try {
            const otp = Math.floor(1000 + Math.random() * 9000);
            try {
                const savedOtp = yield xata.db.otp.create({
                    phoneNumber,
                    code: otp.toString(),
                    loginAttempts: 0,
                });
                return {
                    data: {
                        phoneNumber,
                        otp: otp.toString(),
                        referenceId: savedOtp.id,
                    },
                };
            }
            catch (error) {
                throw new Error((0, constants_js_1.formatDbError)(error === null || error === void 0 ? void 0 : error.message, "is pending verification"));
            }
        }
        catch (error) {
            return { error: error === null || error === void 0 ? void 0 : error.message };
        }
    });
}
exports.createOtp = createOtp;
function removeOtp(_a) {
    return __awaiter(this, arguments, void 0, function* ({ referenceId }) {
        try {
            yield xata.db.otp.delete({ id: referenceId });
        }
        catch (error) {
            console.log('ERROR REMOVING OTP------>', error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.removeOtp = removeOtp;
function verifyOtp(_a) {
    return __awaiter(this, arguments, void 0, function* ({ otp, referenceId, phoneNumber, }) {
        var _b;
        try {
            const savedOtp = yield xata.db.otp.filter({ id: referenceId }).getFirst();
            if (!savedOtp) {
                return { error: "Invalid OTP" };
            }
            // check if the otp is expired
            const currentTime = new Date().getTime();
            const otpTime = new Date(savedOtp.xata.createdAt).getTime();
            if (currentTime - otpTime > index_js_1.default.otp_expiry) {
                yield xata.db.otp.delete({ id: referenceId });
                throw new Error("OTP expired");
            }
            const loginAttempts = (_b = savedOtp === null || savedOtp === void 0 ? void 0 : savedOtp.loginAttempts) !== null && _b !== void 0 ? _b : 0;
            if (loginAttempts >= index_js_1.default.login_attempts) {
                yield xata.db.otp.delete({ id: referenceId });
                throw new Error("Exceeded maximum verification attempts");
            }
            if (savedOtp.code !== otp) {
                yield savedOtp.update({
                    loginAttempts: loginAttempts + 1,
                });
                throw new Error("Invalid OTP");
            }
            if (savedOtp.phoneNumber !== phoneNumber) {
                yield savedOtp.update({
                    loginAttempts: loginAttempts + 1,
                });
                throw new Error("Invalid phone number");
            }
            yield xata.db.otp.delete({ id: referenceId });
            return { data: "OTP verified successfully" };
        }
        catch (error) {
            return { error: error === null || error === void 0 ? void 0 : error.message };
        }
    });
}
exports.verifyOtp = verifyOtp;
