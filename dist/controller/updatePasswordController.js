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
const user_schema_1 = require("../model/user_schema");
const forgot_password_schema_1 = require("../model/forgot_password_schema");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const secretKey = process.env.SECRET || 'kingkoffie';
const UpdatePasswordController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, token, _csrf } = request.body;
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
            if (new Date(forgotPassword.token_expiry_date) > new Date()) {
                // The token is still valid
                // Hash password using bcrypt
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const user = yield user_schema_1.userModel.findOne({ email_address: forgotPassword.email_address }).updateOne({ password: hashedPassword });
                return response.status(200).send({ message: 'Password has successfully been update🎉' });
            }
            else {
                // The token has expired
                yield forgot_password_schema_1.forgotPasswordModel.deleteOne({ token: hashedToken });
                return response.status(401).send({ error: 'Token has expired' });
            }
        }
        else {
            return response.status(404).send({ error: 'Token has expired' });
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
exports.default = UpdatePasswordController;
