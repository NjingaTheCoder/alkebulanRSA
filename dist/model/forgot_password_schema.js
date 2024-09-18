"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const forgotPasswordSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        require: true
    },
    email_address: {
        type: String,
        required: true,
        unique: true
    },
    token_expiry_date: {
        type: String,
        required: true
    }
});
exports.forgotPasswordModel = mongoose_1.default.model('forgot_password_token', forgotPasswordSchema);
