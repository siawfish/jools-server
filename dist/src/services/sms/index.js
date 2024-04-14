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
exports.constructVerificationSms = void 0;
const index_js_1 = __importDefault(require("../../../config/index.js"));
function sendSms(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = new URLSearchParams({
                to: options.to,
                content: options.content,
                from: index_js_1.default.hubtel_sms_name,
                clientid: index_js_1.default.hubtel_client_id,
                clientsecret: index_js_1.default.hubtel_client_secret,
            }).toString();
            const resp = yield fetch(`${index_js_1.default.hubtel_sms_url}?${query}`, {
                method: "GET",
            });
            const data = yield resp.text();
            console.log('SMS RESPONSE------>', data);
            console.log('SMS OTP------>', options.content);
            return { data };
        }
        catch (error) {
            return { error: error === null || error === void 0 ? void 0 : error.message };
        }
    });
}
exports.default = sendSms;
const constructVerificationSms = (otp) => {
    return `Your verification code is ${otp}. Please do not share this code with anyone.`;
};
exports.constructVerificationSms = constructVerificationSms;
