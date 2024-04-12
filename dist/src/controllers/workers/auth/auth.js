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
exports.registerController = void 0;
const errorHandlers_1 = require("../../../helpers/errorHandlers");
const registerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, age } = req.body;
        if (!name) {
            throw new Error("name is required");
        }
        if (!age) {
            throw new Error("age is required");
        }
        return res.status(200).json({
            message: "Registration Successful",
            data: {
                name,
                age
            }
        });
    }
    catch (error) {
        (0, errorHandlers_1.errorResponse)(error === null || error === void 0 ? void 0 : error.message, res, 400);
    }
});
exports.registerController = registerController;
