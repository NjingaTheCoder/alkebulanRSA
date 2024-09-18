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
exports.unsubscribeEmail = exports.subscribeEmail = void 0;
const subscriber_schema_1 = __importDefault(require("../interface&Objects/subscriber_schema"));
// Subscribe to the newsletter
const subscribeEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        let subscription = yield subscriber_schema_1.default.findOne({ email });
        // If email exists and is already subscribed, return a message
        if (subscription && subscription.isSubscribed) {
            return res.status(201).json({ message: "Email is already subscribed." });
        }
        // If the user exists but unsubscribed, resubscribe
        if (subscription) {
            subscription.isSubscribed = true;
            subscription.subscribedAt = new Date();
            subscription.unsubscribedAt = undefined;
        }
        else {
            // Create a new subscription
            subscription = new subscriber_schema_1.default({ email });
        }
        yield subscription.save();
        return res.status(201).json({ message: "Subscription successful" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.subscribeEmail = subscribeEmail;
// Unsubscribe from the newsletter
const unsubscribeEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const subscription = yield subscriber_schema_1.default.findOne({ email });
        if (!subscription || !subscription.isSubscribed) {
            return res.status(404).json({ message: "Email not found or already unsubscribed." });
        }
        subscription.isSubscribed = false;
        subscription.unsubscribedAt = new Date();
        yield subscription.save();
        return res.status(200).json({ message: "Successfully unsubscribed." });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.unsubscribeEmail = unsubscribeEmail;
exports.default = { subscribeEmail: exports.subscribeEmail, unsubscribeEmail: exports.unsubscribeEmail };
