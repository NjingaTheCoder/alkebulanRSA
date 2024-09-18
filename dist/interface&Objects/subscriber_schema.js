"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the subscription schema
const subscriptionSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email is unique
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], // Basic email validation
    },
    isSubscribed: {
        type: Boolean,
        default: true, // Default is subscribed
    },
    subscribedAt: {
        type: Date,
        default: Date.now, // Automatically set when a user subscribes
    },
    unsubscribedAt: {
        type: Date, // Only set when the user unsubscribes
    },
});
// Create the Subscription model from the schema
const Subscription = mongoose_1.default.model("Subscription", subscriptionSchema);
exports.default = Subscription;
