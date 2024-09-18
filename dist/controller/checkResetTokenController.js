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
const forgot_password_schema_1 = require("../model/forgot_password_schema");
const crypto_1 = __importDefault(require("crypto"));
const secretKey = process.env.SECRET || 'kingkoffie';
const CheckResetTokenController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = request.body;
    try {
        // Check if token and salt are provided
        if (!token) {
            return response.status(400).send({ error: 'Token and salt are required' });
        }
        // Hash password using bcrypt
        const hashedToken = crypto_1.default.createHmac('sha256', secretKey).update(token).digest('hex');
        const forgotPassword = yield forgot_password_schema_1.forgotPasswordModel.findOne({ token: hashedToken });
        // Check if token was found 
        if (forgotPassword) {
            response.status(200).send({ tokenExist: true });
        }
        else {
            response.status(200).send({ tokenExist: false });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error saving data:', error.message);
            response.status(500).send({ error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            response.status(500).send({ error: 'Unexpected error' });
        }
    }
});
exports.default = CheckResetTokenController;
