"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SessionSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    },
    session: {
        cookie: {
            path: { type: String, default: '/' },
            httpOnly: { type: Boolean, default: true },
            secure: { type: Boolean, default: true },
            maxAge: { type: Number, default: 1000 * 60 * 60 * 24 }, // 24 hours
        },
        userData: {
            isAuthenticated: { type: Boolean, default: false },
            forgotPassword: { type: Boolean, default: false },
            userID: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
            userEmail: { type: String, required: true },
            userName: { type: String, required: true },
            userSurname: { type: String, required: true },
            userPhoneNumber: { type: String, required: true },
            csrfToken: { type: String, required: true },
        }
    }
});
const sessionModel = mongoose_1.default.model('alkebulan_sessions', SessionSchema);
exports.default = sessionModel;
